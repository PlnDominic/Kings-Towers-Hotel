import { rooms } from "@/app/data";
import { submitPayment, checkoutUrl, encodeRef } from "@/lib/expresspay";
import { sanitizeHeaderValue } from "@/lib/mailFormat";

const ROOM_LABELS = Object.fromEntries(rooms.map((r) => [r.id, r.title]));

function splitName(fullName) {
  const parts = String(fullName).trim().split(/\s+/);
  const firstname = parts[0] || "Guest";
  const lastname = parts.slice(1).join(" ") || firstname;
  return { firstname, lastname };
}

// expressPay expects Ghana numbers in international format (233XXXXXXXXX),
// not the local 0XXXXXXXXX form guests naturally type.
function toGhanaIntlPhone(phone) {
  let digits = String(phone).replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "233" + digits.slice(1);
  if (!digits.startsWith("233")) digits = "233" + digits;
  return digits;
}

// Recomputed from the dates rather than trusting the client's `nights`
// field — the charge amount must never be derived from anything the
// guest's browser sent us directly.
function nightsBetween(checkIn, checkOut) {
  const diff = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
  return diff > 0 ? diff : 0;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, phone, checkIn, checkOut, roomType, guests, message, promo } = body || {};

  if (!name || !email || !phone || !checkIn || !checkOut || !roomType) {
    return Response.json({ error: "Please fill in all required fields." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const room = rooms.find((r) => r.id === roomType);
  if (!room) {
    return Response.json({ error: "Please select a valid room type." }, { status: 400 });
  }

  const serverNights = nightsBetween(checkIn, checkOut);
  if (serverNights <= 0) {
    return Response.json({ error: "Check-out must be after check-in." }, { status: 400 });
  }

  // Deposit policy: 50% of the full stay, balance due at check-in. Total is
  // computed from the room's own rate × nights — never from client input.
  const stayTotal = serverNights * Number(room.price);
  const depositAmount = Math.round(stayTotal * 0.5);
  if (!depositAmount || depositAmount <= 0) {
    return Response.json({ error: "That room doesn't have a valid rate configured." }, { status: 500 });
  }

  const { firstname, lastname } = splitName(name);
  const intlPhone = toGhanaIntlPhone(phone);
  const orderId = `KTH-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();

  const ref = encodeRef({
    orderId,
    name: sanitizeHeaderValue(name),
    email: sanitizeHeaderValue(email),
    phone: sanitizeHeaderValue(phone),
    roomType,
    roomLabel: ROOM_LABELS[roomType],
    checkIn,
    checkOut,
    guests,
    nights: serverNights,
    total: stayTotal,
    deposit: depositAmount,
    message,
    promo,
  });

  const origin = new URL(request.url).origin;

  let submitResult;
  try {
    submitResult = await submitPayment({
      "order-id": orderId,
      currency: "GHS",
      amount: depositAmount.toFixed(2),
      firstname,
      lastname,
      email,
      phonenumber: intlPhone,
      username: email,
      accountnumber: intlPhone,
      "order-desc": `Deposit — ${ROOM_LABELS[roomType]}, ${checkIn} to ${checkOut}`,
      "redirect-url": `${origin}/reservation/payment-result?ref=${ref}`,
      "post-url": `${origin}/api/payment/notify?ref=${ref}`,
    });
  } catch (err) {
    console.error("[payment] expressPay submit failed:", err);
    // Not 502/503/504 — Vercel replaces those with its own generic error
    // page instead of passing our JSON body through to the client.
    return Response.json(
      { error: "We couldn't start the payment right now. Please call or email us instead." },
      { status: 400 }
    );
  }

  if (submitResult?.status !== 1 || !submitResult.token) {
    console.error("[payment] expressPay rejected submit:", submitResult);
    return Response.json(
      { error: submitResult?.message || "Payment couldn't be started. Please try again." },
      { status: 400 }
    );
  }

  return Response.json({ checkoutUrl: checkoutUrl(submitResult.token) });
}
