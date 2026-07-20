import { Suspense } from "react";
import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import RoomBookingForm from "@/components/RoomBookingForm";

export const metadata: Metadata = {
  title: "Book a Room — Sundarban Greenview Homestay",
  description:
    "Reserve a room-only stay at Sundarban Greenview Homestay in Pakhiralay. Pick your room, dates and party size and we'll confirm availability.",
};

function FormFallback() {
  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-[32px] border border-[#6DA003]/10 bg-white"
          />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-[32px] bg-[#111111]/10" />
    </div>
  );
}

export default function RoomBookingPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-28 text-[#111111]">
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading first="Book a" second="Room" />
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-6 text-[#666666] md:text-base">
            A room-only stay — just the room, for the nights you choose. Safaris, permits, guides
            and meals are not part of this booking.
          </p>

          {/* useSearchParams needs a Suspense boundary or the page fails to prerender. */}
          <Suspense fallback={<FormFallback />}>
            <RoomBookingForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
