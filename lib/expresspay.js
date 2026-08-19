// Thin client for expressPay Ghana's Merchant API.
// Docs: https://expresspaygh.com/developers/docs/accept-payments/merchant-api
//
// Flow: submitPayment() authorizes the transaction and returns a token ->
// checkoutUrl(token) is where the guest is sent to actually pay -> after
// they return, queryPayment(token) is the source of truth for whether the
// payment was approved (never trust the redirect alone).

const LIVE_BASE = "https://expresspaygh.com";
const SANDBOX_BASE = "https://sandbox.expresspaygh.com";

function getConfig() {
  const merchantId = process.env.EXPRESSPAY_MERCHANT_ID;
  const apiKey = process.env.EXPRESSPAY_API_KEY;
  if (!merchantId || !apiKey) {
    throw new Error("expressPay is not configured. Set EXPRESSPAY_MERCHANT_ID and EXPRESSPAY_API_KEY.");
  }
  const base = process.env.EXPRESSPAY_ENV === "sandbox" ? SANDBOX_BASE : LIVE_BASE;
  return { merchantId, apiKey, base };
}

async function postForm(url, fields) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(fields),
  });
  if (!res.ok) {
    throw new Error(`expressPay request to ${url} failed with HTTP ${res.status}`);
  }
  return res.json();
}

// Step 1 — authorize the transaction and get a checkout token.
// `params` — order-id, amount, currency, firstname, lastname, email,
// phonenumber, username, accountnumber, redirect-url, post-url, order-desc.
export async function submitPayment(params) {
  const { merchantId, apiKey, base } = getConfig();
  return postForm(`${base}/api/submit.php`, {
    "merchant-id": merchantId,
    "api-key": apiKey,
    ...params,
  });
}

// Step 4a — the authoritative check for what actually happened to a token.
// result: 1 = Approved, 2 = Declined, 3 = Error, 4 = Pending.
export async function queryPayment(token) {
  const { merchantId, apiKey, base } = getConfig();
  return postForm(`${base}/api/query.php`, {
    "merchant-id": merchantId,
    "api-key": apiKey,
    token,
  });
}

// Step 2 — where the guest's browser is sent to actually pay.
export function checkoutUrl(token) {
  const { base } = getConfig();
  return `${base}/payment?token=${encodeURIComponent(token)}`;
}

// The reservation details we need after the guest comes back from
// expressPay are carried round-trip in the redirect-url / post-url query
// string (`ref=`) rather than in a database — this app has none. The
// charge amount itself is never taken from this payload; it was already
// locked in server-side during submitPayment, so tampering with `ref` can
// at worst produce a wrong-looking confirmation email, never a wrong charge.
export function encodeRef(payload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function decodeRef(ref) {
  if (!ref) return null;
  try {
    return JSON.parse(Buffer.from(ref, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}
