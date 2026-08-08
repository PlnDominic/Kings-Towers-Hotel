import { rooms } from "@/app/data";
import { sendMail } from "@/lib/mailer";

const ROOM_LABELS = Object.fromEntries(rooms.map((r) => [r.id, `${r.title} — GHS ${r.price}/night`]));

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

  const {
    token,
    name,
    email,
    phone,
    checkIn,
    checkOut,
    roomType,
    guests,
    nights,
    estimatedTotal,
    message,
    promo,
    orderId
  } = body || {};

  const merchantId = process.env.EXPRESSPAY_MERCHANT_ID;
  const apiKey = process.env.EXPRESSPAY_API_KEY;

  if (!merchantId || !apiKey) {
    return Response.json(
      { error: "ExpressPay credentials are not configured on the server. Please set EXPRESSPAY_MERCHANT_ID and EXPRESSPAY_API_KEY in Vercel environment variables." },
      { status: 400 }
    );
  }

  if (!token) {
    return Response.json({ error: "Transaction token is required for verification." }, { status: 400 });
  }

  const isSandbox = process.env.EXPRESSPAY_SANDBOX === "true";
  const queryUrl = isSandbox
    ? "https://sandbox.expresspaygh.com/api/query.php"
    : "https://expresspaygh.com/api/query.php";

  const params = new URLSearchParams();
  params.append("merchant-id", process.env.EXPRESSPAY_MERCHANT_ID || "");
  params.append("api-key", process.env.EXPRESSPAY_API_KEY || "");
  params.append("token", token);

  try {
    const response = await fetch(queryUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error(`ExpressPay Query API returned HTTP ${response.status}`);
    }

    const queryResult = await response.json();

    // Check result status: 1 = Approved
    const resultStatus = Number(queryResult.result || queryResult.status);

    if (resultStatus === 1) {
      const transactionId = queryResult["transaction-id"] || queryResult.transaction_id || queryResult.transactionId || "N/A";
      const actualAmount = queryResult.amount || estimatedTotal;
      const actualCurrency = queryResult.currency || "GHS";

      const safeName = sanitizeHeaderValue(name || "Guest");
      const safeEmail = sanitizeHeaderValue(email || "");
      const roomLabel = ROOM_LABELS[roomType] || sanitizeHeaderValue(roomType || "");
      const stayLabel = nights ? `${nights} night${Number(nights) > 1 ? "s" : ""}` : null;

      // Build the email notification content
      const text = [
        `CONFIRMED RESERVATION & PAYMENT RECEIPT`,
        `======================================`,
        `New paid reservation confirmed via Kings Towers Hotel website.`,
        ``,
        `--- Payment Details ---`,
        `Payment Status: Approved / Paid (ExpressPay Ghana)`,
        `Transaction ID: ${transactionId}`,
        `Amount Paid: ${actualCurrency} ${actualAmount}`,
        `Order ID: ${orderId || "N/A"}`,
        ``,
        `--- Guest Details ---`,
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        ``,
        `--- Stay Details ---`,
        `Check-in Date: ${checkIn}`,
        `Check-out Date: ${checkOut}`,
        stayLabel ? `Stay Length: ${stayLabel}` : null,
        guests ? `Guests: ${guests}` : null,
        `Room Type: ${roomLabel}`,
        message ? `Guest Message: ${message}` : null,
        promo ? `Promo Code Applied: ${promo}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #ea580c; border-bottom: 2px solid #f97316; padding-bottom: 10px; margin-top: 0;">Reservation & Payment Confirmed</h2>
          <p>A paid reservation has been successfully completed and verified.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f8fafc;"><th colspan="2" style="padding: 10px; text-align: left; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Payment Details</th></tr>
            </thead>
            <tbody>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 40%;">Payment Status</td><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; color: #16a34a; font-weight: bold;">Approved / Paid</td></tr>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Transaction ID</td><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-family: monospace;">${escapeHtml(transactionId)}</td></tr>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Amount Paid</td><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">${escapeHtml(actualCurrency)} ${escapeHtml(actualAmount)}</td></tr>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Order ID</td><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-family: monospace;">${escapeHtml(orderId || "N/A")}</td></tr>
            </tbody>
          </table>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f8fafc;"><th colspan="2" style="padding: 10px; text-align: left; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Guest Details</th></tr>
            </thead>
            <tbody>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 40%;">Name</td><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9;">${escapeHtml(name)}</td></tr>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Email</td><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${safeEmail}">${escapeHtml(email)}</a></td></tr>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Phone</td><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9;">${escapeHtml(phone)}</td></tr>
            </tbody>
          </table>

          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f8fafc;"><th colspan="2" style="padding: 10px; text-align: left; font-size: 14px; border-bottom: 1px solid #e2e8f0;">Stay Details</th></tr>
            </thead>
            <tbody>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 40%;">Check-in</td><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9;">${escapeHtml(checkIn)}</td></tr>
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Check-out</td><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9;">${escapeHtml(checkOut)}</td></tr>
              ${stayLabel ? `<tr><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Stay Length</td><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9;">${escapeHtml(stayLabel)}</td></tr>` : ""}
              ${guests ? `<tr><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Guests</td><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9;">${escapeHtml(guests)}</td></tr>` : ""}
              <tr><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Room Type</td><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9;">${escapeHtml(roomLabel)}</td></tr>
              ${message ? `<tr><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Message</td><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9;">${escapeHtml(message)}</td></tr>` : ""}
              ${promo ? `<tr><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Promo Code</td><td style="padding: 8px 10px; border-bottom: 1px solid #f1f5f9;">${escapeHtml(promo)}</td></tr>` : ""}
            </tbody>
          </table>
        </div>
      `;

      try {
        const mailPromises = [
          // Send email to the hotel
          sendMail({
            subject: `PAID RESERVATION: ${safeName} (${roomLabel})`,
            text,
            html,
            replyTo: `${safeName} <${safeEmail}>`,
          }),
          // Also send a confirmation receipt email to the customer!
          sendMail({
            to: safeEmail,
            subject: `Your Booking Confirmation & Receipt - Kings Towers Hotel`,
            text: `Hi ${name},\n\nThank you for choosing Kings Towers Hotel. Your booking has been successfully confirmed and payment of ${actualCurrency} ${actualAmount} has been processed.\n\nTransaction Details:\n${text}\n\nWe look forward to welcoming you!`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                <h2 style="color: #ea580c; border-bottom: 2px solid #f97316; padding-bottom: 10px; margin-top: 0;">Booking Confirmed</h2>
                <p>Hi <strong>${escapeHtml(name)}</strong>,</p>
                <p>Thank you for choosing Kings Towers Hotel. We are pleased to confirm your booking and payment receipt details below.</p>
                
                ${html}
                
                <div style="margin-top: 25px; font-size: 14px; color: #555; text-align: center;">
                  <p>If you have any questions, please contact us at <a href="mailto:kingstowershotel@gmail.com">kingstowershotel@gmail.com</a>.</p>
                  <p style="font-weight: bold;">We look forward to welcoming you!</p>
                </div>
              </div>
            `,
            replyTo: "kingstowershotel@gmail.com",
          })
        ];

        const mailResults = await Promise.allSettled(mailPromises);
        mailResults.forEach((res, index) => {
          if (res.status === "rejected") {
            console.error(`[reservation verify] Email #${index + 1} failed to send:`, res.reason);
          } else {
            console.log(`[reservation verify] Email #${index + 1} sent successfully.`);
          }
        });
      } catch (err) {
        console.error("[reservation verify] Failed during parallel email dispatch:", err);
      }

      return Response.json({
        ok: true,
        transactionId,
        amount: actualAmount,
        currency: actualCurrency,
        orderId
      });
    } else {
      console.warn("[reservation verify] ExpressPay payment check failed, status:", queryResult);
      return Response.json({
        error: queryResult["result-text"] || queryResult.message || "Payment is not approved yet or has failed."
      }, { status: 400 });
    }
  } catch (err) {
    console.error("[reservation verify] ExpressPay query error:", err);
    return Response.json({ error: "Failed to verify transaction status. Please contact support." }, { status: 400 });
  }
}
