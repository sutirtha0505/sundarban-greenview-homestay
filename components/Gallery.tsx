"use client";

import { useState, useEffect, useMemo } from "react";
import Masonry from "./Masonry";
import { fetchLiveGalleryImages, defaultGalleryImages, type GalleryItem } from "@/lib/data/gallery";

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState<string[]>(defaultGalleryImages);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchLiveGalleryImages().then((items: GalleryItem[]) => {
      if (items && items.length > 0) {
        setGalleryImages(items.map((item) => item.url));
      }
    });
  }, []);

  const masonryItems = useMemo(() => {
    return galleryImages.map((url, index) => ({
      id: `gallery-img-${index}`,
      img: url,
      url: url,
      height: 400 + Math.floor(Math.random() * 200),
    }));
  }, [galleryImages]);

  return (
    <div className="w-full h-full flex flex-col items-center bg-[#FAFAFA] py-20 relative">
      <div className="flex items-center gap-2 mb-10">
        <div className="h-px w-16 md:w-32 bg-[#71A129]"></div>
        <h2 className="text-4xl md:text-5xl font-serif text-center">
          <span className="text-[#71A129]">Making</span> <span className="text-[#111111]">Memories Special</span>
        </h2>
        <div className="h-px w-16 md:w-32 bg-[#71A129]"></div>
      </div>
      <div className="w-full px-4">
        <Masonry
          items={masonryItems}
          onItemClick={(item) => setSelectedImage(item.url)}
        />
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full h-full max-h-[90vh] flex items-center justify-center">
            <button 
              className="absolute top-4 right-4 text-white hover:text-[#71A129] z-50 p-2 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <img 
              src={selectedImage} 
              alt="Gallery Preview" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}