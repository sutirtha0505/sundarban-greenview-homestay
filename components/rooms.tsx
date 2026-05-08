"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Gloock } from "next/font/google";

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

function RoomCard({
  room,
  slot,
  onSelect,
}: {
  room: Room;
  slot: "left" | "center" | "right";
  animKey: number;
  onSelect?: () => void;
}) {
  const isCenter = slot === "center";
  const [hovered, setHovered] = useState(false);

  const isActive = isCenter || hovered;

  const animationName =
    slot === "left"
      ? "appearFromLeft"
      : slot === "right"
        ? "appearFromRight"
        : "appearCenter";

  const bendTransform = isCenter
    ? "rotate(0deg) scale(1)"
    : slot === "left"
      ? "rotate(-5deg) scale(0.92)"
      : "rotate(5deg) scale(0.92)";

  return (
    <div
      onClick={!isCenter ? onSelect : undefined}
      onMouseEnter={() => !isCenter && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: "20px",
        border: isActive ? "2px solid #6DA003" : "1.5px solid rgba(109,160,3,0.35)",
        background: "#ffffff",
        overflow: "hidden",
        width: "100%",
        height: "480px",
        display: "flex",
        flexDirection: "column",
        transformOrigin: "bottom center",
        transform: bendTransform,
        opacity: isActive ? 1 : 0.82,
        boxShadow: isActive
          ? "0 24px 60px rgba(0,0,0,0.18)"
          : "0 12px 32px rgba(0,0,0,0.10)",
        cursor: !isCenter ? "pointer" : "default",
        transition: "border 0.25s ease, opacity 0.25s ease, box-shadow 0.25s ease",
        animation: `${animationName} 0.5s cubic-bezier(0.25,0.46,0.45,0.94) both`,
      }}
    >
      {/* Image */}
      <div className="relative w-full" style={{ height: "220px", flexShrink: 0 }}>
        <Image
          src={room.image}
          alt={room.title}
          fill
          sizes="(max-width: 640px) 80vw, 380px"
          className="object-cover"
          style={{ borderRadius: "18px 18px 0 0" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.22) 0%, transparent 50%)",
            borderRadius: "18px 18px 0 0",
          }}
        />
      </div>

      {/* Text */}
      <div className="flex flex-col px-5 pt-4 pb-5" style={{ flex: 1, overflow: "hidden" }}>
        <h3
          className={`text-[1.25rem] sm:text-[1.35rem] font-bold text-gray-900 mb-2 leading-snug ${gloock.className}`}
          style={{ flexShrink: 0 }}
        >
          {room.title}
        </h3>
        <p
          className="text-[0.82rem] text-gray-500 leading-relaxed"
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
          className="mt-4 w-full rounded-full py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 shadow-md"
          style={{
            flexShrink: 0,
            background: isActive ? "#6DA003" : "transparent",
            color: isActive ? "#ffffff" : "#6DA003",
            border: "2px solid #6DA003",
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Carousel
───────────────────────────────────────────── */
function RoomCarousel({ rooms }: { rooms: Room[] }) {
  const [center, setCenter] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const animating = useRef(false);
  const n = rooms.length;

  const navigate = (dir: "left" | "right") => {
    if (animating.current) return;
    animating.current = true;

    setCenter((c) =>
      dir === "left" ? (c + 1) % n : (c - 1 + n) % n
    );
    setAnimKey((k) => k + 1);

    setTimeout(() => {
      animating.current = false;
    }, 520);
  };

  const leftIdx = (center - 1 + n) % n;
  const rightIdx = (center + 1) % n;

  return (
    <div className="flex items-center gap-3 sm:gap-5 w-full">
      {/* ← Arrow */}
      <button
        onClick={() => navigate("right")}
        className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#6DA003] text-[#6DA003] transition-all duration-300 hover:bg-[#6DA003] hover:text-white hover:scale-110 shadow-sm"
        aria-label="Previous room"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Cards grid */}
      <div className="flex-1 grid grid-cols-3 gap-3 sm:gap-5 items-end">

        {/* Left card — click brings it to center via navigate("right") */}
        <div className="flex justify-end">
          <div className="w-full max-w-[340px]">
            <RoomCard
              key={`left-${animKey}`}
              room={rooms[leftIdx]}
              slot="left"
              animKey={animKey}
              onSelect={() => navigate("right")}
            />
          </div>
        </div>

        {/* Center card */}
        <div className="flex justify-center">
          <div className="w-full max-w-[380px]">
            <RoomCard
              key={`center-${animKey}`}
              room={rooms[center]}
              slot="center"
              animKey={animKey}
            />
          </div>
        </div>

        {/* Right card — click brings it to center via navigate("left") */}
        <div className="flex justify-start">
          <div className="w-full max-w-[340px]">
            <RoomCard
              key={`right-${animKey}`}
              room={rooms[rightIdx]}
              slot="right"
              animKey={animKey}
              onSelect={() => navigate("left")}
            />
          </div>
        </div>

      </div>

      {/* → Arrow */}
      <button
        onClick={() => navigate("left")}
        className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#6DA003] text-[#6DA003] transition-all duration-300 hover:bg-[#6DA003] hover:text-white hover:scale-110 shadow-sm"
        aria-label="Next room"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
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
      className="relative w-full py-20 overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #f0f4e8 0%, #e8ede0 60%, #dde5d0 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #6DA003 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-16 w-80 h-80 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #3a6b00 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8">
        {/* ── Header ── */}
        <div className="flex justify-between items-center text-center mb-10">
          <span className="block h-px w-64 bg-[#6DA003]" />

          {/* <div className="flex items-center gap-4 mb-3">
            <span className="block h-px w-16 bg-[#6DA003]/50" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[#6DA003]">
              Accommodation
            </span>
            <span className="block h-px w-16 bg-[#6DA003]/50" />
          </div> */}

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

          {/* <p className="mt-4 max-w-xl text-gray-500 text-sm sm:text-base leading-relaxed">
            {activeTab === "budget"
              ? "Affordable comfort in the heart of the Sundarbans — great value stays that don't compromise on the experience."
              : "Indulge in our finest rooms crafted for discerning travellers seeking an elevated Sundarban retreat."}
          </p> */}

        </div>
        {/* ── Tab Toggle ── */}
        <div className="flex justify-center mb-12">
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
                  transition-all duration-300
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
        <div
          key={activeTab}
          style={{ animation: "fadeSlideIn 0.4s ease forwards" }}
        >
          <RoomCarousel rooms={activeTab === "budget" ? budgetRooms : premiumRooms} />
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes appearFromLeft {
          from { opacity: 0; transform: rotate(-5deg) scale(0.92) translateX(-80px); }
          to   { opacity: 0.82; transform: rotate(-5deg) scale(0.92) translateX(0); }
        }
        @keyframes appearFromRight {
          from { opacity: 0; transform: rotate(5deg) scale(0.92) translateX(80px); }
          to   { opacity: 0.82; transform: rotate(5deg) scale(0.92) translateX(0); }
        }
        @keyframes appearCenter {
          from { opacity: 0; transform: rotate(0deg) scale(0.96) translateY(20px); }
          to   { opacity: 1; transform: rotate(0deg) scale(1) translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Rooms;