const CACHE_NAME = "supabase-images-v1";

// In-memory cache mapping original URL -> Blob Object URL for instant synchronous / near-instant retrieval
const blobUrlCache = new Map<string, string>();
const pendingFetches = new Map<string, Promise<string>>();

/**
 * Returns a cached Blob URL or browser-cached response for a given Supabase image URL.
 * Automatically saves fetched responses into local Cache Storage (window.caches)
 * so subsequent page scrolls and navigations hit the local cache directly.
 */
export async function getCachedImageUrl(url: string): Promise<string> {
  if (!url) return "";
  if (typeof window === "undefined") return url;

  // 1. Check in-memory Blob URL cache
  if (blobUrlCache.has(url)) {
    return blobUrlCache.get(url)!;
  }

  // 2. Reuse pending fetch if already in flight
  if (pendingFetches.has(url)) {
    return pendingFetches.get(url)!;
  }

  const fetchPromise = (async () => {
    try {
      if (!("caches" in window)) {
        return url;
      }

      const cache = await caches.open(CACHE_NAME);
      let response = await cache.match(url);

      if (!response) {
        // Fetch from Supabase server and save to local Cache Storage
        const fetched = await fetch(url, { mode: "cors" });
        if (fetched.ok) {
          await cache.put(url, fetched.clone());
          response = fetched;
        } else {
          return url;
        }
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      blobUrlCache.set(url, objectUrl);
      return objectUrl;
    } catch (error) {
      console.warn("[imageCache] Failed to cache image locally:", url, error);
      return url;
    } finally {
      pendingFetches.delete(url);
    }
  })();

  pendingFetches.set(url, fetchPromise);
  return fetchPromise;
}

/**
 * Preloads an array of image URLs into the local Cache Storage in the background.
 */
export async function preloadImages(urls: string[]): Promise<void> {
  if (typeof window === "undefined" || !urls.length) return;
  const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));
  
  // Process in small batches to prevent network congestion
  const batchSize = 6;
  for (let i = 0; i < uniqueUrls.length; i += batchSize) {
    const batch = uniqueUrls.slice(i, i + batchSize);
    await Promise.all(batch.map((url) => getCachedImageUrl(url)));
  }
}

/**
 * Synchronous check to see if an image is already stored in the in-memory Blob cache.
 */
export function getImmediateCachedUrl(url: string): string | null {
  return blobUrlCache.get(url) || null;
}
