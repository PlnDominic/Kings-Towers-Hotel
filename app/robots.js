const BASE_URL = "https://www.kingstowers-hotel.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // API routes and the mid-payment redirect page aren't content —
        // no reason for a crawler to hit them.
        disallow: ["/api/", "/reservation/payment-result"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
