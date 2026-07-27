export const heroImages = [
  { src: "/images/pool-grounds.jpg", alt: "Kings Towers Hotel swimming pool and grounds" },
  { src: "/images/poolside-garden.jpg", alt: "Poolside garden with African relief mural" },
  { src: "/images/pool-waterfall.jpg", alt: "Pool with carved African relief mural and stone waterfall" },
  { src: "/images/poolbar-terrace.jpg", alt: "Pool Bar terrace with seating" },
  { src: "/images/hotel-exterior.jpg", alt: "Kings Towers Hotel exterior" },
];

export const rooms = [
  {
    id: "queen",
    title: "Queen Room",
    price: "525",
    img: "/images/room-queen.jpg",
    alt: "Queen Room with wood ceiling and orange curtains",
    desc: "A spacious room with a queen bed, warm wood flooring and a dedicated work desk.",
    features: "Queen bed · Air conditioning · Ensuite bath · DSTV",
  },
  {
    id: "standard",
    title: "Standard Room",
    price: "425",
    img: "/images/room-standard.jpg",
    alt: "Standard Room with double bed",
    desc: "A comfortable double room fitted with air conditioning, TV and a personal refrigerator.",
    features: "Double bed · Air conditioning · Ensuite bath · DSTV",
  },
  {
    id: "twin",
    title: "Twin Room",
    price: "745",
    img: "/images/room-twin.jpg",
    alt: "Twin Room with two single beds",
    desc: "Two single beds in one air-conditioned room, ideal for colleagues or friends traveling together.",
    features: "Twin beds · Air conditioning · Ensuite bath · DSTV",
  },
  {
    id: "mini-suite",
    title: "Mini Suite",
    price: "695",
    img: null,
    alt: "Mini Suite",
    desc: "Our largest guest room, with extra lounge space for longer stays.",
    features: "Extra lounge area · Air conditioning · Ensuite bath · DSTV",
  },
];

const icon = (paths) =>
  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.4">${paths}</svg>`;

export const amenities = [
  {
    title: "Twin-Bed Guest Rooms",
    desc: "Clean, tastily furnished, air-conditioned rooms with personal refrigerators.",
    icon: icon(
      '<path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18h18M3 18v2M21 18v2M7 10V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3"/>'
    ),
  },
  {
    title: "Swimming Pool",
    desc: "Rooftop garden and poolside terrace with tropical fruit cocktails.",
    icon: icon(
      '<path d="M2 17c1.5 1 3 1 4.5 0S9 16 10.5 17s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0M4 12l7-8 7 8"/>'
    ),
  },
  {
    title: "DSTV & Local Channels",
    desc: "In-room DSTV and four local TV channels.",
    icon: icon(
      '<rect x="3" y="5" width="18" height="13" rx="1"/><path d="M8 21h8M12 18v3"/>'
    ),
  },
  {
    title: "4 Bars, 3 Restaurants",
    desc: "Oriental and rare African dishes, plus a chilled pool bar.",
    icon: icon(
      '<path d="M4 3h16l-1.5 9a5 5 0 0 1-5 4h-3a5 5 0 0 1-5-4L4 3zM8 21h8M12 16v5"/>'
    ),
  },
];

export const galleryImages = [
  { src: "/images/pool-grounds.jpg", alt: "Swimming pool and grounds" },
  { src: "/images/poolside-garden.jpg", alt: "Poolside garden with African relief mural" },
  { src: "/images/pool-waterfall.jpg", alt: "Pool with stone waterfall" },
  { src: "/images/poolbar-terrace.jpg", alt: "Pool Bar terrace" },
  { src: "/images/hotel-exterior.jpg", alt: "Hotel exterior" },
  { src: "/images/gallery-queen.jpg", alt: "Queen Room" },
  { src: "/images/room-standard.jpg", alt: "Standard Room" },
  { src: "/images/gallery-twin.jpg", alt: "Twin Room" },
];

export const nearbyAttractions = [{ name: "KNUST", distance: "2 min" }];

export const gettingHereSteps = [
  "From Gyenyase, head toward High School Junction.",
  "Turn onto Ahensan Estate road, past Kumasi High School.",
  "Kings Towers Hotel sits between Ahensan Estate and the KNUST Ahinsan Security Gate, near Coca-Cola / the Brewery.",
];
