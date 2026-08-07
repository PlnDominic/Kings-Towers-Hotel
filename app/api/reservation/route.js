import { sendMail } from "@/lib/mailer";
import { buildReservationMail, validateReservationPayload } from "@/lib/reservation";

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

  const email = buildReservationMail(reservation);

  try {
    await sendMail({
      subject: email.subject,
      text: email.text,
      html: email.html,
      replyTo: email.replyTo,
    });
  } catch (err) {
    console.error("[reservation] failed to send mail:", err);
    return Response.json({ error: "We couldn't send your request right now. Please call or email us instead." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
