"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  budgetRooms,
  premiumRooms,
  formatINR,
  type Room,
  type RoomTier,
} from "@/lib/data/rooms";

if (typeof window !== "undefined") {
  gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);
}

type Tab = RoomTier;

/* ─────────────────────────────────────────────
   Card Component
───────────────────────────────────────────── */
function RoomCard({
  room,
  isActive,
}: {
  room: Room;
  isActive: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: "32px",
        border: "2px solid #6DA003",
        background: "#ffffff",
        overflow: "hidden",
        width: "100%",
        height: "auto",
        minHeight: "380px",
        display: "flex",
        flexDirection: "column",
        boxShadow: isActive
          ? "0 24px 60px rgba(0,0,0,0.18)"
          : "0 12px 32px rgba(0,0,0,0.10)",
        transition: "box-shadow 0.25s ease",
      }}
      className="p-3"
    >
      {/* Image */}
      <div className="relative w-full" style={{ height: "200px", flexShrink: 0 }}>
        <Image
          src={room.image}
          alt={room.title}
          fill
          sizes="(max-width: 640px) 80vw, 380px"
          className="object-cover"
          style={{ borderRadius: "24px" }}
        />
      </div>

      {/* Text */}
      <div className="flex flex-col px-3 pt-6 pb-2" style={{ flex: 1, overflow: "hidden" }}>
        <h3 className="text-[1.3rem] sm:text-[1.4rem] font-bold text-gray-600 mb-2 leading-snug text-center"
          style={{ flexShrink: 0 }}
        >
          {room.title}
        </h3>
        <p
          className="text-[0.75rem] text-gray-400 leading-relaxed text-center"
          style={{
            flex: 1,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {room.description}
        </p>

        {/* Price + occupancy */}
        <div
          className="mt-3 flex items-center justify-between gap-2 border-t border-[#6DA003]/15 pt-3"
          style={{ flexShrink: 0 }}
        >
          <div className="text-left">
            <span className="text-[1.05rem] font-bold leading-none text-[#111111]">
              {formatINR(room.pricePerNight)}
            </span>
            <span className="ml-1 text-[0.65rem] text-gray-400">/ per night</span>
          </div>
          <span className="shrink-0 rounded-full border border-[#6DA003]/30 bg-[#6DA003]/5 px-2.5 py-1 text-[0.65rem] font-semibold text-[#6DA003]">
            Sleeps {room.maxGuests}
          </span>
        </div>

        <Link
          href={`/rooms/booking?room=${room.slug}`}
          // The card wrapper owns a click handler that rotates the carousel —
          // don't let a deliberate CTA click also spin the arc.
          onClick={(e) => e.stopPropagation()}
          className="mt-4 block w-full rounded-full py-2.5 text-center text-sm font-semibold tracking-wide transition-all duration-300 shadow-sm bg-transparent text-[#6DA003] border-2 border-[#6DA003] hover:bg-[#6DA003] hover:text-white cursor-pointer"
          style={{ flexShrink: 0 }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Carousel with Arc MotionPath
───────────────────────────────────────────── */
function RoomCarousel({ rooms }: { rooms: Room[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState(0);
  const animating = useRef(false);
  const n = rooms.length;
  const timelines = useRef<gsap.core.Timeline[]>([]);
  const hasAnimatedIn = useRef(false);

  useEffect(() => {
    timelines.current = [];
    hasAnimatedIn.current = false;
  }, [rooms]);

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".room-arc-card");
    
    if (timelines.current.length === 0) {
      cards.forEach((card) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(card, {
          motionPath: {
            path: "#arc-path",
            align: "#arc-path",
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
          },
          duration: 1,
          ease: "none"
        });
        timelines.current.push(tl);
      });
    }

    cards.forEach((card, idx) => {
      let diff = idx - center;
      if (diff > n / 2) diff -= n;
      if (diff < -n / 2) diff += n;
      
      const targetProgress = 0.5 + diff * 0.265; // approx 440px spacing (320px width + 120px gap)
      
      const tl = timelines.current[idx];
      if (!tl) return;

      if (!hasAnimatedIn.current) {
        // Scroll entrance animation
        gsap.fromTo(tl, { progress: 0 }, {
          progress: targetProgress,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        });
        gsap.fromTo(card, { opacity: 0, scale: 0.5 }, {
          opacity: Math.abs(diff) > 1 ? 0 : 1,
          scale: Math.abs(diff) > 0 ? 0.92 : 1,
          zIndex: Math.abs(diff) === 0 ? 10 : 5,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        });
      } else {
        // Carousel navigation animation
        const currentProgress = tl.progress();
        if (Math.abs(targetProgress - currentProgress) > 0.4) {
           tl.progress(targetProgress);
        } else {
           gsap.to(tl, { progress: targetProgress, duration: 0.6, ease: "power2.out" });
        }
        
        gsap.to(card, {
          opacity: Math.abs(diff) > 1 ? 0 : 1,
          scale: Math.abs(diff) > 0 ? 0.92 : 1,
          zIndex: Math.abs(diff) === 0 ? 10 : 5,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    });

    if (!hasAnimatedIn.current) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 80%",
        onEnter: () => {
          setTimeout(() => { hasAnimatedIn.current = true; }, 1500);
        }
      });
    }

  }, { dependencies: [center, rooms], scope: containerRef });

  const navigate = useCallback((dir: "left" | "right") => {
    if (animating.current || !hasAnimatedIn.current) return;
    animating.current = true;
    setCenter((c) => dir === "left" ? (c + 1) % n : (c - 1 + n) % n);
    setTimeout(() => { animating.current = false; }, 600);
  }, [n]);

  useEffect(() => {
    const interval = setInterval(() => {
      navigate("left");
    }, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div ref={containerRef} className="relative w-full h-[480px] sm:h-[600px] flex items-center justify-center overflow-hidden sm:overflow-visible">
      {/* SVG Path for MotionPath */}
      <svg className="absolute w-full h-[600px] pointer-events-none invisible" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid meet">
        <path id="arc-path" d="M 0 372 Q 600 228 1200 372" fill="none" stroke="black" />
      </svg>

      {/* Cards */}
      {rooms.map((room, idx) => {
        let diff = idx - center;
        if (diff > n / 2) diff -= n;
        if (diff < -n / 2) diff += n;
        // Cards past ±1 are animated to opacity 0 but still sit on the arc — without
        // this they would swallow clicks meant for the visible cards underneath.
        const isVisible = Math.abs(diff) <= 1;

        return (
          <div
            key={room.id}
            className={`room-arc-card absolute top-0 left-0 w-[280px] sm:w-[320px] origin-center cursor-pointer ${
              isVisible ? "" : "pointer-events-none"
            }`}
            aria-hidden={!isVisible}
            onClick={() => {
              if (diff === 1) navigate("right");
              if (diff === -1) navigate("left");
            }}
          >
            <RoomCard room={room} isActive={idx === center} />
          </div>
        );
      })}

      {/* Navigation Buttons */}
      <div className="absolute top-[60%] -translate-y-1/2 left-0 sm:-left-4 z-20">
            <button
              onClick={() => navigate("right")}
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#6DA003] text-[#6DA003] transition-all duration-300 hover:bg-[#6DA003] hover:text-white hover:scale-110 shadow-md bg-[#E1E1E1]"
          aria-label="Previous room"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="absolute top-[60%] -translate-y-1/2 right-0 sm:-right-4 z-20">
            <button
              onClick={() => navigate("left")}
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#6DA003] text-[#6DA003] transition-all duration-300 hover:bg-[#6DA003] hover:text-white hover:scale-110 shadow-md bg-[#E1E1E1]"
          aria-label="Next room"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Section
───────────────────────────────────────────── */
const Rooms = () => {
  const [activeTab, setActiveTab] = useState<Tab>("budget");

  return (
    <section
      id="rooms"
      className="relative w-full min-h-screen py-20 pb-[220px] sm:pb-[180px] lg:pb-20 bg-[#E1E1E1] overflow-hidden"
    >
      <div
        className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-16 w-80 h-80 rounded-full"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        {/* ── Header ── */}
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="block h-px w-16 md:w-32 bg-[#6DA003]" />
            <h2 className="text-4xl sm:text-5xl lg:text-[3.4rem] leading-tight tracking-tight text-gray-900 font-serif">
              Check Our <span className="text-[#6DA003]">{activeTab === "budget" ? "Budget" : "Premium"} Rooms</span>
            </h2>
            <span className="block h-px w-16 md:w-32 bg-[#6DA003]" />
          </div>
          <Link href="/rooms" className="text-sm font-semibold text-[#6DA003] transition-colors hover:text-[#5B8703]">
            See all rooms →
          </Link>
        </div>

        {/* ── Tab Toggle ── */}
        <div className="flex justify-center relative z-20">
          <div
            className="relative flex rounded-full p-1"
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(10px)",
              border: "1.5px solid rgba(109,160,3,0.35)",
              boxShadow: "0 4px 20px rgba(109,160,3,0.12)",
            }}
          >
            {(["budget", "premium"] as Tab[]).map((tab) => (
              <button
                key={tab}
                id={`rooms-tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`
                  relative z-10 px-8 py-2.5 rounded-full text-sm font-semibold tracking-wide capitalize
                  transition-all duration-300 cursor-pointer
                  ${activeTab === tab
                    ? "bg-[#6DA003] text-white shadow-md"
                    : "text-[#6DA003] hover:bg-[#6DA003]/10"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Carousel ── */}
        <div key={activeTab} >
          <RoomCarousel rooms={activeTab === "budget" ? budgetRooms : premiumRooms} />
        </div>
      </div>
    </section>
  );
};

export default Rooms;