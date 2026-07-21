"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
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

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function getRateLimitDaysLeft(): number | null {
  if (typeof window === "undefined") return null;
  const lastTimeStr = localStorage.getItem("gvh_last_review_timestamp");
  if (!lastTimeStr) return null;
  const lastTime = Number(lastTimeStr);
  const elapsed = Date.now() - lastTime;
  if (elapsed < ONE_WEEK_MS) {
    return Math.ceil((ONE_WEEK_MS - elapsed) / (24 * 60 * 60 * 1000));
  }
  return null;
}

function WriteReviewModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const rateLimitDaysLeft = isOpen ? getRateLimitDaysLeft() : null;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImageError(null);
    const file = acceptedFiles[0];
    if (!file) return;

    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;

      if (w <= h) {
        setImageError("Portrait or square photos are not allowed. Please upload a landscape photo (wider than it is tall).");
        setPreviewUrl(null);
        setDimensions(null);
      } else {
        setImageError(null);
        setPreviewUrl(objectUrl);
        setDimensions({ width: w, height: h });
      }
    };

    img.onerror = () => {
      setImageError("Failed to load image. Please select a valid image file.");
      setPreviewUrl(null);
      setDimensions(null);
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    disabled: rateLimitDaysLeft !== null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rateLimitDaysLeft !== null) return;
    if (!name.trim() || !text.trim()) return;

    localStorage.setItem("gvh_last_review_timestamp", String(Date.now()));
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setName("");
    setText("");
    setRating(5);
    setHoverRating(0);
    setPreviewUrl(null);
    setImageError(null);
    setDimensions(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C0000]/80 backdrop-blur-md">
      <div
        className="fixed inset-0"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[32px] bg-[#111111] border border-[#6DA003]/30 p-6 sm:p-8 text-white shadow-[0_32px_80px_rgba(0,0,0,0.8)] flex flex-col">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-colors hover:bg-white/20 hover:text-white"
          aria-label="Close review modal"
        >
          ✕
        </button>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#6DA003] text-white text-3xl mb-4 shadow-[0_0_30px_rgba(109,160,3,0.5)]">
              ✓
            </div>
            <h3 className="font-serif text-2xl font-bold text-white">Review Submitted!</h3>
            <p className="mt-3 text-sm leading-6 text-gray-300 max-w-xs">
              Thank you for sharing your experience at Sundarban Greenview Homestay. Your review has been recorded.
            </p>
            <div className="mt-4 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs text-[#C5FE4E]">
              Note: 1-week submission guard activated for your session.
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="mt-6 rounded-full bg-[#6DA003] px-8 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-[#5B8703]"
            >
              Close Window
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#6DA003]">
                Wanna Write a review? ✨
              </span>
              <h3 className="mt-1 font-serif text-2xl font-bold text-white">
                Share Your Experience
              </h3>
              <p className="mt-1 text-xs text-gray-400">
                Help future travellers discover the beauty of Sundarban Greenview Homestay.
              </p>
            </div>

            {rateLimitDaysLeft !== null && (
              <div className="mb-6 flex items-start gap-3 rounded-[20px] border border-amber-500/30 bg-amber-500/10 p-4 text-xs leading-5 text-amber-200">
                <span className="text-lg">🔒</span>
                <div>
                  <p className="font-semibold text-amber-300">Rate limit active (1 review / week)</p>
                  <p className="mt-0.5 text-amber-200/80">
                    You have already submitted a review recently. You can submit another review in{" "}
                    <span className="font-bold text-white">{rateLimitDaysLeft} day(s)</span>.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Customer Name */}
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6DA003]">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={rateLimitDaysLeft !== null}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="h-12 w-full rounded-[16px] border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-[#6DA003] transition-colors disabled:opacity-50"
                />
              </div>

              {/* Star Rating Selection */}
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6DA003]">
                  Overall Rating <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= (hoverRating || rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        disabled={rateLimitDaysLeft !== null}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer disabled:opacity-50"
                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      >
                        <svg
                          className={`w-7 h-7 transition-colors ${
                            active ? "fill-[#F5B301] text-[#F5B301]" : "fill-white/10 text-white/20"
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </button>
                    );
                  })}
                  <span className="ml-2 text-xs font-semibold text-amber-400">
                    {hoverRating || rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Customer Photo Upload (React Dropzone with Landscape check) */}
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6DA003]">
                  Customer Photo <span className="normal-case text-gray-400">(Landscape Only)</span>
                </label>

                {previewUrl && dimensions ? (
                  <div className="relative rounded-[20px] overflow-hidden border border-[#6DA003]/40 bg-black/40 p-2">
                    <div className="relative aspect-video w-full rounded-[14px] overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Uploaded review landscape"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 rounded-full bg-[#6DA003] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-md">
                        ✓ Verified Landscape ({dimensions.width}×{dimensions.height}px)
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(null);
                          setDimensions(null);
                        }}
                        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
                        aria-label="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    {...getRootProps()}
                    className={`flex flex-col items-center justify-center rounded-[20px] border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
                      isDragActive
                        ? "border-[#6DA003] bg-[#6DA003]/15 scale-[0.99]"
                        : imageError
                          ? "border-red-500/50 bg-red-500/10 hover:border-red-500"
                          : "border-[#6DA003]/30 bg-white/5 hover:border-[#6DA003] hover:bg-white/10"
                    } ${rateLimitDaysLeft !== null ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6DA003]/15 text-[#C5FE4E] mb-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-white">
                      {isDragActive
                        ? "Drop your landscape photo here..."
                        : "Drag & drop customer photo, or click to browse"}
                    </p>
                    <span className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#C5FE4E] font-semibold">
                      Landscape Only
                    </span>
                  </div>
                )}

                {imageError && (
                  <div className="mt-2.5 flex items-start gap-2 rounded-[14px] border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                    <span className="shrink-0 text-red-400 font-bold">✕</span>
                    <span>{imageError}</span>
                  </div>
                )}
              </div>

              {/* Review Text */}
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6DA003]">
                  Your Review <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  disabled={rateLimitDaysLeft !== null}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share details about your room, hospitality, food, boat safari, or view..."
                  className="w-full rounded-[16px] border border-white/10 bg-white/5 p-4 text-sm text-white outline-none focus:border-[#6DA003] transition-colors resize-none disabled:opacity-50"
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-2 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rateLimitDaysLeft !== null || !name.trim() || !text.trim()}
                  className="rounded-full bg-[#6DA003] px-7 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 hover:bg-[#5B8703] disabled:opacity-40 disabled:hover:scale-100 cursor-pointer shadow-[0_8px_25px_rgba(109,160,3,0.3)]"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="reviews" className="relative w-full min-h-screen py-10 pb-[200px] sm:pb-[160px] lg:pb-10 bg-[#E1E1E1] flex flex-col items-center scroll-mt-28">
      <div className="z-20 flex flex-col items-center gap-4">
        <SectionHeading first="What Our" second="Customers Think" accentSide="right" />
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="group inline-flex items-center gap-2 rounded-full border border-[#6DA003] bg-white px-6 py-2.5 text-sm font-semibold text-[#6DA003] shadow-[0_8px_25px_rgba(109,160,3,0.12)] transition-all duration-300 hover:scale-105 hover:bg-[#6DA003] hover:text-white cursor-pointer"
        >
          <span>Wanna Write a review?</span>
          <span className="text-base transition-transform group-hover:translate-x-1">✨</span>
        </button>
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        <ReviewCarousel reviews={reviewsData} />
      </div>

      <WriteReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}