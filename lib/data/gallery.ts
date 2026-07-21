import { supabase } from "@/lib/supabase/client";
import { STORAGE_BUCKET, getStorageImageUrl } from "@/lib/supabase/storage";

export const defaultGalleryFiles = [
  "image1.jpg", "image2.jpg", "image3.jpg", "image4.jpg", "image5.jpg",
  "image6.jpg", "image7.jpg", "image8.jpg", "image9.jpg", "image10.jpg",
  "image11.jpg", "image12.jpg", "image13.jpg", "image14.jpg", "image15.jpg",
  "image16.jpg", "image17.jpg", "image18.jpg", "image19.jpg", "kingFisher.png"
];

export const defaultGalleryImages = defaultGalleryFiles.map((file) =>
  getStorageImageUrl(`/images/gallery/${file}`)
);

export type GalleryItem = {
  name: string;
  url: string;
  created_at?: string | null;
};

/**
 * Fetch all gallery image objects from Supabase Storage "images/gallery" folder.
 */
export async function fetchLiveGalleryImages(): Promise<GalleryItem[]> {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list("images/gallery", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error || !data || data.length === 0) {
      console.warn("Storage list returned no data or error, using default fallback gallery:", error);
      return defaultGalleryFiles.map((file) => ({
        name: file,
        url: getStorageImageUrl(`/images/gallery/${file}`),
      }));
    }

    // Filter valid files (exclude hidden files or folders)
    const validFiles = data.filter((item) => item.name && !item.name.startsWith("."));

    if (validFiles.length === 0) {
      return defaultGalleryFiles.map((file) => ({
        name: file,
        url: getStorageImageUrl(`/images/gallery/${file}`),
      }));
    }

    return validFiles.map((file) => ({
      name: file.name,
      url: getStorageImageUrl(`/images/gallery/${file.name}`),
      created_at: file.created_at,
    }));
  } catch (err) {
    console.error("Failed to fetch live gallery images:", err);
    return defaultGalleryFiles.map((file) => ({
      name: file,
      url: getStorageImageUrl(`/images/gallery/${file}`),
    }));
  }
}

/**
 * Upload multiple files to Supabase Storage in "images/gallery" folder
 */
export async function uploadGalleryImagesToStorage(files: File[]): Promise<string[]> {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const fileExt = file.name.split(".").pop();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${Date.now()}_${cleanName}`;
    const filePath = `images/gallery/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error(`Error uploading ${file.name} to gallery:`, uploadError);
      throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
    }

    uploadedUrls.push(getStorageImageUrl(filePath));
  }

  return uploadedUrls;
}

/**
 * Delete a file from Supabase Storage "images/gallery" folder
 */
export async function deleteGalleryImageFromStorage(fileName: string): Promise<void> {
  const filePath = `images/gallery/${fileName}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);

  if (error) {
    console.error(`Error deleting ${fileName} from gallery storage:`, error);
    throw new Error(`Failed to delete ${fileName}: ${error.message}`);
  }
}
