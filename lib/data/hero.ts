import { supabase } from "@/lib/supabase/client";
import { getStorageImageUrl } from "@/lib/supabase/storage";

export type HeroData = {
  id?: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  images: string[];
};

export const defaultHeroImages = [
  getStorageImageUrl("/images/rooms/image1.jpg"),
  getStorageImageUrl("/images/rooms/image2.jpg"),
  getStorageImageUrl("/images/rooms/image3.jpg"),
  getStorageImageUrl("/images/rooms/image4.jpg"),
  getStorageImageUrl("/images/rooms/image5.jpg"),
  getStorageImageUrl("/images/rooms/image6.jpg"),
  getStorageImageUrl("/images/rooms/image7.jpg"),
  getStorageImageUrl("/images/rooms/image8.jpg"),
  getStorageImageUrl("/images/rooms/image9.jpg"),
  getStorageImageUrl("/images/rooms/image10.jpg"),
];

export const defaultHeroData: HeroData = {
  title: 'Escape. <span class="text-[#C5FE4E]">Relax.</span> Mangroves.',
  subtitle:
    "Escape into the untouched wilderness of the Sundarbans and experience a destination where nature, tranquility, and authentic village hospitality come together in perfect harmony. Sundarban Greenview Homestay offers a peaceful retreat in the heart of the world's largest mangrove forest, surrounded by serene rivers, lush greenery, and breathtaking natural beauty. Explore winding waterways on traditional boat rides, witness mesmerizing sunsets over the delta, and discover the rich biodiversity that makes the Sundarbans one of the most extraordinary ecosystems on Earth. From exotic birds and spotted deer to the legendary Royal Bengal Tiger, every journey through the forest carries the excitement of adventure and discovery. Beyond the wilderness, immerse yourself in the warmth of local culture, enjoy freshly prepared Bengali cuisine, and experience the calm simplicity of life far away from crowded cities and constant noise. Whether you seek relaxation, wildlife exploration, photography, or meaningful moments with family and friends, Sundarban Greenview Homestay creates an unforgettable escape where every breeze, river, and sunrise reconnects you with the beauty of the natural world.",
  buttonText: "Book your Trip",
  buttonLink: "/booking",
  images: defaultHeroImages,
};

export async function fetchLiveHeroData(): Promise<HeroData> {
  try {
    const { data, error } = await supabase
      .from("hero_content")
      .select("*")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return defaultHeroData;
    }

    const rawImages: string[] = Array.isArray(data.images) && data.images.length > 0
      ? data.images
      : defaultHeroImages;

    const formattedImages = rawImages.map((img) => getStorageImageUrl(img));

    return {
      id: data.id,
      title: data.title || defaultHeroData.title,
      subtitle: data.subtitle || defaultHeroData.subtitle,
      buttonText: data.button_text || defaultHeroData.buttonText,
      buttonLink: data.button_link || defaultHeroData.buttonLink,
      images: formattedImages.length > 0 ? formattedImages : defaultHeroImages,
    };
  } catch (err) {
    console.error("Error fetching live hero content:", err);
    return defaultHeroData;
  }
}
