import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rooms & Accommodations — Luxury River View Stay in Sundarbans",
  description:
    "Explore Budget & Premium rooms at Sundarban Greenview Homestay near Pakhiralay, Gosaba. Features attached bath, AC/non-AC options, river view balconies, power backup & home-cooked meals.",
  keywords: [
    "Sundarban homestay rooms",
    "Sundarban budget rooms",
    "Sundarban premium resort rooms",
    "River view stay Pakhiralay Gosaba",
    "Sundarban room booking per night",
    "AC rooms Sundarban homestay"
  ],
  alternates: {
    canonical: "/rooms",
  },
  openGraph: {
    title: "Rooms & Accommodations — Sundarban Greenview Homestay",
    description: "Book Budget and Premium river-view rooms at Sundarban Greenview Homestay, Pakhiralay.",
    url: "https://sundarbangreenviewhomestay.com/rooms",
    images: [
      {
        url: "https://fupyposiegpynmgndboz.supabase.co/storage/v1/object/public/green_view_home_stay/images/gallery/image2.jpg",
        width: 1200,
        height: 630,
        alt: "Sundarban Greenview Homestay Rooms",
      },
    ],
  },
};

export default function RoomsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
