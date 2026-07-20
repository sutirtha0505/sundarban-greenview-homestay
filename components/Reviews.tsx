"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import SectionHeading from "./SectionHeading";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);
}

type Review = {
  id: string;
  name: string;
  text: string;
  rating: number;
  image: string;
};

const reviewsData: Review[] = [
  {
    id: "r1",
    name: "Soumen Das",
    text: "Had an amazing stay at Sundarban Greenview Homestay. The rooms were clean, food was fresh and authentic, and the river view during sunrise was unreal. The staff members were very polite and helped us throughout the trip. The boat safari arrangement was also smooth and well managed.",
    rating: 5,
    image: "/images/reviews/image1.jpg"
  },
  {
    id: "r2",
    name: "Subhajit Sarkar",
    text: "Perfect place if you want peace away from city noise. I visited with my parents and they loved the hospitality. Homemade Bengali food was the best part for us. The environment feels very natural and relaxing.",
    rating: 5,
    image: "/images/reviews/image2.jpg"
  },
  {
    id: "r3",
    name: "Arindam Chatterjee",
    text: "The experience was much better than expected. Clean rooms, proper safety arrangements, and very helpful guides during the Sundarban tour. At night the atmosphere beside the river was beautiful. Worth every rupee.",
    rating: 5,
    image: "/images/reviews/image3.jpg"
  },
  {
    id: "r4",
    name: "Pinak Mondal",
    text: "Stayed here for two nights with friends. The hospitality was genuinely impressive. Fresh fish curry, comfortable beds, and organized sightseeing made the trip memorable. Highly recommended for family trips.",
    rating: 5,
    image: "/images/reviews/image4.jpg"
  },
  {
    id: "r5",
    name: "Madhumita Roy",
    text: "One of the best homestay experiences I have had in West Bengal. The owners are very humble and caring. Everything from transport assistance to local sightseeing was handled professionally. Will definitely visit again.",
    rating: 5,
    image: "/images/reviews/image5.jpg"
  }
];

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="w-full bg-white rounded-[24px] p-4 border border-[#6DA003]/25 shadow-[0_8px_30px_rgba(109,160,3,0.08)] flex flex-col min-h-[380px] sm:h-[460px]">
      <div className="relative w-full h-[200px] rounded-[16px] overflow-hidden shrink-0">
        <Image
          src={review.image}
          alt={review.name}
          fill
          sizes="(max-width: 640px) 100vw, 300px"
          className="object-cover"
        />
      </div>
      <div className="mt-4 flex flex-col flex-1 items-center">
        <h3 className="text-[22px] font-bold text-[#111111] font-sans">{review.name}</h3>
        <p className="text-[11px] leading-[18px] text-[#888888] text-center mt-3 flex-1 px-1 line-clamp-4">
          {review.text}
        </p>
        <div className="mt-auto w-full flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3 mt-2">
            <span className="text-[13px] font-medium text-[#444444]">Rating :</span>
            <div className="flex text-[#F5B301] text-sm gap-[2px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>
          <div className="w-[85%] h-px bg-[#6DA003]/40 mt-1" />
        </div>
      </div>
    </div>
  );
}

function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState(0);
  const animating = useRef(false);
  const n = reviews.length;
  const timelines = useRef<gsap.core.Timeline[]>([]);
  const hasAnimatedIn = useRef(false);

  useEffect(() => {
    timelines.current = [];
    hasAnimatedIn.current = false;
  }, [reviews]);

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".review-arc-card");

    if (timelines.current.length === 0) {
      cards.forEach((card) => {
        const tl = gsap.timeline({ paused: true });
        tl.to(card, {
          motionPath: {
            path: "#review-arc-path",
            align: "#review-arc-path",
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

      const targetProgress = 0.5 + diff * 0.265;

      const tl = timelines.current[idx];
      if (!tl) return;

      if (!hasAnimatedIn.current) {
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

  }, { dependencies: [center, reviews], scope: containerRef });

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
    <div ref={containerRef} className="relative w-full h-[560px] sm:h-[750px] flex items-center justify-center overflow-hidden sm:overflow-visible mt-8">
      <svg className="absolute w-full h-[600px] pointer-events-none invisible" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid meet">
        {/* 'U' Shape Arc */}
        <path id="review-arc-path" d="M 0 228 Q 600 372 1200 228" fill="none" stroke="black" />
      </svg>

      {reviews.map((review, idx) => (
        <div
          key={review.id}
          className="review-arc-card flex items-center justify-center absolute top-0 left-0 w-[280px] sm:w-[380px] origin-center cursor-pointer"
          onClick={() => {
            let diff = idx - center;
            if (diff > n / 2) diff -= n;
            if (diff < -n / 2) diff += n;
            if (diff === 1) navigate("right");
            if (diff === -1) navigate("left");
          }}
        >
          <ReviewCard review={review} />
        </div>
      ))}

      {/* Navigation Buttons */}
      <div className="absolute top-[50%] -translate-y-1/2 left-2 md:-left-6 z-20">
        <button
          onClick={() => navigate("right")}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#6DA003] text-[#6DA003] transition-all duration-300 hover:bg-[#6DA003] hover:text-white hover:scale-110 shadow-sm bg-transparent"
          aria-label="Previous review"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="absolute top-[50%] -translate-y-1/2 right-2 md:-right-6 z-20">
        <button
          onClick={() => navigate("left")}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#6DA003] text-[#6DA003] transition-all duration-300 hover:bg-[#6DA003] hover:text-white hover:scale-110 shadow-sm bg-transparent"
          aria-label="Next review"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className="relative w-full min-h-screen py-10 pb-[200px] sm:pb-[160px] lg:pb-10 bg-[#E1E1E1] flex flex-col items-center scroll-mt-28">
      <div className="z-20 flex flex-col items-center gap-4">
        <SectionHeading first="What Our" second="Customers Think" accentSide="right" />
        <Link href="/reviews" className="text-sm font-semibold text-[#6DA003] transition-colors hover:text-[#5B8703]">
          Read all reviews →
        </Link>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        <ReviewCarousel reviews={reviewsData} />
      </div>
    </section>
  );
}