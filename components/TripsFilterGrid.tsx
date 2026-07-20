"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  DURATION_OPTIONS,
  GROUP_OPTIONS,
  PRICE_OPTIONS,
  type DurationBand,
  type GroupType,
  type Trip,
} from "@/lib/data/trips";

const CHIP_BASE =
  "rounded-full border px-4 py-2 text-sm transition-all cursor-pointer";
const CHIP_ON = "border-[#6DA003] bg-[#6DA003] text-white";
const CHIP_OFF =
  "border-[#6DA003]/20 bg-[#FAFAFA] text-[#444444] hover:border-[#6DA003] hover:text-[#6DA003]";

/** Toggle a value in/out of a selection array. */
function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

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

export default function TripsFilterGrid({ trips }: { trips: Trip[] }) {
  const [durations, setDurations] = useState<DurationBand[]>([]);
  const [priceBands, setPriceBands] = useState<string[]>([]);
  const [groupTypes, setGroupTypes] = useState<GroupType[]>([]);

  const activeCount = durations.length + priceBands.length + groupTypes.length;

  const filtered = useMemo(() => {
    // Within a group the options are OR'd; across groups they are AND'd.
    // An empty group means "no constraint".
    return trips.filter((trip) => {
      if (durations.length && !durations.includes(trip.durationBand)) return false;
      if (groupTypes.length && !groupTypes.includes(trip.groupType)) return false;

      if (priceBands.length) {
        const inBand = PRICE_OPTIONS.filter((band) => priceBands.includes(band.id)).some(
          (band) => trip.priceValue >= band.min && trip.priceValue < band.max,
        );
        if (!inBand) return false;
      }

      return true;
    });
  }, [trips, durations, priceBands, groupTypes]);

  const clearAll = () => {
    setDurations([]);
    setPriceBands([]);
    setGroupTypes([]);
  };

  return (
    <>
      <div className="mt-8 rounded-[28px] border border-[#6DA003]/15 bg-white p-4 shadow-[0_10px_30px_rgba(109,160,3,0.06)]">
        <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
          <FilterGroup
            label="Duration"
            options={DURATION_OPTIONS}
            selected={durations}
            onToggle={(id) => setDurations((prev) => toggle(prev, id))}
          />
          <FilterGroup
            label="Price"
            options={PRICE_OPTIONS.map(({ id, label }) => ({ id, label }))}
            selected={priceBands}
            onToggle={(id) => setPriceBands((prev) => toggle(prev, id))}
          />
          <FilterGroup
            label="Group type"
            options={GROUP_OPTIONS}
            selected={groupTypes}
            onToggle={(id) => setGroupTypes((prev) => toggle(prev, id))}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#6DA003]/10 pt-4">
          <p aria-live="polite" className="text-sm text-[#555555]">
            Showing <span className="font-semibold text-[#111111]">{filtered.length}</span> of{" "}
            {trips.length} trips
          </p>
          {activeCount > 0 ? (
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full border border-[#6DA003]/30 px-4 py-1.5 text-sm text-[#6DA003] transition-all hover:bg-[#6DA003] hover:text-white cursor-pointer"
            >
              Clear filters ({activeCount})
            </button>
          ) : null}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((trip) => (
            <article
              key={trip.slug}
              className="flex h-full flex-col overflow-hidden rounded-[32px] border border-[#6DA003]/20 bg-white shadow-[0_12px_40px_rgba(109,160,3,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(109,160,3,0.14)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={trip.image}
                  alt={trip.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-[#6DA003]">
                  <span className="rounded-full border border-[#6DA003]/20 px-3 py-1">
                    {trip.durationText}
                  </span>
                  <span className="rounded-full border border-[#6DA003]/20 px-3 py-1">
                    {trip.groupType}
                  </span>
                </div>
                <p className="text-sm leading-6 text-[#555555]">{trip.pillText}</p>
                <h3 className="mt-3 text-[18px] font-semibold leading-7 text-[#111111]">
                  {trip.title}
                </h3>
                <div className="mt-4 flex items-center gap-2">
                  <span className="rounded-md bg-[#6DA003] px-2 py-0.5 text-[12px] font-bold text-white">
                    {trip.rating}
                  </span>
                  <span className="text-[12px] font-medium text-[#6DA003]">{trip.reviews}</span>
                </div>
                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.24em] text-[#666666]">From</p>
                    <p className="text-2xl font-semibold text-[#111111]">{trip.price}</p>
                    <p className="text-[12px] text-[#666666]">/ per person</p>
                  </div>
                  <Link
                    href={`/trips/${trip.slug}`}
                    className="inline-flex rounded-full border border-[#6DA003] px-4 py-2 text-sm font-semibold text-[#6DA003] transition-all hover:bg-[#6DA003] hover:text-white"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[32px] border border-dashed border-[#6DA003]/30 bg-white px-6 py-14 text-center">
          <h3 className="font-serif text-2xl text-[#111111]">No trips match those filters</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#666666]">
            Try widening your dates or budget — or talk to us and we&apos;ll put together
            something that fits.
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-6 rounded-full bg-[#6DA003] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-[#5B8703] cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
