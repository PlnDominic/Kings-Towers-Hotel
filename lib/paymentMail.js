import { sendMail } from "./mailer";
import { sanitizeHeaderValue, escapeHtml } from "./mailFormat";

// Best-effort dedupe only: this app has no database, so there's nowhere
// durable to record "already emailed this order". A guest refreshing the
// payment-result page re-runs the Query API call and would otherwise
// re-send both emails every time; this in-memory guard catches that within
// one warm server instance, but a cold start or a second instance won't
// share it. If duplicate emails become a real problem, this is the place
// to swap in a real store (KV, a database row, etc).
const sentOrderIds = new Map();
const DEDUPE_WINDOW_MS = 30 * 60 * 1000;

function alreadySent(orderId) {
  const at = orderId && sentOrderIds.get(orderId);
  return Boolean(at) && Date.now() - at < DEDUPE_WINDOW_MS;
}

function markSent(orderId) {
  if (!orderId) return;
  sentOrderIds.set(orderId, Date.now());
  if (sentOrderIds.size > 500) {
    const cutoff = Date.now() - DEDUPE_WINDOW_MS;
    for (const [id, at] of sentOrderIds) {
      if (at < cutoff) sentOrderIds.delete(id);
    }
  }
}

// Sent once a deposit is confirmed Approved by expressPay's Query API —
// one email to the hotel (so staff see the paid booking) and a receipt
// back to the guest. Called from both the payment-result page (card
// payments, confirmed synchronously) and the post-url webhook (mobile
// money, confirmed asynchronously) — see lib/expresspay.js for why those
// two paths don't double-send under expressPay's documented behavior.
export async function sendPaymentConfirmation(ref, query) {
  const orderId = query["order-id"] || ref.orderId;
  if (alreadySent(orderId)) return;
  markSent(orderId);

  const safeName = sanitizeHeaderValue(ref.name);
  const safeEmail = sanitizeHeaderValue(ref.email);
  const stayLabel = ref.nights ? `${ref.nights} night${Number(ref.nights) > 1 ? "s" : ""}` : null;

  const lines = [
    `Name: ${ref.name}`,
    `Email: ${ref.email}`,
    `Phone: ${ref.phone}`,
    `Check-in: ${ref.checkIn}`,
    `Check-out: ${ref.checkOut}`,
    stayLabel ? `Stay length: ${stayLabel}` : null,
    ref.guests ? `Guests: ${ref.guests}` : null,
    `Room type: ${ref.roomLabel}`,
    ref.total ? `Estimated total: GHS ${ref.total}` : null,
    ref.promo ? `Promo code: ${ref.promo}` : null,
    ref.message ? `Message: ${ref.message}` : null,
    ``,
    `Deposit paid: GHS ${query.amount} (${query["result-text"]})`,
    `expressPay order id: ${query["order-id"]}`,
    `expressPay transaction id: ${query["transaction-id"]}`,
    `Date processed: ${query["date-processed"]}`,
  ].filter(Boolean);

  const rows = [
    ["Name", ref.name],
    ["Email", ref.email],
    ["Phone", ref.phone],
    ["Check-in", ref.checkIn],
    ["Check-out", ref.checkOut],
    stayLabel ? ["Stay length", stayLabel] : null,
    ref.guests ? ["Guests", ref.guests] : null,
    ["Room type", ref.roomLabel],
    ref.total ? ["Estimated total", `GHS ${ref.total}`] : null,
    ref.promo ? ["Promo code", ref.promo] : null,
    ref.message ? ["Message", ref.message] : null,
    ["Deposit paid", `GHS ${query.amount} (${query["result-text"]})`],
    ["expressPay order id", query["order-id"]],
    ["expressPay transaction id", query["transaction-id"]],
    ["Date processed", query["date-processed"]],
  ]
    .filter(Boolean)
    .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`)
    .join("");

  // Both emails fire in parallel and independently — a delivery failure on
  // one (e.g. a bad guest address) must never block or delay the other,
  // and must never look like the payment itself failed.
  const results = await Promise.allSettled([
    sendMail({
      subject: `Deposit paid — ${safeName} (${ref.roomLabel})`,
      text: [`Deposit received via expressPay`, ``, ...lines].join("\n"),
      html: `<h2>Deposit received</h2><table cellpadding="4" cellspacing="0">${rows}</table>`,
      replyTo: `${safeName} <${safeEmail}>`,
    }),
    sendMail({
      to: ref.email,
      subject: `Your deposit is confirmed — Kings Towers Hotel`,
      text: [
        `Hi ${ref.name},`,
        ``,
        `Thanks — we've received your deposit and your room is on hold.`,
        ``,
        ...lines,
        ``,
        `The balance is payable at check-in. We look forward to welcoming you.`,
        ``,
        `Kings Towers Hotel Limited`,
      ].join("\n"),
      html: `
        <p>Hi ${escapeHtml(ref.name)},</p>
        <p>Thanks — we've received your deposit and your room is on hold.</p>
        <table cellpadding="4" cellspacing="0">${rows}</table>
        <p>The balance is payable at check-in. We look forward to welcoming you.</p>
        <p>Kings Towers Hotel Limited</p>
      `,
    }),
  ]);

  results.forEach((res, i) => {
    if (res.status === "rejected") {
      console.error(`[payment] confirmation email #${i + 1} (${i === 0 ? "hotel" : "guest"}) failed:`, res.reason);
    }
  });
}
