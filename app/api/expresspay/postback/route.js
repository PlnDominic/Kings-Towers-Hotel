import { queryExpressPayPayment } from "@/lib/expresspay";

async function parseRequestPayload(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    return Object.fromEntries(formData.entries());
  }

  const text = await request.text();
  return text ? { raw: text } : {};
}

export async function POST(request) {
  const orderId = request.nextUrl.searchParams.get("orderId");

  try {
    const payload = await parseRequestPayload(request);
    const token = payload?.token ? String(payload.token).trim() : "";

    if (token) {
      try {
        const payment = await queryExpressPayPayment(token);
        console.info("[expresspay-postback] received status update", {
          orderId,
          result: payment?.result,
          resultText: payment?.["result-text"],
          transactionId: payment?.["transaction-id"],
        });
      } catch (error) {
        console.error("[expresspay-postback] query failed:", error);
      }
    } else {
      console.info("[expresspay-postback] callback received without token", { orderId });
    }
  } catch (error) {
    console.error("[expresspay-postback] failed to parse callback:", error);
  }

  return new Response("OK", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
