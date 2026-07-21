"use client";

import { useState, useEffect } from "react";
import DomeGallery from "./DomeGallery";
import { fetchLiveGalleryImages, defaultGalleryImages, type GalleryItem } from "@/lib/data/gallery";

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState<string[]>(defaultGalleryImages);

  useEffect(() => {
    fetchLiveGalleryImages().then((items: GalleryItem[]) => {
      if (items && items.length > 0) {
        setGalleryImages(items.map((item) => item.url));
      }
    });
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-[#FAFAFA]">
      <div className="flex items-center gap-2">
        <div className="h-px w-16 md:w-32 bg-[#71A129]"></div>
        <h2 className="text-4xl md:text-5xl font-serif">
          <span className="text-[#71A129]">Making</span> <span className="text-[#111111]">Memories Special</span>
        </h2>
        <div className="h-px w-16 md:w-32 bg-[#71A129]"></div>
      </div>
      <div className="w-full h-full max-h-[80vh] mt-10">
        <DomeGallery
          images={galleryImages}
          fit={0.5}
          minRadius={800}
          maxVerticalRotationDeg={0}
          segments={34}
          dragDampening={2}
          grayscale={false}
        />
      </div>
    </div>
  );
}