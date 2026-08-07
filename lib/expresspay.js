import crypto from "node:crypto";

const EXPRESSPAY_ENVIRONMENTS = {
  sandbox: "https://sandbox.expresspaygh.com",
  production: "https://expresspaygh.com",
  live: "https://expresspaygh.com",
};

function getExpressPayCredentials() {
  const merchantId = process.env.EXPRESSPAY_MERCHANT_ID;
  const apiKey = process.env.EXPRESSPAY_API_KEY;

  if (!merchantId || !apiKey) {
    throw new Error(
      "ExpressPay is not configured. Set EXPRESSPAY_MERCHANT_ID and EXPRESSPAY_API_KEY in .env.local."
    );
  }

  return { merchantId, apiKey };
}

function getExpressPayBaseUrl() {
  const rawEnvironment = String(process.env.EXPRESSPAY_ENVIRONMENT || "sandbox").toLowerCase();
  const baseUrl = EXPRESSPAY_ENVIRONMENTS[rawEnvironment];

  if (!baseUrl) {
    throw new Error("EXPRESSPAY_ENVIRONMENT must be one of: sandbox, production, live.");
  }

  return baseUrl;
}

function normalizeBaseUrl(value) {
  return String(value || "").replace(/\/+$/, "");
}

export function resolveAppBaseUrl(request) {
  const configuredBaseUrl =
    process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;

  if (configuredBaseUrl) {
    return normalizeBaseUrl(configuredBaseUrl);
  }

  return normalizeBaseUrl(request.nextUrl.origin);
}

export function splitFullName(fullName) {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { firstName: "Guest", lastName: "Guest" };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: parts[0] };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export function buildExpressPayOrderId() {
  return `KTH-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

async function readExpressPayJson(response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Unexpected ExpressPay response: ${text || response.statusText}`);
  }
}

async function postForm(endpointPath, values) {
  const { merchantId, apiKey } = getExpressPayCredentials();
  const form = new URLSearchParams();

  form.set("merchant-id", merchantId);
  form.set("api-key", apiKey);

  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== null && value !== "") {
      form.set(key, String(value));
    }
  }

  const response = await fetch(`${getExpressPayBaseUrl()}${endpointPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
    cache: "no-store",
  });

  return readExpressPayJson(response);
}

export function buildCheckoutUrl(token) {
  return `${getExpressPayBaseUrl()}/api/checkout.php?token=${encodeURIComponent(token)}`;
}

export async function submitExpressPayPayment({
  amount,
  orderId,
  orderDesc,
  redirectUrl,
  postUrl,
  accountNumber,
  firstName,
  lastName,
  phoneNumber,
  email,
  username,
  orderImageUrl,
}) {
  const result = await postForm("/api/submit.php", {
    firstname: firstName,
    lastname: lastName,
    email,
    phonenumber: phoneNumber,
    username,
    accountnumber: accountNumber,
    currency: "GHS",
    amount,
    "order-id": orderId,
    "order-desc": orderDesc,
    "order-img-url": orderImageUrl,
    "redirect-url": redirectUrl,
    "post-url": postUrl,
  });

  if (Number(result?.status) !== 1 || !result?.token) {
    throw new Error(result?.message || "ExpressPay rejected the payment request.");
  }

  return {
    ...result,
    checkoutUrl: buildCheckoutUrl(result.token),
  };
}

export async function queryExpressPayPayment(token) {
  if (!token) {
    throw new Error("A payment token is required.");
  }

  return postForm("/api/query.php", { token });
}
