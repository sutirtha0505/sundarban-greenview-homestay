"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Gloock } from "next/font/google";

const gloock = Gloock({
  weight: "400",
  subsets: ["latin"],
});

const roomImages = [
  "/images/rooms/image1.jpg",
  "/images/rooms/image2.jpg",
  "/images/rooms/image3.jpg",
  "/images/rooms/image4.jpg",
  "/images/rooms/image5.jpg",
  "/images/rooms/image6.jpg",
  "/images/rooms/image7.jpg",
  "/images/rooms/image8.jpg",
  "/images/rooms/image9.jpg",
  "/images/rooms/image10.jpg",
];

export default function HeroPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % roomImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentImageIndex]);

  // Auto-scroll when active index changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeElement = container.children[currentImageIndex] as HTMLElement;
      if (activeElement) {
        const containerWidth = container.clientWidth;
        const elementOffset = activeElement.offsetLeft;
        const elementWidth = activeElement.clientWidth;
        const scrollPosition = elementOffset - (containerWidth / 2) + (elementWidth / 2);

        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [currentImageIndex]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div id="home" className="relative h-screen w-full overflow-hidden">
      {/* Background Images */}
      {roomImages.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Sundarban Hero Image ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          priority={index === 0}
        />
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-black/40">
        <div className="absolute inset-0 bg-linear-to-r from-black via-transparent to-black/20" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full w-full flex-col justify-top px-4 sm:px-8 lg:px-16 pt-35 sm:pt-32">
        <div className="mb-6 w-full">
          <h1 className={`mb-4 sm:mb-6 text-4xl sm:text-7xl lg:text-[5.5rem] text-white leading-tight tracking-tight ${gloock.className}`}>
            Escape. <span className="text-[#C5FE4E]">Relax.</span> Mangroves.
          </h1>
          <p className="max-w-5xl text-sm sm:text-lg lg:text-xl leading-relaxed text-gray-200 line-clamp-4 sm:line-clamp-none">
            Escape into the untouched wilderness of the Sundarbans and experience a destination where nature, tranquility, and authentic village hospitality come together in perfect harmony. Sundarban Greenview Homestay offers a peaceful retreat in the heart of the world&apos;s largest mangrove forest, surrounded by serene rivers, lush greenery, and breathtaking natural beauty. Explore winding waterways on traditional boat rides, witness mesmerizing sunsets over the delta, and discover the rich biodiversity that makes the Sundarbans one of the most extraordinary ecosystems on Earth. From exotic birds and spotted deer to the legendary Royal Bengal Tiger, every journey through the forest carries the excitement of adventure and discovery. Beyond the wilderness, immerse yourself in the warmth of local culture, enjoy freshly prepared Bengali cuisine, and experience the calm simplicity of life far away from crowded cities and constant noise. Whether you seek relaxation, wildlife exploration, photography, or meaningful moments with family and friends, Sundarban Greenview Homestay creates an unforgettable escape where every breeze, river, and sunrise reconnects you with the beauty of the natural world.
          </p>
        </div>

        <div className="mt-4 sm:mt-6 flex w-full flex-col items-start gap-8 md:flex-row md:items-end">
          <button className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-[#6DA003] px-8 py-3.5 text-lg text-white transition-all hover:bg-[#5B8703] border border-[#8FCE05] shadow-[0_10px_24px_rgba(109,160,3,0.24)]">
            <span className="relative z-10 font-medium">Book your Trip</span>
            <svg
              className="relative z-10 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </button>
        </div>

        {/* Room Cards Carousel */}
        <div className="absolute bottom-4 sm:bottom-10 left-0 sm:left-auto right-0 sm:right-20 lg:right-32 z-20 flex flex-col items-center gap-2 px-2 sm:px-0 sm:max-w-[60vw] lg:max-w-[50vw]">

          {/* Row: left arrow + scrollable images + right arrow */}
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={scrollLeft}
              className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110 border border-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div
              ref={scrollContainerRef}
              className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-1 min-w-0"
            >
              {roomImages.map((src, index) => (
                <button
                  key={src}
                  onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-28 w-36 sm:h-32 sm:w-48 shrink-0 overflow-hidden rounded-xl group transition-all duration-300 snap-center ${index === currentImageIndex ? "border-[3px] border-[#C5FE4E]" : "border-[3px] border-transparent"
                    }`}
                >
                  <Image
                    src={src}
                    alt={`Room ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>

            <button
              onClick={scrollRight}
              className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110 border border-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dot indicators — mobile only */}
          <div className="flex sm:hidden gap-1.5 justify-center">
            {roomImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`rounded-full transition-all duration-300 ${index === currentImageIndex ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/50'
                  }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
