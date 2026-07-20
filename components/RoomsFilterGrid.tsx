"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MAX_PARTY_SIZE,
  NIGHT_OPTIONS,
  ROOM_PRICE_OPTIONS,
  TIER_OPTIONS,
  formatINR,
  roomStayTotal,
  roomsNeededFor,
  stayTotal,
  type Room,
  type RoomTier,
} from "@/lib/data/rooms";

const CHIP_BASE = "rounded-full border px-4 py-2 text-sm transition-all cursor-pointer";
const CHIP_ON = "border-[#6DA003] bg-[#6DA003] text-white";
const CHIP_OFF =
  "border-[#6DA003]/20 bg-[#FAFAFA] text-[#444444] hover:border-[#6DA003] hover:text-[#6DA003]";

const DEFAULT_NIGHTS = "1";
const DEFAULT_GUESTS = 2;
const PAGE_SIZE = 6;

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/** Single-select chip row — used for Nights and Guests, which feed the price maths. */
function ChoiceGroup<T extends string>({
  label,
  hint,
  options,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2" role="radiogroup" aria-label={label}>
      <span className="text-[11px] uppercase tracking-[0.28em] text-[#6DA003]">
        {label}
        {hint ? <span className="ml-2 normal-case tracking-normal text-[#AAAAAA]">{hint}</span> : null}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isOn = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isOn}
              onClick={() => onChange(option.id)}
              className={`${CHIP_BASE} ${isOn ? CHIP_ON : CHIP_OFF}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Party-size slider. Drives how many rooms each option needs, not which rooms show. */
function GuestSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (guests: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor="rooms-guest-slider"
          className="text-[11px] uppercase tracking-[0.28em] text-[#6DA003]"
        >
          Guests
        </label>
        <span className="rounded-full bg-[#6DA003] px-3 py-0.5 text-[12px] font-semibold text-white tabular-nums">
          {value}
        </span>
      </div>
      <input
        id="rooms-guest-slider"
        type="range"
        min={1}
        max={MAX_PARTY_SIZE}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuemin={1}
        aria-valuemax={MAX_PARTY_SIZE}
        aria-valuenow={value}
        aria-valuetext={`${value} guest${value === 1 ? "" : "s"}`}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#6DA003]/15 accent-[#6DA003] outline-none focus-visible:ring-2 focus-visible:ring-[#6DA003]/40"
      />
      <div className="flex justify-between text-[11px] text-[#AAAAAA] tabular-nums">
        <span>1</span>
        <span>{MAX_PARTY_SIZE}</span>
      </div>
    </div>
  );
}

/** Multi-select chip row — used for Price and Room type, which narrow results. */
function FilterGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { id: T; label: string }[];
  selected: T[];
  onToggle: (id: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2" role="group" aria-label={label}>
      <span className="text-[11px] uppercase tracking-[0.28em] text-[#6DA003]">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isOn = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isOn}
              onClick={() => onToggle(option.id)}
              className={`${CHIP_BASE} ${isOn ? CHIP_ON : CHIP_OFF}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function RoomsFilterGrid({ rooms }: { rooms: Room[] }) {
  const [nightId, setNightId] = useState(DEFAULT_NIGHTS);
  const [guests, setGuests] = useState(DEFAULT_GUESTS);
  const [priceBands, setPriceBands] = useState<string[]>([]);
  const [tiers, setTiers] = useState<RoomTier[]>([]);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const nights = NIGHT_OPTIONS.find((o) => o.id === nightId)?.nights ?? 1;
  const isNightsOpenEnded = nightId === "3plus";

  const filtered = useMemo(() => {
    return rooms.filter((room) => {
      if (tiers.length && !tiers.includes(room.tier)) return false;

      // Party size no longer excludes a room — it multiplies how many are booked,
      // so the price band applies to the full multi-room total.
      if (priceBands.length) {
        const total = stayTotal(room, nights, guests);
        const inBand = ROOM_PRICE_OPTIONS.filter((b) => priceBands.includes(b.id)).some(
          (b) => total >= b.min && total < b.max,
        );
        if (!inBand) return false;
      }

      return true;
    });
  }, [rooms, guests, tiers, priceBands, nights]);

  const shown = filtered.slice(0, visible);
  const remaining = filtered.length - shown.length;

  // Any change to the criteria collapses the list back to one page.
  const resetPaging = () => setVisible(PAGE_SIZE);

  const narrowingCount = priceBands.length + tiers.length;
  const isDefaultStay = nightId === DEFAULT_NIGHTS && guests === DEFAULT_GUESTS;

  const clearAll = () => {
    setPriceBands([]);
    setTiers([]);
    setNightId(DEFAULT_NIGHTS);
    setGuests(DEFAULT_GUESTS);
    resetPaging();
  };

  return (
    <>
      <div className="mt-8 rounded-[28px] border border-[#6DA003]/15 bg-white p-4 shadow-[0_10px_30px_rgba(109,160,3,0.06)] sm:p-5">
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4 xl:items-start">
          <ChoiceGroup
            label="Nights"
            options={NIGHT_OPTIONS}
            value={nightId}
            onChange={(id) => {
              setNightId(id);
              resetPaging();
            }}
          />
          <GuestSlider
            value={guests}
            onChange={(g) => {
              setGuests(g);
              resetPaging();
            }}
          />
          <FilterGroup
            label="Price (total stay)"
            options={ROOM_PRICE_OPTIONS.map(({ id, label }) => ({ id, label }))}
            selected={priceBands}
            onToggle={(id) => {
              setPriceBands((prev) => toggle(prev, id));
              resetPaging();
            }}
          />
          <FilterGroup
            label="Room type"
            options={TIER_OPTIONS}
            selected={tiers}
            onToggle={(id) => {
              setTiers((prev) => toggle(prev, id));
              resetPaging();
            }}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#6DA003]/10 pt-4">
          <p aria-live="polite" className="text-sm text-[#555555]">
            Showing <span className="font-semibold text-[#111111]">{shown.length}</span> of{" "}
            {filtered.length} room types —{" "}
            <span className="text-[#666666]">
              totals for {guests} guest{guests === 1 ? "" : "s"} over {nights}
              {isNightsOpenEnded ? "+" : ""} night{nights === 1 ? "" : "s"}
            </span>
          </p>
          {narrowingCount > 0 || !isDefaultStay ? (
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full border border-[#6DA003]/30 px-4 py-1.5 text-sm text-[#6DA003] transition-all hover:bg-[#6DA003] hover:text-white cursor-pointer"
            >
              Reset {narrowingCount > 0 ? `filters (${narrowingCount})` : "filters"}
            </button>
          ) : null}
        </div>
      </div>

      {shown.length > 0 ? (
        <>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {shown.map((room) => {
              const roomsNeeded = roomsNeededFor(room, guests);
              const total = stayTotal(room, nights, guests);
              const perRoom = roomStayTotal(room, nights);
              return (
                <article
                  key={room.slug}
                  className="flex h-full flex-col overflow-hidden rounded-[32px] border border-[#6DA003]/20 bg-white shadow-[0_12px_40px_rgba(109,160,3,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(109,160,3,0.14)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={room.image}
                      alt={room.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6DA003] backdrop-blur-sm">
                      {room.tier}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-[#6DA003]">
                      <span className="rounded-full border border-[#6DA003]/20 px-3 py-1">
                        Sleeps {room.maxGuests}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 ${
                          roomsNeeded > 1
                            ? "border border-[#6DA003] bg-[#6DA003]/10 font-semibold"
                            : "border border-[#6DA003]/20"
                        }`}
                      >
                        {roomsNeeded} room{roomsNeeded === 1 ? "" : "s"}
                      </span>
                    </div>

                    <h3 className="text-[18px] font-semibold leading-7 text-[#111111]">
                      {room.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#555555]">
                      {room.description}
                    </p>

                    <div className="mt-6 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[12px] uppercase tracking-[0.24em] text-[#666666]">
                          {roomsNeeded === 1 && nights === 1
                            ? "Per night"
                            : `Total · ${nights}${isNightsOpenEnded ? "+" : ""} night${nights === 1 ? "" : "s"}`}
                        </p>
                        <p className="text-2xl font-semibold text-[#111111]">{formatINR(total)}</p>
                        <p className="text-[12px] text-[#666666]">
                          {formatINR(room.pricePerNight)}
                          {nights > 1 ? ` × ${nights} nights` : ""}
                          {roomsNeeded > 1 ? ` × ${roomsNeeded} rooms` : ""}
                          {roomsNeeded === 1 && nights === 1 ? " · room only" : ""}
                        </p>
                        {roomsNeeded > 1 ? (
                          <p className="mt-0.5 text-[11px] text-[#888888]">
                            {formatINR(perRoom)} per room · sleeps {room.maxGuests} each
                          </p>
                        ) : null}
                      </div>
                      <Link
                        href={`/rooms/booking?room=${room.slug}&nights=${nights}&guests=${guests}`}
                        className="inline-flex shrink-0 rounded-full border border-[#6DA003] px-4 py-2 text-sm font-semibold text-[#6DA003] transition-all hover:bg-[#6DA003] hover:text-white"
                      >
                        Book room
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {remaining > 0 ? (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="rounded-full bg-[#6DA003] px-8 py-3 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-[#5B8703] cursor-pointer"
              >
                Show more rooms ({remaining})
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="mt-10 rounded-[32px] border border-dashed border-[#6DA003]/30 bg-white px-6 py-14 text-center">
          <h3 className="font-serif text-2xl text-[#111111]">No rooms match those filters</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#666666]">
            {priceBands.length > 0
              ? `No room type totals that much for ${guests} guest${guests === 1 ? "" : "s"} over ${nights} night${nights === 1 ? "" : "s"}. Try a wider price band, or fewer nights.`
              : "Try a different price band or room type — or talk to us and we'll work something out."}
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-6 rounded-full bg-[#6DA003] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-[#5B8703] cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      )}
    </>
  );
}
