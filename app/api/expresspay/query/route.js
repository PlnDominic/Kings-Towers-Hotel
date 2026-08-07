import { queryExpressPayPayment } from "@/lib/expresspay";

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

  try {
    const payment = await queryExpressPayPayment(token);
    return Response.json({ ok: true, payment });
  } catch (error) {
    console.error("[expresspay-query] failed to query payment:", error);
    return Response.json(
      { error: error.message || "We couldn't check the payment status right now." },
      { status: 502 }
    );
  }
}
