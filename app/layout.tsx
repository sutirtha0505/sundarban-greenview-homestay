import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ImageCacheProvider from "@/components/ImageCacheProvider";
import JsonLd from "@/components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sundarbangreenviewhomestay.com";

export const viewport: Viewport = {
  themeColor: "#6DA003",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sundarban Greenview Homestay | Best Eco Resort & River View Stay in Sundarbans",
    template: "%s | Sundarban Greenview Homestay",
  },
  description:
    "Book your stay at Sundarban Greenview Homestay — located near Pakhiralay, Gosaba. Experience river view AC/non-AC rooms, authentic home-cooked Bengali cuisine, and curated boat safaris in the Sundarbans. Best price & hospitalities guaranteed!",
  keywords: [
    "Sundarban Greenview Homestay",
    "Best homestay in Sundarban",
    "Sundarban resort Pakhiralay",
    "Sundarban river view room",
    "Sundarban tour packages",
    "Sundarban boat safari booking",
    "Gosaba homestay Sundarban",
    "Sundarban tiger reserve tour",
    "Sundarban eco tourism West Bengal",
    "Bengali food homestay Sundarban",
    "Pakhiralay homestay",
    "Sundarban budget homestay"
  ],
  authors: [{ name: "Sundarban Greenview Homestay", url: SITE_URL }],
  creator: "Sundarban Greenview Homestay",
  publisher: "Sundarban Greenview Homestay",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
    },
  },
  openGraph: {
    title: "Sundarban Greenview Homestay | Best Eco Resort & River View Stay",
    description:
      "Experience untamed Sundarban wilderness with river view rooms, authentic Bengali home food, and curated jungle boat safaris near Pakhiralay, Gosaba.",
    url: SITE_URL,
    siteName: "Sundarban Greenview Homestay",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://fupyposiegpynmgndboz.supabase.co/storage/v1/object/public/green_view_home_stay/images/gallery/image1.jpg",
        width: 1200,
        height: 630,
        alt: "Sundarban Greenview Homestay Riverside View",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sundarban Greenview Homestay | Luxury Eco Stay & Jungle Safaris",
    description:
      "Riverside rooms, authentic Bengali cuisine, and guided boat safaris in the heart of Sundarbans delta.",
    images: [
      "https://fupyposiegpynmgndboz.supabase.co/storage/v1/object/public/green_view_home_stay/images/gallery/image1.jpg",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Travel & Tourism",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <JsonLd />
      </head>
      <body className="min-h-full flex flex-col">
        <ImageCacheProvider>{children}</ImageCacheProvider>
      </body>
    </html>
  );
}
