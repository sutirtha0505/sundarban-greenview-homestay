'use client';
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import SectionHeading from "@/components/SectionHeading";
import { tripsData } from "@/lib/data/trips";

const routeSteps = [
  "Arrive at Godkhali jetty by road or pickup service.",
  "Board the boat transfer arranged for your booking slot.",
  "Reach Pakhiralay and check in at Sundarban Greenview Homestay.",
];

const bookingDefaults = {
  checkIn: "2026-08-10",
  checkOut: "2026-08-12",
  guests: "2",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "Tell us about your dates, food preference, room preference, and any forest permit needs.",
};

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTrip = searchParams.get("trip") ?? tripsData[0]?.slug ?? "";
  const [selectedTrip, setSelectedTrip] = useState(defaultTrip);
  const [pickupNeeded, setPickupNeeded] = useState(true);
  const [form, setForm] = useState(bookingDefaults);

  const selectedTripData = useMemo(
    () => tripsData.find((trip) => trip.slug === selectedTrip) ?? tripsData[0],
    [selectedTrip],
  );

  const nights = useMemo(() => {
    const checkIn = new Date(form.checkIn);
    const checkOut = new Date(form.checkOut);
    const difference = checkOut.getTime() - checkIn.getTime();
    return Math.max(1, Math.round(difference / (1000 * 60 * 60 * 24)) || 2);
  }, [form.checkIn, form.checkOut]);

  const generatedReference = useMemo(() => {
    const seed = `${selectedTripData?.slug ?? "booking"}-${form.checkIn}-${form.firstName}-${form.phone}`;
    const hash = Array.from(seed).reduce((accumulator, character) => accumulator + character.charCodeAt(0), 0);
    return `GVH-${(1000 + (hash % 9000)).toString()}`;
  }, [form.checkIn, form.firstName, form.phone, selectedTripData?.slug]);

  const updateField = (key: keyof typeof bookingDefaults, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/booking/confirmation?ref=${generatedReference}&trip=${selectedTripData?.slug ?? ""}`);
  };

  const priceSummary = [
    { label: "Room × nights", value: `₹ ${(selectedTripData?.price ?? "₹ 0").replace("₹", "").trim()} × ${nights}` },
    { label: "Trip package", value: selectedTripData?.price ?? "₹ 0" },
    { label: "Activities", value: pickupNeeded ? "₹ 1,250" : "₹ 750" },
    { label: "Taxes", value: "₹ 450" },
    { label: "Advance payable", value: nights >= 3 ? "₹ 5,000" : "₹ 4,000" },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-28 text-[#111111]">
      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading first="Book your" second="Trip" />
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-6 text-[#666666] md:text-base">
            Send us your stay details and we&apos;ll confirm availability, guide you through the permits, and help with the next step.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="rounded-[32px] border border-[#6DA003]/20 bg-white p-6 shadow-[0_12px_40px_rgba(109,160,3,0.08)] sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#6DA003]">Step 1</p>
                    <h2 className="mt-2 text-2xl font-serif text-[#111111]">Choose your room or package</h2>
                  </div>
                  <Link href="/trips" className="text-sm font-semibold text-[#6DA003] transition-colors hover:text-[#5B8703]">
                    Browse trip index →
                  </Link>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {tripsData.slice(0, 3).map((trip) => (
                    <button
                      key={trip.slug}
                      type="button"
                      onClick={() => setSelectedTrip(trip.slug)}
                      className={`rounded-[24px] border p-4 text-left transition-all hover:-translate-y-1 ${selectedTrip === trip.slug ? "border-[#6DA003] bg-[#6DA003]/5 shadow-[0_10px_24px_rgba(109,160,3,0.12)]" : "border-[#6DA003]/15 bg-[#FAFAFA] hover:border-[#6DA003]/30"}`}
                    >
                      <div className="mb-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.24em] text-[#6DA003]">
                        <span className="rounded-full border border-[#6DA003]/15 px-2 py-1">{trip.durationText}</span>
                        <span className="rounded-full border border-[#6DA003]/15 px-2 py-1">{trip.groupType}</span>
                      </div>
                      <h3 className="text-[16px] font-semibold leading-6 text-[#111111]">{trip.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#666666]">{trip.pillText}</p>
                      <div className="mt-4 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-[#666666]">From</p>
                          <p className="text-xl font-semibold text-[#111111]">{trip.price}</p>
                        </div>
                        <span className="rounded-md bg-[#6DA003] px-2 py-1 text-[11px] font-bold text-white">{trip.rating}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-[#6DA003]/20 bg-white p-6 shadow-[0_12px_40px_rgba(109,160,3,0.08)] sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#6DA003]">Step 2</p>
                    <h2 className="mt-2 text-2xl font-serif text-[#111111]">Travel dates and guest details</h2>
                  </div>
                  <p className="rounded-full bg-[#6DA003]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6DA003]">
                    Govt. photo ID required
                  </p>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.24em] text-[#6DA003]">Check-in date</span>
                    <input
                      type="date"
                      value={form.checkIn}
                      onChange={(event) => updateField("checkIn", event.target.value)}
                      className="h-12 w-full rounded-full border border-[#6DA003]/15 bg-[#FAFAFA] px-4 text-sm text-[#444444] outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.24em] text-[#6DA003]">Check-out date</span>
                    <input
                      type="date"
                      value={form.checkOut}
                      onChange={(event) => updateField("checkOut", event.target.value)}
                      className="h-12 w-full rounded-full border border-[#6DA003]/15 bg-[#FAFAFA] px-4 text-sm text-[#444444] outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.24em] text-[#6DA003]">Guests</span>
                    <input
                      type="number"
                      min="1"
                      value={form.guests}
                      onChange={(event) => updateField("guests", event.target.value)}
                      className="h-12 w-full rounded-full border border-[#6DA003]/15 bg-[#FAFAFA] px-4 text-sm text-[#444444] outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.24em] text-[#6DA003]">Pickup preference</span>
                    <button
                      type="button"
                      onClick={() => setPickupNeeded((current) => !current)}
                      className={`h-12 w-full rounded-full border px-4 text-left text-sm transition-all ${pickupNeeded ? "border-[#6DA003] bg-[#6DA003]/5 text-[#111111]" : "border-[#6DA003]/15 bg-[#FAFAFA] text-[#444444]"}`}
                    >
                      {pickupNeeded ? "Need pickup from Godkhali jetty" : "I will arrange my own transfer"}
                    </button>
                  </label>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.24px] text-[#6DA003]">First name</span>
                    <input
                      value={form.firstName}
                      onChange={(event) => updateField("firstName", event.target.value)}
                      placeholder="Enter first name"
                      className="h-12 w-full rounded-full border border-[#6DA003]/15 bg-[#FAFAFA] px-4 text-sm text-[#444444] outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.24px] text-[#6DA003]">Last name</span>
                    <input
                      value={form.lastName}
                      onChange={(event) => updateField("lastName", event.target.value)}
                      placeholder="Enter last name"
                      className="h-12 w-full rounded-full border border-[#6DA003]/15 bg-[#FAFAFA] px-4 text-sm text-[#444444] outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.24px] text-[#6DA003]">Email</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="Enter email address"
                      className="h-12 w-full rounded-full border border-[#6DA003]/15 bg-[#FAFAFA] px-4 text-sm text-[#444444] outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.24px] text-[#6DA003]">Phone</span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) => updateField("phone", event.target.value)}
                      placeholder="Enter phone number"
                      className="h-12 w-full rounded-full border border-[#6DA003]/15 bg-[#FAFAFA] px-4 text-sm text-[#444444] outline-none"
                    />
                  </label>
                </div>

                <div className="mt-4">
                  <label className="block">
                    <span className="mb-2 block text-[11px] uppercase tracking-[0.24em] text-[#6DA003]">Message</span>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(event) => updateField("message", event.target.value)}
                      className="w-full rounded-[28px] border border-[#6DA003]/15 bg-[#FAFAFA] px-4 py-3 text-sm text-[#444444] outline-none"
                    />
                  </label>
                </div>
              </div>

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
                      {routeSteps.map((step, index) => (
                        <div key={step} className="flex gap-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6DA003] text-sm font-bold text-white">
                            {index + 1}
                          </div>
                          <p className="pt-1 text-sm leading-6 text-[#555555]">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-[#111111] p-5 text-white">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#C5FE4E]">Important notes</p>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-white/85">
                      <li>Forest permits need the government ID details of every travelling adult.</li>
                      <li>Pickup can be arranged from Godkhali jetty or from Kolkata at an extra cost.</li>
                      <li>Boat timings can shift with tides, so we recommend early departure.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-[#6DA003]/20 bg-white p-6 shadow-[0_12px_40px_rgba(109,160,3,0.08)] sm:p-8">
                <h2 className="text-2xl font-serif text-[#111111]">Payment and policy</h2>
                <p className="mt-4 text-sm leading-7 text-[#555555]">
                  We confirm bookings after the advance payment is received. The balance is payable on arrival unless we arrange otherwise in advance. Forest permits depend on government ID submission before the trip date.
                </p>
                <div className="mt-4 rounded-[24px] bg-[#FAFAFA] p-5 text-sm leading-7 text-[#555555]">
                  <p className="font-semibold text-[#111111]">What happens next</p>
                  <p className="mt-2">1. We check availability.</p>
                  <p>2. We send the confirmation and payment details.</p>
                  <p>3. You receive your reference number and arrival guidance.</p>
                </div>
              </div>

              <div className="rounded-[32px] border border-[#6DA003]/20 bg-white p-6 shadow-[0_12px_40px_rgba(109,160,3,0.08)] sm:p-8">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#6DA003]">Step 3</p>
                <h2 className="mt-2 text-2xl font-serif text-[#111111]">Review and submit</h2>
                <p className="mt-4 text-sm leading-7 text-[#555555]">
                  Once you submit, we&apos;ll send your confirmation and reference number using the details above.
                </p>
                <button
                  type="submit"
                  className="mt-6 rounded-full bg-[#6DA003] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#5B8703]"
                >
                  Reserve now
                </button>
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 h-fit rounded-[32px] border border-[#6DA003]/20 bg-[#111111] p-6 text-white shadow-[0_12px_40px_rgba(17,17,17,0.18)] sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#C5FE4E]">Price summary</p>
              <h2 className="mt-3 text-3xl font-serif">Your trip at a glance</h2>
              <div className="mt-6 space-y-3">
                {priceSummary.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 text-sm">
                    <span className="text-white/75">{item.label}</span>
                    <span className="font-semibold text-white">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[24px] bg-white/10 p-5 text-sm leading-7 text-white/85">
                <p className="font-semibold text-white">Advance and balance</p>
                <p className="mt-2">Advance secures the room and trip slot. Balance is due before departure or on arrival, depending on the package.</p>
              </div>

              <div className="mt-6 rounded-[24px] bg-[#FAFAFA] p-5 text-sm leading-7 text-[#444444]">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#6DA003]">Reference number</p>
                <p className="mt-2 text-2xl font-semibold text-[#111111]">{generatedReference}</p>
                <p className="mt-2">This reference will be attached to your confirmation screen after submission.</p>
              </div>

              <div className="mt-6 flex flex-col gap-3">
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
