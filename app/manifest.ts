import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sundarban Greenview Homestay",
    short_name: "Greenview Homestay",
    description: "Best Eco Resort & River View Homestay near Pakhiralay, Sundarbans",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAFA",
    theme_color: "#6DA003",
    icons: [
      {
        src: "/images/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
