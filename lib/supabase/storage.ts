export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fupyposiegpynmgndboz.supabase.co";
export const STORAGE_BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET || "green_view_home_stay";

export const PUBLIC_STORAGE_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}`;

/**
 * Returns the public Supabase Storage URL for a given relative path (e.g. "/images/rooms/image1.jpg").
 */
export function getStorageImageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${PUBLIC_STORAGE_BASE_URL}${cleanPath}`;
}
