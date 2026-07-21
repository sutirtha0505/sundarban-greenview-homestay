"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from "next/link";
import CachedImage from './CachedImage';
import { useRouter } from 'next/navigation';
import SectionHeading from "./SectionHeading";
import { tripsData, fetchLiveTrips, type Trip } from "@/lib/data/trips";

export default function Trips() {
  const router = useRouter();
  const [tripsList, setTripsList] = useState<Trip[]>(tripsData);
  const [startIndex, setStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    fetchLiveTrips().then((data) => {
      if (data && data.length > 0) {
        setTripsList(data);
      }
    });
  }, []);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getVisibleTrips = () => {
    const count = isMobile ? 1 : isTablet ? 2 : 3;
    const visible = [];
    const list = tripsList.length > 0 ? tripsList : tripsData;
    for (let i = 0; i < count; i++) {
      visible.push(list[(startIndex + i) % list.length]);
    }
    return visible;
  };

  const handleNext = useCallback(() => {
    const len = tripsList.length || 1;
    setStartIndex((prev) => (prev + 1) % len);
  }, [tripsList.length]);

  const handlePrev = useCallback(() => {
    const len = tripsList.length || 1;
    setStartIndex((prev) => (prev - 1 + len) % len);
  }, [tripsList.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <section id="trips" className="w-full md:min-h-screen py-12 md:py-24 bg-[#FFFFFF] scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-6 md:mb-10 flex flex-col items-center gap-4">
          <SectionHeading first="Book your" second="Trips" />
          <Link href="/trips" className="text-sm font-semibold text-[#6DA003] transition-colors hover:text-[#5B8703]">
            View all trips →
          </Link>
        </div>

        {/* Cards Carousel Container */}
        <div className="relative">
          {/* Left Controller */}
          <button 
            onClick={handlePrev} 
            className="absolute -left-2 sm:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-[#6DA003] text-[#6DA003] shadow-md hover:bg-[#6DA003] hover:text-white hover:scale-110 transition-all duration-300 cursor-pointer z-20"
            aria-label="Previous trips"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {getVisibleTrips().map((trip, idx) => (
              <div 
                key={`${trip.slug}-${idx}`}
                className="bg-[#FFFFFF] border border-[#6DA003] rounded-[32px] p-4 shadow-[0_8px_30px_rgba(109,160,3,0.10)] hover:shadow-[0_12px_40px_rgba(109,160,3,0.16)] transition-shadow duration-300 flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-4/3 rounded-[24px] overflow-hidden bg-[#F5F5F5]">
                  <CachedImage 
                    src={trip.image}
                    alt={trip.title || "Trip Image"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>

                {/* Pill */}
                {trip.pillText && (
                  <div className="flex justify-center -mt-4 relative z-10 mb-4">
                      <div className="bg-[#FFFFFF] border border-[#555555] rounded-full px-4 py-1.5 text-[9px] md:text-[10px] text-[#111111] shadow-sm text-center max-w-full truncate">
                      {trip.pillText}
                    </div>
                  </div>
                )}
                {!trip.pillText && <div className="mt-4"></div>}

                {/* Content */}
                <div className="px-2 pb-2 grow flex flex-col">
                  {trip.durationText && (
                    <p className="text-[11px] md:text-[10px] font-bold text-[#444444] mb-1 uppercase tracking-wide">
                      {trip.durationText}
                    </p>
                  )}
                  
                  {trip.title && (
                    <h3 className="text-[15px] md:text-[16px] font-bold text-[#888888] leading-tight mb-4 line-clamp-2 min-h-10">
                      {trip.title}
                    </h3>
                  )}
                  
                  {trip.rating && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-[#6DA003] text-[#FFFFFF] px-2 py-0.5 rounded-md text-[12px] md:text-[11px] font-bold">
                        {trip.rating}
                      </div>
                      <span className="text-[#6DA003] text-[12px] md:text-[11px] font-semibold">
                        {trip.reviews}
                      </span>
                    </div>
                  )}

                  {trip.price && (
                    <div className="mt-auto mb-5 flex items-baseline gap-1.5">
                      <span className="text-xl md:text-2xl font-bold text-[#111111]">{trip.price}</span>
                      <span className="text-[12px] text-[#888888] font-medium">/ per person</span>
                    </div>
                  )}

                  <div className="mt-auto">
                    <button 
                      onClick={() => router.push(`/booking?trip=${trip.slug}`)}
                      className="w-full py-3 px-6 rounded-[24px] flex items-center justify-between text-base font-serif transition-colors border border-[#6DA003] cursor-pointer bg-[#FFFFFF] text-[#6DA003] hover:bg-[#6DA003] hover:text-[#FFFFFF] group"
                    >
                      View Details
                      <svg 
                        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="transition-transform group-hover:translate-x-1"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Controller */}
          <button 
            onClick={handleNext} 
            className="absolute -right-2 sm:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-[#6DA003] text-[#6DA003] shadow-md hover:bg-[#6DA003] hover:text-white hover:scale-110 transition-all duration-300 cursor-pointer z-20"
            aria-label="Next trips"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}