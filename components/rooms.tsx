"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Gloock } from "next/font/google";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);
}

const gloock = Gloock({ weight: "400", subsets: ["latin"] });

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const budgetRooms = [
  {
    id: "b1",
    title: "Budget Cozy Room",
    description:
      "A warm and intimate room tucked within the mangrove edge. Perfect for solo travellers or couples seeking peace and simplicity without sacrificing comfort.",
    image: "/images/rooms/image1.jpg",
  },
  {
    id: "b2",
    title: "Budget Standard Room",
    description:
      "Our most popular budget pick — spacious, clean, and thoughtfully arranged to give you a restful stay after a long day of Sundarbans exploration.",
    image: "/images/rooms/image5.jpg",
  },
  {
    id: "b3",
    title: "Budget Essential Room",
    description:
      "Everything you need, nothing you don't. A no-fuss, comfortable room designed for the modern eco-traveller who values experiences over extras.",
    image: "/images/rooms/image6.jpg",
  },
  {
    id: "b4",
    title: "Budget Garden View",
    description:
      "Wake up to lush greenery right outside your window. This budget gem offers a serene garden outlook at an unbeatable price.",
    image: "/images/rooms/image7.jpg",
  },
  {
    id: "b5",
    title: "Budget Twin Retreat",
    description:
      "Ideal for friends or family sharing — two comfortable beds, ample storage, and a relaxed atmosphere that feels like a home away from home.",
    image: "/images/rooms/image8.jpg",
  },
];

const premiumRooms = [
  {
    id: "p1",
    title: "Premium Jungle Suite",
    description:
      "Immerse yourself in the wild without sacrificing luxury. Floor-to-ceiling views, premium linens, and a private balcony overlooking the mangroves.",
    image: "/images/rooms/image2.jpg",
  },
  {
    id: "p2",
    title: "Premium River View",
    description:
      "Fall asleep to the soft sound of flowing water. This suite offers panoramic river vistas paired with elegant furnishings for a truly memorable stay.",
    image: "/images/rooms/image3.jpg",
  },
  {
    id: "p3",
    title: "Premium Heritage Room",
    description:
      "Inspired by the rich heritage of Bengal, this room blends traditional craftsmanship with modern comforts for a culturally immersive retreat.",
    image: "/images/rooms/image4.jpg",
  },
  {
    id: "p4",
    title: "Premium Canopy Loft",
    description:
      "Perched high with a bird's-eye perspective of the treetops — a unique loft experience that brings the forest to your doorstep.",
    image: "/images/rooms/image9.jpg",
  },
  {
    id: "p5",
    title: "Premium Honeymoon Suite",
    description:
      "A romantic haven crafted for two. Draped in warm hues, with a private jacuzzi and curated amenities that make every moment unforgettable.",
    image: "/images/rooms/image10.jpg",
  },
];

type Tab = "budget" | "premium";
type Room = (typeof budgetRooms)[0];

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
            <h3
              className="text-[1.3rem] sm:text-[1.4rem] font-bold text-gray-600 mb-2 leading-snug text-center"
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
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
          }}
        >
          {room.description}
        </p>

        <button
          className="mt-4 w-full rounded-full py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 shadow-sm bg-transparent text-[#6DA003] border-2 border-[#6DA003] hover:bg-[#6DA003] hover:text-white cursor-pointer"
          style={{ flexShrink: 0 }}
        >
          View Details
        </button>
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
      {rooms.map((room, idx) => (
        <div 
          key={room.id} 
          className="room-arc-card absolute top-0 left-0 w-[280px] sm:w-[320px] origin-center cursor-pointer" 
          onClick={() => {
            let diff = idx - center;
            if (diff > n / 2) diff -= n;
            if (diff < -n / 2) diff += n;
            if (diff === 1) navigate("right");
            if (diff === -1) navigate("left");
          }}
        >
          <RoomCard room={room} isActive={idx === center} />
        </div>
      ))}

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
        <div className="flex justify-between items-center text-center mb-10">
          <span className="block h-px w-64 bg-[#6DA003]" />

          <div className="flex justify-between items-center gap-4">
            <h2
              className={`text-4xl sm:text-5xl lg:text-[3.4rem] leading-tight tracking-tight text-gray-900 font-[glidaDisplay]`}
            >
              Check Our{" "}
              <span className="text-[#6DA003]">
                {activeTab === "budget" ? "Budget" : "Premium"} Rooms
              </span>
            </h2>
          </div>
          <span className="block h-px w-64 bg-[#6DA003]" />
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