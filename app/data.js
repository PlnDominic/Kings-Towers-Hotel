export const heroImages = [
  { src: "/images/pool-waterfall.jpg", alt: "Pool with carved African relief mural and stone waterfall" },
  { src: "/images/poolbar-terrace.jpg", alt: "Pool Bar terrace with seating" },
  { src: "/images/hotel-exterior.jpg", alt: "Kings Towers Hotel exterior" },
  { src: "/images/room-queen.jpg", alt: "Queen Room with wood ceiling and orange curtains" },
];

export const rooms = [
  {
    id: "standard",
    title: "Standard Guestroom",
    price: "550",
    img: "/images/room-standard.jpg",
    alt: "Standard Room with double bed",
    desc: "A comfortable double room fitted with air conditioning, TV and a personal refrigerator.",
    features: "Double bed · Air conditioning · Internet · DSTV & local channels · Personal refrigerator",
  },
  {
    id: "queen",
    title: "Queen Bed Guestroom",
    price: "650",
    img: "/images/room-queen.jpg",
    alt: "Queen Room with wood ceiling and orange curtains",
    desc: "A spacious room with a queen bed, warm wood flooring and a dedicated work desk.",
    features: "Queen bed · Air conditioning · Internet · DSTV & local channels · Personal refrigerator",
  },
  {
    id: "mini-suite",
    title: "Mini-Suite Guestroom",
    price: "850",
    img: "/images/room-mini-suite.png",
    alt: "Mini-Suite with wood-panelled ceiling, work desk and patterned curtains",
    desc: "Our largest guest room, with extra lounge space for longer stays.",
    features: "Extra lounge area · Air conditioning · Internet · DSTV & local channels · Personal refrigerator",
  },
  {
    id: "twin",
    title: "Twin-Bed Guestroom",
    price: "950",
    img: "/images/room-twin.jpg",
    alt: "Twin Room with two single beds",
    desc: "Two single beds in one air-conditioned room, ideal for colleagues or friends traveling together.",
    features: "Twin beds · Air conditioning · Internet · DSTV & local channels · Personal refrigerator",
  },
];

const icon = (paths) =>
  `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">${paths}</svg>`;

export const amenities = [
  {
    title: "Guestrooms",
    desc: "A range of affordable tastily furnished and restful airconditioned guestrooms.",
    icon: icon(
      '<path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18h18M3 18v2M21 18v2M7 10V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3"/>'
    ),
  },
  {
    title: "Internet & DSTV",
    desc: "In-room internet service, DSTV and local TV Channels.",
    icon: icon('<rect x="3" y="5" width="18" height="13" rx="1"/><path d="M8 21h8M12 18v3"/>'),
  },
  {
    title: "Dining & Bar",
    desc: "Enjoy meals, drinks and liquor carefully selected from Ghanaian, continental and oriental dishes to surprise your palate.",
    icon: icon('<path d="M4 3h16l-1.5 9a5 5 0 0 1-5 4h-3a5 5 0 0 1-5-4L4 3zM8 21h8M12 16v5"/>'),
  },
  {
    title: "Swimming Pool",
    desc: "A clean and cute swimming pool to cool off those hot afternoons.",
    icon: icon('<path d="M2 17c1.5 1 3 1 4.5 0S9 16 10.5 17s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0M4 12l7-8 7 8"/>'),
  },
  {
    title: "24/7 Security & Power",
    desc: "24 / 7 utilities including electric power, total property security provided by electric fencing monitored by CCTV.",
    icon: icon('<path d="M12 3 4 6v6c0 4.4 3.2 8.3 8 9.5 4.8-1.2 8-5.1 8-9.5V6l-8-3Z"/>'),
  },
  {
    title: "Customer Service",
    desc: "Very professional customer service team ready to provide for your needs when in residence.",
    icon: icon(
      '<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="2" y="13" width="4" height="6" rx="1"/><rect x="18" y="13" width="4" height="6" rx="1"/><path d="M20 19a4 4 0 0 1-4 4h-2"/>'
    ),
  },
  {
    title: "Conferencing & Events",
    desc: "Conferencing with buffet service facilities for social and educational groups as well as for your special birthday and wedding events.",
    icon: icon('<rect x="3" y="4" width="18" height="14" rx="1"/><path d="M3 9h18M8 21h8M12 18v3"/>'),
  },
];

export const galleryImages = [
  { src: "/images/pool-grounds.jpg", alt: "Swimming pool and grounds" },
  { src: "/images/poolside-garden.jpg", alt: "Poolside garden with African relief mural" },
  { src: "/images/pool-waterfall.jpg", alt: "Pool with stone waterfall" },
  { src: "/images/poolbar-terrace.jpg", alt: "Pool Bar terrace" },
  { src: "/images/hotel-exterior.jpg", alt: "Hotel exterior" },
  { src: "/images/room-queen.jpg", alt: "Queen Room" },
  { src: "/images/room-standard.jpg", alt: "Standard Room" },
  { src: "/images/gallery-twin.jpg", alt: "Twin Room" },
];

// Real reviews from the hotel's Google Business Profile, trimmed to a
// short pull-quote each — not fabricated or invented.
export const testimonials = [
  {
    quote: "I enjoyed my stay. Clean rooms, reasonable prices, swimming pool, morning breakfast.",
    name: "Suzie Q.",
    detail: "4/5 on Google · Holiday, Family",
  },
  {
    quote:
      "Very pleasant place to lodge. The customer service was very great — everyone was very friendly. A nice and cozy place to stay, and I would recommend it.",
    name: "Bernice Yram Danu, PhD.",
    detail: "4/5 on Google · Business, Solo",
  },
  {
    quote:
      "Lovely and near bedrooms. I slept like a baby at night. Wonderful continental breakfast served too. I can't wait to visit there again when I'm in Kumasi.",
    name: "Abena Mimi",
    detail: "5/5 on Google · Holiday, Friends",
  },
];

