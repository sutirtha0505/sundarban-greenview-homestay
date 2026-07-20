import Link from "next/link";
import type { Metadata } from "next";
import { getRoomBySlug } from "@/lib/data/rooms";

export const metadata: Metadata = {
  title: "Room Booking Received — Sundarban Greenview Homestay",
};

const NEXT_STEPS = [
  "We check availability for your dates and confirm by phone or email.",
  "We send advance payment details — 30% holds the room.",
  "You receive check-in guidance. The balance is payable on arrival.",
];

// In Next 16 `searchParams` is a Promise and must be awaited.
export default async function RoomBookingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{
    ref?: string;
    room?: string;
    nights?: string;
    rooms?: string;
    guests?: string;
  }>;
}) {
  const { ref, room: roomSlug, nights, rooms, guests } = await searchParams;
  const reference = ref ?? "GVH-R0000";
  const room = roomSlug ? getRoomBySlug(roomSlug) : undefined;
  const nightCount = Number(nights) || 1;
  const roomCount = Number(rooms) || 1;
  const guestCount = Number(guests) || 0;

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-4 py-28 text-[#111111] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center rounded-[32px] border border-[#6DA003]/20 bg-white p-8 text-center shadow-[0_12px_40px_rgba(109,160,3,0.08)] sm:p-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6DA003]/10 text-3xl text-[#6DA003]">
            ✓
          </span>
          <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-[#6DA003]">
            Room request received
          </p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
            Your reference is {reference}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#666666] sm:text-base">
            We&apos;ve received your room request and will confirm availability shortly. Keep this
            reference handy when you contact us.
          </p>

          {room ? (
            <div className="mt-8 w-full rounded-[24px] bg-[#FAFAFA] p-5 text-left">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#6DA003]">
                    {room.tier} room
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[#111111]">
                    {roomCount > 1 ? `${roomCount} × ` : ""}
                    {room.title}
                  </p>
                </div>
                <p className="text-sm text-[#666666]">
                  {nightCount} night{nightCount === 1 ? "" : "s"}
                  {guestCount > 0 ? ` · ${guestCount} guest${guestCount === 1 ? "" : "s"}` : ""} ·
                  sleeps {room.maxGuests} per room
                </p>
              </div>
              <p className="mt-3 border-t border-[#6DA003]/10 pt-3 text-[12px] leading-5 text-[#888888]">
                Room only — safaris, permits, guides and meals are not included.
              </p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/rooms"
              className="rounded-full border border-[#6DA003] px-5 py-3 text-sm font-semibold text-[#6DA003] transition-all hover:bg-[#6DA003] hover:text-white"
            >
              Browse rooms
            </Link>
            <Link
              href="/trips"
              className="rounded-full border border-[#6DA003] px-5 py-3 text-sm font-semibold text-[#6DA003] transition-all hover:bg-[#6DA003] hover:text-white"
            >
              Add a trip package
            </Link>
            <Link
              href="/"
              className="rounded-full border border-[#6DA003] px-5 py-3 text-sm font-semibold text-[#6DA003] transition-all hover:bg-[#6DA003] hover:text-white"
            >
              Back to home
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-[32px] border border-[#6DA003]/20 bg-white p-6 shadow-[0_10px_30px_rgba(109,160,3,0.06)] sm:p-8">
          <h2 className="font-serif text-2xl text-[#111111]">What happens next</h2>
          <div className="mt-5 space-y-4">
            {NEXT_STEPS.map((step, i) => (
              <div key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6DA003] text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="pt-1 text-sm leading-6 text-[#555555]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
