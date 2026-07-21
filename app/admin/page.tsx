"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { getStorageImageUrl, STORAGE_BUCKET } from "@/lib/supabase/storage";
import { fetchLiveHeroData, defaultHeroData, type HeroData } from "@/lib/data/hero";
import type { User, Session } from "@supabase/supabase-js";
import {
  Mail,
  KeyRound,
  LogOut,
  PlusCircle,
  BedDouble,
  Compass,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Eye,
  ChevronRight,
  ShieldCheck,
  UserPlus,
  Lock,
  Images,
  MessageSquareQuote,
  Star,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  fetchLiveGalleryImages,
  uploadGalleryImagesToStorage,
  deleteGalleryImageFromStorage,
  type GalleryItem,
} from "@/lib/data/gallery";
import {
  fetchAllReviews,
  toggleReviewShowInHome,
  createReview,
  deleteReview,
  type ReviewRecord,
} from "@/lib/data/reviews";

type RoomTier = "budget" | "premium";
type DurationBand = "1N" | "2N" | "3N+";
type GroupType = "group" | "private";

interface RoomRecord {
  id: string;
  title: string;
  slug: string;
  hero_image: string;
  tier: string;
  price_per_night: number;
}

interface TripRecord {
  id: string;
  title: string;
  slug: string;
  hero_image: string;
  duration_band: string;
  price_display: string;
}

const DEFAULT_ADMIN_EMAIL = "tirtharajkarmakarinlinux@gmail.com";

export default function AdminPage() {
  // Auth state
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccessMsg, setAuthSuccessMsg] = useState("");
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Active tab state
  const [activeTab, setActiveTab] = useState<"rooms" | "trips" | "hero" | "gallery" | "reviews">("rooms");

  // Feedback notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // --------------------------------------------------------------------------
  // Rooms State & Operations
  // --------------------------------------------------------------------------
  const [roomsList, setRoomsList] = useState<RoomRecord[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [uploadingRoomImage, setUploadingRoomImage] = useState(false);

  const [roomForm, setRoomForm] = useState({
    title: "",
    slug: "",
    tier: "budget" as RoomTier,
    price_per_night: "",
    max_guests: "2",
    description: "",
    hero_image: "",
    bed_config: "1 Double Bed",
    room_size: "220 sq.ft",
    view_type: "Garden View",
    has_ac: true,
    has_balcony: false,
    has_river_view: false,
    has_hot_water: true,
    has_wifi: true,
    has_power_backup: true,
    has_mosquito_net: true,
  });

  // --------------------------------------------------------------------------
  // Trips State & Operations
  // --------------------------------------------------------------------------
  const [tripsList, setTripsList] = useState<TripRecord[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [uploadingTripImage, setUploadingTripImage] = useState(false);

  const [tripForm, setTripForm] = useState({
    title: "",
    slug: "",
    pill_text: "Night on board | One Day, One Night | Sundarban",
    duration_text: "Sundarban 1 Day, 1 Night",
    days: "1",
    nights: "1",
    duration_band: "1N" as DurationBand,
    group_type: "group" as GroupType,
    price_per_person: "",
    price_display: "₹ 3,675",
    hero_image: "",
    rating: "4.5",
    rating_label: "Very Good",
    review_count: "2900",
    inclusionsInput: "Boat transfers, Meals, Forest guide, Basic stay",
    exclusionsInput: "GST, Forest permit, Pickup/drop, Personal expenses",
  });

  const [submittingRoom, setSubmittingRoom] = useState(false);
  const [submittingTrip, setSubmittingTrip] = useState(false);

  // --------------------------------------------------------------------------
  // Hero Section State & Operations
  // --------------------------------------------------------------------------
  const [heroForm, setHeroForm] = useState<HeroData>(defaultHeroData);
  const [loadingHero, setLoadingHero] = useState(false);
  const [submittingHero, setSubmittingHero] = useState(false);
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  const [newHeroImageUrl, setNewHeroImageUrl] = useState("");

  const fetchHeroContent = useCallback(async () => {
    setLoadingHero(true);
    try {
      const data = await fetchLiveHeroData();
      setHeroForm(data);
    } catch (err: unknown) {
      console.error("Error fetching live hero data:", err);
    } finally {
      setLoadingHero(false);
    }
  }, []);

  // --------------------------------------------------------------------------
  // Gallery State & Operations
  // --------------------------------------------------------------------------
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [uploadingGalleryImages, setUploadingGalleryImages] = useState(false);

  const fetchGallery = useCallback(async () => {
    setLoadingGallery(true);
    try {
      const items = await fetchLiveGalleryImages();
      setGalleryList(items);
    } catch (err: unknown) {
      console.error("Error fetching live gallery images:", err);
    } finally {
      setLoadingGallery(false);
    }
  }, []);

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingGalleryImages(true);

    try {
      const fileArray = Array.from(files);
      await uploadGalleryImagesToStorage(fileArray);
      showToast(`${fileArray.length} gallery image(s) uploaded to Supabase Storage!`);
      fetchGallery();
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to upload gallery images", "error");
    } finally {
      setUploadingGalleryImages(false);
    }
  };

  const handleDeleteGalleryImage = async (fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName} from Supabase Storage?`)) return;
    try {
      await deleteGalleryImageFromStorage(fileName);
      showToast("Gallery image deleted from Supabase Storage!");
      fetchGallery();
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to delete gallery image", "error");
    }
  };

  // --------------------------------------------------------------------------
  // Reviews State & Operations
  // --------------------------------------------------------------------------
  const [reviewsList, setReviewsList] = useState<ReviewRecord[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [uploadingReviewImage, setUploadingReviewImage] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    name: "",
    text: "",
    rating: 5,
    image: "",
    show_in_home: true,
  });

  const fetchReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const data = await fetchAllReviews();
      setReviewsList(data);
    } catch (err: unknown) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  }, []);

  const handleToggleShowInHome = async (review: ReviewRecord) => {
    const nextVal = !review.show_in_home;
    try {
      await toggleReviewShowInHome(review.id, nextVal);
      showToast(`Review by "${review.name}" ${nextVal ? "is now shown" : "is now hidden"} on Homepage`);
      fetchReviews();
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to toggle review visibility", "error");
    }
  };

  const handleDeleteReview = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete review by "${name}"?`)) return;
    try {
      await deleteReview(id);
      showToast("Review deleted successfully!");
      fetchReviews();
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to delete review", "error");
    }
  };

  const handleCreateReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) {
      showToast("Name and review text are required", "error");
      return;
    }
    setSubmittingReview(true);
    try {
      await createReview(reviewForm);
      showToast("New review added successfully!");
      setReviewForm({
        name: "",
        text: "",
        rating: 5,
        image: "",
        show_in_home: true,
      });
      fetchReviews();
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to add review", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  // --------------------------------------------------------------------------
  // Admin Verification Logic
  // --------------------------------------------------------------------------
  const verifyAdminStatus = useCallback(async (user: User | null) => {
    if (!user) {
      setIsAdmin(false);
      return false;
    }

    const userEmail = (user.email || "").toLowerCase();

    // Default admin override
    if (userEmail === DEFAULT_ADMIN_EMAIL.toLowerCase()) {
      setIsAdmin(true);
      return true;
    }

    // Database check in admin_users table
    try {
      const { data, error } = await supabase
        .from("admin_users")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (!error && data && data.is_admin === true) {
        setIsAdmin(true);
        return true;
      }
    } catch (err) {
      console.warn("Could not query admin_users table:", err);
    }

    // Access Denied
    setIsAdmin(false);
    await supabase.auth.signOut();
    setSession(null);
    setAuthError(`Access Denied: User "${user.email}" is not an authorized admin.`);
    return false;
  }, []);

  // --------------------------------------------------------------------------
  // Fetch Auth Session & Data
  // --------------------------------------------------------------------------
  const fetchRooms = useCallback(async () => {
    setLoadingRooms(true);
    try {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setRoomsList(data);
    } catch (e) {
      console.error("Error fetching rooms:", e);
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  const fetchTrips = useCallback(async () => {
    setLoadingTrips(true);
    try {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setTripsList(data);
    } catch (e) {
      console.error("Error fetching trips:", e);
    } finally {
      setLoadingTrips(false);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const authorized = await verifyAdminStatus(session.user);
        if (authorized) {
          setSession(session);
          fetchRooms();
          fetchTrips();
          fetchHeroContent();
          fetchGallery();
          fetchReviews();
        }
      } else {
        setSession(null);
      }
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const authorized = await verifyAdminStatus(session.user);
        if (authorized) {
          setSession(session);
          fetchRooms();
          fetchTrips();
          fetchHeroContent();
          fetchGallery();
          fetchReviews();
        }
      } else {
        setSession(null);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchRooms, fetchTrips, fetchHeroContent, fetchGallery, fetchReviews, verifyAdminStatus]);

  // Handle Sign In / Sign Up Form Submission
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccessMsg("");
    setIsSubmittingAuth(true);

    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          // Attempt to record in admin_users table
          const isDefaultAdmin = email.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase();
          try {
            await supabase.from("admin_users").upsert([
              {
                id: data.user.id,
                email: data.user.email,
                is_admin: isDefaultAdmin,
              },
            ]);
          } catch (dbErr) {
            console.warn("Could not insert into admin_users:", dbErr);
          }

          if (isDefaultAdmin) {
            setAuthSuccessMsg("Account created! Authorized as Default Admin.");
            setSession(data.session);
            setIsAdmin(true);
            showToast("Welcome Admin! Signed up and logged in.");
          } else {
            setAuthError(`Account created for ${email}, but access is restricted to authorized admin (${DEFAULT_ADMIN_EMAIL}).`);
            await supabase.auth.signOut();
          }
        }
      } else {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          const authorized = await verifyAdminStatus(data.user);
          if (authorized) {
            setSession(data.session);
            showToast("Signed in successfully!");
          }
        }
      }
    } catch (err: unknown) {
      setAuthError((err as Error).message || "Authentication failed");
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
    showToast("Signed out successfully");
  };

  // Auto-generate slug from title
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleRoomTitleChange = (newTitle: string) => {
    setRoomForm((prev) => ({
      ...prev,
      title: newTitle,
      slug: slugify(newTitle),
    }));
  };

  const handleTripTitleChange = (newTitle: string) => {
    setTripForm((prev) => ({
      ...prev,
      title: newTitle,
      slug: slugify(newTitle),
    }));
  };

  // --------------------------------------------------------------------------
  // Supabase Storage Image Upload
  // --------------------------------------------------------------------------
  const uploadImageToStorage = async (file: File, folder: string): Promise<string> => {
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
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const handleRoomImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingRoomImage(true);

    try {
      const path = await uploadImageToStorage(files[0], "rooms");
      setRoomForm((prev) => ({ ...prev, hero_image: path }));
      showToast("Room hero image uploaded successfully!");
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to upload image", "error");
    } finally {
      setUploadingRoomImage(false);
    }
  };

  const handleTripImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingTripImage(true);

    try {
      const path = await uploadImageToStorage(files[0], "trips");
      setTripForm((prev) => ({ ...prev, hero_image: path }));
      showToast("Trip hero image uploaded successfully!");
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to upload image", "error");
    } finally {
      setUploadingTripImage(false);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingHeroImage(true);

    try {
      const fileArray = Array.from(files);
      const uploadedPaths = await Promise.all(
        fileArray.map((file) => uploadImageToStorage(file, "hero"))
      );

      setHeroForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedPaths],
      }));
      showToast(`${uploadedPaths.length} image(s) uploaded to Supabase Storage!`);
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to upload hero images", "error");
    } finally {
      setUploadingHeroImage(false);
    }
  };

  const handleAddHeroImageUrl = () => {
    if (!newHeroImageUrl.trim()) return;
    setHeroForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), newHeroImageUrl.trim()],
    }));
    setNewHeroImageUrl("");
    showToast("Hero image URL added!");
  };

  const handleRemoveHeroImage = (indexToRemove: number) => {
    setHeroForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroForm.title || !heroForm.subtitle) {
      showToast("Please enter both Title and Subtitle", "error");
      return;
    }

    setSubmittingHero(true);
    try {
      const payload = {
        title: heroForm.title,
        subtitle: heroForm.subtitle,
        button_text: heroForm.buttonText,
        button_link: heroForm.buttonLink,
        images: heroForm.images,
        is_active: true,
        updated_at: new Date().toISOString(),
      };

      if (heroForm.id) {
        const { error } = await supabase
          .from("hero_content")
          .update(payload)
          .eq("id", heroForm.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("hero_content")
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        if (data) {
          setHeroForm((prev) => ({ ...prev, id: data.id }));
        }
      }

      showToast("Hero section updated successfully in Supabase!");
      fetchHeroContent();
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to update hero section", "error");
    } finally {
      setSubmittingHero(false);
    }
  };

  // --------------------------------------------------------------------------
  // Submit New Room
  // --------------------------------------------------------------------------
  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomForm.title || !roomForm.slug || !roomForm.price_per_night || !roomForm.hero_image) {
      showToast("Please fill in all required fields (title, price, image)", "error");
      return;
    }

    setSubmittingRoom(true);
    try {
      const payload = {
        slug: roomForm.slug,
        title: roomForm.title,
        description: roomForm.description,
        hero_image: roomForm.hero_image,
        tier: roomForm.tier,
        price_per_night: parseFloat(roomForm.price_per_night),
        max_guests: parseInt(roomForm.max_guests, 10),
        bed_config: roomForm.bed_config,
        room_size: roomForm.room_size,
        view_type: roomForm.view_type,
        has_ac: roomForm.has_ac,
        has_balcony: roomForm.has_balcony,
        has_river_view: roomForm.has_river_view,
        has_hot_water: roomForm.has_hot_water,
        has_wifi: roomForm.has_wifi,
        has_power_backup: roomForm.has_power_backup,
        has_mosquito_net: roomForm.has_mosquito_net,
        is_active: true,
      };

      const { error } = await supabase.from("rooms").insert([payload]);
      if (error) throw error;

      showToast("Room added successfully to Supabase!");
      setRoomForm({
        title: "",
        slug: "",
        tier: "budget",
        price_per_night: "",
        max_guests: "2",
        description: "",
        hero_image: "",
        bed_config: "1 Double Bed",
        room_size: "220 sq.ft",
        view_type: "Garden View",
        has_ac: true,
        has_balcony: false,
        has_river_view: false,
        has_hot_water: true,
        has_wifi: true,
        has_power_backup: true,
        has_mosquito_net: true,
      });
      fetchRooms();
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to add room", "error");
    } finally {
      setSubmittingRoom(false);
    }
  };

  // Delete Room
  const handleDeleteRoom = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      const { error } = await supabase.from("rooms").delete().eq("id", id);
      if (error) throw error;
      showToast("Room deleted");
      fetchRooms();
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to delete room", "error");
    }
  };

  // --------------------------------------------------------------------------
  // Submit New Trip / Package
  // --------------------------------------------------------------------------
  const handleAddTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripForm.title || !tripForm.slug || !tripForm.price_per_person || !tripForm.hero_image) {
      showToast("Please fill in all required fields (title, price, image)", "error");
      return;
    }

    setSubmittingTrip(true);
    try {
      const payload = {
        slug: tripForm.slug,
        title: tripForm.title,
        pill_text: tripForm.pill_text,
        duration_text: tripForm.duration_text,
        days: parseInt(tripForm.days, 10),
        nights: parseInt(tripForm.nights, 10),
        duration_band: tripForm.duration_band,
        group_type: tripForm.group_type,
        price_per_person: parseFloat(tripForm.price_per_person),
        price_display: tripForm.price_display || `₹ ${parseInt(tripForm.price_per_person).toLocaleString("en-IN")}`,
        hero_image: tripForm.hero_image,
        rating: parseFloat(tripForm.rating),
        rating_label: tripForm.rating_label,
        review_count: parseInt(tripForm.review_count, 10),
        is_active: true,
        is_featured: true,
      };

      const { data: insertedTrip, error } = await supabase
        .from("trips")
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      // Inclusions & Exclusions
      const inclusions = tripForm.inclusionsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (inclusions.length > 0 && insertedTrip) {
        const incPayload = inclusions.map((item, idx) => ({
          trip_id: insertedTrip.id,
          item,
          sort_order: idx + 1,
        }));
        await supabase.from("trip_inclusions").insert(incPayload);
      }

      const exclusions = tripForm.exclusionsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (exclusions.length > 0 && insertedTrip) {
        const excPayload = exclusions.map((item, idx) => ({
          trip_id: insertedTrip.id,
          item,
          sort_order: idx + 1,
        }));
        await supabase.from("trip_exclusions").insert(excPayload);
      }

      showToast("Package added successfully to Supabase!");
      setTripForm({
        title: "",
        slug: "",
        pill_text: "Night on board | One Day, One Night | Sundarban",
        duration_text: "Sundarban 1 Day, 1 Night",
        days: "1",
        nights: "1",
        duration_band: "1N",
        group_type: "group",
        price_per_person: "",
        price_display: "₹ 3,675",
        hero_image: "",
        rating: "4.5",
        rating_label: "Very Good",
        review_count: "2900",
        inclusionsInput: "Boat transfers, Meals, Forest guide, Basic stay",
        exclusionsInput: "GST, Forest permit, Pickup/drop, Personal expenses",
      });
      fetchTrips();
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to add package", "error");
    } finally {
      setSubmittingTrip(false);
    }
  };

  // Delete Trip
  const handleDeleteTrip = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip package?")) return;
    try {
      const { error } = await supabase.from("trips").delete().eq("id", id);
      if (error) throw error;
      showToast("Package deleted");
      fetchTrips();
    } catch (err: unknown) {
      showToast((err as Error).message || "Failed to delete package", "error");
    }
  };

  // --------------------------------------------------------------------------
  // Loading Screen
  // --------------------------------------------------------------------------
  if (authLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#070C0A] text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#C5FE4E]" />
          <p className="text-sm font-medium tracking-wide text-gray-400">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Unauthenticated / Unauthorized Login & Signup View
  // --------------------------------------------------------------------------
  if (!session || !isAdmin) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#070C0A] px-4 py-12">
        <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#6DA003]/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#C5FE4E]/10 blur-[140px]" />

        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:p-10">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#C5FE4E]/30 bg-[#6DA003]/20 text-[#C5FE4E] shadow-[0_0_25px_rgba(197,254,78,0.2)]">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Admin Portal</h1>
            <p className="mt-2 text-xs text-gray-400 sm:text-sm">
              Default Admin: <span className="font-mono text-[#C5FE4E]">{DEFAULT_ADMIN_EMAIL}</span>
            </p>
          </div>

          {/* Mode Switcher: Sign In vs Sign Up */}
          <div className="mb-6 flex rounded-xl border border-white/10 bg-black/40 p-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode("signin");
                setAuthError("");
                setAuthSuccessMsg("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition ${
                authMode === "signin"
                  ? "bg-[#6DA003] text-white shadow-md"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("signup");
                setAuthError("");
                setAuthSuccessMsg("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition ${
                authMode === "signup"
                  ? "bg-[#6DA003] text-white shadow-md"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Sign Up</span>
            </button>
          </div>

          {authError && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
              <p>{authError}</p>
            </div>
          )}

          {authSuccessMsg && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              <p>{authSuccessMsg}</p>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={DEFAULT_ADMIN_EMAIL}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 backdrop-blur-md outline-none transition focus:border-[#C5FE4E] focus:ring-1 focus:ring-[#C5FE4E]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-300">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 backdrop-blur-md outline-none transition focus:border-[#C5FE4E] focus:ring-1 focus:ring-[#C5FE4E]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#6DA003] to-[#4E7502] py-3.5 font-semibold text-white shadow-[0_8px_25px_rgba(109,160,3,0.3)] transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmittingAuth ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{authMode === "signup" ? "Creating Account..." : "Signing In..."}</span>
                </>
              ) : (
                <>
                  <span>{authMode === "signup" ? "Create Account & Check Admin" : "Sign In to Dashboard"}</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <Link href="/" className="text-xs text-gray-400 hover:text-[#C5FE4E] transition">
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Authenticated Admin Dashboard View
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#070C0A] text-white">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-4 text-sm shadow-2xl backdrop-blur-xl transition duration-300 animate-in fade-in slide-in-from-bottom-4 ${
            toast.type === "success"
              ? "border-[#C5FE4E]/40 bg-[#6DA003]/20 text-[#C5FE4E]"
              : "border-red-500/40 bg-red-950/80 text-red-300"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070C0A]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6DA003]/20 text-[#C5FE4E] border border-[#C5FE4E]/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Greenview Homestay Admin
              </h1>
              <p className="text-xs text-gray-400">
                Logged in as: <span className="font-semibold text-[#C5FE4E]">{session.user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/10 transition sm:flex"
            >
              <Eye className="h-4 w-4" />
              <span>Live Site</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="mb-8 flex border-b border-white/10">
          <button
            onClick={() => setActiveTab("rooms")}
            className={`flex items-center gap-2.5 border-b-2 px-6 py-4 text-sm font-semibold transition ${
              activeTab === "rooms"
                ? "border-[#C5FE4E] text-[#C5FE4E]"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <BedDouble className="h-5 w-5" />
            <span>Manage Rooms ({roomsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("trips")}
            className={`flex items-center gap-2.5 border-b-2 px-6 py-4 text-sm font-semibold transition ${
              activeTab === "trips"
                ? "border-[#C5FE4E] text-[#C5FE4E]"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Compass className="h-5 w-5" />
            <span>Manage Tour Packages ({tripsList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("hero")}
            className={`flex items-center gap-2.5 border-b-2 px-6 py-4 text-sm font-semibold transition ${
              activeTab === "hero"
                ? "border-[#C5FE4E] text-[#C5FE4E]"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Sparkles className="h-5 w-5" />
            <span>Manage Hero Section</span>
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex items-center gap-2.5 border-b-2 px-6 py-4 text-sm font-semibold transition ${
              activeTab === "gallery"
                ? "border-[#C5FE4E] text-[#C5FE4E]"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <Images className="h-5 w-5" />
            <span>Manage Gallery ({galleryList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-2.5 border-b-2 px-6 py-4 text-sm font-semibold transition ${
              activeTab === "reviews"
                ? "border-[#C5FE4E] text-[#C5FE4E]"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            <MessageSquareQuote className="h-5 w-5" />
            <span>Manage Reviews ({reviewsList.length})</span>
          </button>
        </div>

        {/* TAB 1: ROOMS MANAGEMENT */}
        {activeTab === "rooms" && (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Left Column: Add Room Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <PlusCircle className="h-5 w-5 text-[#C5FE4E]" />
                    <h2 className="text-xl font-bold text-white">Add New Room</h2>
                  </div>
                  <span className="rounded-full bg-[#6DA003]/20 px-3 py-1 text-xs font-semibold text-[#C5FE4E] border border-[#6DA003]/40">
                    Supabase DB
                  </span>
                </div>

                <form onSubmit={handleAddRoom} className="space-y-6">
                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">
                        Room Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={roomForm.title}
                        onChange={(e) => handleRoomTitleChange(e.target.value)}
                        placeholder="e.g. Deluxe Riverside Cottage"
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C5FE4E]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={roomForm.slug}
                        onChange={(e) => setRoomForm((p) => ({ ...p, slug: e.target.value }))}
                        placeholder="deluxe-riverside-cottage"
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-gray-300 outline-none focus:border-[#C5FE4E]"
                      />
                    </div>
                  </div>

                  {/* Tier, Price, Max Guests */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">
                        Room Tier *
                      </label>
                      <select
                        value={roomForm.tier}
                        onChange={(e) => setRoomForm((p) => ({ ...p, tier: e.target.value as RoomTier }))}
                        className="w-full rounded-xl border border-white/10 bg-[#070C0A] p-3 text-sm text-white outline-none focus:border-[#C5FE4E]"
                      >
                        <option value="budget">Budget Tier</option>
                        <option value="premium">Premium Tier</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">
                        Price / Night (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        step="100"
                        value={roomForm.price_per_night}
                        onChange={(e) => setRoomForm((p) => ({ ...p, price_per_night: e.target.value }))}
                        placeholder="2500"
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C5FE4E]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">
                        Max Guests *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="10"
                        value={roomForm.max_guests}
                        onChange={(e) => setRoomForm((p) => ({ ...p, max_guests: e.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-[#C5FE4E]"
                      />
                    </div>
                  </div>

                  {/* Image Upload & Preview */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">
                      Room Image * (Direct Upload to Supabase Storage)
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#C5FE4E]/50 bg-[#6DA003]/10 px-5 py-3 text-xs font-semibold text-[#C5FE4E] hover:bg-[#6DA003]/20 transition">
                        {uploadingRoomImage ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Uploading to Storage...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            <span>Upload Image File</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleRoomImageUpload}
                          disabled={uploadingRoomImage}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs text-gray-400">or Public Storage URL:</span>
                      <input
                        type="text"
                        value={roomForm.hero_image}
                        onChange={(e) => setRoomForm((p) => ({ ...p, hero_image: e.target.value }))}
                        placeholder="https://...supabase.co/storage/v1/object/public/..."
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C5FE4E]"
                      />
                    </div>

                    {roomForm.hero_image && (
                      <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-2">
                        <div className="relative h-16 w-24 overflow-hidden rounded-xl">
                          <Image
                            src={getStorageImageUrl(roomForm.hero_image)}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="truncate text-xs text-gray-300">
                          <p className="font-semibold text-white">Selected Image:</p>
                          <p className="truncate text-gray-400">{roomForm.hero_image}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">
                      Room Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={roomForm.description}
                      onChange={(e) => setRoomForm((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Spacious cottage with panoramic river view, king size bed, attached bath and private balcony."
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C5FE4E]"
                    />
                  </div>

                  {/* Extra Specs */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-400">Bed Config</label>
                      <input
                        type="text"
                        value={roomForm.bed_config}
                        onChange={(e) => setRoomForm((p) => ({ ...p, bed_config: e.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-400">Room Size</label>
                      <input
                        type="text"
                        value={roomForm.room_size}
                        onChange={(e) => setRoomForm((p) => ({ ...p, room_size: e.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-400">View Type</label>
                      <input
                        type="text"
                        value={roomForm.view_type}
                        onChange={(e) => setRoomForm((p) => ({ ...p, view_type: e.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Amenities Checkboxes */}
                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase text-gray-300">
                      Room Amenities
                    </label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        { key: "has_ac", label: "Air Conditioned" },
                        { key: "has_balcony", label: "Private Balcony" },
                        { key: "has_river_view", label: "River View" },
                        { key: "has_hot_water", label: "24/7 Hot Water" },
                        { key: "has_wifi", label: "Wi-Fi" },
                        { key: "has_power_backup", label: "Power Backup" },
                        { key: "has_mosquito_net", label: "Mosquito Net" },
                      ].map((item) => (
                        <label
                          key={item.key}
                          className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-gray-300 hover:bg-white/10"
                        >
                          <input
                            type="checkbox"
                            checked={Boolean(roomForm[item.key as keyof typeof roomForm])}
                            onChange={(e) =>
                              setRoomForm((p) => ({ ...p, [item.key]: e.target.checked }))
                            }
                            className="h-4 w-4 rounded accent-[#C5FE4E]"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingRoom}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#6DA003] to-[#4E7502] py-4 font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                  >
                    {submittingRoom ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Inserting Room into Supabase...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-5 w-5" />
                        <span>Publish New Room</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Existing Rooms List */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
                <h2 className="mb-6 text-xl font-bold text-white">Existing Rooms</h2>

                {loadingRooms ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-[#C5FE4E]" />
                  </div>
                ) : roomsList.length === 0 ? (
                  <p className="text-center text-sm text-gray-400">No rooms found in Supabase database.</p>
                ) : (
                  <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
                    {roomsList.map((room) => (
                      <div
                        key={room.id}
                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 hover:border-white/20 transition"
                      >
                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={getStorageImageUrl(room.hero_image)}
                            alt={room.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 truncate">
                          <h3 className="truncate text-sm font-semibold text-white">{room.title}</h3>
                          <div className="mt-1 flex items-center gap-2 text-xs">
                            <span
                              className={`rounded-full px-2 py-0.5 font-medium ${
                                room.tier === "premium"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              }`}
                            >
                              {room.tier}
                            </span>
                            <span className="text-gray-400">₹{room.price_per_night}/night</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition"
                          title="Delete room"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRIPS / PACKAGES MANAGEMENT */}
        {activeTab === "trips" && (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Left Column: Add Trip Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <PlusCircle className="h-5 w-5 text-[#C5FE4E]" />
                    <h2 className="text-xl font-bold text-white">Add New Tour Package</h2>
                  </div>
                  <span className="rounded-full bg-[#6DA003]/20 px-3 py-1 text-xs font-semibold text-[#C5FE4E] border border-[#6DA003]/40">
                    Supabase DB
                  </span>
                </div>

                <form onSubmit={handleAddTrip} className="space-y-6">
                  {/* Title & Slug */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">
                        Package Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={tripForm.title}
                        onChange={(e) => handleTripTitleChange(e.target.value)}
                        placeholder="e.g. Sundarban Wildlife Safari 2D/3N"
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C5FE4E]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={tripForm.slug}
                        onChange={(e) => setTripForm((p) => ({ ...p, slug: e.target.value }))}
                        placeholder="sundarban-wildlife-safari-2d-3n"
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-gray-300 outline-none focus:border-[#C5FE4E]"
                      />
                    </div>
                  </div>

                  {/* Pill Text & Duration Text */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">
                        Card Pill Badge Text
                      </label>
                      <input
                        type="text"
                        value={tripForm.pill_text}
                        onChange={(e) => setTripForm((p) => ({ ...p, pill_text: e.target.value }))}
                        placeholder="Night on board | Two Days, Three Nights | Sundarban"
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-[#C5FE4E]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">
                        Duration Text Display *
                      </label>
                      <input
                        type="text"
                        required
                        value={tripForm.duration_text}
                        onChange={(e) => setTripForm((p) => ({ ...p, duration_text: e.target.value }))}
                        placeholder="Sundarban 2 Days, 3 Nights"
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-[#C5FE4E]"
                      />
                    </div>
                  </div>

                  {/* Days, Nights, Band, Group */}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">Days</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={tripForm.days}
                        onChange={(e) => setTripForm((p) => ({ ...p, days: e.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">Nights</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={tripForm.nights}
                        onChange={(e) => setTripForm((p) => ({ ...p, nights: e.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">
                        Duration Band
                      </label>
                      <select
                        value={tripForm.duration_band}
                        onChange={(e) =>
                          setTripForm((p) => ({ ...p, duration_band: e.target.value as DurationBand }))
                        }
                        className="w-full rounded-xl border border-white/10 bg-[#070C0A] p-3 text-sm text-white outline-none"
                      >
                        <option value="1N">1 Night</option>
                        <option value="2N">2 Nights</option>
                        <option value="3N+">3+ Nights</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">
                        Group Type
                      </label>
                      <select
                        value={tripForm.group_type}
                        onChange={(e) =>
                          setTripForm((p) => ({ ...p, group_type: e.target.value as GroupType }))
                        }
                        className="w-full rounded-xl border border-white/10 bg-[#070C0A] p-3 text-sm text-white outline-none"
                      >
                        <option value="group">Group</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">
                        Price Per Person (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        step="50"
                        value={tripForm.price_per_person}
                        onChange={(e) =>
                          setTripForm((p) => ({
                            ...p,
                            price_per_person: e.target.value,
                            price_display: e.target.value
                              ? `₹ ${parseFloat(e.target.value).toLocaleString("en-IN")}`
                              : "",
                          }))
                        }
                        placeholder="4675"
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">
                        Price Display String
                      </label>
                      <input
                        type="text"
                        value={tripForm.price_display}
                        onChange={(e) => setTripForm((p) => ({ ...p, price_display: e.target.value }))}
                        placeholder="₹ 4,675"
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Hero Image Upload */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">
                      Package Image * (Direct Upload to Supabase Storage)
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#C5FE4E]/50 bg-[#6DA003]/10 px-5 py-3 text-xs font-semibold text-[#C5FE4E] hover:bg-[#6DA003]/20 transition">
                        {uploadingTripImage ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Uploading to Storage...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            <span>Upload Image File</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleTripImageUpload}
                          disabled={uploadingTripImage}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs text-gray-400">or Public Storage URL:</span>
                      <input
                        type="text"
                        value={tripForm.hero_image}
                        onChange={(e) => setTripForm((p) => ({ ...p, hero_image: e.target.value }))}
                        placeholder="https://...supabase.co/storage/v1/object/public/..."
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none"
                      />
                    </div>

                    {tripForm.hero_image && (
                      <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 p-2">
                        <div className="relative h-16 w-24 overflow-hidden rounded-xl">
                          <Image
                            src={getStorageImageUrl(tripForm.hero_image)}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="truncate text-xs text-gray-300">
                          <p className="font-semibold text-white">Selected Image:</p>
                          <p className="truncate text-gray-400">{tripForm.hero_image}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Inclusions & Exclusions */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">
                      Inclusions (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={tripForm.inclusionsInput}
                      onChange={(e) => setTripForm((p) => ({ ...p, inclusionsInput: e.target.value }))}
                      placeholder="Boat safari, Guided birdwatching, Meals, Riverside stay"
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-gray-300 uppercase">
                      Exclusions (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={tripForm.exclusionsInput}
                      onChange={(e) => setTripForm((p) => ({ ...p, exclusionsInput: e.target.value }))}
                      placeholder="GST, Forest permit, Personal expenses"
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingTrip}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#6DA003] to-[#4E7502] py-4 font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                  >
                    {submittingTrip ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Inserting Package into Supabase...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-5 w-5" />
                        <span>Publish New Package</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Existing Trips List */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
                <h2 className="mb-6 text-xl font-bold text-white">Existing Packages</h2>

                {loadingTrips ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-[#C5FE4E]" />
                  </div>
                ) : tripsList.length === 0 ? (
                  <p className="text-center text-sm text-gray-400">No packages found in Supabase database.</p>
                ) : (
                  <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1">
                    {tripsList.map((trip) => (
                      <div
                        key={trip.id}
                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 hover:border-white/20 transition"
                      >
                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={getStorageImageUrl(trip.hero_image)}
                            alt={trip.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 truncate">
                          <h3 className="truncate text-sm font-semibold text-white">{trip.title}</h3>
                          <div className="mt-1 flex items-center gap-2 text-xs">
                            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-blue-300 border border-blue-500/40 font-medium">
                              {trip.duration_band}
                            </span>
                            <span className="text-gray-400">{trip.price_display} / person</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTrip(trip.id)}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition"
                          title="Delete trip"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HERO SECTION MANAGEMENT */}
        {activeTab === "hero" && (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-12">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="h-6 w-6 text-[#C5FE4E]" />
                    <h2 className="text-xl font-bold text-white">Manage Hero Section & Storage Images</h2>
                  </div>
                  <button
                    onClick={fetchHeroContent}
                    className="flex items-center gap-1 text-xs text-[#C5FE4E] hover:underline"
                  >
                    Reload Live Data
                  </button>
                </div>

                {loadingHero ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-[#C5FE4E]" />
                  </div>
                ) : (
                  <form onSubmit={handleSaveHero} className="space-y-6">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase text-gray-300">
                        Hero Main Title (HTML supported for highlighted text) *
                      </label>
                      <input
                        type="text"
                        value={heroForm.title}
                        onChange={(e) => setHeroForm((p) => ({ ...p, title: e.target.value }))}
                        placeholder='Escape. <span class="text-[#C5FE4E]">Relax.</span> Mangroves.'
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3.5 text-sm text-white outline-none focus:border-[#C5FE4E]"
                      />
                      <p className="mt-1 text-xs text-gray-400">
                        Tip: Use &lt;span class=&quot;text-[#C5FE4E]&quot;&gt;Word&lt;/span&gt; to highlight words in neon green.
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase text-gray-300">
                        Hero Description / Subtitle Paragraph *
                      </label>
                      <textarea
                        rows={5}
                        value={heroForm.subtitle}
                        onChange={(e) => setHeroForm((p) => ({ ...p, subtitle: e.target.value }))}
                        placeholder="Escape into the untouched wilderness of the Sundarbans..."
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3.5 text-sm text-white outline-none focus:border-[#C5FE4E]"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase text-gray-300">
                          CTA Button Text
                        </label>
                        <input
                          type="text"
                          value={heroForm.buttonText}
                          onChange={(e) => setHeroForm((p) => ({ ...p, buttonText: e.target.value }))}
                          placeholder="Book your Trip"
                          className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-[#C5FE4E]"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase text-gray-300">
                          CTA Button Target Link
                        </label>
                        <input
                          type="text"
                          value={heroForm.buttonLink}
                          onChange={(e) => setHeroForm((p) => ({ ...p, buttonLink: e.target.value }))}
                          placeholder="/booking"
                          className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-[#C5FE4E]"
                        />
                      </div>
                    </div>

                    {/* Hero Carousel Images */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase text-gray-300">
                        Hero Background Carousel Images (Upload directly to Supabase Storage)
                      </label>

                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#C5FE4E]/50 bg-[#6DA003]/10 px-5 py-3 text-xs font-semibold text-[#C5FE4E] transition hover:bg-[#6DA003]/20">
                          {uploadingHeroImage ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Uploading Images to Storage...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4" />
                              <span>Upload Multiple Image Files</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleHeroImageUpload}
                            disabled={uploadingHeroImage}
                            className="hidden"
                          />
                        </label>

                        <span className="text-xs text-gray-400">or Public Storage URL:</span>
                        <input
                          type="text"
                          value={newHeroImageUrl}
                          onChange={(e) => setNewHeroImageUrl(e.target.value)}
                          placeholder="https://...supabase.co/storage/v1/object/public/..."
                          className="flex-1 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-[#C5FE4E]"
                        />
                        <button
                          type="button"
                          onClick={handleAddHeroImageUrl}
                          className="rounded-xl border border-[#C5FE4E]/40 bg-[#C5FE4E]/10 px-4 py-3 text-xs font-semibold text-[#C5FE4E] hover:bg-[#C5FE4E]/20"
                        >
                          Add URL
                        </button>
                      </div>

                      {/* Image Thumbnails Grid */}
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                        {heroForm.images.map((src, index) => (
                          <div
                            key={`${src}-${index}`}
                            className="group relative h-28 overflow-hidden rounded-2xl border border-white/10 bg-black/40"
                          >
                            <Image
                              src={getStorageImageUrl(src)}
                              alt={`Hero Carousel Image ${index + 1}`}
                              fill
                              className="object-cover transition group-hover:scale-105"
                              unoptimized
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveHeroImage(index)}
                              className="absolute top-2 right-2 rounded-full bg-red-500/80 p-1.5 text-white transition hover:bg-red-600"
                              title="Remove image"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="absolute bottom-1 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                              #{index + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingHero}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#6DA003] to-[#4E7502] py-4 font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                    >
                      {submittingHero ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Updating Hero Section in Supabase...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-5 w-5" />
                          <span>Save Hero Section Changes</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GALLERY MANAGEMENT */}
        {activeTab === "gallery" && (
          <div className="flex flex-col gap-8">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Images className="h-5 w-5 text-[#C5FE4E]" />
                    <span>Supabase Storage Gallery Images</span>
                  </h2>
                  <p className="mt-1 text-xs text-gray-400">
                    Bucket Path: <code className="text-[#C5FE4E]">green_view_home_stay/images/gallery/</code>
                  </p>
                </div>

                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#C5FE4E]/50 bg-[#6DA003]/10 px-5 py-3 text-xs font-semibold text-[#C5FE4E] transition hover:bg-[#6DA003]/20">
                  {uploadingGalleryImages ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading to Supabase Storage...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Upload Multiple Gallery Images</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    disabled={uploadingGalleryImages}
                    className="hidden"
                  />
                </label>
              </div>

              {loadingGallery ? (
                <div className="flex py-16 justify-center items-center text-[#C5FE4E]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : galleryList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-gray-400">
                  No images found in Supabase Storage <code className="text-[#C5FE4E]">images/gallery/</code>.
                  Upload your first batch above!
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {galleryList.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 transition hover:border-[#C5FE4E]/50"
                    >
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black/40">
                        <Image
                          src={item.url}
                          alt={item.name}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-105"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryImage(item.name)}
                          className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg backdrop-blur-md transition hover:bg-red-500 hover:scale-110"
                          title="Delete image from Supabase Storage"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 truncate px-1 text-[11px] font-medium text-gray-300">
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: REVIEWS MANAGEMENT */}
        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Left Column: Add New Review Form */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <PlusCircle className="h-5 w-5 text-[#C5FE4E]" />
                    <h2 className="text-xl font-bold text-white">Add Customer Review</h2>
                  </div>
                  <span className="rounded-full bg-[#6DA003]/20 px-3 py-1 text-xs font-semibold text-[#C5FE4E] border border-[#6DA003]/40">
                    Supabase DB
                  </span>
                </div>

                <form onSubmit={handleCreateReviewSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Customer Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Soumen Das"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#C5FE4E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Rating (1 to 5 Stars)
                    </label>
                    <div className="flex items-center gap-2 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                          className="p-1 transition hover:scale-125"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= reviewForm.rating
                                ? "fill-[#F5B301] text-[#F5B301]"
                                : "fill-white/10 text-white/20"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-semibold text-[#C5FE4E]">
                        {reviewForm.rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Review Text <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={reviewForm.text}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, text: e.target.value }))}
                      placeholder="Enter customer review text..."
                      className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white placeholder-gray-500 focus:border-[#C5FE4E] focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Customer Photo
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={reviewForm.image}
                        onChange={(e) => setReviewForm((prev) => ({ ...prev, image: e.target.value }))}
                        placeholder="Image URL or upload file..."
                        className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#C5FE4E] focus:outline-none"
                      />
                      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-gray-300 hover:bg-white/10">
                        {uploadingReviewImage ? (
                          <Loader2 className="h-4 w-4 animate-spin text-[#C5FE4E]" />
                        ) : (
                          <Upload className="h-4 w-4 text-[#C5FE4E]" />
                        )}
                        <span>Browse</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingReviewImage(true);
                            try {
                              const url = await uploadImageToStorage(file, "images/reviews");
                              setReviewForm((prev) => ({ ...prev, image: url }));
                              showToast("Photo uploaded to Supabase Storage!");
                            } catch (err: unknown) {
                              showToast((err as Error).message || "Failed to upload image", "error");
                            } finally {
                              setUploadingReviewImage(false);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-4">
                    <div>
                      <span className="text-xs font-semibold text-white">Show on Homepage</span>
                      <p className="text-[11px] text-gray-400">Controls whether this review appears in Homepage Carousel</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReviewForm((prev) => ({ ...prev, show_in_home: !prev.show_in_home }))}
                      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                        reviewForm.show_in_home
                          ? "bg-[#6DA003]/20 text-[#C5FE4E] border border-[#6DA003]/40"
                          : "bg-gray-800 text-gray-400 border border-gray-700"
                      }`}
                    >
                      {reviewForm.show_in_home ? (
                        <>
                          <ToggleRight className="h-4 w-4 text-[#C5FE4E]" />
                          <span>YES</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="h-4 w-4 text-gray-400" />
                          <span>NO</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#6DA003] to-[#4E7502] py-4 font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                  >
                    {submittingReview ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Saving Review to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-5 w-5" />
                        <span>Add Review</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Reviews List & Visibility Management */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <MessageSquareQuote className="h-5 w-5 text-[#C5FE4E]" />
                      <span>Customer Reviews ({reviewsList.length})</span>
                    </h2>
                    <p className="mt-1 text-xs text-gray-400">
                      Toggle <code className="text-[#C5FE4E]">show_in_home</code> to show/hide reviews on Homepage
                    </p>
                  </div>
                </div>

                {loadingReviews ? (
                  <div className="flex py-16 justify-center items-center text-[#C5FE4E]">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : reviewsList.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-gray-400">
                    No reviews found in Supabase DB. Add your first review on the left!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviewsList.map((review) => (
                      <div
                        key={review.id}
                        className={`flex flex-col gap-4 rounded-2xl border p-4 transition sm:flex-row sm:items-center sm:justify-between ${
                          review.show_in_home
                            ? "border-[#C5FE4E]/30 bg-white/5"
                            : "border-white/5 bg-black/40 opacity-75"
                        }`}
                      >
                        <div className="flex items-start gap-4 flex-1">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-black/50 border border-white/10">
                            {review.image ? (
                              <Image
                                src={review.image}
                                alt={review.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-500 font-bold">
                                {review.name.charAt(0)}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-white truncate">{review.name}</h3>
                              <div className="flex items-center text-[#F5B301] text-xs">
                                <Star className="h-3.5 w-3.5 fill-current" />
                                <span className="ml-1 font-semibold text-gray-300">{review.rating}</span>
                              </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-300 line-clamp-2 leading-relaxed">
                              "{review.text}"
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                          {/* Homepage Display Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleShowInHome(review)}
                            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                              review.show_in_home
                                ? "border-[#C5FE4E]/50 bg-[#6DA003]/20 text-[#C5FE4E] hover:bg-[#6DA003]/30"
                                : "border-gray-700 bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                            }`}
                            title="Click to toggle homepage visibility"
                          >
                            {review.show_in_home ? (
                              <>
                                <ToggleRight className="h-4 w-4 text-[#C5FE4E]" />
                                <span>Showing on Home</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                                <span>Hidden from Home</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteReview(review.id, review.name)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                            title="Delete review"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
