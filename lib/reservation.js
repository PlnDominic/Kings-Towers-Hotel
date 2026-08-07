import { rooms } from "@/app/data";

export const ROOM_LABELS = Object.fromEntries(rooms.map((room) => [room.id, `${room.title} - GHS ${room.price}/night`]));

export function sanitizeHeaderValue(value) {
  return String(value ?? "").replace(/[\r\n]+/g, " ").trim();
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const diff = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
  return diff > 0 ? diff : 0;
}

export function validateReservationPayload(body) {
  const reservation = body && typeof body === "object" ? body : {};
  const { name, email, phone, checkIn, checkOut, roomType, guests, message, promo } = reservation;

  if (!name || !email || !phone || !checkIn || !checkOut || !roomType) {
    throw new Error("Please fill in all required fields.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    throw new Error("Please provide a valid email address.");
  }

  const room = rooms.find((entry) => entry.id === roomType);
  if (!room) {
    throw new Error("Please choose a valid room type.");
  }

  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) {
    throw new Error("Please choose valid check-in and check-out dates.");
  }

  return {
    ...reservation,
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone).trim(),
    checkIn: String(checkIn),
    checkOut: String(checkOut),
    roomType: String(roomType),
    guests: guests ? String(guests) : "",
    message: message ? String(message).trim() : "",
    promo: promo ? String(promo).trim() : "",
    room,
    roomLabel: ROOM_LABELS[roomType] || sanitizeHeaderValue(roomType),
    nights,
    estimatedTotal: String(nights * Number(room.price)),
    currency: "GHS",
  };
}

export function buildReservationMail(reservation, payment = null) {
  const safeName = sanitizeHeaderValue(reservation.name);
  const safeEmail = sanitizeHeaderValue(reservation.email);
  const stayLabel = `${reservation.nights} night${Number(reservation.nights) > 1 ? "s" : ""}`;
  const paymentStatus = payment ? "Paid via ExpressPay" : "Reservation request only";

  const text = [
    payment ? "New paid reservation from the Kings Towers Hotel website" : "New reservation request from the Kings Towers Hotel website",
    "",
    `Payment status: ${paymentStatus}`,
    `Name: ${reservation.name}`,
    `Email: ${reservation.email}`,
    `Phone: ${reservation.phone}`,
    `Check-in: ${reservation.checkIn}`,
    `Check-out: ${reservation.checkOut}`,
    `Stay length: ${stayLabel}`,
    reservation.guests ? `Guests: ${reservation.guests}` : null,
    `Room type: ${reservation.roomLabel}`,
    `Total: ${reservation.currency} ${reservation.estimatedTotal}`,
    reservation.promo ? `Promo code: ${reservation.promo}` : null,
    payment?.["transaction-id"] ? `ExpressPay transaction ID: ${payment["transaction-id"]}` : null,
    payment?.["payment_reference"] ? `ExpressPay reference: ${payment.payment_reference}` : null,
    payment?.["auth-code"] ? `Authorization code: ${payment["auth-code"]}` : null,
    payment?.["payment_option_type_name"] ? `Payment method: ${payment.payment_option_type_name}` : null,
    payment?.["date-processed"] ? `Paid at: ${payment["date-processed"]}` : null,
    reservation.message ? `Message: ${reservation.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <h2>${payment ? "New paid reservation" : "New reservation request"}</h2>
    <table cellpadding="4" cellspacing="0">
      <tr><td><strong>Payment status</strong></td><td>${escapeHtml(paymentStatus)}</td></tr>
      <tr><td><strong>Name</strong></td><td>${escapeHtml(reservation.name)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(reservation.email)}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${escapeHtml(reservation.phone)}</td></tr>
      <tr><td><strong>Check-in</strong></td><td>${escapeHtml(reservation.checkIn)}</td></tr>
      <tr><td><strong>Check-out</strong></td><td>${escapeHtml(reservation.checkOut)}</td></tr>
      <tr><td><strong>Stay length</strong></td><td>${escapeHtml(stayLabel)}</td></tr>
      ${reservation.guests ? `<tr><td><strong>Guests</strong></td><td>${escapeHtml(reservation.guests)}</td></tr>` : ""}
      <tr><td><strong>Room type</strong></td><td>${escapeHtml(reservation.roomLabel)}</td></tr>
      <tr><td><strong>Total</strong></td><td>${escapeHtml(reservation.currency)} ${escapeHtml(reservation.estimatedTotal)}</td></tr>
      ${reservation.promo ? `<tr><td><strong>Promo code</strong></td><td>${escapeHtml(reservation.promo)}</td></tr>` : ""}
      ${payment?.["transaction-id"] ? `<tr><td><strong>ExpressPay transaction ID</strong></td><td>${escapeHtml(payment["transaction-id"])}</td></tr>` : ""}
      ${payment?.payment_reference ? `<tr><td><strong>ExpressPay reference</strong></td><td>${escapeHtml(payment.payment_reference)}</td></tr>` : ""}
      ${payment?.["auth-code"] ? `<tr><td><strong>Authorization code</strong></td><td>${escapeHtml(payment["auth-code"])}</td></tr>` : ""}
      ${payment?.["payment_option_type_name"] ? `<tr><td><strong>Payment method</strong></td><td>${escapeHtml(payment["payment_option_type_name"])}</td></tr>` : ""}
      ${payment?.["date-processed"] ? `<tr><td><strong>Paid at</strong></td><td>${escapeHtml(payment["date-processed"])}</td></tr>` : ""}
      ${reservation.message ? `<tr><td><strong>Message</strong></td><td>${escapeHtml(reservation.message)}</td></tr>` : ""}
    </table>
  `;

  return {
    subject: `${payment ? "Paid reservation" : "Reservation request"} from ${safeName} (${reservation.roomLabel})`,
    text,
    html,
    replyTo: `${safeName} <${safeEmail}>`,
  };
}
