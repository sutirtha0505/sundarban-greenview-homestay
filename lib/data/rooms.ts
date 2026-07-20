export type RoomTier = "budget" | "premium";

export type Room = {
  id: string;
  slug: string;
  tier: RoomTier;
  title: string;
  description: string;
  image: string;
  /**
   * Per-night tariff in ₹ for the whole room, not per person.
   * Booking a room is room-only — trip packages bundle rooms with travel,
   * guides and meals and are priced separately in `lib/data/trips.ts`.
   */
  pricePerNight: number;
  /** Hard occupancy cap. Must not exceed MAX_GUESTS_BY_TIER for the tier. */
  maxGuests: number;
};

/**
 * House rule: budget rooms sleep 2, premium rooms sleep at most 4.
 * Single source of truth — use this for occupancy tables and booking validation
 * rather than re-typing the numbers.
 */
export const MAX_GUESTS_BY_TIER: Record<RoomTier, number> = {
  budget: 2,
  premium: 4,
};

/** Deterministic ₹ formatter with Indian digit grouping (no locale dependency, so SSR and client always agree). */
export function formatINR(amount: number): string {
  const whole = Math.round(amount).toString();
  const last3 = whole.slice(-3);
  const rest = whole.slice(0, -3);
  const grouped = rest
    ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${last3}`
    : last3;
  return `₹ ${grouped}`;
}

export const budgetRooms: Room[] = [
  {
    id: "b1",
    slug: "budget-cozy-room",
    tier: "budget",
    title: "Budget Cozy Room",
    description:
      "A warm and intimate room tucked within the mangrove edge. Perfect for solo travellers or couples seeking peace and simplicity without sacrificing comfort.",
    image: "/images/rooms/image1.jpg",
    pricePerNight: 1200,
    maxGuests: 2,
  },
  {
    id: "b2",
    slug: "budget-standard-room",
    tier: "budget",
    title: "Budget Standard Room",
    description:
      "Our most popular budget pick — spacious, clean, and thoughtfully arranged to give you a restful stay after a long day of Sundarbans exploration.",
    image: "/images/rooms/image5.jpg",
    pricePerNight: 1600,
    maxGuests: 2,
  },
  {
    id: "b3",
    slug: "budget-essential-room",
    tier: "budget",
    title: "Budget Essential Room",
    description:
      "Everything you need, nothing you don't. A no-fuss, comfortable room designed for the modern eco-traveller who values experiences over extras.",
    image: "/images/rooms/image6.jpg",
    pricePerNight: 1100,
    maxGuests: 2,
  },
  {
    id: "b4",
    slug: "budget-garden-view",
    tier: "budget",
    title: "Budget Garden View",
    description:
      "Wake up to lush greenery right outside your window. This budget gem offers a serene garden outlook at an unbeatable price.",
    image: "/images/rooms/image7.jpg",
    pricePerNight: 1800,
    maxGuests: 2,
  },
  {
    id: "b5",
    slug: "budget-twin-retreat",
    tier: "budget",
    title: "Budget Twin Retreat",
    description:
      "Ideal for friends or family sharing — two comfortable beds, ample storage, and a relaxed atmosphere that feels like a home away from home.",
    image: "/images/rooms/image8.jpg",
    pricePerNight: 2000,
    maxGuests: 2,
  },
];

export const premiumRooms: Room[] = [
  {
    id: "p1",
    slug: "premium-jungle-suite",
    tier: "premium",
    title: "Premium Jungle Suite",
    description:
      "Immerse yourself in the wild without sacrificing luxury. Floor-to-ceiling views, premium linens, and a private balcony overlooking the mangroves.",
    image: "/images/rooms/image2.jpg",
    pricePerNight: 3800,
    maxGuests: 4,
  },
  {
    id: "p2",
    slug: "premium-river-view",
    tier: "premium",
    title: "Premium River View",
    description:
      "Fall asleep to the soft sound of flowing water. This suite offers panoramic river vistas paired with elegant furnishings for a truly memorable stay.",
    image: "/images/rooms/image3.jpg",
    pricePerNight: 4200,
    maxGuests: 3,
  },
  {
    id: "p3",
    slug: "premium-heritage-room",
    tier: "premium",
    title: "Premium Heritage Room",
    description:
      "Inspired by the rich heritage of Bengal, this room blends traditional craftsmanship with modern comforts for a culturally immersive retreat.",
    image: "/images/rooms/image4.jpg",
    pricePerNight: 3500,
    maxGuests: 3,
  },
  {
    id: "p4",
    slug: "premium-canopy-loft",
    tier: "premium",
    title: "Premium Canopy Loft",
    description:
      "Perched high with a bird's-eye perspective of the treetops — a unique loft experience that brings the forest to your doorstep.",
    image: "/images/rooms/image9.jpg",
    pricePerNight: 4500,
    maxGuests: 4,
  },
  {
    id: "p5",
    slug: "premium-honeymoon-suite",
    tier: "premium",
    title: "Premium Honeymoon Suite",
    description:
      "A romantic haven crafted for two. Draped in warm hues, with a private jacuzzi and curated amenities that make every moment unforgettable.",
    image: "/images/rooms/image10.jpg",
    pricePerNight: 5200,
    maxGuests: 2,
  },
];

export const roomsData: Room[] = [...budgetRooms, ...premiumRooms];

export function getRoomsByTier(tier: RoomTier): Room[] {
  return tier === "budget" ? budgetRooms : premiumRooms;
}

export function getRoomBySlug(slug: string): Room | undefined {
  return roomsData.find((room) => room.slug === slug);
}
