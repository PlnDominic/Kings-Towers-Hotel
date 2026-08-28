const BASE_URL = "https://kingstowers-hotel.com";

// Only real, indexable pages — not the API routes, and not
// /reservation/payment-result, which only makes sense mid-transaction
// and shouldn't show up in search results.
export default function sitemap() {
  const now = new Date();
  return [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/reservation`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];
}
