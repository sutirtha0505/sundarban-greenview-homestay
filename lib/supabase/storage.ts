import { supabase } from "@/lib/supabase/client";

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

/**
 * Upload an image file directly to a subfolder in Supabase Storage and return its public URL.
 */
export async function uploadImageToStorage(file: File, folder: string): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
  const filePath = `${folder}/${cleanFileName}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Storage Upload Error: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
