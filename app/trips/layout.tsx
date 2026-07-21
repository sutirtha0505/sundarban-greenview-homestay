import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sundarban Tour Packages & Boat Safaris — 1D, 2D & 3D Trips",
  description:
    "Book official Sundarban tour packages & jungle boat safaris. 1-Day Express, 2-Day Classic, and 3-Day Deep Delta exploration. Includes meals, watchtower permits, guide & stays.",
  keywords: [
    "Sundarban tour packages",
    "Sundarban boat safari booking",
    "Sundarban 2 days 1 night package",
    "Sundarban 3 days 2 nights tour",
    "Sundarban tiger reserve safari",
    "Dobanki Sajnekhali watchtower tour"
  ],
  alternates: {
    canonical: "/trips",
  },
  openGraph: {
    title: "Sundarban Tour Packages & Safaris — Sundarban Greenview Homestay",
    description: "Curated 1D, 2D & 3D Sundarban jungle boat safari packages with lodging and meals.",
    url: "https://sundarbangreenviewhomestay.com/trips",
    images: [
      {
        url: "https://fupyposiegpynmgndboz.supabase.co/storage/v1/object/public/green_view_home_stay/images/gallery/image3.jpg",
        width: 1200,
        height: 630,
        alt: "Sundarban Boat Safari Tour",
      },
    ],
  },
};

export default function TripsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
