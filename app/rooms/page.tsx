import Link from "next/link";
import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import RoomsFilterGrid from "@/components/RoomsFilterGrid";
import { MAX_GUESTS_BY_TIER, budgetRooms, premiumRooms, formatINR, roomsData } from "@/lib/data/rooms";

export const metadata: Metadata = {
  title: "Rooms — Sundarban Greenview Homestay",
  description:
    "Budget and premium rooms at Sundarban Greenview Homestay in Pakhiralay. Room-only tariffs, per-night pricing, and occupancy details.",
};

const AMENITIES = [
  "Attached bathroom",
  "Hot water",
  "Mosquito netting",
  "Power backup",
  "Wi-Fi in common areas",
  "Daily housekeeping",
];

const HOUSE_RULES = [
  ["Check-in", "12:00 noon"],
  ["Check-out", "10:00 am"],
  ["Quiet hours", "10:00 pm – 6:00 am"],
  ["Smoking", "Not permitted indoors"],
];

export default function RoomsIndexPage() {
  const budgetFrom = Math.min(...budgetRooms.map((r) => r.pricePerNight));
  const premiumFrom = Math.min(...premiumRooms.map((r) => r.pricePerNight));

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-28 text-[#111111]">
      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading first="Check Our" second="Rooms" />
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-6 text-[#666666] md:text-base">
            Room-only stays at the edge of the mangroves. Pick your nights and party size — we&apos;ll
            show what fits. Looking for boat safaris and guided forest trips instead?{" "}
            <Link href="/trips" className="font-semibold text-[#6DA003] hover:text-[#5B8703]">
              Browse our trip packages
            </Link>
            .
          </p>

          <RoomsFilterGrid rooms={roomsData} />

          {/* ── Tier summary ── */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                tier: "Budget rooms" as const,
                from: budgetFrom,
                cap: MAX_GUESTS_BY_TIER.budget,
                count: budgetRooms.length,
                blurb:
                  "Simple, clean and comfortable — everything you need after a long day on the water.",
              },
              {
                tier: "Premium rooms" as const,
                from: premiumFrom,
                cap: MAX_GUESTS_BY_TIER.premium,
                count: premiumRooms.length,
                blurb:
                  "More space, river and canopy views, and room for the whole family to spread out.",
              },
            ].map((t) => (
              <div
                key={t.tier}
                className="rounded-[32px] border border-[#6DA003]/20 bg-white p-6 shadow-[0_10px_30px_rgba(109,160,3,0.06)] sm:p-8"
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#6DA003]">
                  {t.count} rooms
                </p>
                <h2 className="mt-2 font-serif text-2xl text-[#111111]">{t.tier}</h2>
                <p className="mt-3 text-sm leading-6 text-[#555555]">{t.blurb}</p>
                <div className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-[#6DA003]/10 pt-4">
                  <span>
                    <span className="text-[12px] uppercase tracking-[0.24em] text-[#666666]">From </span>
                    <span className="text-xl font-semibold text-[#111111]">{formatINR(t.from)}</span>
                    <span className="text-[12px] text-[#666666]"> / night</span>
                  </span>
                  <span className="rounded-full border border-[#6DA003]/30 bg-[#6DA003]/5 px-3 py-1 text-[12px] font-semibold text-[#6DA003]">
                    Sleeps up to {t.cap}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Amenities + house rules ── */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[32px] border border-[#6DA003]/20 bg-white p-6 shadow-[0_10px_30px_rgba(109,160,3,0.06)] sm:p-8">
              <h2 className="font-serif text-2xl text-[#111111]">In every room</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {AMENITIES.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-sm text-[#444444]">
                    <span className="mt-0.5 text-[#6DA003]">✓</span> {a}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-[20px] bg-[#6DA003]/5 p-4 text-sm leading-6 text-[#555555]">
                <span className="font-semibold text-[#111111]">Room-only tariff.</span> Meals, boat
                safaris, guides and forest permits are not included — those come with our{" "}
                <Link href="/trips" className="font-semibold text-[#6DA003] hover:text-[#5B8703]">
                  trip packages
                </Link>
                , or can be arranged on request once you arrive.
              </p>
            </div>

            <div className="rounded-[32px] border border-[#6DA003]/20 bg-white p-6 shadow-[0_10px_30px_rgba(109,160,3,0.06)] sm:p-8">
              <h2 className="font-serif text-2xl text-[#111111]">House rules</h2>
              <dl className="mt-5 space-y-3">
                {HOUSE_RULES.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-4 border-b border-[#6DA003]/10 pb-3 last:border-0 last:pb-0"
                  >
                    <dt className="text-[12px] uppercase tracking-[0.24em] text-[#666666]">{k}</dt>
                    <dd className="text-sm font-semibold text-[#111111]">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-[12px] leading-5 text-[#888888]">
                A government-issued photo ID is required at check-in for every adult guest.
              </p>
            </div>
          </div>

          {/* ── CTA band ── */}
          <div className="mt-12 overflow-hidden rounded-[32px] border border-[#6DA003]/20 bg-[#111111] px-6 py-8 text-white shadow-[0_12px_40px_rgba(17,17,17,0.16)] sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#C5FE4E]">
                  Travelling as a bigger group?
                </p>
                <h2 className="mt-2 font-serif text-3xl md:text-4xl">
                  We&apos;ll put adjoining rooms together for you.
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="tel:+917679756846"
                  className="rounded-full border border-[#C5FE4E] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#C5FE4E] hover:text-[#111111]"
                >
                  Call +91 7679756846
                </Link>
                <Link
                  href="https://wa.me/917679756846"
                  className="rounded-full border border-[#C5FE4E] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#C5FE4E] hover:text-[#111111]"
                >
                  WhatsApp us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
