"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MAX_PARTY_SIZE,
  budgetRooms,
  premiumRooms,
  formatINR,
  getRoomBySlug,
  roomStayTotal,
  roomsNeededFor,
  roomsData,
  stayTotal,
} from "@/lib/data/rooms";

/** Room tariffs under ₹7,500/night attract 12% GST. */
const GST_RATE = 0.12;
/** Share of the total taken as a booking advance. */
const ADVANCE_RATE = 0.3;

const DEFAULT_CHECK_IN = "2026-08-10";

const NOT_INCLUDED = [
  "Boat safaris and creek cruises",
  "Forest entry permits and guide fees",
  "Meals and beverages",
  "Pickup, drop and local travel",
];

const HOUSE_RULES = [
  ["Check-in", "12:00 noon"],
  ["Check-out", "10:00 am"],
  ["Quiet hours", "10:00 pm – 6:00 am"],
  ["Smoking", "Not permitted indoors"],
];

/** Deterministic date maths — no `new Date()` on today, so SSR and client agree. */
function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(`${checkIn}T00:00:00Z`).getTime();
  const b = new Date(`${checkOut}T00:00:00Z`).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return 1;
  return Math.max(1, Math.round((b - a) / 86_400_000));
}

const inputCls =
  "h-12 w-full rounded-full border border-[#6DA003]/15 bg-[#FAFAFA] px-4 text-sm text-[#444444] outline-none focus:border-[#6DA003]/40 transition-colors";
const labelCls = "mb-2 block text-[11px] uppercase tracking-[0.24em] text-[#6DA003]";
const cardCls =
  "rounded-[32px] border border-[#6DA003]/20 bg-white p-6 shadow-[0_12px_40px_rgba(109,160,3,0.08)] sm:p-8";

export default function RoomBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSlug = searchParams.get("room");
  const initialNights = Number(searchParams.get("nights")) || 1;
  const initialGuests = Number(searchParams.get("guests")) || 2;

  const [slug, setSlug] = useState(
    () => (initialSlug && getRoomBySlug(initialSlug)?.slug) || roomsData[0].slug,
  );
  const [checkIn, setCheckIn] = useState(DEFAULT_CHECK_IN);
  const [checkOut, setCheckOut] = useState(() =>
    addDays(DEFAULT_CHECK_IN, Math.max(1, initialNights)),
  );
  const [guests, setGuests] = useState(Math.max(1, initialGuests));
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const room = getRoomBySlug(slug) ?? roomsData[0];
  const nights = nightsBetween(checkIn, checkOut);

  const roomsNeeded = roomsNeededFor(room, guests);
  const perRoomTotal = roomStayTotal(room, nights);
  const datesInvalid = new Date(checkOut) <= new Date(checkIn);

  const roomTotal = stayTotal(room, nights, guests);
  const taxes = Math.round(roomTotal * GST_RATE);
  const total = roomTotal + taxes;
  const advance = Math.round((total * ADVANCE_RATE) / 100) * 100;
  const balance = Math.max(0, total - advance);

  const referenceSeed = `${room.slug}-${checkIn}-${form.firstName}-${form.phone}`;
  const reference = `GVH-R${1000 + (Array.from(referenceSeed).reduce((a, c) => a + c.charCodeAt(0), 0) % 9000)}`;

  const updateField = (key: keyof typeof form, value: string) =>
    setForm((cur) => ({ ...cur, [key]: value }));

  const canSubmit =
    !datesInvalid && form.firstName.trim() !== "" && form.phone.trim() !== "";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    router.push(
      `/rooms/booking/confirmation?ref=${reference}&room=${room.slug}&nights=${nights}&rooms=${roomsNeeded}&guests=${guests}`,
    );
  };

  const stepLabel = (n: number, text: string) => (
    <>
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#6DA003]">Step {n}</p>
      <h2 className="mt-2 font-serif text-2xl text-[#111111]">{text}</h2>
    </>
  );

  return (
    <form onSubmit={handleSubmit} className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        {/* ── Step 1: Choose room ── */}
        <div className={cardCls}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>{stepLabel(1, "Choose your room")}</div>
            <Link
              href="/rooms"
              className="text-sm font-semibold text-[#6DA003] transition-colors hover:text-[#5B8703]"
            >
              Browse all rooms →
            </Link>
          </div>

          <label className="mt-6 block">
            <span className={labelCls}>Room</span>
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={`${inputCls} cursor-pointer appearance-none`}
            >
              <optgroup label="Budget">
                {budgetRooms.map((r) => (
                  <option key={r.slug} value={r.slug}>
                    {r.title} — {formatINR(r.pricePerNight)}/night · sleeps {r.maxGuests}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Premium">
                {premiumRooms.map((r) => (
                  <option key={r.slug} value={r.slug}>
                    {r.title} — {formatINR(r.pricePerNight)}/night · sleeps {r.maxGuests}
                  </option>
                ))}
              </optgroup>
            </select>
          </label>

          <div className="mt-6 grid gap-5 sm:grid-cols-[0.9fr_1.1fr] sm:items-start">
            <div className="relative overflow-hidden rounded-[24px]" style={{ aspectRatio: "4/3" }}>
              <Image
                src={room.image}
                alt={room.title}
                fill
                sizes="(max-width: 640px) 100vw, 320px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                {[room.tier, `Sleeps ${room.maxGuests}`, "Room only"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#6DA003]/20 bg-[#6DA003]/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#6DA003]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="mt-3 text-xl font-semibold text-[#111111]">{room.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#555555]">{room.description}</p>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#111111]">
                  {formatINR(room.pricePerNight)}
                </span>
                <span className="text-sm text-[#888888]">/ per night</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Step 2: Dates & guests ── */}
        <div className={cardCls}>
          {stepLabel(2, "Stay dates and guests")}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className={labelCls}>Check-in</span>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => {
                  const next = e.target.value;
                  setCheckIn(next);
                  if (new Date(checkOut) <= new Date(next)) setCheckOut(addDays(next, nights));
                }}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className={labelCls}>Check-out</span>
              <input
                type="date"
                value={checkOut}
                min={addDays(checkIn, 1)}
                onChange={(e) => setCheckOut(e.target.value)}
                className={inputCls}
              />
            </label>
          </div>

          {datesInvalid ? (
            <p role="alert" className="mt-3 rounded-[16px] bg-[#FFF4E5] px-4 py-3 text-sm text-[#9A5B00]">
              Check-out must be after check-in.
            </p>
          ) : (
            <p className="mt-3 text-sm text-[#666666]">
              <span className="font-semibold text-[#111111]">
                {nights} night{nights === 1 ? "" : "s"}
              </span>{" "}
              · arriving 12:00 noon, leaving 10:00 am
            </p>
          )}

          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-2">
              <label htmlFor="booking-guest-slider" className={`${labelCls} mb-0`}>
                Guests
              </label>
              <span className="rounded-full bg-[#6DA003] px-3 py-0.5 text-[12px] font-semibold text-white tabular-nums">
                {guests}
              </span>
            </div>
            <input
              id="booking-guest-slider"
              type="range"
              min={1}
              max={MAX_PARTY_SIZE}
              step={1}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              aria-valuetext={`${guests} guest${guests === 1 ? "" : "s"}`}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-[#6DA003]/15 accent-[#6DA003] outline-none focus-visible:ring-2 focus-visible:ring-[#6DA003]/40"
            />
            <div className="flex justify-between text-[11px] text-[#AAAAAA] tabular-nums">
              <span>1</span>
              <span>{MAX_PARTY_SIZE}</span>
            </div>

            <div className="mt-3 rounded-[16px] bg-[#6DA003]/5 px-4 py-3 text-sm">
              <p className="text-[#555555]">
                {room.title} sleeps{" "}
                <span className="font-semibold text-[#111111]">{room.maxGuests}</span>, so{" "}
                <span className="font-semibold text-[#6DA003]">
                  {roomsNeeded} room{roomsNeeded === 1 ? "" : "s"}
                </span>{" "}
                {roomsNeeded === 1 ? "is" : "are"} reserved for {guests} guest
                {guests === 1 ? "" : "s"}.
              </p>
              {roomsNeeded * room.maxGuests > guests ? (
                <p className="mt-1 text-[12px] text-[#888888]">
                  {roomsNeeded * room.maxGuests - guests} spare bed
                  {roomsNeeded * room.maxGuests - guests === 1 ? "" : "s"} across those rooms.
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* ── Step 3: Guest details ── */}
        <div className={cardCls}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>{stepLabel(3, "Guest details")}</div>
            <div className="rounded-[20px] border border-[#6DA003]/20 bg-[#6DA003]/5 px-4 py-3 text-[11px] leading-5 text-[#6DA003]">
              <p className="font-semibold uppercase tracking-[0.22em]">Photo ID notice</p>
              <p className="mt-1 normal-case tracking-normal text-[#555555]">
                A government-issued photo ID is required at check-in for every adult guest.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className={labelCls}>First name</span>
              <input
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="Enter first name"
                className={inputCls}
                required
              />
            </label>
            <label className="block">
              <span className={labelCls}>Last name</span>
              <input
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                placeholder="Enter last name"
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className={labelCls}>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="Enter email address"
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className={labelCls}>Phone</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="Enter phone number"
                className={inputCls}
                required
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className={labelCls}>Special requests</span>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              placeholder="Early check-in, extra mattress, ground-floor room, accessibility needs — tell us here."
              className="w-full rounded-[28px] border border-[#6DA003]/15 bg-[#FAFAFA] px-4 py-3 text-sm text-[#444444] outline-none transition-colors focus:border-[#6DA003]/40 placeholder:text-[#AAAAAA]"
            />
          </label>
        </div>

        {/* ── What a room booking covers ── */}
        <div className={cardCls}>
          <h2 className="font-serif text-2xl text-[#111111]">What this booking covers</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[20px] bg-[#6DA003]/5 p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6DA003]">
                Included
              </p>
              <ul className="space-y-2">
                {["The room for your selected nights", "Attached bath, hot water, power backup", "Housekeeping and mosquito netting", "Applicable taxes shown in the summary"].map(
                  (item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#444444]">
                      <span className="mt-0.5 text-[#6DA003]">✓</span> {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div className="rounded-[20px] bg-[#FAFAFA] p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#888888]">
                Not included
              </p>
              <ul className="space-y-2">
                {NOT_INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#666666]">
                    <span className="mt-0.5 text-[#AAAAAA]">✕</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 rounded-[20px] bg-[#6DA003]/5 p-4 text-sm leading-6 text-[#555555]">
            This is a room-only stay. If you want boat safaris, forest permits, guides and meals
            bundled in, book a{" "}
            <Link href="/trips" className="font-semibold text-[#6DA003] hover:text-[#5B8703]">
              trip package
            </Link>{" "}
            instead.
          </p>

          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {HOUSE_RULES.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 rounded-[16px] bg-[#FAFAFA] px-4 py-3">
                <dt className="text-[12px] uppercase tracking-[0.24em] text-[#666666]">{k}</dt>
                <dd className="text-sm font-semibold text-[#111111]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── Step 4: Submit ── */}
        <div className={cardCls}>
          {stepLabel(4, "Review and confirm")}
          <p className="mt-4 text-sm leading-7 text-[#555555]">
            We hold the room once the advance is received. The balance is payable at check-in.
            Submitting sends us a request — we&apos;ll confirm availability before taking payment.
          </p>
          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-6 rounded-full bg-[#6DA003] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#5B8703] hover:shadow-[0_8px_24px_rgba(109,160,3,0.3)] disabled:cursor-not-allowed disabled:bg-[#C4C4C4] disabled:shadow-none cursor-pointer"
          >
            Request booking — {formatINR(advance)} advance
          </button>
          {!canSubmit ? (
            <p className="mt-3 text-[12px] text-[#888888]">
              {datesInvalid
                ? "Fix your dates to continue."
                : "Add your name and phone number to continue."}
            </p>
          ) : null}
        </div>
      </div>

      {/* ── Sidebar: price summary ── */}
      <aside className="h-fit rounded-[32px] border border-[#6DA003]/20 bg-[#111111] p-6 text-white shadow-[0_12px_40px_rgba(17,17,17,0.18)] sm:p-8 lg:sticky lg:top-28">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#C5FE4E]">Price summary</p>
        <h2 className="mt-3 font-serif text-3xl">Your stay at a glance</h2>

        <div className="mt-6 space-y-1">
          <div className="rounded-[20px] bg-white/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">
                  {roomsNeeded === 1 ? "Room" : `${roomsNeeded} rooms`}
                </p>
                <p className="mt-1 text-sm text-white/80">{room.title}</p>
                <p className="mt-0.5 text-[11px] text-white/40">
                  {formatINR(room.pricePerNight)} × {nights} night{nights === 1 ? "" : "s"}
                  {roomsNeeded > 1 ? ` × ${roomsNeeded} rooms` : ""}
                </p>
                {roomsNeeded > 1 ? (
                  <p className="mt-0.5 text-[11px] text-white/40">
                    {formatINR(perRoomTotal)} per room
                  </p>
                ) : null}
              </div>
              <p className="text-base font-semibold text-white">{formatINR(roomTotal)}</p>
            </div>
          </div>

          <div className="rounded-[20px] bg-white/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">Occupancy</p>
                <p className="mt-1 text-sm text-white/80">
                  {guests} guest{guests === 1 ? "" : "s"}
                </p>
                <p className="mt-0.5 text-[11px] text-white/40">
                  {room.maxGuests} per room × {roomsNeeded}
                </p>
              </div>
              <p className="text-base font-semibold text-white">
                {roomsNeeded * room.maxGuests} beds
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 px-1 py-3 text-sm">
            <span className="text-white/60">GST ({Math.round(GST_RATE * 100)}%)</span>
            <span className="font-semibold text-white">{formatINR(taxes)}</span>
          </div>

          <div className="border-t border-white/15 pt-4">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm text-white/75">Total stay cost</span>
              <span className="text-2xl font-bold text-white">{formatINR(total)}</span>
            </div>
          </div>

          <div className="mt-3 rounded-[20px] bg-[#C5FE4E]/10 p-4">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-[#C5FE4E]">Advance payable now</span>
              <span className="text-lg font-bold text-[#C5FE4E]">{formatINR(advance)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-4 text-sm">
              <span className="text-white/60">Balance at check-in</span>
              <span className="font-semibold text-white/80">{formatINR(balance)}</span>
            </div>
            <p className="mt-3 text-[11px] leading-5 text-white/40">
              {Math.round(ADVANCE_RATE * 100)}% advance holds the room. The balance is payable on
              arrival.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[20px] bg-[#FAFAFA] p-5 text-sm text-[#444444]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#6DA003]">Reference number</p>
          <p className="mt-2 text-2xl font-semibold text-[#111111]">{reference}</p>
          <p className="mt-1 text-[12px]">
            Your reference appears on the confirmation screen after you submit.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <Link
            href="mailto:greenviewhomestay@gmail.com"
            className="rounded-full bg-[#6DA003] px-5 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-[#5B8703]"
          >
            Confirm by email
          </Link>
          <Link
            href="https://wa.me/917679756846"
            className="rounded-full border border-[#C5FE4E] px-5 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-[#C5FE4E] hover:text-[#111111]"
          >
            Ask on WhatsApp
          </Link>
        </div>
      </aside>
    </form>
  );
}
