import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Room — Sundarban Greenview Homestay",
  description:
    "Reserve your budget or premium room at Sundarban Greenview Homestay, near Pakhiralay. Calculate custom rates per night and book directly via WhatsApp.",
  alternates: {
    canonical: "/rooms/booking",
  },
};

export default function RoomBookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
