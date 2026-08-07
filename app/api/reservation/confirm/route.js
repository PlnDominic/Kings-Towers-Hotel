import { sendMail } from "@/lib/mailer";
import { buildReservationMail, validateReservationPayload } from "@/lib/reservation";
import { queryExpressPayPayment } from "@/lib/expresspay";

function amountsMatch(expectedAmount, paidAmount) {
  return Number(expectedAmount).toFixed(2) === Number(paidAmount).toFixed(2);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const token = String(body?.token || "").trim();
  if (!token) {
    return Response.json({ error: "Missing ExpressPay token." }, { status: 400 });
  }

  let reservation;
  try {
    reservation = validateReservationPayload(body?.reservation);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  let payment;
  try {
    payment = await queryExpressPayPayment(token);
  } catch (error) {
    console.error("[reservation-confirm] failed to query ExpressPay:", error);
    return Response.json({ error: "We couldn't verify your payment right now. Please contact the hotel." }, { status: 502 });
  }

  if (Number(payment?.result) !== 1) {
    return Response.json(
      { error: payment?.["result-text"] || "Payment is not completed yet.", payment },
      { status: 409 }
    );
  }

  if (!amountsMatch(reservation.estimatedTotal, payment?.amount)) {
    return Response.json(
      { error: "The payment amount did not match the reservation total. Please contact the hotel.", payment },
      { status: 409 }
    );
  }

  const email = buildReservationMail(reservation, payment);

  try {
    await sendMail({
      subject: email.subject,
      text: email.text,
      html: email.html,
      replyTo: email.replyTo,
    });
  } catch (error) {
    console.error("[reservation-confirm] failed to send mail:", error);
    return Response.json(
      { error: "Your payment was received, but we couldn't notify the hotel automatically. Please contact the hotel." },
      { status: 502 }
    );
  }

  return Response.json({
    ok: true,
    payment,
    reservation: {
      roomLabel: reservation.roomLabel,
      estimatedTotal: reservation.estimatedTotal,
      currency: reservation.currency,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      nights: reservation.nights,
    },
  });
}
