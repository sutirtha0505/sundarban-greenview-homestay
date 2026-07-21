import { supabase } from "@/lib/supabase/client";
import { getStorageImageUrl } from "@/lib/supabase/storage";

export type ReviewRecord = {
  id: string;
  name: string;
  text: string;
  rating: number;
  image: string;
  show_in_home: boolean;
  created_at?: string;
};

export const defaultReviews: ReviewRecord[] = [
  {
    id: "r1",
    name: "Soumen Das",
    text: "Had an amazing stay at Sundarban Greenview Homestay. The rooms were clean, food was fresh and authentic, and the river view during sunrise was unreal. The staff members were very polite and helped us throughout the trip. The boat safari arrangement was also smooth and well managed.",
    rating: 5,
    image: getStorageImageUrl("/images/reviews/image1.jpg"),
    show_in_home: true,
  },
  {
    id: "r2",
    name: "Subhajit Sarkar",
    text: "Perfect place if you want peace away from city noise. I visited with my parents and they loved the hospitality. Homemade Bengali food was the best part for us. The environment feels very natural and relaxing.",
    rating: 5,
    image: getStorageImageUrl("/images/reviews/image2.jpg"),
    show_in_home: true,
  },
  {
    id: "r3",
    name: "Arindam Chatterjee",
    text: "The experience was much better than expected. Clean rooms, proper safety arrangements, and very helpful guides during the Sundarban tour. At night the atmosphere beside the river was beautiful. Worth every rupee.",
    rating: 5,
    image: getStorageImageUrl("/images/reviews/image3.jpg"),
    show_in_home: true,
  },
  {
    id: "r4",
    name: "Pinak Mondal",
    text: "Stayed here for two nights with friends. The hospitality was genuinely impressive. Fresh fish curry, comfortable beds, and organized sightseeing made the trip memorable. Highly recommended for family trips.",
    rating: 5,
    image: getStorageImageUrl("/images/reviews/image4.jpg"),
    show_in_home: true,
  },
  {
    id: "r5",
    name: "Madhumita Roy",
    text: "One of the best homestay experiences I have had in West Bengal. The owners are very humble and caring. Everything from transport assistance to local sightseeing was handled professionally. Will definitely visit again.",
    rating: 5,
    image: getStorageImageUrl("/images/reviews/image5.jpg"),
    show_in_home: true,
  },
];

/**
 * Fetch reviews intended for homepage (where show_in_home = true)
 */
export async function fetchHomepageReviews(): Promise<ReviewRecord[]> {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("show_in_home", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) console.warn("Supabase fetch homepage reviews notice:", error.message);
      return defaultReviews;
    }

    return data.map((item) => ({
      ...item,
      image: item.image ? getStorageImageUrl(item.image) : getStorageImageUrl("/images/reviews/image1.jpg"),
    }));
  } catch (err) {
    console.error("Failed to fetch homepage reviews:", err);
    return defaultReviews;
  }
}

/**
 * Fetch all reviews for Admin management panel
 */
export async function fetchAllReviews(): Promise<ReviewRecord[]> {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.warn("Supabase fetch all reviews notice:", error?.message);
      return defaultReviews;
    }

    return data.map((item) => ({
      ...item,
      image: item.image ? getStorageImageUrl(item.image) : getStorageImageUrl("/images/reviews/image1.jpg"),
    }));
  } catch (err) {
    console.error("Failed to fetch all reviews for admin:", err);
    return defaultReviews;
  }
}

/**
 * Toggle show_in_home flag for a review in Supabase DB
 */
export async function toggleReviewShowInHome(id: string, showInHome: boolean): Promise<void> {
  const { error } = await supabase
    .from("reviews")
    .update({ show_in_home: showInHome })
    .eq("id", id);

  if (error) {
    console.error(`Error updating show_in_home for review ${id}:`, error);
    throw new Error(`Failed to update review visibility: ${error.message}`);
  }
}

/**
 * Insert a new review into Supabase DB
 */
export async function createReview(reviewData: {
  name: string;
  text: string;
  rating: number;
  image?: string;
  show_in_home?: boolean;
}): Promise<ReviewRecord> {
  const payload = {
    name: reviewData.name,
    text: reviewData.text,
    rating: reviewData.rating,
    image: reviewData.image || "",
    show_in_home: reviewData.show_in_home !== undefined ? reviewData.show_in_home : true,
  };

  const { data, error } = await supabase
    .from("reviews")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("Error creating review:", error);
    throw new Error(`Failed to save review: ${error.message}`);
  }

  return {
    ...data,
    image: data.image ? getStorageImageUrl(data.image) : getStorageImageUrl("/images/reviews/image1.jpg"),
  };
}

/**
 * Delete a review from Supabase DB
 */
export async function deleteReview(id: string): Promise<void> {
  const { error } = await supabase.from("reviews").delete().eq("id", id);

  if (error) {
    console.error(`Error deleting review ${id}:`, error);
    throw new Error(`Failed to delete review: ${error.message}`);
  }
}
