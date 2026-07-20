@AGENTS.md

# Sundarban Greenview Homestay

Marketing site for a homestay in Pakhiralay, West Bengal, at the edge of the Sundarbans
mangrove delta. Next.js 16 (App Router) + React 19 + Tailwind v4 + GSAP.

---

## 1. Current State

### Routes

Exactly one route exists: `/` ([app/page.tsx](app/page.tsx)). Everything is a section
component stacked in a single `<main>`:

```
Navbar → HeroPage → Trips → Rooms → About → Activities → Gallery → Reviews → SocialMedia → Contact
```

There is **no** `app/api/`, no route handlers, no `loading.tsx` / `error.tsx` /
`not-found.tsx`, no `sitemap.ts` / `robots.ts`, and no per-page metadata beyond the
root `metadata` export in [app/layout.tsx](app/layout.tsx).

### Component inventory

| File | Client? | Role | Data source |
|---|---|---|---|
| [components/Navbar.tsx](components/Navbar.tsx) | server | Floating pill nav, logo, Book Now CTA | inline JSX |
| [components/hero.tsx](components/hero.tsx) | client | Full-screen crossfade hero + thumbnail carousel | `roomImages[]` local |
| [components/Trips.tsx](components/Trips.tsx) | client | 1/2/3-up tour package cards, autoplay | `tripsData[]` local |
| [components/rooms.tsx](components/rooms.tsx) | client | Budget/Premium tabs + GSAP arc carousel | `budgetRooms[]`, `premiumRooms[]` local |
| [components/About.tsx](components/About.tsx) | server | Bento image grid wrapping a centered text card | hardcoded image paths |
| [components/Activities.tsx](components/Activities.tsx) | client | Text slider + bento grid + kingfisher cutout | `activities[]` local |
| [components/Gallery.tsx](components/Gallery.tsx) | server | Reads `public/images/gallery` via `fs`, feeds DomeGallery | filesystem |
| [components/DomeGallery.tsx](components/DomeGallery.tsx) | client | 3D draggable sphere of images (`@use-gesture/react`) | props |
| [components/Reviews.tsx](components/Reviews.tsx) | client | GSAP arc carousel of review cards | `reviewsData[]` local |
| [components/SocialMedia.tsx](components/SocialMedia.tsx) | server | YouTube embed + social still | inline |
| [components/Contact.tsx](components/Contact.tsx) | server | Footer: contact card, link grid, contact form | `NAV_LINKS[]`, `CONTACT_ITEMS[]` local |

### Known gaps to fix while building pages

These are real defects found while reading the code — address them as the pages below
get built, don't replicate them:

1. **Navbar links are dead.** They are `<li>` elements with no `href`. Once real routes
   exist they must become `next/link` `<Link>`s.
2. **No mobile navigation.** The link list is `hidden lg:block` with no hamburger or
   drawer. Below `lg` there is no way to navigate at all.
3. **Broken anchors.** `NAV_LINKS` in Contact.tsx points at `#trips`, `#about`,
   `#gallery`, but only `#rooms`, `#activities`, `#reviews` have matching `id`s.
4. **Two greens in use.** `#6DA003` (hero, rooms, about, activities) and `#71A129`
   (trips, gallery, reviews, social) are used interchangeably. Pick one — see §3.
5. **Design tokens are unused.** [app/globals.css](app/globals.css) still holds the
   stock shadcn *neutral grayscale* palette (`--primary: oklch(0.205 0 0)` = near-black).
   Every brand colour in the app is a hardcoded hex literal. New work should move to
   tokens (§3.6).
6. **`font-[glidaDisplay]`** in [components/rooms.tsx](components/rooms.tsx) references
   a font that is never loaded — it silently falls back.
7. **`Open_Sans` is applied wrong** in [components/About.tsx](components/About.tsx):
   `${openSans.variable}` only defines a CSS variable, it does not set `font-family`.
   Use `openSans.className`, or wire the variable into `@theme` and use a utility.
8. **Activities copy is lorem ipsum.** All six entries need real descriptions.
9. **Contact form is inert** — no `action`, no server action, no validation, no state.
10. **Unescaped apostrophe** in Activities.tsx (`Activities You'll Never Forget`) — will
    trip `react/no-unescaped-entities`.
11. **Filename casing is inconsistent**: `hero.tsx` / `rooms.tsx` are lowercase, the rest
    are PascalCase. New components: **PascalCase**.

---

## 2. Pages To Build

Each page below lists the route, its purpose, and the blocks it must contain. Reuse the
existing section components wherever noted rather than rewriting them.

### 2.1 `/` — Home (exists, needs polish)

Keep the current section order. Add:
- Real `id` attributes on every section (`#trips`, `#rooms`, `#about`, `#activities`,
  `#gallery`, `#reviews`, `#contact`) so nav anchors resolve.
- A "Why stay with us" strip between About and Activities: 4 icon + label cards
  (Riverside location · Home-cooked Bengali meals · Licensed forest guides · Family-run).
- Each home section becomes a *teaser* that links to its full page: "View all trips →",
  "See all rooms →", "Full gallery →", "Read all reviews →".

### 2.2 `/trips` — Tour packages index

- Page header: "Book your Trips" (reuse the hairline + two-tone serif heading pattern).
- Filter/sort bar: duration (1N/2N/3N+), price range, group vs private.
- Responsive grid of the existing trip card (3-up desktop / 2-up tablet / 1-up mobile) —
  as a static grid here, **not** the autoplay carousel.
- Each card: hero image, duration pill, itinerary title, rating badge + review count,
  `₹ price / per person`, "View Details" button.
- "What's included / not included" comparison table across packages.
- Bottom CTA band: "Can't decide? Talk to us" → phone + WhatsApp.

### 2.3 `/trips/[slug]` — Single package

- Image gallery header (hero + thumbnail strip — reuse the hero pattern).
- Title, duration, group size, meeting point, languages.
- **Day-by-day itinerary** as a vertical timeline (Day 1 → arrival, Day 2 → Sajnekhali,
  etc.).
- Inclusions / exclusions two-column list.
- Price block: per-person price, child pricing, sticky "Book this trip" card on desktop.
- Route map or "How to reach the departure point".
- What to carry + best season for this package.
- Cancellation policy summary linking to `/policies/cancellation`.
- Reviews filtered to this package.
- "Similar trips" carousel.

### 2.4 `/rooms` — Accommodation index

- Header with the existing **Budget / Premium** pill toggle.
- Grid of room cards (image, title, description, amenity icons, per-night price,
  "View Details").
- Amenities legend: AC / non-AC, attached bath, hot water, river view, balcony, Wi-Fi,
  power backup, mosquito netting.
- Occupancy + extra-bed policy table.
- Meal plan note (breakfast/all-meals included).
- CTA: "Check availability".

### 2.5 `/rooms/[slug]` — Single room

- Image carousel of that room.
- Full description, size, bed configuration, max occupancy, view.
- Amenity checklist grid.
- Per-night pricing table by season (peak Nov–Feb vs off-season).
- House rules: check-in 12:00 / check-out 10:00, no smoking, quiet hours.
- Availability/date-picker widget → `/booking?room=<slug>`.
- "Other rooms you may like".

### 2.6 `/activities` — Things to do

- Header: "Activities You'll Never Forget".
- Card grid replacing the current one-at-a-time slider (the slider stays on home as a
  teaser). One card per activity with image, title, guide type, duration, difficulty,
  best time of day/season.
- Full activity set to cover: boat safari through creeks, bird watching, sunset river
  cruise, watchtower visits (Sajnekhali, Sudhanyakhali, Dobanki), tiger-zone
  exploration, village life & folk performance (Bonbibi Pala), mangrove forest walk,
  fishing with locals, honey-collector stories, crab/prawn farm visit, stargazing,
  photography walks.
- Wildlife you may spot: Royal Bengal Tiger, spotted deer, estuarine crocodile,
  kingfishers, monitor lizard, Irrawaddy dolphin — with a "sightings are never
  guaranteed" honesty note.
- Seasonal calendar strip: which activity is best in which month.
- Safety & forest-permit note (Forest Dept. permit required, guide mandatory).
- CTA: "Add activities to your trip".

### 2.7 `/activities/[slug]` — Single activity (optional, phase 2)

Description, duration, timing, what's included, what to carry, permit requirement,
photo gallery, related trips.

### 2.8 `/gallery` — Photo gallery

- Reuse [components/DomeGallery.tsx](components/DomeGallery.tsx) as the hero interaction.
- Below it, a categorised masonry grid: Rooms · Wildlife · River & Sunsets · Food ·
  Village Life · Guests. Category chips filter the grid.
- Lightbox on click (keyboard + swipe navigation, `Esc` to close).
- Video section (reuse the YouTube embed from SocialMedia).
- Keep the `fs`-based image discovery from [components/Gallery.tsx](components/Gallery.tsx),
  but extend it to read per-category subfolders under `public/images/gallery/`.

### 2.9 `/about` — About the homestay

- "Welcoming you at GreenView HomeStay" hero — reuse the About bento layout.
- Our story: who runs it, how it started, family background.
- Our values: eco-tourism, local employment, plastic-free, sourcing from village farms.
- Meet the hosts & guides: photo cards with name and role.
- The property: layout, common areas, dining space, rooftop/riverside deck.
- Food & dining: home-cooked Bengali menu, fresh fish/crab, veg options, sample menu.
- Sustainability commitments.
- Awards / recognitions / registrations if any.
- CTA: "Plan your stay".

### 2.10 `/reviews` — Guest reviews

- Header: "What Our Customers Think".
- Rating summary: average score, total count, 5→1 star distribution bars.
- Full review list (paginated or infinite), each with photo, name, date, rating, text,
  and which package they took.
- Filter by rating and by trip type.
- Source badges (Google / TripAdvisor / MakeMyTrip) if reviews are syndicated.
- "Write a review" form → same handler as the contact form's review textarea.

### 2.11 `/contact` — Contact & enquiry

Promote the existing [components/Contact.tsx](components/Contact.tsx) block to a page:
- "Let's Work Together" heading (**rename** — for a homestay use "Get in Touch" or
  "Plan Your Stay"; the current copy reads like a freelancer portfolio).
- Contact tiles: address (Pakhiralay, West Bengal 743370), phone (+91 7679756846),
  email (greenviewhomestay@gmail.com).
- Working enquiry form: first name, last name, email, phone, travel dates, guests,
  message. Wire to a server action or route handler with validation + success/error state.
- Embedded Google Map of the property.
- WhatsApp quick-chat button (floating on all pages).
- Response-time promise ("we reply within a day").

### 2.12 `/booking` — Booking / availability request

- Step 1: dates + guests + room type or package.
- Step 2: guest details, ID note (govt. photo ID required for forest permits).
- Step 3: summary + price breakdown (room × nights, activities, taxes, advance payable).
- Payment instructions or gateway handoff; advance/balance policy stated plainly.
- Confirmation screen at `/booking/confirmation` with a reference number.
- This is the destination for every "Book Now" / "Book your Trip" button in the site.

### 2.13 `/how-to-reach` — Travel guide

High-value SEO page for this business:
- By train: Sealdah → Canning, then van/auto to Godkhali jetty, then boat to Pakhiralay.
- By road from Kolkata: distance, drive time, route.
- By private car/pickup: our pickup service and cost.
- Timings and last-boat warnings.
- Interactive/annotated map with the full journey.
- Nearest ATM, pharmacy, mobile network coverage note.
- Downloadable/printable directions.

### 2.14 `/faq`

Grouped accordions: Booking & Payment · Travel & Permits · Rooms & Amenities · Food ·
Wildlife & Safety · Cancellation. Add FAQ structured data (JSON-LD) for search results.

### 2.15 `/blog` and `/blog/[slug]` (phase 2)

Travel articles — "Best time to visit the Sundarbans", "What to pack", "Birds of the
Sundarbans", "Bonbibi legend". Index grid + article page with author, date, reading
time, related posts.

### 2.16 `/policies/[terms|privacy|cancellation]`

Plain long-form text pages linked from the footer. Cancellation policy must state
refund tiers by days-before-arrival.

### 2.17 Supporting files (not routes, but required)

- `app/not-found.tsx` — branded 404 with links back to Home / Trips / Contact.
- `app/loading.tsx` and per-segment `loading.tsx` — skeletons matching the card shapes.
- `app/error.tsx` — client error boundary.
- `app/sitemap.ts`, `app/robots.ts`.
- `app/opengraph-image.tsx` — branded OG card; per-page `generateMetadata` for trips,
  rooms, activities, blog.
- `app/api/contact/route.ts` (or a server action) — form submission handler.

### 2.18 Shared components to extract

Building the above without extracting these will duplicate a lot of markup:

- `SectionHeading` — the hairline-rule + two-tone serif heading used in 5 places already.
- `ArcCarousel` — [components/rooms.tsx](components/rooms.tsx) and
  [components/Reviews.tsx](components/Reviews.tsx) contain a **near-identical** ~100-line
  GSAP MotionPath carousel. Extract once, pass `renderItem` and the SVG path.
- `Button` — pill button with `filled` / `outline` variants (already implied by
  `trip.buttonType`; note the Trips component checks for `'solid'` but the data only
  ever sets `'filled'` or `'outline'`, so the filled branch is dead).
- `TripCard`, `RoomCard`, `ReviewCard`, `ActivityCard`.
- `BentoGrid` — About and Activities both hand-roll one.
- `Footer` — extract from Contact so the contact *page* and the footer aren't the same
  component.
- `MobileNav` — currently missing entirely.
- `WhatsAppFloat`.

### 2.19 Data layer

All content is hardcoded arrays inside client components. Before adding pages, move it to
`lib/data/` (`trips.ts`, `rooms.ts`, `activities.ts`, `reviews.ts`) with exported types
and a `slug` field per record. Detail pages then use `generateStaticParams()` over those
slugs. This also lets the section components become server components that pass data down.

---

## 3. Design System

Derived from the existing code — follow it so new pages match.

### 3.1 Brand colours

| Token | Hex | Where used | Notes |
|---|---|---|---|
| **Primary green** | `#6DA003` | Buttons, borders, headings, tabs | **Canonical — use this** |
| Secondary green | `#71A129` | Trips/Gallery/Reviews/Social sections | Legacy duplicate; migrate to `#6DA003` |
| Green hover | `#5B8703` | Button hover | (`#5b851f` also appears — consolidate) |
| Green (form CTA) | `#78A700` | Send Message button | |
| Border lime | `#8FCE05` | Button outlines on dark | |
| **Accent lime** | `#C5FE4E` | Hero "Relax.", nav hover | Bright accent on dark only |
| Lime variants | `#CEF15D`, `#C9FF4A`, `#D7FF4A` | Thumbnails, footer text/icons | Consolidate to one |
| Amber | `#FF9500` | Activities "with local guides" italic | Guide/annotation accent |
| Star gold | `#F5B301` | Review stars | Ratings only |

### 3.2 Neutrals

| Token | Hex | Role |
|---|---|---|
| Page white | `#FFFFFF` | Trips section, cards |
| Off-white | `#FAFAFA` | About, Gallery, SocialMedia sections |
| Section grey | `#E1E1E1` | Rooms, Activities, Reviews sections |
| Footer grey | `#878787` | Contact background |
| Cream | `#F4EBDD` | Contact text on grey |
| Muted text | `#858585`, `#888888` | Body copy |
| Sub text | `#444444`, `#555555` | Labels, meta |
| Near-black | `#111111`, `#0C0000` | Headings |

**Section rhythm:** the page alternates `#FFFFFF` → `#E1E1E1` → `#FAFAFA` → `#E1E1E1` →
`#FAFAFA` → `#878787`. Keep alternating light/grey; never place two `#E1E1E1` sections
adjacent without a light one between.

### 3.3 Typography

- **Body/UI:** Geist Sans (`--font-geist-sans`, loaded in
  [app/layout.tsx](app/layout.tsx)); Geist Mono available but unused.
- **Display/headings:** Gloock (`next/font/google`, weight 400) — hero H1, room card
  titles. Also `font-serif` used broadly for section headings and CTA button text.
- **Scale in use:** hero H1 `text-4xl → sm:text-7xl → lg:text-[5.5rem]`; section H2
  `text-3xl md:text-5xl` (some `lg:text-[3.2rem]`); card title ~`text-[15px]–[22px]`;
  body `text-[13px]–[14px]` with `leading-relaxed`/`leading-7`; meta labels
  `text-[10px]–[12px]`, often `uppercase tracking-wide`.
- **Heading pattern (used 5×):** hairline rule + two-tone split + hairline rule —
  green word first *or* second, near-black for the other:
  ```tsx
  <div className="flex items-center justify-center gap-4">
    <div className="h-px w-16 md:w-32 bg-[#6DA003]" />
    <h2 className="text-3xl md:text-5xl font-serif">
      <span className="text-[#6DA003]">Book your</span>{" "}
      <span className="text-[#111111]">Trips</span>
    </h2>
    <div className="h-px w-16 md:w-32 bg-[#6DA003]" />
  </div>
  ```

### 3.4 Shape & elevation

- **Buttons:** always `rounded-full`. Filled = green bg + white text. Outline = white bg,
  green text, green border, inverts on hover. Hover adds `hover:scale-105`.
- **Cards:** `rounded-[24px]` (reviews) / `rounded-[32px]` (trips, rooms) with a
  `1–2px` green border and a soft green-tinted shadow
  (`shadow-[0_8px_30px_#71A1291A]` → `hover:shadow-[0_12px_40px_#71A1292A]`).
- **Images inside cards:** `rounded-[16px]`–`rounded-[24px]`, `object-cover`.
- **Bento grids:** `gap-[4px]`, outer container `rounded-[30px] overflow-hidden`.
- **Glass:** `bg-white/70 backdrop-blur-xs` (navbar), `bg-white/30 backdrop-blur-md`
  (contact card overlay), `border-white/10–white/20`.
- **Form inputs:** `rounded-full` + `bg-white/70`; textarea `rounded-[28px]`.

### 3.5 Motion

- GSAP + `@gsap/react` (`useGSAP`), with `MotionPathPlugin` and `ScrollTrigger`
  registered behind a `typeof window !== "undefined"` guard.
- **Signature interaction:** cards travel along an invisible SVG arc
  (`M 0 372 Q 600 228 1200 372` for rooms; the inverted U
  `M 0 228 Q 600 372 1200 228` for reviews). Entrance is a `ScrollTrigger` at
  `top 80%`; navigation is `power2.out` at `0.6s`.
- **Autoplay is 5000ms everywhere** (hero, trips, rooms, reviews). Keep this constant.
- Standard transitions: `duration-300` for hover, `duration-1000` for hero crossfade.
- Off-centre cards: `opacity 0` beyond ±1, `scale 0.92` at ±1, `zIndex 10` at centre.
- **Accessibility gap:** none of the autoplay carousels respect
  `prefers-reduced-motion` or offer a pause control. Add both to new carousels.

### 3.6 Tokens (recommended migration)

Replace the stock grayscale in [app/globals.css](app/globals.css) `:root` with the brand
palette so `bg-primary` / `text-primary` actually mean green, then swap hex literals for
utilities as files are touched:

```css
:root {
  --primary: oklch(0.62 0.15 130);        /* ≈ #6DA003 */
  --primary-foreground: oklch(1 0 0);
  --accent: oklch(0.92 0.20 120);         /* ≈ #C5FE4E */
  --muted-foreground: oklch(0.60 0 0);    /* ≈ #858585 */
  --radius: 1.5rem;                        /* cards are 24–32px */
}
```

Do not do this as a big-bang rewrite — it will churn every component. Introduce tokens,
use them in **new** pages, and convert existing sections opportunistically.

### 3.7 Responsive rules

- Breakpoints: `sm:640` `md:768` `lg:1024`. Content max-widths: `max-w-7xl` (trips,
  rooms), `max-w-6xl` (reviews), `max-w-[1180px]` (about), `max-w-[1600px]` (contact).
- Padding ladder: `px-4 sm:px-6 lg:px-8` (some sections use `px-4 sm:px-8`).
- Carousel visibility: 1 card mobile / 2 tablet / 3 desktop.
- About and Activities ship **separate mobile and desktop layouts** (`lg:hidden` vs
  `hidden lg:grid`) rather than reflowing one grid — follow that when a bento can't
  reflow cleanly.
- Mobile-only affordances: dot indicators on the hero; arrows shrink `h-8 w-8` →
  `sm:h-10 sm:w-10`.
- Sections are `min-h-screen` on desktop but `py-10/12` on mobile — never force
  `min-h-screen` on small screens.

### 3.8 Images

- Always `next/image`. Local assets live under `public/images/{rooms,trips,gallery,reviews,social,icons}/`.
- Use `fill` + `sizes` for art-directed containers (the existing `sizes` strings are
  copy-pasted and often wrong for the actual layout — set them per use).
- `priority` only on the first hero image and the contact hero.
- [next.config.ts](next.config.ts) permits remote images from `images.unsplash.com` only
  — that exists for `DomeGallery`'s defaults, which are unused in production.
- Decorative bento images currently have `alt=""`; content images need real alt text.

### 3.9 Voice & content

- Warm, sensory, first-person-plural. "Escape. Relax. Mangroves." is the tagline.
- Recurring themes: mangroves, river, sunrise/sunset, Royal Bengal Tiger, birdlife,
  home-cooked Bengali food, village hospitality, escape from the city.
- Prices in `₹ N,NNN` format with `/ per person`.
- Ratings as `4.5` + `Very Good (2.9k Reviews)`.
- **Never ship lorem ipsum** — Activities.tsx currently does.
- Escape apostrophes in JSX (`&apos;`) to satisfy the ESLint rule.
