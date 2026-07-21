"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

  const [showPreview, setShowPreview] = useState(false);

  const updateField = (key: keyof typeof form, value: string) =>
    setForm((cur) => ({ ...cur, [key]: value }));

  const canSubmit =
    !datesInvalid && form.firstName.trim() !== "" && form.phone.trim() !== "";

  const blockedReason = datesInvalid
    ? "Fix your dates to continue."
    : form.firstName.trim() === "" || form.phone.trim() === ""
      ? "Add your name and phone number to continue."
      : null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    setShowPreview(true);
  };

  // ── Booking message builder ────────────────────────────────────────────────
  const buildBookingMessage = () => {
    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    const divider = "────────────────────────────────";
    const fmt = (label: string, value: string) => `  ${label}: ${value}`;
    const lines: string[] = [
      `Hi, I'm ${fullName} and I'd like to book a room at Sundarban Greenview Homestay.`,
      ``,
      `Please find my booking details below.`,
      ``,
      divider,
      `  ROOM`,
      divider,
      fmt("Room type", `${room.title} (${room.tier})`),
      fmt("Rate", `${formatINR(room.pricePerNight)} per night`),
      fmt("Sleeps", `${room.maxGuests} per room`),
      ``,
      divider,
      `  STAY DETAILS`,
      divider,
      fmt("Check-in", checkIn),
      fmt("Check-out", checkOut),
      fmt("Duration", `${nights} night${nights === 1 ? "" : "s"}`),
      fmt("Guests", `${guests} guest${guests === 1 ? "" : "s"}`),
      fmt("Rooms required", `${roomsNeeded} room${roomsNeeded === 1 ? "" : "s"}`),
      ``,
      divider,
      `  PRICE SUMMARY`,
      divider,
      fmt("Room charges", `${formatINR(room.pricePerNight)} × ${nights}n × ${roomsNeeded}r = ${formatINR(roomTotal)}`),
      fmt(`GST (${Math.round(GST_RATE * 100)}%)`, formatINR(taxes)),
      `  ` + "─".repeat(30),
      fmt("Total", formatINR(total)),
      fmt("Advance payable now", formatINR(advance)),
      fmt("Balance at check-in", formatINR(balance)),
    ];
    if (form.email || form.phone) {
      lines.push(``, divider, `  CONTACT`, divider);
      if (form.email) lines.push(fmt("Email", form.email));
      if (form.phone) lines.push(fmt("Phone", form.phone));
    }
    if (form.message.trim()) {
      lines.push(``, divider, `  SPECIAL REQUESTS`, divider, `  ${form.message.trim()}`);
    }
    lines.push(``, divider);
    lines.push(`Thank you. Please confirm availability at your earliest convenience.`);
    lines.push(``, `— ${fullName}`);
    return lines.join("\n");
  };

  const emailHref = () => {
    const msg = buildBookingMessage();
    const subject = encodeURIComponent(`Room Booking Enquiry – ${form.firstName} ${form.lastName}`);
    return `https://mail.google.com/mail/?view=cm&to=greenviewhomestay@gmail.com&su=${subject}&body=${encodeURIComponent(msg)}`;
  };

  const whatsappHref = () =>
    `https://wa.me/917679756846?text=${encodeURIComponent(buildBookingMessage())}`;

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
              <span className={labelCls}>Guests</span>
              {/* Stepper */}
              <div className="flex items-center gap-3 mt-1">
                <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} disabled={guests <= 1}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#6DA003]/30 bg-[#6DA003]/5 text-[#6DA003] transition-all hover:bg-[#6DA003] hover:text-white hover:border-[#6DA003] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Remove guest">
                  <svg width="14" height="2" viewBox="0 0 14 2" fill="currentColor"><rect width="14" height="2" rx="1" /></svg>
                </button>
                <div className="flex-1 flex flex-col items-center">
                  <span className="font-serif text-[38px] font-bold leading-none text-[#111111] tabular-nums">{guests}</span>
                  <span className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#888888]">guest{guests === 1 ? "" : "s"}</span>
                </div>
                <button type="button" onClick={() => setGuests((g) => Math.min(MAX_PARTY_SIZE, g + 1))} disabled={guests >= MAX_PARTY_SIZE}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#6DA003]/30 bg-[#6DA003]/5 text-[#6DA003] transition-all hover:bg-[#6DA003] hover:text-white hover:border-[#6DA003] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Add guest">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="6" y="0" width="2" height="14" rx="1" /><rect x="0" y="6" width="14" height="2" rx="1" /></svg>
                </button>
              </div>
              {/* Dot track */}
              <div className="mt-4 flex gap-1.5" aria-hidden>
                {Array.from({ length: MAX_PARTY_SIZE }).map((_, i) => (
                  <button key={i} type="button" onClick={() => setGuests(i + 1)}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-200 cursor-pointer ${i < guests ? "bg-[#6DA003]" : "bg-[#6DA003]/15"}`} />
                ))}
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

        {/* ── Step 4: Review ── */}
        <div className={cardCls}>
          {stepLabel(4, "Review and confirm")}
          <p className="mt-4 text-sm leading-7 text-[#555555]">
            Preview your full booking details before reaching out to confirm.
          </p>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => setShowPreview(true)}
            className="mt-6 rounded-full bg-[#6DA003] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#5B8703] hover:shadow-[0_8px_24px_rgba(109,160,3,0.3)] disabled:cursor-not-allowed disabled:bg-[#C4C4C4] disabled:shadow-none cursor-pointer"
          >
            Review Booking — {formatINR(advance)} advance
          </button>
          {blockedReason ? (
            <p className="mt-3 text-[12px] text-[#888888]">{blockedReason}</p>
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

        {/* Contact CTAs */}
        <div className="mt-5 flex flex-col gap-3">
          {!canSubmit && (
            <p className="rounded-[16px] bg-white/10 px-4 py-3 text-[12px] leading-5 text-white/50">
              {blockedReason}
            </p>
          )}
          <a href={canSubmit ? emailHref() : undefined}
            onClick={!canSubmit ? (e) => e.preventDefault() : undefined}
            target="_blank" rel="noopener noreferrer" aria-disabled={!canSubmit}
            className={`rounded-full px-5 py-3 text-center text-sm font-semibold transition-all ${canSubmit ? "bg-[#6DA003] text-white hover:bg-[#5B8703] hover:shadow-[0_6px_20px_rgba(109,160,3,0.35)] cursor-pointer" : "cursor-not-allowed bg-[#6DA003]/40 text-white/50"}`}>
            ✉&nbsp; Confirm by Email
          </a>
          <a href={canSubmit ? whatsappHref() : undefined}
            onClick={!canSubmit ? (e) => e.preventDefault() : undefined}
            target="_blank" rel="noopener noreferrer" aria-disabled={!canSubmit}
            className={`rounded-full border px-5 py-3 text-center text-sm font-semibold transition-all ${canSubmit ? "border-[#C5FE4E] text-white hover:bg-[#C5FE4E] hover:text-[#111111] cursor-pointer" : "cursor-not-allowed border-white/20 text-white/40"}`}>
            💬&nbsp; Ask on WhatsApp
          </a>
        </div>
      </aside>
      {/* ── Room Booking Preview Modal ── */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <div className="absolute inset-0 bg-[#0C0000]/80 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-[#111111] shadow-[0_32px_80px_rgba(0,0,0,0.6)] flex flex-col" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-[32px] bg-[#111111] px-7 pt-7 pb-5 border-b border-white/8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.36em] text-[#6DA003]">Room Booking Preview</p>
                <h2 className="mt-1 font-serif text-[22px] text-white leading-tight">{form.firstName} {form.lastName}</h2>
              </div>
              <button onClick={() => setShowPreview(false)} type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all hover:border-white/40 hover:text-white cursor-pointer"
                aria-label="Close preview">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-7 py-6 space-y-5">

              {/* Room card */}
              <div className="rounded-[20px] bg-white/5 p-5">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#6DA003] mb-3">Room</p>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[17px] font-semibold text-white leading-snug">{room.title}</p>
                    <p className="mt-1 text-[13px] text-white/50">{room.tier} · sleeps {room.maxGuests} per room</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[15px] font-semibold text-white">{formatINR(room.pricePerNight)}</p>
                    <p className="mt-1 text-[11px] text-white/40">per night</p>
                  </div>
                </div>
              </div>

              {/* Stay details */}
              <div className="rounded-[20px] bg-white/5 p-5">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#6DA003] mb-3">Stay Details</p>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  {([
                    ["Check-in", checkIn],
                    ["Check-out", checkOut],
                    ["Duration", `${nights} night${nights === 1 ? "" : "s"}`],
                    ["Guests", `${guests} guest${guests === 1 ? "" : "s"}`],
                    ["Rooms reserved", `${roomsNeeded} room${roomsNeeded === 1 ? "" : "s"}`],
                    ["Occupancy", `${room.maxGuests} per room`],
                  ] as [string, string][]).map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider">{label}</p>
                      <p className="mt-0.5 text-[13px] font-medium text-white/85">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price breakdown */}
              <div className="rounded-[20px] bg-white/5 p-5">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#6DA003] mb-4">Price Breakdown</p>
                <div className="space-y-2.5">
                  {([
                    ["Room charges", formatINR(roomTotal)],
                    [`GST (${Math.round(GST_RATE * 100)}%)`, formatINR(taxes)],
                  ] as [string, string][]).map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between text-[13px]">
                      <span className="text-white/55">{label}</span>
                      <span className="font-medium text-white/85">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-white/10 pt-4 flex items-baseline justify-between">
                  <span className="text-[13px] text-white/60">Total</span>
                  <span className="text-[22px] font-bold text-white">{formatINR(total)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-[14px] bg-[#C5FE4E]/12 px-4 py-3">
                  <div>
                    <p className="text-[11px] text-[#C5FE4E] font-semibold uppercase tracking-wider">Advance payable now</p>
                    <p className="text-[11px] text-white/35 mt-0.5">Balance {formatINR(balance)} at check-in</p>
                  </div>
                  <span className="text-[20px] font-bold text-[#C5FE4E]">{formatINR(advance)}</span>
                </div>
              </div>

              {/* Contact */}
              {(form.email || form.phone) && (
                <div className="rounded-[20px] bg-white/5 p-5">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#6DA003] mb-3">Your Contact</p>
                  <div className="grid grid-cols-2 gap-3">
                    {form.email && <div><p className="text-[10px] text-white/40 uppercase tracking-wider">Email</p><p className="mt-0.5 text-[13px] text-white/80 break-all">{form.email}</p></div>}
                    {form.phone && <div><p className="text-[10px] text-white/40 uppercase tracking-wider">Phone</p><p className="mt-0.5 text-[13px] text-white/80">{form.phone}</p></div>}
                  </div>
                </div>
              )}

              {/* Special requests */}
              {form.message.trim() && (
                <div className="rounded-[20px] bg-white/5 p-5">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#6DA003] mb-2">Special Requests</p>
                  <p className="text-[13px] leading-[1.7] text-white/65">{form.message}</p>
                </div>
              )}
            </div>

            {/* Footer CTAs */}
            <div className="sticky bottom-0 rounded-b-[32px] bg-[#111111] border-t border-white/8 px-7 py-5 flex flex-col gap-3">
              <a href={emailHref()} target="_blank" rel="noopener noreferrer"
                className="w-full rounded-full bg-[#6DA003] py-3.5 text-center text-[14px] font-semibold text-white transition-all hover:bg-[#5B8703] hover:shadow-[0_6px_20px_rgba(109,160,3,0.4)] cursor-pointer">
                ✉&nbsp; Confirm by Email
              </a>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer"
                className="w-full rounded-full border border-[#C5FE4E] py-3.5 text-center text-[14px] font-semibold text-white transition-all hover:bg-[#C5FE4E] hover:text-[#111111] cursor-pointer">
                💬&nbsp; Ask on WhatsApp
              </a>
              <button type="button" onClick={() => setShowPreview(false)}
                className="text-[12px] text-white/35 hover:text-white/60 transition-colors cursor-pointer">
                ← Edit booking
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
