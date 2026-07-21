"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { getCachedImageUrl, getImmediateCachedUrl } from "@/lib/supabase/imageCache";

export type CachedImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

export default function CachedImage({
  src,
  alt,
  unoptimized = true,
  ...props
}: CachedImageProps) {
  const [displaySrc, setDisplaySrc] = useState<string>(() => {
    return getImmediateCachedUrl(src) || src;
  });
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setDisplaySrc(getImmediateCachedUrl(src) || src);
  }

  useEffect(() => {
    let isMounted = true;
    const immediate = getImmediateCachedUrl(src);
    if (!immediate) {
      getCachedImageUrl(src).then((cachedUrl) => {
        if (isMounted && cachedUrl) {
          setDisplaySrc(cachedUrl);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [src]);

  return (
    <Image
      {...props}
      src={displaySrc}
      alt={alt || ""}
      unoptimized={unoptimized}
    />
  );
}
