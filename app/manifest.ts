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
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
