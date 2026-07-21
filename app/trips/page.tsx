"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import TripsFilterGrid from "@/components/TripsFilterGrid";
import { tripsData, fetchLiveTrips, type Trip } from "@/lib/data/trips";

export default function TripsIndexPage() {
  const [trips, setTrips] = useState<Trip[]>(tripsData);

  useEffect(() => {
    fetchLiveTrips().then((data) => {
      if (data && data.length > 0) {
        setTrips(data);
      }
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-28 text-[#111111]">
      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading first="Book your" second="Trips" />
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-6 text-[#666666] md:text-base">
            Choose the Sundarbans escape that fits your pace, your group, and your budget.
          </p>

          <TripsFilterGrid trips={trips} />

          <div className="mt-12 overflow-hidden rounded-[32px] border border-[#6DA003]/20 bg-[#111111] px-6 py-8 text-white shadow-[0_12px_40px_rgba(17,17,17,0.16)] sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#C5FE4E]">Can&apos;t decide?</p>
                <h2 className="mt-2 text-3xl font-serif md:text-4xl">Talk to us and we&apos;ll match you with the right trip.</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="tel:+917679756846" className="rounded-full border border-[#C5FE4E] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#C5FE4E] hover:text-[#111111]">
                  Call +91 7679756846
                </Link>
                <Link href="https://wa.me/917679756846" className="rounded-full border border-[#C5FE4E] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#C5FE4E] hover:text-[#111111]">
                  WhatsApp us
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 overflow-x-auto rounded-[28px] border border-[#6DA003]/20 bg-white shadow-[0_10px_30px_rgba(109,160,3,0.06)]">
            <table className="min-w-[760px] w-full border-collapse text-left text-sm">
              <thead className="bg-[#FAFAFA] text-[11px] uppercase tracking-[0.24em] text-[#6DA003]">
                <tr>
                  <th className="px-5 py-4">Package</th>
                  <th className="px-5 py-4">Included</th>
                  <th className="px-5 py-4">Not included</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip.slug} className="border-t border-[#6DA003]/10 align-top">
                    <td className="px-5 py-4 font-semibold text-[#111111]">{trip.durationText}</td>
                    <td className="px-5 py-4 text-[#555555]">{trip.includes.join(", ")}</td>
                    <td className="px-5 py-4 text-[#555555]">{trip.excludes.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}