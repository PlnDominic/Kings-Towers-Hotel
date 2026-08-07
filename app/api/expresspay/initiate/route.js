import {
  buildExpressPayOrderId,
  resolveAppBaseUrl,
  splitFullName,
  submitExpressPayPayment,
} from "@/lib/expresspay";
import { validateReservationPayload } from "@/lib/reservation";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  let reservation;
  try {
    reservation = validateReservationPayload(body);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  const orderId = buildExpressPayOrderId();
  const appBaseUrl = resolveAppBaseUrl(request);
  const redirectUrl = `${appBaseUrl}/reservation/complete?orderId=${encodeURIComponent(orderId)}`;
  const postUrl = `${appBaseUrl}/api/expresspay/postback?orderId=${encodeURIComponent(orderId)}`;
  const { firstName, lastName } = splitFullName(reservation.name);

  try {
    const payment = await submitExpressPayPayment({
      amount: Number(reservation.estimatedTotal).toFixed(2),
      orderId,
      orderDesc: `${reservation.room.title} booking from ${reservation.checkIn} to ${reservation.checkOut}`,
      redirectUrl,
      postUrl,
      accountNumber: reservation.phone,
      firstName,
      lastName,
      phoneNumber: reservation.phone,
      email: reservation.email,
      username: reservation.email,
      orderImageUrl: `${appBaseUrl}/favicon.ico`,
    });

    return Response.json({
      ok: true,
      orderId,
      token: payment.token,
      checkoutUrl: payment.checkoutUrl,
      redirectUrl,
    });
  } catch (error) {
    console.error("[expresspay-initiate] failed to create checkout:", error);
    return Response.json(
      { error: error.message || "We couldn't start the ExpressPay checkout right now." },
      { status: 502 }
    );
  }
}
