"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const tripsData = [
  {
    id: 1,
    image: "/images/trips/trip1.jpg",
    pillText: "Night on board | One Day, One Night | Sundarban",
    durationText: "Sundarban 1 Day, 1 Night",
    title: "Sundarban Tour: Sajnekhali Bird Sanctuary, Watch Tower, Eco Garden, Hiron Point etc.",
    rating: "4.5",
    reviews: "Very Good (2.9k Reviews)",
    price: "₹ 3,675",
    buttonType: "outline"
  },
  {
    id: 2,
    image: "/images/trips/trip2.jpg",
    pillText: "Night on board | Two Days, Three Nights | Sundarban",
    durationText: "Sundarban 2 Days, 3 Nights",
    title: "Sundarban Birdwatching & Riverside Relaxation",
    rating: "4.5",
    reviews: "Very Good (2.9k Reviews)",
    price: "₹ 4,675",
    buttonType: "outline"
  },
  {
    id: 3,
    image: "/images/trips/trip3.jpg",
    pillText: "Night on board | Two Days, Three Nights | Sundarban",
    durationText: "Sundarban 5 Days, 7 Nights",
    title: "Sundarban Wildlife Adventure: Deep Forest Exploration",
    rating: "4.7",
    reviews: "Very Good (2.9k Reviews)",
    price: "₹ 5,695",
    buttonType: "outline"
  },
  {
    id: 4,
    image: "/images/trips/trip4.jpg",
    pillText: "Mangrove Safari & Trek | 3 Days, 4 Nights | Sundarban",
    durationText: "Sundarban 3 Days, 4 Nights",
    title: "Sundarban Wildlife Trek & Coastal Camping",
    rating: "4.6",
    reviews: "Excellent (1.8k Reviews)",
    price: "₹ 6,995",
    buttonType: "filled"
  },
  {
    id: 5,
    image: "/images/trips/trip5.jpg",
    pillText: "River Cruise & Culture | 4 Days, 5 Nights | Sundarban",
    durationText: "Sundarban 4 Days, 5 Nights",
    title: "Sundarban River Journey: Village Life & Birdlife",
    rating: "4.8",
    reviews: "Outstanding (3.5k Reviews)",
    price: "₹ 8,495",
    buttonType: "filled"
  }
];

export default function Trips() {
  const [startIndex, setStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

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
    for (let i = 0; i < count; i++) {
      visible.push(tripsData[(startIndex + i) % tripsData.length]);
    }
    return visible;
  };

  const handleNext = useCallback(() => {
    setStartIndex((prev) => (prev + 1) % tripsData.length);
  }, []);

  const handlePrev = useCallback(() => {
    setStartIndex((prev) => (prev - 1 + tripsData.length) % tripsData.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <section className="w-full md:min-h-screen py-12 md:py-24 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header Section */}
        <div className="flex items-center justify-center gap-4 mb-8 md:mb-16">
          <div className="h-px w-16 md:w-32 bg-[#71A129]"></div>
          <h2 className="text-center text-3xl md:text-5xl font-serif">
            <span className="text-[#71A129]">Book your</span> <span className="text-[#111111]">Trips</span>
          </h2>
          <div className="h-px w-16 md:w-32 bg-[#71A129]"></div>
        </div>

        {/* Cards Carousel Container */}
        <div className="relative">
          {/* Left Controller */}
          <button 
            onClick={handlePrev} 
            className="absolute -left-2 sm:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-[#71A129] text-[#71A129] shadow-md hover:bg-[#71A129] hover:text-white hover:scale-110 transition-all duration-300 cursor-pointer z-20"
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
                key={`${trip.id}-${idx}`}
                className="bg-[#FFFFFF] border border-[#71A129] rounded-[32px] p-4 shadow-[0_8px_30px_#71A1291A] hover:shadow-[0_12px_40px_#71A1292A] transition-shadow duration-300 flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-4/3 rounded-[24px] overflow-hidden bg-[#F5F5F5]">
                  <Image 
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
                      <div className="bg-[#71A129] text-[#FFFFFF] px-2 py-0.5 rounded-md text-[12px] md:text-[11px] font-bold">
                        {trip.rating}
                      </div>
                      <span className="text-[#71A129] text-[12px] md:text-[11px] font-semibold">
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
                      className={`w-full py-3 px-6 rounded-[24px] flex items-center justify-between text-base font-serif transition-colors border border-[#71A129] cursor-pointer ${
                        trip.buttonType === 'solid' 
                          ? 'bg-[#71A129] text-[#FFFFFF] hover:bg-[#5b851f]' 
                          : 'bg-[#FFFFFF] text-[#71A129] hover:bg-[#71A129] hover:text-[#FFFFFF] group'
                      }`}
                    >
                      View Details
                      <svg 
                        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className={`transition-transform ${trip.buttonType === 'outline' ? 'group-hover:translate-x-1' : ''}`}
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
            className="absolute -right-2 sm:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border border-[#71A129] text-[#71A129] shadow-md hover:bg-[#71A129] hover:text-white hover:scale-110 transition-all duration-300 cursor-pointer z-20"
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