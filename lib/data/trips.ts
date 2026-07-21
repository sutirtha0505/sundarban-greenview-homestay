import { getStorageImageUrl } from "@/lib/supabase/storage";

export type Trip = {
  slug: string;
  image: string;
  pillText: string;
  durationText: string;
  title: string;
  rating: string;
  reviews: string;
  /** Display string, e.g. "₹ 3,675". Use `priceValue` for any comparison. */
  price: string;
  /** Numeric per-person price in ₹, used for price-band filtering and sorting. */
  priceValue: number;
  groupType: "group" | "private";
  durationBand: "1N" | "2N" | "3N+";
  includes: string[];
  excludes: string[];
};

export type DurationBand = Trip["durationBand"];
export type GroupType = Trip["groupType"];

export const DURATION_OPTIONS: { id: DurationBand; label: string }[] = [
  { id: "1N", label: "1 Night" },
  { id: "2N", label: "2 Nights" },
  { id: "3N+", label: "3+ Nights" },
];

export const GROUP_OPTIONS: { id: GroupType; label: string }[] = [
  { id: "group", label: "Group" },
  { id: "private", label: "Private" },
];

/** `min` inclusive, `max` exclusive. */
export const PRICE_OPTIONS: { id: string; label: string; min: number; max: number }[] = [
  { id: "under-5k", label: "Under ₹5k", min: 0, max: 5000 },
  { id: "5k-7k", label: "₹5k – ₹7k", min: 5000, max: 7000 },
  { id: "7k-plus", label: "₹7k+", min: 7000, max: Infinity },
];

export const tripsData: Trip[] = [
  {
    slug: "sundarban-1-day-1-night",
    image: getStorageImageUrl("/images/trips/trip1.jpg"),
    pillText: "Night on board | One Day, One Night | Sundarban",
    durationText: "Sundarban 1 Day, 1 Night",
    title: "Sundarban Tour: Sajnekhali Bird Sanctuary, Watch Tower, Eco Garden, Hiron Point etc.",
    rating: "4.5",
    reviews: "Very Good (2.9k Reviews)",
    price: "₹ 3,675",
    priceValue: 3675,
    groupType: "group",
    durationBand: "1N",
    includes: ["Boat transfers", "Meals", "Forest guide", "Basic stay"],
    excludes: ["GST", "Forest permit", "Pickup/drop", "Personal expenses"],
  },
  {
    slug: "sundarban-2-days-3-nights",
    image: getStorageImageUrl("/images/trips/trip2.jpg"),
    pillText: "Night on board | Two Days, Three Nights | Sundarban",
    durationText: "Sundarban 2 Days, 3 Nights",
    title: "Sundarban Birdwatching & Riverside Relaxation",
    rating: "4.5",
    reviews: "Very Good (2.9k Reviews)",
    price: "₹ 4,675",
    priceValue: 4675,
    groupType: "private",
    durationBand: "2N",
    includes: ["Boat safari", "Guided birdwatching", "Meals", "Riverside stay"],
    excludes: ["GST", "Forest permit", "Anything not listed"],
  },
  {
    slug: "sundarban-5-days-7-nights",
    image: getStorageImageUrl("/images/trips/trip3.jpg"),
    pillText: "Night on board | Two Days, Three Nights | Sundarban",
    durationText: "Sundarban 5 Days, 7 Nights",
    title: "Sundarban Wildlife Adventure: Deep Forest Exploration",
    rating: "4.7",
    reviews: "Very Good (2.9k Reviews)",
    price: "₹ 5,695",
    priceValue: 5695,
    groupType: "private",
    durationBand: "3N+",
    includes: ["Extended safari", "Watchtower visits", "Meals", "Guide service"],
    excludes: ["GST", "Forest permit", "Travel insurance"],
  },
  {
    slug: "sundarban-3-days-4-nights",
    image: getStorageImageUrl("/images/trips/trip4.jpg"),
    pillText: "Mangrove Safari & Trek | 3 Days, 4 Nights | Sundarban",
    durationText: "Sundarban 3 Days, 4 Nights",
    title: "Sundarban Wildlife Trek & Coastal Camping",
    rating: "4.6",
    reviews: "Excellent (1.8k Reviews)",
    price: "₹ 6,995",
    priceValue: 6995,
    groupType: "group",
    durationBand: "3N+",
    includes: ["Mangrove trek", "Camping stay", "Meals", "Local guide"],
    excludes: ["GST", "Forest permit", "Camping gear"],
  },
  {
    slug: "sundarban-4-days-5-nights",
    image: getStorageImageUrl("/images/trips/trip5.jpg"),
    pillText: "River Cruise & Culture | 4 Days, 5 Nights | Sundarban",
    durationText: "Sundarban 4 Days, 5 Nights",
    title: "Sundarban River Journey: Village Life & Birdlife",
    rating: "4.8",
    reviews: "Outstanding (3.5k Reviews)",
    price: "₹ 8,495",
    priceValue: 8495,
    groupType: "private",
    durationBand: "3N+",
    includes: ["Cruise", "Village visit", "Meals", "Bengali cultural evening"],
    excludes: ["GST", "Forest permit", "Premium beverage service"],
  },
];
