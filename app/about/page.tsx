import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Open_Sans, Playfair_Display } from "next/font/google";
import type { Metadata } from "next";
import { getStorageImageUrl } from "@/lib/supabase/storage";

export const metadata: Metadata = {
  title: "About Us | Sundarban Greenview Homestay",
  description:
    "Learn about Sundarban Greenview Homestay — a family-run retreat nestled in the heart of the Sundarbans, offering authentic hospitality, jungle safaris, and a deep connection with nature.",
};

const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const stats = [
  { value: "500+", label: "Happy Guests" },
  { value: "10+", label: "Years of Hospitality" },
  { value: "15+", label: "Curated Experiences" },
  { value: "4.9★", label: "Average Rating" },
];

const values = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current fill-none stroke-[1.6]">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Authentic Hospitality",
    desc: "We treat every guest like family — with home-cooked meals, genuine warmth, and personal care that no hotel can replicate.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current fill-none stroke-[1.6]">
        <path d="M3 17l4-8 4 4 4-6 4 10" />
        <path d="M3 20h18" />
      </svg>
    ),
    title: "Nature First",
    desc: "Our ethos is rooted in the wild. We partner with certified guides and follow responsible tourism practices to protect the Sundarbans.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current fill-none stroke-[1.6]">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 1 0 7.75" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Community Rooted",
    desc: "We source food locally, employ village guides, and channel proceeds back into the community — travel that gives back.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current fill-none stroke-[1.6]">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Safe & Comfortable",
    desc: "From well-maintained rooms to trained first-responders, your safety is our quiet promise throughout every journey.",
  },
];

const timeline = [
  {
    year: "2013",
    title: "The Dream Begins",
    desc: "The Mondal family converted their riverside home into a small guesthouse, welcoming the first visitors to explore the delta.",
  },
  {
    year: "2016",
    title: "Expanding Horizons",
    desc: "Partnered with licensed forest guides to launch curated jungle safari packages — the first in the local area.",
  },
  {
    year: "2019",
    title: "Award-Winning Hospitality",
    desc: "Recognised by the West Bengal Tourism Board for excellence in eco-tourism and community-led travel experiences.",
  },
  {
    year: "2023",
    title: "A New Chapter",
    desc: "Renovated our premium rooms, added bird-watching decks, and launched the online booking platform you&apos;re using today.",
  },
];

export default function AboutPage() {
  return (
    <main
      className={`${openSans.variable} ${playfair.variable} relative min-h-screen overflow-x-hidden bg-[#FAFAFA] text-[#111111]`}
    >
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[90vh] items-end overflow-hidden">
        {/* Background image mosaic */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          <div className="relative overflow-hidden">
            <Image
              src={getStorageImageUrl("/images/gallery/image3.jpg")}
              alt="Sundarban river view"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
          </div>
          <div className="relative overflow-hidden">
            <Image
              src={getStorageImageUrl("/images/gallery/image7.jpg")}
              alt="Mangrove forest"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
          </div>
          <div className="relative overflow-hidden">
            <Image
              src={getStorageImageUrl("/images/gallery/image5.jpg")}
              alt="Sundarban wildlife"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="relative overflow-hidden">
            <Image
              src={getStorageImageUrl("/images/gallery/image14.jpg")}
              alt="Homestay exterior"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[#0C0000]/90 via-[#0C0000]/40 to-transparent" />

        {/* Hero text */}
        <div className="relative z-10 w-full px-6 pb-16 sm:px-10 lg:px-20 lg:pb-24">
          <p
            className={`${openSans.className} text-[11px] uppercase tracking-[0.36em] text-[#6DA003]`}
          >
            Our story
          </p>
          <h1
            className={`${playfair.className} mt-3 max-w-3xl font-serif text-[48px] leading-[1.08] text-white sm:text-[64px] lg:text-[80px]`}
          >
            Where the jungle meets{" "}
            <span className="text-[#C5FE4E]">home.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-[1.75] text-white/75">
            Sundarban Greenview Homestay is more than a place to sleep — it&apos;s a gateway into one of
            the world&apos;s last great wildernesses, run by a family who has called this delta home for
            generations.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/booking"
              className="rounded-full bg-[#6DA003] px-8 py-3 font-semibold text-white transition-all hover:bg-[#5a8a02] hover:shadow-[0_0_24px_rgba(109,160,3,0.5)]"
            >
              Book a Stay
            </Link>
            <Link
              href="/#about"
              className="rounded-full border border-white/30 px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:border-white/70 hover:bg-white/10"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="relative z-10 -mt-1 bg-white px-6 py-12 shadow-[0_8px_40px_rgba(0,0,0,0.06)] sm:px-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p
                className={`${playfair.className} font-serif text-[40px] leading-none text-[#6DA003]`}
              >
                {s.value}
              </p>
              <p className="mt-2 text-[13px] text-[#858585]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── STORY SECTION ─── */}
      <section className="mx-auto max-w-[1180px] px-6 py-20 sm:px-10 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: image stack */}
          <div className="relative h-[480px] sm:h-[580px]">
            <div className="absolute left-0 top-0 h-[88%] w-[72%] overflow-hidden rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
              <Image
                src={getStorageImageUrl("/images/gallery/image2.jpg")}
                alt="Family at Greenview Homestay"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 h-[55%] w-[56%] overflow-hidden rounded-[24px] border-4 border-[#FAFAFA] shadow-[0_16px_48px_rgba(0,0,0,0.18)]">
              <Image
                src={getStorageImageUrl("/images/gallery/image6.jpg")}
                alt="Riverside view"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute bottom-[44%] left-[64%] z-10 flex flex-col items-center rounded-[18px] bg-[#6DA003] px-5 py-4 text-white shadow-xl">
              <span className={`${playfair.className} font-serif text-[28px] leading-none`}>10+</span>
              <span className="mt-1 text-[11px] uppercase tracking-widest">Years</span>
            </div>
          </div>

          {/* Right: text */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.36em] text-[#6DA003]">Who we are</p>
            <h2
              className={`${playfair.className} mt-4 font-serif text-[40px] leading-[1.12] text-[#0C0000] sm:text-[48px]`}
            >
              A family home on the edge of the{" "}
              <span className="text-[#6DA003]">Sundarbans</span>
            </h2>
            <p className="mt-6 text-[15px] leading-[1.8] text-[#555555]">
              The Mondal family has lived beside the Matla river for three generations. When the idea
              of sharing this extraordinary corner of the world with travellers took hold, Sundarban
              Greenview Homestay was born — not as a business, but as an extension of home.
            </p>
            <p className="mt-4 text-[15px] leading-[1.8] text-[#555555]">
              Every meal is cooked by family members. Every safari is led by a guide who grew up
              reading the forest. Every guest is welcomed at the door. The Sundarbans is one of the
              most biodiverse places on earth — we believe that experiencing it should feel personal,
              not packaged.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#6DA003]/20" />
              <span className="text-[12px] uppercase tracking-[0.28em] text-[#858585]">
                Est. 2013 · Gosaba, West Bengal
              </span>
              <div className="h-px flex-1 bg-[#6DA003]/20" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── IMMERSIVE IMAGE STRIP ─── */}
      <section className="overflow-hidden">
        <div className="flex h-[300px] sm:h-[400px]">
          {[
            getStorageImageUrl("/images/gallery/image1.jpg"),
            getStorageImageUrl("/images/gallery/image4.jpg"),
            getStorageImageUrl("/images/gallery/image8.jpg"),
            getStorageImageUrl("/images/gallery/image13.jpg"),
            getStorageImageUrl("/images/gallery/image19.jpg"),
          ].map((src, i) => (
            <div key={i} className="relative flex-1 overflow-hidden">
              <Image
                src={src}
                alt={`Sundarban scene ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#0C0000]/20 transition-opacity duration-300 hover:opacity-0" />
            </div>
          ))}
        </div>
      </section>

      {/* ─── OUR VALUES ─── */}
      <section className="bg-[#111111] px-6 py-20 sm:px-10 lg:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.36em] text-[#6DA003]">What we stand for</p>
            <h2
              className={`${playfair.className} mt-4 font-serif text-[40px] leading-[1.12] text-white sm:text-[48px]`}
            >
              Our values
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="group rounded-[24px] border border-white/8 bg-white/5 p-7 transition-all duration-300 hover:border-[#6DA003]/50 hover:bg-white/10"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#6DA003]/15 text-[#6DA003] transition-colors group-hover:bg-[#6DA003]/30">
                  {v.icon}
                </div>
                <h3 className="text-[17px] font-semibold text-white">{v.title}</h3>
                <p className="mt-3 text-[13px] leading-[1.75] text-white/60">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OUR JOURNEY ─── */}
      <section className="relative overflow-hidden bg-[#FAFAFA] px-4 py-20 sm:px-6 lg:py-28">
        {/* Subtle background watermark */}
        <div
          aria-hidden
          className={`${playfair.className} pointer-events-none absolute -right-8 top-1/2 hidden -translate-y-1/2 select-none text-[220px] font-bold leading-none text-[#6DA003]/5 lg:block`}
        >
          2013–
        </div>

        <div className="mx-auto max-w-[1100px]">
          {/* Heading */}
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.36em] text-[#6DA003]">Our journey</p>
            <h2
              className={`${playfair.className} mt-4 font-serif text-[40px] leading-[1.1] text-[#0C0000] sm:text-[52px]`}
            >
              A decade in the delta
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[14px] leading-[1.8] text-[#858585]">
              From a single family guesthouse to an award-winning eco-retreat — here&apos;s how we
              grew alongside the Sundarbans.
            </p>
          </div>

          {/* ── MOBILE / TABLET: left-rail road ── */}
          <div className="relative mt-14 lg:hidden">
            {/* Rail line */}
            <div className="absolute left-[22px] top-0 h-full w-[2px] bg-linear-to-b from-[#6DA003]/60 via-[#6DA003]/30 to-transparent" />

            <div className="flex flex-col gap-0">
              {timeline.map((item, i) => (
                <div key={item.year} className="relative flex gap-6 pb-12 last:pb-0">
                  {/* Node */}
                  <div className="relative z-10 shrink-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6DA003] shadow-[0_0_0_4px_rgba(109,160,3,0.18)] shadow-[#6DA003]/30">
                      <span className="text-[13px] font-bold text-white">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                  </div>

                  {/* Card */}
                  <div className="group relative flex-1 overflow-hidden rounded-[20px] border border-[#6DA003]/12 bg-white p-6 shadow-[0_6px_24px_rgba(109,160,3,0.07)] transition-all duration-300 hover:shadow-[0_10px_36px_rgba(109,160,3,0.14)]">
                    {/* Year watermark */}
                    <span
                      aria-hidden
                      className={`${playfair.className} pointer-events-none absolute -right-3 -top-4 select-none text-[72px] font-bold leading-none text-[#6DA003]/8 transition-all duration-300 group-hover:text-[#6DA003]/14`}
                    >
                      {item.year}
                    </span>

                    {/* Year pill */}
                    <span className="inline-flex items-center rounded-full bg-[#6DA003]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6DA003]">
                      {item.year}
                    </span>
                    <h3 className="mt-3 text-[18px] font-semibold leading-snug text-[#111111]">
                      {item.title}
                    </h3>
                    <p
                      className="mt-2 text-[13px] leading-[1.75] text-[#666666]"
                      dangerouslySetInnerHTML={{ __html: item.desc }}
                    />

                    {/* Bottom accent bar */}
                    <div className="mt-5 h-px w-10 rounded-full bg-[#6DA003]/40 transition-all duration-300 group-hover:w-full group-hover:bg-[#6DA003]/20" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── DESKTOP: centred two-column spine ── */}
          <div className="relative mt-20 hidden lg:block">
            {/* Spine */}
            <div className="absolute left-1/2 top-4 h-[calc(100%-2rem)] w-[2px] -translate-x-1/2 bg-linear-to-b from-[#6DA003]/50 via-[#6DA003]/20 to-transparent" />

            <div className="flex flex-col">
              {timeline.map((item, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <div
                    key={item.year}
                    className={`group relative mb-14 flex last:mb-0 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
                  >
                    {/* Card — 46% wide */}
                    <div
                      className={`relative w-[46%] overflow-hidden rounded-[24px] border border-[#6DA003]/12 bg-white p-8 shadow-[0_8px_32px_rgba(109,160,3,0.06)] transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(109,160,3,0.13)] ${
                        isLeft ? "mr-auto" : "ml-auto"
                      }`}
                    >
                      {/* Giant year watermark */}
                      <span
                        aria-hidden
                        className={`${playfair.className} pointer-events-none absolute ${
                          isLeft ? "-right-4" : "-left-4"
                        } -top-5 select-none text-[100px] font-bold leading-none text-[#6DA003]/8 transition-all duration-300 group-hover:text-[#6DA003]/13`}
                      >
                        {item.year}
                      </span>

                      {/* Year pill */}
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6DA003]/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6DA003]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#6DA003]" />
                        {item.year}
                      </span>

                      <h3 className="mt-4 text-[22px] font-semibold leading-snug text-[#111111]">
                        {item.title}
                      </h3>
                      <p
                        className="mt-3 text-[14px] leading-[1.8] text-[#666666]"
                        dangerouslySetInnerHTML={{ __html: item.desc }}
                      />

                      {/* Animated bottom bar */}
                      <div className="mt-6 h-[2px] w-10 rounded-full bg-[#6DA003] transition-all duration-500 group-hover:w-3/4" />
                    </div>

                    {/* Centre connector: dot + horizontal bridge line */}
                    <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                      {/* Step number badge */}
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#6DA003] bg-white shadow-[0_0_0_5px_rgba(109,160,3,0.12)] transition-all duration-300 group-hover:bg-[#6DA003] group-hover:shadow-[0_0_0_6px_rgba(109,160,3,0.22)]">
                        <span className="text-[12px] font-bold text-[#6DA003] transition-colors duration-300 group-hover:text-white">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {/* Spacer on the other side */}
                    <div className="w-[46%]" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PHOTO FEATURE ─── */}
      <section className="mx-auto max-w-[1180px] px-6 pb-20 sm:px-10">
        <div className="overflow-hidden rounded-[32px]">
          <div className="grid gap-[4px] lg:grid-cols-[1.4fr_1fr]">
            {/* Large image */}
            <div className="relative h-[380px] overflow-hidden lg:h-auto">
              <Image
                src={getStorageImageUrl("/images/gallery/image11.jpg")}
                alt="Sundarban boat safari"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            {/* Right column */}
            <div className="grid grid-rows-2 gap-[4px]">
              <div className="relative h-[200px] overflow-hidden lg:h-auto">
                <Image
                  src={getStorageImageUrl("/images/gallery/image9.jpg")}
                  alt="Sundarban birds"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="flex flex-col items-start justify-center bg-[#6DA003] p-8">
                <p className={`${playfair.className} font-serif text-[28px] leading-[1.2] text-white`}>
                  &ldquo;The most beautiful place I have ever stayed.&rdquo;
                </p>
                <p className="mt-4 text-[13px] text-white/75">— Priya S., Mumbai · March 2025</p>
                <Link
                  href="/#reviews"
                  className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-white underline-offset-4 hover:underline"
                >
                  Read all reviews →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative overflow-hidden bg-[#FAFAFA] px-6 pb-28 pt-4 sm:px-10">
        <div className="mx-auto max-w-[760px] overflow-hidden rounded-[32px] bg-[#111111] px-8 py-14 text-center shadow-[0_20px_60px_rgba(17,17,17,0.2)] sm:px-14">
          {/* Glow */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6DA003] opacity-10 blur-[80px]" />

          <p className="text-[11px] uppercase tracking-[0.36em] text-[#6DA003]">
            Ready to experience it?
          </p>
          <h2
            className={`${playfair.className} relative mt-4 font-serif text-[36px] leading-[1.12] text-white sm:text-[44px]`}
          >
            Your Sundarban adventure awaits
          </h2>
          <p className="relative mt-5 text-[14px] leading-[1.8] text-white/60">
            Whether it&apos;s a weekend escape or a week-long jungle expedition, we&apos;ll make sure
            every moment feels extraordinary.
          </p>
          <div className="relative mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/booking"
              className="w-full rounded-full bg-[#6DA003] px-10 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-[#5a8a02] hover:shadow-[0_0_32px_rgba(109,160,3,0.55)] sm:w-auto"
            >
              Book Your Stay
            </Link>
            <Link
              href="/trips"
              className="w-full rounded-full border border-white/20 px-10 py-3.5 text-[15px] font-semibold text-white transition-all hover:border-white/50 hover:bg-white/10 sm:w-auto"
            >
              Explore Trips
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
