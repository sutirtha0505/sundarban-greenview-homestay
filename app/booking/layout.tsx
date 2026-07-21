import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Tour Package — Sundarban Greenview Homestay",
  description:
    "Reserve your Sundarban tour package online. Instant booking calculator for group & private trips, including food, boat safaris, permits, and homestay lodging.",
  alternates: {
    canonical: "/booking",
  },
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
