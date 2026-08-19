import { queryPayment, decodeRef } from "@/lib/expresspay";
import { sendPaymentConfirmation } from "@/lib/paymentMail";

// expressPay's post-url callback — invoked asynchronously for transactions
// that were still Pending (result 4) when the guest was redirected back,
// which per their docs is the mobile money case. We must always re-check
// with the Query API rather than trust anything in the callback itself,
// then answer HTTP 200 so expressPay stops retrying.
async function handleNotify(request) {
  const url = new URL(request.url);
  let token = url.searchParams.get("token");
  const ref = url.searchParams.get("ref");

  if (!token && request.method === "POST") {
    try {
      const form = await request.formData();
      token = form.get("token") || token;
    } catch {
      // Not a form body — fall through with whatever we already have.
    }
  }

  if (!token) {
    console.error("[payment] notify called without a token");
    return new Response("missing token", { status: 200 });
  }

  const bookingRef = decodeRef(ref);
  if (!bookingRef) {
    console.error("[payment] notify: could not decode ref for token", token);
    return new Response("missing ref", { status: 200 });
  }

  let query;
  try {
    query = await queryPayment(token);
  } catch (err) {
    console.error("[payment] notify: query failed", err);
    // Ask expressPay to retry — this is our failure, not theirs.
    return new Response("query failed", { status: 500 });
  }

  if (query.result === 1) {
    try {
      await sendPaymentConfirmation(bookingRef, query);
    } catch (err) {
      console.error("[payment] notify: failed to send confirmation email", err);
    }
  } else {
    console.log("[payment] notify: non-approved result", query.result, query["result-text"]);
  }

  return new Response("ok", { status: 200 });
}

export async function POST(request) {
  return handleNotify(request);
}

export async function GET(request) {
  return handleNotify(request);
}
