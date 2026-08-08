import { rooms } from "@/app/data";

const ROOM_LABELS = Object.fromEntries(rooms.map((r) => [r.id, `${r.title} — GHS ${r.price}/night`]));

// Header values must not contain CR/LF
function sanitizeHeaderValue(value) {
  return String(value ?? "").replace(/[\r\n]+/g, " ").trim();
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, phone, checkIn, checkOut, roomType, guests, nights, estimatedTotal, message, promo } = body || {};

  if (!name || !email || !phone || !checkIn || !checkOut || !roomType || !estimatedTotal) {
    return Response.json({ error: "Please fill in all required fields." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  // Format phone number to international format (233XXXXXXXXX) for Ghana
  let cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "233" + cleanPhone.substring(1);
  }
  if (!cleanPhone.startsWith("233")) {
    cleanPhone = "233" + cleanPhone;
  }

  // Split name for ExpressPay
  const nameParts = name.trim().split(/\s+/);
  const firstname = sanitizeHeaderValue(nameParts[0] || "Guest");
  const lastname = sanitizeHeaderValue(nameParts.slice(1).join(" ") || ".");

  const orderId = `KTH-${Date.now()}`;
  
  // Dynamically determine the host and protocol for the callback URL
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const baseUrl = `${protocol}://${host}`;

  // We append all booking metadata as query params to the callback URL so we can send the email AFTER payment confirmation
  const callbackUrl = `${baseUrl}/reservation/callback?` + new URLSearchParams({
    name,
    email,
    phone,
    checkIn,
    checkOut,
    roomType,
    guests,
    nights: String(nights),
    estimatedTotal: String(estimatedTotal),
    message: message || "",
    promo: promo || "",
    orderId
  }).toString();

  const isSandbox = process.env.EXPRESSPAY_SANDBOX === "true";
  const submitUrl = isSandbox
    ? "https://sandbox.expresspaygh.com/api/submit.php"
    : "https://expresspaygh.com/api/submit.php";

  const checkoutBaseUrl = isSandbox
    ? "https://sandbox.expresspaygh.com/api/checkout.php"
    : "https://expresspaygh.com/api/checkout.php";

  const params = new URLSearchParams();
  params.append("merchant-id", process.env.EXPRESSPAY_MERCHANT_ID || "");
  params.append("api-key", process.env.EXPRESSPAY_API_KEY || "");
  params.append("amount", parseFloat(estimatedTotal).toFixed(2));
  params.append("currency", "GHS");
  params.append("order-id", orderId);
  params.append("redirect-url", callbackUrl);
  params.append("firstname", firstname);
  params.append("lastname", lastname);
  params.append("email", email);
  params.append("phonenumber", cleanPhone);

  try {
    const response = await fetch(submitUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error(`ExpressPay Submit API returned HTTP ${response.status}`);
    }

    const result = await response.json();

    if (Number(result.status) === 1 && result.token) {
      const checkoutUrl = `${checkoutBaseUrl}?token=${result.token}`;
      return Response.json({ ok: true, checkoutUrl, token: result.token });
    } else {
      console.error("[reservation] ExpressPay payment initialization failed:", result);
      return Response.json({ error: result.message || "Failed to initialize payment with ExpressPay. Please try again." }, { status: 502 });
    }
  } catch (err) {
    console.error("[reservation] ExpressPay submit error:", err);
    return Response.json({ error: "Failed to connect to the payment gateway. Please check your connection and try again." }, { status: 502 });
  }
}
