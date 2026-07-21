# 🌿 Sundarban Greenview Homestay

A modern, high-performance, dynamic web application and admin portal for **Sundarban Greenview Homestay**, designed to showcase luxury homestay accommodations, curated Sundarban tour packages, a 3D photo gallery, and interactive customer reviews.

---

## ✨ Features

- ** dynamic Hero Carousel & Content**: Admin-configurable title, subtitle, CTA button links, and multi-image background carousels stored in Supabase.
- ** 3D Interactive Photo Gallery**: Directly synced with Supabase Storage (`images/gallery/`) featuring drag & click preview modes.
- ** Dynamic Rooms & Bookings**: Browse Budget and Premium rooms fetched from Supabase DB with automated WhatsApp booking integration.
- ** Curated Sundarban Tour Packages**: 1-Day, 2-Day, and 3-Day tour packages with detailed inclusions, exclusions, and custom trip booking.
- ** Dynamic Customer Reviews**:
  - Live customer reviews carousel with dynamic 1-5 star rating displays.
  - Interactive "Write a Review" modal with landscape photo validation and direct upload to Supabase Storage.
  - Admin panel control to toggle homepage visibility (`show_in_home`).
- ** Secured Admin Dashboard (`/admin`)**:
  - Supabase Email & Password Authentication.
  - Admin verification via `admin_users` table and default admin override.
  - Tabbed management for Rooms, Tour Packages, Hero Section, Gallery, and Reviews.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [GSAP](https://greensock.com/gsap/) (MotionPathPlugin, ScrollTrigger, `@gsap/react`)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL & Storage Buckets)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utilities**: `react-dropzone`, `canvas-confetti`

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm, pnpm, yarn, or bun

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/sundarban-greenview-homestay.git
cd sundarban-greenview-homestay
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://fupyposiegpynmgndboz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Setup (Supabase SQL)

To set up the database tables and storage policies, execute the SQL migration scripts in your Supabase SQL Editor:

1. **Reviews Table**: `supabase_reviews.sql`
   - Creates `public.reviews` table (`id`, `name`, `text`, `rating`, `image`, `show_in_home`, `created_at`).
   - Configures RLS policies for public select/insert and authenticated admin access.

2. **Storage Bucket**:
   - Bucket Name: `green_view_home_stay` (Public access enabled).
   - Folders: `rooms/`, `trips/`, `hero/`, `images/gallery/`, `images/reviews/`.

---

## 📜 Available Scripts

- `npm run dev` — Starts Next.js development server with Turbopack.
- `npm run build` — Builds optimized production bundle.
- `npm run start` — Starts production server.
- `npm run lint` — Runs Next.js linter checks.
- `npx tsc --noEmit` — Validates TypeScript types across the project.

---

## 🔒 Admin Access

Access the Admin Dashboard at [`/admin`](http://localhost:3000/admin) to manage rooms, tour packages, hero section content, gallery images, and customer reviews.
