import { Suspense } from "react";
import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import TripBookingForm from "@/components/TripBookingForm";
import RoomBookingForm from "@/components/RoomBookingForm";

export const metadata: Metadata = {
  title: "Book your Stay — Sundarban Greenview Homestay",
  description:
    "Book a room stay or trip package with Sundarban Greenview Homestay — pick your room, package, and travel dates and we'll confirm availability.",
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

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ room?: string; trip?: string }>;
}) {
  const { room, trip } = await searchParams;
  const isRoomBooking = Boolean(room && !trip);

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-28 text-[#111111]">
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {isRoomBooking ? (
            <>
              <SectionHeading first="Book a" second="Room" />
              <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-6 text-[#666666] md:text-base">
                A room-only stay — just the room, for the nights you choose. Safaris, permits, guides
                and meals are not part of this booking.
              </p>
              <Suspense fallback={<FormFallback />}>
                <RoomBookingForm />
              </Suspense>
            </>
          ) : (
            <>
              <SectionHeading first="Book your" second="Trip" />
              <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-6 text-[#666666] md:text-base">
                Send us your travel details and we&apos;ll confirm availability, assist with permits, and
                guide your next step.
              </p>
              <Suspense fallback={<FormFallback />}>
                <TripBookingForm />
              </Suspense>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

