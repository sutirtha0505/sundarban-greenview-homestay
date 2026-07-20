'use client';
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import SectionHeading from "@/components/SectionHeading";
import { tripsData } from "@/lib/data/trips";

const ROOM_SUPPLEMENT = 500; // ₹ per room
const ACTIVITIES_WITH_PICKUP = 1250;
const ACTIVITIES_NO_PICKUP = 750;
const TAXES = 450;
const ADVANCE_THRESHOLD_NIGHTS = 3;
const ADVANCE_HIGH = 5000;
const ADVANCE_LOW = 4000;

const routeSteps = [
  "Arrive at Godkhali jetty by road or pickup service.",
  "Board the boat transfer arranged for your booking slot.",
  "Reach Pakhiralay and check in at Sundarban Greenview Homestay.",
];

const PICKUP_OPTIONS = [
  { value: "none", label: "No pickup required — I will arrange my own transfer" },
  { value: "godkhali", label: "Pickup from Godkhali Jetty" },
  { value: "other", label: "Other pickup location (please specify in message)" },
];

const bookingDefaults = {
  departure: "2026-08-10",
  returnDate: "2026-08-12",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

function fmt(n: number) {
  return `₹ ${n.toLocaleString("en-IN")}`;
}

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripSlug = searchParams.get("trip");

  const [guests, setGuests] = useState(2);
  const [pickup, setPickup] = useState("godkhali");
  const [form, setForm] = useState(bookingDefaults);

  const selectedTripData = useMemo(
    () => (tripSlug ? tripsData.find((t) => t.slug === tripSlug) ?? null : null),
    [tripSlug],
  );

  const nights = useMemo(() => {
    const d1 = new Date(form.departure);
    const d2 = new Date(form.returnDate);
    const diff = d2.getTime() - d1.getTime();
    return Math.max(1, Math.round(diff / 86400000) || 2);
  }, [form.departure, form.returnDate]);

  const roomsRequired = Math.ceil(guests / 2);
  const pricePerPerson = selectedTripData?.priceValue ?? 0;
  const packageSubtotal = pricePerPerson * guests;
  const accommodationSupplement = ROOM_SUPPLEMENT * roomsRequired;
  const activitiesCost = pickup === "none" ? ACTIVITIES_NO_PICKUP : ACTIVITIES_WITH_PICKUP;
  const totalCost = packageSubtotal + accommodationSupplement + activitiesCost + TAXES;
  const advance = nights >= ADVANCE_THRESHOLD_NIGHTS ? ADVANCE_HIGH : ADVANCE_LOW;
  const balance = Math.max(0, totalCost - advance);

  const generatedReference = useMemo(() => {
    const seed = `${selectedTripData?.slug ?? "booking"}-${form.departure}-${form.firstName}-${form.phone}`;
    const hash = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
    return `GVH-${(1000 + (hash % 9000)).toString()}`;
  }, [form.departure, form.firstName, form.phone, selectedTripData?.slug]);

  const updateField = (key: keyof typeof bookingDefaults, value: string) =>
    setForm((cur) => ({ ...cur, [key]: value }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/booking/confirmation?ref=${generatedReference}&trip=${selectedTripData?.slug ?? ""}`);
  };

  const inputCls = "h-12 w-full rounded-full border border-[#6DA003]/15 bg-[#FAFAFA] px-4 text-sm text-[#444444] outline-none focus:border-[#6DA003]/40 transition-colors";
  const labelCls = "mb-2 block text-[11px] uppercase tracking-[0.24em] text-[#6DA003]";

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-28 text-[#111111]">
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading first="Book your" second="Trip" />
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-6 text-[#666666] md:text-base">
            Send us your travel details and we&apos;ll confirm availability, assist with permits, and guide your next step.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">

              {/* ── Step 1: Selected package or browse prompt ── */}
              {selectedTripData ? (
                <div className="rounded-[32px] border border-[#6DA003]/20 bg-white p-6 shadow-[0_12px_40px_rgba(109,160,3,0.08)] sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-[#6DA003]">Step 1 · Selected Package</p>
                      <h2 className="mt-2 text-2xl font-serif text-[#111111]">{selectedTripData.title}</h2>
                    </div>
                    <Link href="/trips" className="text-sm font-semibold text-[#6DA003] transition-colors hover:text-[#5B8703]">
                      Browse trip index →
                    </Link>
                  </div>

                  <div className="relative mt-6 w-full overflow-hidden rounded-[24px]" style={{ aspectRatio: "16/7" }}>
                    <img src={selectedTripData.image} alt={selectedTripData.title} className="h-full w-full object-cover" />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {[selectedTripData.durationText, selectedTripData.groupType, `⭐ ${selectedTripData.rating} · ${selectedTripData.reviews}`].map((tag) => (
                      <span key={tag} className="rounded-full border border-[#6DA003]/20 bg-[#6DA003]/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#6DA003]">{tag}</span>
                    ))}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#666666]">{selectedTripData.pillText}</p>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#111111]">{selectedTripData.price}</span>
                    <span className="text-sm text-[#888888]">/ per person</span>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[20px] bg-[#6DA003]/5 p-4">
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6DA003]">Includes</p>
                      <ul className="space-y-2">
                        {selectedTripData.includes.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-[#444444]">
                            <span className="mt-0.5 text-[#6DA003]">✓</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-[20px] bg-[#FAFAFA] p-4">
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#888888]">Excludes</p>
                      <ul className="space-y-2">
                        {selectedTripData.excludes.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-[#666666]">
                            <span className="mt-0.5 text-[#AAAAAA]">✕</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-[32px] border border-dashed border-[#6DA003]/30 bg-white p-10 text-center shadow-[0_12px_40px_rgba(109,160,3,0.06)]">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#6DA003]">Step 1</p>
                  <h2 className="mt-3 text-2xl font-serif text-[#111111]">No package selected yet</h2>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#666666]">
                    Browse our trip catalogue and click <strong>View Details</strong> on any package to start your booking.
                  </p>
                  <Link href="/trips" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#6DA003] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#5B8703]">
                    Browse trip index →
                  </Link>
                </div>
              )}

              {/* ── Step 2: Travel dates & guest details ── */}
              <div className="rounded-[32px] border border-[#6DA003]/20 bg-white p-6 shadow-[0_12px_40px_rgba(109,160,3,0.08)] sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#6DA003]">Step 2</p>
                    <h2 className="mt-2 text-2xl font-serif text-[#111111]">Travel dates and guest details</h2>
                  </div>
                  <div className="rounded-[20px] border border-[#6DA003]/20 bg-[#6DA003]/5 px-4 py-3 text-[11px] leading-5 text-[#6DA003]">
                    <p className="font-semibold uppercase tracking-[0.22em]">Photo ID notice</p>
                    <p className="mt-1 normal-case tracking-normal text-[#555555]">Government-issued photo ID may be required for travel permits and accommodation check-in.</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className={labelCls}>Departure date</span>
                    <input type="date" value={form.departure} onChange={(e) => updateField("departure", e.target.value)} className={inputCls} />
                  </label>
                  <label className="block">
                    <span className={labelCls}>Return date</span>
                    <input type="date" value={form.returnDate} onChange={(e) => updateField("returnDate", e.target.value)} className={inputCls} />
                  </label>
                </div>

                {/* Guest stepper + pickup */}
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {/* Guest stepper */}
                  <div>
                    <span className={labelCls}>Guests</span>
                    <div className="flex h-12 items-center overflow-hidden rounded-full border border-[#6DA003]/15 bg-[#FAFAFA]">
                      <button
                        type="button"
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        className="flex h-full w-12 shrink-0 items-center justify-center text-[#6DA003] text-xl font-bold transition-colors hover:bg-[#6DA003]/10 cursor-pointer"
                        aria-label="Decrease guests"
                      >
                        −
                      </button>
                      <span className="flex-1 text-center text-sm font-semibold text-[#111111]">{guests}</span>
                      <button
                        type="button"
                        onClick={() => setGuests((g) => g + 1)}
                        className="flex h-full w-12 shrink-0 items-center justify-center text-[#6DA003] text-xl font-bold transition-colors hover:bg-[#6DA003]/10 cursor-pointer"
                        aria-label="Increase guests"
                      >
                        +
                      </button>
                    </div>
                    <div className="mt-2 rounded-[16px] bg-[#6DA003]/5 px-4 py-2.5 text-sm">
                      <p className="text-[#555555]">Maximum <span className="font-semibold text-[#111111]">2 guests per room</span></p>
                      <p className="mt-0.5 text-[#6DA003] font-semibold">
                        Rooms required: {roomsRequired} {roomsRequired === 1 ? "room" : "rooms"}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#888888]">
                        Accommodation supplement: {fmt(ROOM_SUPPLEMENT)}/room × {roomsRequired} = {fmt(accommodationSupplement)}
                      </p>
                    </div>
                  </div>

                  {/* Pickup dropdown */}
                  <div>
                    <span className={labelCls}>Pickup preference</span>
                    <select
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="h-12 w-full rounded-full border border-[#6DA003]/15 bg-[#FAFAFA] px-4 text-sm text-[#444444] outline-none focus:border-[#6DA003]/40 transition-colors cursor-pointer appearance-none"
                    >
                      {PICKUP_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <p className="mt-2 px-1 text-[12px] text-[#888888]">
                      {pickup === "none" ? "Activities cost: ₹750" : "Activities cost: ₹1,250 (includes pickup coordination)"}
                    </p>
                  </div>
                </div>

                {/* Personal details */}
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className={labelCls}>First name</span>
                    <input value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="Enter first name" className={inputCls} />
                  </label>
                  <label className="block">
                    <span className={labelCls}>Last name</span>
                    <input value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Enter last name" className={inputCls} />
                  </label>
                  <label className="block">
                    <span className={labelCls}>Email</span>
                    <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="Enter email address" className={inputCls} />
                  </label>
                  <label className="block">
                    <span className={labelCls}>Phone</span>
                    <input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="Enter phone number" className={inputCls} />
                  </label>
                </div>

                <div className="mt-4">
                  <label className="block">
                    <span className={labelCls}>Special requests</span>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      placeholder="Tell us about food preferences, room preferences, accessibility needs, or any other requirements."
                      className="w-full rounded-[28px] border border-[#6DA003]/15 bg-[#FAFAFA] px-4 py-3 text-sm text-[#444444] outline-none focus:border-[#6DA003]/40 transition-colors placeholder:text-[#AAAAAA]"
                    />
                  </label>
                </div>
              </div>

              {/* ── How the journey works ── */}
              <div className="rounded-[32px] border border-[#6DA003]/20 bg-white p-6 shadow-[0_12px_40px_rgba(109,160,3,0.08)] sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#6DA003]">Travel help</p>
                    <h2 className="mt-2 text-2xl font-serif text-[#111111]">How the journey works</h2>
                  </div>
                  <Link href="/how-to-reach" className="text-sm font-semibold text-[#6DA003] transition-colors hover:text-[#5B8703]">
                    View travel guide →
                  </Link>
                </div>
                <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
                  <div className="rounded-[24px] bg-[#FAFAFA] p-5">
                    <h3 className="text-lg font-semibold text-[#111111]">Departure point</h3>
                    <div className="mt-4 space-y-4">
                      {routeSteps.map((step, i) => (
                        <div key={step} className="flex gap-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6DA003] text-sm font-bold text-white">{i + 1}</div>
                          <p className="pt-1 text-sm leading-6 text-[#555555]">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[24px] bg-[#111111] p-5 text-white">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#C5FE4E]">Important notes</p>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-white/85">
                      <li>Forest permits require government-issued ID for every travelling adult.</li>
                      <li>Pickup can be arranged from Godkhali Jetty or Kolkata at an extra cost.</li>
                      <li>Boat timings can shift with tides — early departure is recommended.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* ── Payment & policy ── */}
              <div className="rounded-[32px] border border-[#6DA003]/20 bg-white p-6 shadow-[0_12px_40px_rgba(109,160,3,0.08)] sm:p-8">
                <h2 className="text-2xl font-serif text-[#111111]">Payment and policy</h2>
                <p className="mt-4 text-sm leading-7 text-[#555555]">
                  We confirm bookings after the advance payment is received. The balance is payable before departure or on arrival, depending on the package. Forest permits require government ID submission before the trip date.
                </p>
                <div className="mt-4 rounded-[24px] bg-[#FAFAFA] p-5 text-sm leading-7 text-[#555555]">
                  <p className="font-semibold text-[#111111]">What happens next</p>
                  <p className="mt-2">1. We check availability and confirm your slot.</p>
                  <p>2. We send payment details for the advance ({fmt(advance)}).</p>
                  <p>3. You receive your reference number and arrival guidance.</p>
                </div>
              </div>

              {/* ── Step 3: Submit ── */}
              <div className="rounded-[32px] border border-[#6DA003]/20 bg-white p-6 shadow-[0_12px_40px_rgba(109,160,3,0.08)] sm:p-8">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#6DA003]">Step 3</p>
                <h2 className="mt-2 text-2xl font-serif text-[#111111]">Review and submit</h2>
                <p className="mt-4 text-sm leading-7 text-[#555555]">
                  Once you submit, we&apos;ll reach out to confirm availability and send your advance payment details.
                </p>
                <button
                  type="submit"
                  className="mt-6 rounded-full bg-[#6DA003] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#5B8703] hover:shadow-[0_8px_24px_rgba(109,160,3,0.3)]"
                >
                  Review booking — {fmt(advance)} advance
                </button>
              </div>
            </div>

            {/* ── Sidebar: Price summary ── */}
            <aside className="lg:sticky lg:top-28 h-fit rounded-[32px] border border-[#6DA003]/20 bg-[#111111] p-6 text-white shadow-[0_12px_40px_rgba(17,17,17,0.18)] sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#C5FE4E]">Price summary</p>
              <h2 className="mt-3 text-3xl font-serif">Your trip at a glance</h2>

              <div className="mt-6 space-y-1">
                {/* Package */}
                <div className="rounded-[20px] bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">Package</p>
                      <p className="mt-1 text-sm text-white/80">
                        {selectedTripData ? selectedTripData.price : "—"} × {guests} guest{guests !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <p className="text-base font-semibold text-white">{selectedTripData ? fmt(packageSubtotal) : "—"}</p>
                  </div>
                </div>

                {/* Accommodation */}
                <div className="rounded-[20px] bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">Accommodation</p>
                      <p className="mt-1 text-sm text-white/80">
                        {fmt(ROOM_SUPPLEMENT)}/room × {roomsRequired} room{roomsRequired !== 1 ? "s" : ""}
                      </p>
                      <p className="mt-0.5 text-[11px] text-white/40">Max 2 guests per room</p>
                    </div>
                    <p className="text-base font-semibold text-white">{fmt(accommodationSupplement)}</p>
                  </div>
                </div>

                {/* Activities */}
                <div className="rounded-[20px] bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">Activities / Add-ons</p>
                      <p className="mt-1 text-sm text-white/80">
                        {pickup !== "none" ? "Includes pickup coordination" : "No pickup"}
                      </p>
                    </div>
                    <p className="text-base font-semibold text-white">{fmt(activitiesCost)}</p>
                  </div>
                </div>

                {/* Taxes */}
                <div className="flex items-center justify-between gap-4 px-1 py-3 text-sm">
                  <span className="text-white/60">Taxes / Fees</span>
                  <span className="font-semibold text-white">{fmt(TAXES)}</span>
                </div>

                {/* Divider */}
                <div className="border-t border-white/15 pt-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm text-white/75">Total trip cost</span>
                    <span className="text-2xl font-bold text-white">{selectedTripData ? fmt(totalCost) : "—"}</span>
                  </div>
                </div>

                {/* Advance / Balance */}
                <div className="mt-3 rounded-[20px] bg-[#C5FE4E]/10 p-4">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[#C5FE4E]">Advance payable now</span>
                    <span className="text-lg font-bold text-[#C5FE4E]">{fmt(advance)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-4 text-sm">
                    <span className="text-white/60">Remaining balance</span>
                    <span className="font-semibold text-white/80">{selectedTripData ? fmt(balance) : "—"}</span>
                  </div>
                  <p className="mt-3 text-[11px] leading-5 text-white/40">
                    Advance secures your trip slot. Balance is due before departure or on arrival, per package terms.
                  </p>
                </div>
              </div>

              {/* Reference */}
              <div className="mt-5 rounded-[20px] bg-[#FAFAFA] p-5 text-sm text-[#444444]">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#6DA003]">Reference number</p>
                <p className="mt-2 text-2xl font-semibold text-[#111111]">{generatedReference}</p>
                <p className="mt-1 text-[12px]">Your reference will appear on the confirmation screen after submission.</p>
              </div>

              {/* Contact CTAs */}
              <div className="mt-5 flex flex-col gap-3">
                <Link href="mailto:greenviewhomestay@gmail.com" className="rounded-full bg-[#6DA003] px-5 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-[#5B8703]">
                  Confirm by email
                </Link>
                <Link href="https://wa.me/917679756846" className="rounded-full border border-[#C5FE4E] px-5 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-[#C5FE4E] hover:text-[#111111]">
                  Ask on WhatsApp
                </Link>
              </div>
            </aside>
          </form>
        </div>
      </section>
    </main>
  );
}
