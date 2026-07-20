import Link from "next/link";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import { tripsData } from "@/lib/data/trips";

const filters = [
  {
    label: "Duration",
    options: ["1N", "2N", "3N+"],
  },
  {
    label: "Price",
    options: ["Under ₹5k", "₹5k-₹7k", "₹7k+"],
  },
  {
    label: "Group type",
    options: ["Group", "Private"],
  },
];

export default function TripsIndexPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-28 text-[#111111]">
      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading first="Book your" second="Trips" />
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm leading-6 text-[#666666] md:text-base">
            Choose the Sundarbans escape that fits your pace, your group, and your budget.
          </p>

          <div className="mt-8 grid gap-4 rounded-[28px] border border-[#6DA003]/15 bg-white p-4 shadow-[0_10px_30px_rgba(109,160,3,0.06)] lg:grid-cols-3 lg:items-end">
            {filters.map((filter) => (
              <div key={filter.label} className="flex flex-col gap-2">
                <span className="text-[11px] uppercase tracking-[0.28em] text-[#6DA003]">{filter.label}</span>
                <div className="flex flex-wrap gap-2">
                  {filter.options.map((option, index) => (
                    <button
                      key={option}
                      className={`rounded-full border px-4 py-2 text-sm transition-all ${index === 0 ? "border-[#6DA003] bg-[#6DA003] text-white" : "border-[#6DA003]/20 bg-[#FAFAFA] text-[#444444] hover:border-[#6DA003] hover:text-[#6DA003]"}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tripsData.map((trip) => (
              <article key={trip.slug} className="flex h-full flex-col overflow-hidden rounded-[32px] border border-[#6DA003]/20 bg-white shadow-[0_12px_40px_rgba(109,160,3,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(109,160,3,0.14)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={trip.image} alt={trip.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-[#6DA003]">
                    <span className="rounded-full border border-[#6DA003]/20 px-3 py-1">{trip.durationText}</span>
                    <span className="rounded-full border border-[#6DA003]/20 px-3 py-1">{trip.groupType}</span>
                  </div>
                  <p className="text-sm leading-6 text-[#555555]">{trip.pillText}</p>
                  <h3 className="mt-3 text-[18px] font-semibold leading-7 text-[#111111]">{trip.title}</h3>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="rounded-md bg-[#6DA003] px-2 py-0.5 text-[12px] font-bold text-white">{trip.rating}</span>
                    <span className="text-[12px] font-medium text-[#6DA003]">{trip.reviews}</span>
                  </div>
                  <div className="mt-6 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.24em] text-[#666666]">From</p>
                      <p className="text-2xl font-semibold text-[#111111]">{trip.price}</p>
                      <p className="text-[12px] text-[#666666]">/ per person</p>
                    </div>
                    <Link href={`/trips/${trip.slug}`} className="inline-flex rounded-full border border-[#6DA003] px-4 py-2 text-sm font-semibold text-[#6DA003] transition-all hover:bg-[#6DA003] hover:text-white">
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

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
                {tripsData.map((trip) => (
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