"use client";

import { useEffect } from "react";
import { preloadImages } from "@/lib/supabase/imageCache";
import { getStorageImageUrl } from "@/lib/supabase/storage";
import { roomsData } from "@/lib/data/rooms";
import { tripsData } from "@/lib/data/trips";

const galleryFiles = [
  "image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg",
  "image6.jpg", "image7.jpg", "image8.jpg", "image9.jpg", "image10.jpg",
  "image11.jpg", "image12.jpg", "image13.jpg", "image14.jpg", "image15.jpg",
  "image16.jpg", "image17.jpg", "image18.jpg", "image19.jpg", "kingFisher.png"
];

const reviewFiles = [
  "image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg"
];

const chooseFiles = [
  "RiversideLocation.jpg",
  "HomeCookedBengaliMeals.jpg",
  "LicensedForest Guides.jpg",
  "FamilyRun.jpg"
];

const iconFiles = [
  "sundarban-green-view-logo.png"
];

export default function ImageCacheProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Collect all Supabase image URLs
    const roomUrls = roomsData.map((r) => r.image);
    const tripUrls = tripsData.map((t) => t.image);
    const galleryUrls = galleryFiles.map((file) => getStorageImageUrl(`/images/gallery/${file}`));
    const reviewUrls = reviewFiles.map((file) => getStorageImageUrl(`/images/reviews/${file}`));
    const chooseUrls = chooseFiles.map((file) => getStorageImageUrl(`/images/Choose/${file}`));
    const iconUrls = iconFiles.map((file) => getStorageImageUrl(`/images/icons/${file}`));

    const allUrls = [
      ...roomUrls,
      ...tripUrls,
      ...galleryUrls,
      ...reviewUrls,
      ...chooseUrls,
      ...iconUrls
    ];

    // Preload into local Cache Storage
    preloadImages(allUrls);
  }, []);

  return <>{children}</>;
}
