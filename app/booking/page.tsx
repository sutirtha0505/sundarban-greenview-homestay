import { Suspense } from "react";
import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import TripBookingForm from "@/components/TripBookingForm";

export const metadata: Metadata = {
  title: "Book your Trip — Sundarban Greenview Homestay",
  description:
    "Book a Sundarbans trip package with Sundarban Greenview Homestay — pick your package, rooms and travel dates and we'll confirm availability.",
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

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-28 text-[#111111]">
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading first="Book your" second="Trip" />
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-6 text-[#666666] md:text-base">
            Send us your travel details and we&apos;ll confirm availability, assist with permits, and
            guide your next step.
          </p>

          {/* useSearchParams needs a Suspense boundary or the page fails to prerender. */}
          <Suspense fallback={<FormFallback />}>
            <TripBookingForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
