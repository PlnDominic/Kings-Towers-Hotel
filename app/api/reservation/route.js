import { rooms } from "@/app/data";
import { sendMail } from "@/lib/mailer";

const ROOM_LABELS = Object.fromEntries(rooms.map((r) => [r.id, `${r.title} — GHS ${r.price}/night`]));

// Header values (used in From/Reply-To/Subject) must not contain CR/LF,
// otherwise user input could inject extra mail headers.
function sanitizeHeaderValue(value) {
  return String(value ?? "").replace(/[\r\n]+/g, " ").trim();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, phone, checkIn, checkOut, roomType, guests, nights, estimatedTotal, message, promo } = body || {};

  if (!name || !email || !phone || !checkIn || !checkOut || !roomType) {
    return Response.json({ error: "Please fill in all required fields." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const safeName = sanitizeHeaderValue(name);
  const safeEmail = sanitizeHeaderValue(email);
  const roomLabel = ROOM_LABELS[roomType] || sanitizeHeaderValue(roomType);
  const stayLabel = nights ? `${nights} night${Number(nights) > 1 ? "s" : ""}` : null;

  const text = [
    `New reservation request from the Kings Towers Hotel website`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Check-in: ${checkIn}`,
    `Check-out: ${checkOut}`,
    stayLabel ? `Stay length: ${stayLabel}` : null,
    guests ? `Guests: ${guests}` : null,
    `Room type: ${roomLabel}`,
    estimatedTotal ? `Estimated total: GHS ${estimatedTotal}` : null,
    promo ? `Promo code: ${promo}` : null,
    message ? `Message: ${message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <h2>New reservation request</h2>
    <table cellpadding="4" cellspacing="0">
      <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${escapeHtml(phone)}</td></tr>
      <tr><td><strong>Check-in</strong></td><td>${escapeHtml(checkIn)}</td></tr>
      <tr><td><strong>Check-out</strong></td><td>${escapeHtml(checkOut)}</td></tr>
      ${stayLabel ? `<tr><td><strong>Stay length</strong></td><td>${escapeHtml(stayLabel)}</td></tr>` : ""}
      ${guests ? `<tr><td><strong>Guests</strong></td><td>${escapeHtml(guests)}</td></tr>` : ""}
      <tr><td><strong>Room type</strong></td><td>${escapeHtml(roomLabel)}</td></tr>
      ${estimatedTotal ? `<tr><td><strong>Estimated total</strong></td><td>GHS ${escapeHtml(estimatedTotal)}</td></tr>` : ""}
      ${promo ? `<tr><td><strong>Promo code</strong></td><td>${escapeHtml(promo)}</td></tr>` : ""}
      ${message ? `<tr><td><strong>Message</strong></td><td>${escapeHtml(message)}</td></tr>` : ""}
    </table>
  `;

  try {
    await sendMail({
      subject: `Reservation request from ${safeName} (${roomLabel})`,
      text,
      html,
      replyTo: `${safeName} <${safeEmail}>`,
    });
  } catch (err) {
    console.error("[reservation] failed to send mail:", err);
    return Response.json({ error: "We couldn't send your request right now. Please call or email us instead." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
