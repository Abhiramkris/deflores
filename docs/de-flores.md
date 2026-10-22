# de-flores.md — Next.js Master Build Spec & Copy Deck (v2)

This supersedes v1 and defines the final sequence, layout, copy, and constraints. Pure Next.js App Router + TypeScript. No external assets beyond floral.svg (a local SVG pattern asset).

## 1. Project Context
- **Client:** De Flores Haute Couture — custom outfits, bridal wear, occasion wear, pret apparel.
- **Stack:** Next.js App Router, TypeScript. Static-first. Client components only for mobile nav toggle and the scroll-transform section.
- **Rule:** No real images. Every media slot is a flat grey placeholder box.
- **Repeated asset:** `public/floral.svg` — used as a tiled background pattern in the Collections section.

## 2. Design Tokens

```ts
// tokens.ts
export const tokens = {
  color: {
    coral:   "#F0705E",
    blush:   "#F6D5CC",
    ink:     "#1A1A1A",
    grey:    "#8A8A8A",
    paper:   "#FAF7F4",
    line:    "#E5E0DB",
    phBg:    "#D9D4CF",
  },
  font: {
    display: "Georgia, 'Times New Roman', serif",
    ui: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
  },
  eyebrow: { size: "11px", tracking: "0.18em", weight: 500, transform: "uppercase" },
  body: { size: "16px", lineHeight: 1.7 },
  container: { maxWidth: "1280px", padMobile: "24px", padDesktop: "48px" },
  spacing: { sectionDesktop: "96px", sectionTablet: "64px", sectionMobile: "48px" },
};
```

### Type scale
- **Hero display:** `clamp(40px, 7vw, 88px)`, serif, 400, tracking -0.02em, uppercase
- **Section headline:** `clamp(28px, 4vw, 48px)`
- **Eyebrow:** 11px / 0.18em / 500 / uppercase
- **Body:** 16px → 15px mobile / 1.7
- **Motion:** color .2s, border-color .2s, opacity .2s only. The scroll-transform block is the sole exception (uses transform driven by scroll progress).
- **Banned:** purple/blue gradients, radial orbs, sparkles, Lucide/generic icon libs, emojis, 3-card grids, 3-tier pricing, floating chat bubbles, bouncy hover, rounded media, shadows, fade-in-on-scroll.

## 3. Placeholder Contract

```tsx
type Props = { ratio: string; label?: string; video?: boolean; className?: string };
```

Flat `--phBg`, no radius, no shadow. Label: 11px / 0.2em / `--grey` / uppercase / centered. `aria-hidden="true"`. Video variant label: `▶ RAMP WALK VIDEO`.

## 4. Final Section Sequence (Homepage)
1. `<Nav />` — centered logo
2. `<Hero />` — split editorial
3. `<Story />` — De Flores story, split 50/50
4. `<FeaturedRelease />` — "Our Patrons / Featured Release" product cards
5. `<RampVideoOne />` — first ramp walk video (highlight)
6. `<Collections />` — categories with floral.svg repeating pattern
7. `<Founder />` — Anisree Sreeraj, split 50/50
8. `<ScrollPinterestGallery />` — pinned full-screen tile scales down to reveal masonry gallery (replaces ScrollTransform + Lookbook)
9. `<RampVideoTwo />` — second ramp walk video
10. `<Testimonials />` — client quotes
11. `<Bespoke />` — atelier callout
12. `<Footer />` — ink background

## 5. Sections — Layout & Copy

### 5.1 `<Nav />` — Centered Logo & Luxury Navigation
- Sticky, `--paper` bg, 1px bottom border.
- **Top Bar Layout (`grid-cols-[1fr_auto_1fr]`):**
  - **Left:** Menu button (hamburger icon) on all viewports, plus collection links on desktop (`min-[900px]`).
  - **Center:** Brand wordmark `DE FLORES.` with coral dot, mathematically centered.
  - **Right:** Search icon button, `Cart (0)` utility, and filled accent book button (`bg-coral text-white`) with only icon (appointment calendar SVG) and sharp 0px corners.
- **Search Overlay:** Expandable inline search bar beneath navbar linking to `/explore?q=...`.
- **Hamburger Drawer (When Opened):**
  - Clean collection links: Lehenga · Gown · Saree · Mens Wear · Party Wear.
  - Cart utility row.
  - **Bottom Full-Width CTA:** Solid accent button (`bg-coral text-white hover:bg-ink`, sharp 0px corners) with the matching calendar icon and `BOOK CONSULTANT` text, navigating to `/#bespoke`.

### 5.2 `<Hero />`
- **Layout:** Framed luxury layout taking 93% screen width (`w-[93%] mx-auto`) with tight, organic spacing (`gap-6 sm:gap-8`) between the hero card and footer text, eliminating empty dead space.
- **Main Hero Section:** Height `h-[55vh] min-[900px]:h-[75vh] min-h-[360px]` with sharp 0px corners, flat `--phBg` box, and clean borders without any ratio badges.
- **Main Hero Content Stack (Integrated):**
  - **Eyebrow:** `EST. 2025 · HAUTE COUTURE` positioned above the headline. Fades in (`opacity: 0 -> 1`, `translate-y-2 -> translate-y-0`) with `delay-500` (duration 700ms, ease-out).
  - **Headline & Animation:** `DEFINE YOUR LOOK` with character-by-character `.rise` split-text animation (2 lines max, `whitespace-nowrap` on each line):
    - Font size: `clamp(32px, 6vw, 66px)`
    - Individual character rotation and translateY: `transform: translateY(0.6em) rotate(6deg) -> translateY(0) rotate(0)`
    - Spring cubic-bezier: `cubic-bezier(0.16, 1, 0.3, 1)` with `calc(var(--i) * 40ms)` sequential stagger
    - Accessible `.sr-only` readout with `aria-hidden="true"` character spans
    - `prefers-reduced-motion: reduce` fallback bypassing transforms
  - **Sub-nav Links:** `NEW ARRIVALS` (`/collections/lehenga`) · `MEN` (`/collections/mens-wear`) · `WOMEN` (`/collections/gown`) positioned directly below the headline. Fades in (`opacity: 0 -> 1`, `translate-y-2 -> translate-y-0`) with `delay-700` (duration 700ms, ease-out).
- **Editorial Footer Bar (Below Hero Box):**
  - **Entrance Choreography:** Statement and CTA fade in (`opacity: 0 -> 1`, `translate-y-2 -> translate-y-0`) with `delay-900` (duration 700ms, ease-out).
  - **Body:** Style, quality, craftsmanship, confidence. Premium apparel designed for those who refuse to blend in.
  - **CTA:** VIEW COLLECTION → (`/collections/new-arrivals`, centered solid filled container with white text)
- **Multi-Image Cover Mode Showcase (Configurable from CMS):**
  - Up to 4 hero showcase images configurable from `/admin/dashboard` (Storefront CMS).
  - Uploads to Supabase Storage (`deflores-bucket`) with WebP 82 compression via Sharp.
  - Rendered in full `cover mode` (`object-cover object-center`) so any aspect ratio auto-fits the container without distortion or blocking upload restrictions.
  - Smooth crossfade transitions with 5s auto-rotation when multiple images are active.
  - Minimalist sharp dash indicators at bottom center with interactive slide jump.
  - Dark editorial scrim (`bg-black/40`) applied over media ensuring high-contrast legibility for typography.


### 5.3 `<Story />` — "Who is De Flores" (Single-Line Typography Fix)
- Desktop: 50/50 split. Left = Placeholder ratio="4/5", right = story text (`.story-column`).
- Mobile: text only (image hidden — per user request "show the text only in mobile view").
- **Typography composition & CSS Rules:**
  - `.story-column`: `width: 100%`.
  - `.static-title`: `font-family: var(--font-display); font-size: clamp(28px, 4vw, 48px); line-height: 1.2; text-transform: uppercase;`. Text: `THE DE FLORES STORY`.
  - `.italic-for`: `display: block; font-family: var(--font-display); font-size: clamp(24px, 3vw, 36px); font-style: italic; margin: 4px 0;`. Text: `for`.
  - Line 3: `<StoryWordCarousel />` (see §5.3.1).
  - `.location-tag`: UI sans-serif, uppercase, spaced (11px, `letter-spacing: 0.18em`). Text: `COCHIN · EST. 2025`.
- **Body paragraph below (grey, max 58ch):**
  "De Flores stemmed from a young fashion designer's passion for crafting unique and novel style statements — to create a distinction. Translating to 'flowers' in Spanish, the name symbolises elegance, chastity, and loveliness in every attire we design. With a profusion of colours, high-calibre fabric, and aesthetic appeal, De Flores is a one-stop designer boutique for every woman who wants to flaunt an enchanting style."

### 5.3.1 `<StoryWordCarousel />` — Animated Word Carousel
- **Concept:** Within the `<Story />` section, the center stack of typography uses a rotating word carousel that switches every 2 seconds, cycling through four audience segments.
- **Lines & Sizing:**
  - Container (`.carousel-container`): `position: relative; width: 100%; height: 1.35em; overflow: hidden; margin: 8px 0; font-family: var(--font-display); font-size: clamp(24px, 4.5vw, 36px); line-height: 1.35;`. On desktop (`min-width: 900px`): `font-size: clamp(28px, 2.8vw, 42px);`. Locks container height to 1.35em based on the clamped font size, preventing vertical text clipping while remaining smaller and harmonious with `.static-title` (48px).
  - Words (`.carousel-word`): `position: absolute; top: 0; left: 0; width: 100%; display: block; white-space: nowrap; font-family: inherit; font-size: inherit; line-height: inherit; font-weight: 400; text-transform: uppercase; letter-spacing: 0.05em;`. Cycles between `EVERY WOMAN`, `EVERY MAN`, `EVERY COUPLE`, `EVERY ACHIEVER`.
  - Single-Line & Zero-Clipping Guarantee: `white-space: nowrap` and `clamp(28px, 2.8vw, 42px)` on desktop with `1.35em` container height ensure all letters fit completely without top/bottom clipping or horizontal overflow.
- **Animation Rules:**
  - Interval: exactly 2000ms per word.
  - Transition: vertical slide only. Outgoing word slides up -100%, incoming word slides up from 100% to 0. Duration 450ms, easing cubic-bezier(0.65, 0, 0.35, 1). No fade, no scale, no bounce.
  - Loop: infinite, no pause on hover.
  - Reduced motion: `prefers-reduced-motion: reduce` freezes on `EVERY WOMAN` — no rotation.
  - A11y: visible rotating text is `aria-hidden="true"`. A visually-hidden `<span>` outside the animation reads: `for every woman, man, couple, and achiever`.
- **Component Contract:** `components/StoryWordCarousel.tsx` (`'use client'`).

### 5.4 `<FeaturedRelease />` — "Our Patrons"
- Mirrors the reference's OUR PATRONS block.
- **Layout:**
  - Centered eyebrow + serif headline + subhead row with "View All" link and `←` / `→` scroll navigation controls.
  - Horizontal scroll track with smooth CSS snap alignment (`overflow-x-auto snap-x snap-mandatory scrollbar-none`) across all breakpoints (`w-[260px] sm:w-[280px] min-[900px]:w-[320px]`).
- **Interactive Peek Hint Animation:**
  - When the section enters viewport focus (`threshold: 0.25`), the card track executes a smooth horizontal peek animation (`animate-peek` via `@keyframes peekSlider`).
  - Cards gently slide left by 56px, then right (+12px), settling at 0px over 1.2s, visually signaling horizontal sliding capability.
  - User interaction (manual scrolling or navigation button click) immediately disables/cancels the hint to avoid interfering with user input.
  - Respects `prefers-reduced-motion: reduce` by disabling transforms.
- **Each card:**
  - Placeholder tall portrait `ratio="2/3"` for elongated couture silhouettes, with a small solid-white + button anchored bottom-right (24×24, no radius).
  - Product name below: serif, 16px, `--ink`.
  - Price below: serif, 15px, `--grey`, centered.
- **Copy:**
  - **Eyebrow:** FEATURED RELEASE
  - **Headline (serif, 48px, tracked):** OUR PATRONS
  - **Subhead link:** View All
  - **Cards:**
    - The Coral Bloom Lehenga — Rs. 527,990
    - Garden of Wilderness Gown — Rs. 421,990
    - The Tuscan Sunset Saree — Rs. 307,490
    - Lavender Court Sherwani — Rs. 560,990
    - Royal Ivory Anarkali — Rs. 385,490
    - Midnight Velvet Bandhgala — Rs. 489,990
    - Emerald Cascade Saree — Rs. 342,000
    - Rose Quartz Embroidered Cape — Rs. 298,500

### 5.5 `<RampVideoOne />`
- Vertical video Placeholder ratio="9/16" centered in `max-w-[420px]` container, max-height: 80vh. Centered eyebrow + serif subhead above.
- **Eyebrow:** THE RAMP
- **Subhead:** Couture in motion.

### 5.6 `<Collections />` — Collections Grid Refinements
1. **Background Pattern & Continuous Animation (floral.svg):**
   - Pattern & Size: Staggered haute couture embroidery pattern (`viewBox="0 0 64 76"`, `background-size: 64px 76px;`). Each floral floret is sized to ~18px × 21px (`scale(0.68)`), with alternating rows offset by 50% (32px shift), breaking vertical column lines into an elegant staggered half-drop texture with zero overlap.
   - Opacity & Layering: Subtle floret embroidery (`opacity: 0.18`) layered beneath a semi-transparent couture lighting overlay (`.floral-gradient-overlay` with radial center illumination and soft edge vignettes at top and bottom).
   - Continuous Animation (Right-to-Left): Smooth horizontal drift (`scrollFloral`, 50s linear infinite) with seamless looping (shifts by -256px, an exact multiple of the 64px tile width).
   - Reduced Motion: `@media (prefers-reduced-motion: reduce)` sets `animation: none;` to display static background.
2. **Glassmorphism Cards (Image Containers):**
   - Translucent, glass-like container wrapping each image tile.
   - Card Background: `background: rgba(250, 247, 244, 0.3);` (using `--paper` token color).
   - Backdrop Filter: `backdrop-filter: blur(8px);` (plus `-webkit-backdrop-filter`).
   - Padding: Responsive internal padding (`8px` mobile, `12px` desktop) to maximize image presence inside the glass frame.
   - Border & Radius: `1px solid rgba(255, 255, 255, 0.4)` border to define the glass edge, with sharp `0px` border-radius. No drop shadows.
   - Internal Placeholder: Flat grey `Placeholder` component with tall portrait `ratio="2/3"` for full-length couture garment presentation. The caption (`LEHENGA`, `Explore →`) goes below the glass card.
3. **Layout Spacing:**
   - Gap: `gap: 32px;` desktop, responsive `12px` mobile / `16px` sm. Outer container padding `px-4` on mobile to enlarge cards.
4. **Scroll Animation (Left-to-Right):**
   - Entrance animation to the category tiles via `IntersectionObserver`.
   - Stagger: Sequential entrance from the left (100ms stagger delay between each card).
   - Animation: Cards slide in from left to right (translate from `-50px` on X-axis to `0`), fading in from `opacity: 0` to `1` over `600ms` with `ease-out`.
   - Reduced Motion: Translation disabled, leaving simple opacity fade if `prefers-reduced-motion` is active.
5. **Copy Deck:**
   - **Eyebrow:** EXPLORE * OUR COLLECTIONS
   - **Tiles:** Lehenga · Gown · Saree · Mens Wear · Party Wear

### 5.7 `<Founder />` — Anisree Sreeraj
- Split 50/50 mirrored (image right on desktop, text left).
- Mobile: image hidden, text only.
- **Copy:**
  - **Eyebrow:** THE FOUNDER
  - **Headline (serif, clamp 32–56px):** Anisree Sreeraj
  - **Body (grey, max 54ch):**
    "A designer by instinct and a perfectionist by craft. Anisree founded De Flores to give every woman a wardrobe that feels like her own — designed, not selected. From bridal heirlooms to contemporary pret, each commission carries her signature: thoughtful silhouettes, refined colour, and embroidery that tells a story."
  - **Small signature line below in italic serif:** — Founder, De Flores Haute Couture
  - **CTA Button:** EXPLORE DE FLORES → (`/explore`, solid coral accent container with white text)
  - **Placeholder:** ratio="3/4"

### 5.8 `<FeaturedGallery />` — See /docs/de-flores-featured-gallery.md
- **Concept:**
  Sticky full-screen image pinned to the viewport with overlaid text, scroll-driven uniform shrink (preserving 100% of the aspect ratio without distortion) and translation that smoothly lands into the first item (aspect ratio 4/5) of a pre-rendered Pinterest masonry grid. The masonry grid below rises and reveals smoothly as the image shrinks and scrolls up naturally as the 250vh sticky phase ends.
- **Component Contract (Next.js / Client Component):**
  `components/FeaturedGallery.tsx` (`'use client'`).
  Uses a custom `requestAnimationFrame` scroll hook bound to a 250vh wrapper.
  `prefers-reduced-motion: reduce` bypasses sticky/scroll and renders the full masonry grid statically.
- **Masonry Grid Specs:**
  - CSS Columns: `columns-2` on mobile, `columns-3` on tablet (`md:`), `columns-4` on desktop (`lg:`).
  - Gap: `gap-4` (16px) universally.
  - Zero rounded corners, zero shadows. Flat `--phBg` boxes.
  - Landing Pad: First item has aspect ratio `4/5`.
- **Content Deck:**
  - Eyebrow: `ATELIER`
  - Headline: `CURATED STYLE. ELEVATED EVERY DAY.` (Serif, `clamp(24px, 6.2vw, 72px)`, `max-w-[100vw]` containment to prevent mobile clipping, fades out as progress reaches 0.7).
  - Placeholder Labels: `SILHOUETTE`, `TEXTURE`, `ARCHIVE`, `DETAIL`, `CRAFT`, `HERITAGE`, `RUNWAY`.

### 5.10 `<RampVideoTwo />`
- Vertical runway video with Placeholder ratio="9/16" centered in `max-w-[420px]` container, max-height: 80vh. Centered eyebrow + short serif line above (matching `<RampVideoOne />`).
- **Eyebrow:** SECOND LOOK
- **Subhead:** The runway, again.

### 5.11 `<Testimonials />`
- Three-column on desktop, single column stack on mobile. No card backgrounds — just typographic quotes separated by thin `--line` rules.
- **Copy:**
  - **Eyebrow:** IN THEIR WORDS
  - **Headline:** What our patrons say.
  - **Quote 1 (serif, ~22px):** "The fit was unreal — I didn't need a single alteration." — — Meera K., Bridal Client
  - **Quote 2:** "Every detail felt considered. It's the first time an outfit felt truly mine." — — Aditi R., Occasion Wear
  - **Quote 3:** "From consultation to final fitting, De Flores made the process feel effortless." — — Priya S., Pret Collection

### 5.12 `<Journal />` — Editorial Articles
- Blog teaser driving SEO and demonstrating brand authority.
- **Layout:** 3-column on desktop (`min-[900px]:grid-cols-3`), single column stack on mobile.
- **Header:** Eyebrow `THE JOURNAL`, Headline `Notes from the Atelier.`, Link `Read All Stories →`.
- **Cards (Placeholder ratio="16/9"):**
  - Card 1: `CRAFT` · The Art of Hand Zardozi — "Why machine embroidery can never replicate the human hand."
  - Card 2: `STYLING` · Choosing Your Bridal Palette — "How to select colors that photograph beautifully under Indian wedding lighting."
  - Card 3: `HERITAGE` · The Revival of Kanchipuram — "Sourcing authentic pure-zari silks directly from weaver cooperatives."

### 5.13 `<InstagramGrid />` — Social Proof (Without Rounded UI)
- Lifestyle and behind-the-scenes showcase without standard rounded Instagram chrome.
- **Layout:** Edge-to-edge grid with tight `gap-1` (`grid-cols-2 sm:grid-cols-3 min-[900px]:grid-cols-6`).
- **Header:** Eyebrow `FOLLOW ALONG`, Headline `@deflores.india` (linking directly to Instagram).
- **Design:** Clean, sharp 0px corners, square placeholders (`ratio="1/1"`). Hover state brightens the grey placeholder (`hover:brightness-110`).

### 5.14 `<StoreLocator />` — The Flagship Showroom
- Functional physical atelier discovery block for prospective patrons.
- **Layout:** 50/50 split on desktop (`min-[900px]:grid-cols-2`), single column stack on mobile.
- **Left:** Square placeholder (`ratio="1/1"`) with centered `MAP` label.
- **Right:**
  - Eyebrow: `THE SHOWROOM`
  - Headline: `Visit the Atelier.`
  - Address: "Near Cochin International Airport, Kerala."
  - Hours: "Mon – Sat · 10:00 AM – 7:00 PM (By Appointment Only)"
  - CTAs: `GET DIRECTIONS →` (text link) and `BOOK APPOINTMENT` (solid coral button).

### 5.15 `<Bespoke />` — CTA Section
- Centered, max 52ch.
- **Eyebrow:** BESPOKE
- **Headline (serif):** Made to your measure.
- **Body:** Every De Flores commission begins with a conversation. Choose your silhouette, fabric, and finish — we tailor the rest.
- **CTA:** BOOK A CONSULTATION (solid ink/black, 0 radius, uppercase, 0.18em)
- **Note below divider:** Consultations available in-studio and virtually.

### 5.16 `<Footer />`
- `--ink` bg, `--paper` text, 4-column responsive layout (`grid-cols-1 sm:grid-cols-2 min-[900px]:grid-cols-4`).
- **Brand line:** De Flores Haute Couture — custom craft, contemporary form.
- **Quick links:** Shop · Appointments · Stores · About
- **Legal:** Privacy · Terms · Shipping · Returns
- **Socials:** Instagram (`/de_flores_official`), Facebook, YouTube
- **Bottom:** © 2026 De Flores Haute Couture · All rights reserved

## 6. Responsive Matrix
| Breakpoint | Nav | Hero | Story | Featured | Collections | Founder | ScrollTransform |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `<640px` | hamburger | stacked | text only | 2 vis, scroll | 2-col | text only | static fallback |
| `640–900px` | hamburger | stacked | text only | 2 vis | 3-col | stacked | static |
| `900–1200px` | inline | 60/40 | 50/50 | 3 vis | 5-col | 50/50 | animates |
| `>1200px` | inline | 60/40 | 50/50 | 4 vis | 5-col | 50/50 | animates |

Section vertical padding: 96px → 64px → 48px.

## 7. Assets & Files
```text
/public
  floral.svg          ← tiled pattern (Collections only)
/app
  layout.tsx
  page.tsx
/components
  Nav.tsx
  Hero.tsx
  Story.tsx
  StoryWordCarousel.tsx ('use client')
  FeaturedRelease.tsx
  RampVideoOne.tsx
  Collections.tsx ('use client')
  Founder.tsx
  FeaturedGallery.tsx ('use client')
  RampVideoTwo.tsx
  Testimonials.tsx
  Bespoke.tsx
  Footer.tsx
  Placeholder.tsx
/lib
  tokens.ts
```

## 8. Accessibility
- Landmarks: `<nav>`, `<main>`, `<section aria-labelledby>`, `<footer>`
- Placeholders: `aria-hidden="true"`
- Focus-visible: `outline: 2px solid var(--coral)`
- Nav toggle: `aria-expanded` + `aria-controls`
- ScrollTransform: honors `prefers-reduced-motion`, static fallback

## 9. Acceptance Checklist
- [ ] No images, no icon libs, no external fonts.
- [ ] Every media slot is a grey placeholder.
- [ ] floral.svg tiled only inside `<Collections />`.
- [ ] Ramp video appears twice: 16/9 block + 21/9 cinematic strip.
- [ ] Story and Founder sections hide their placeholder on mobile (text-only).
- [ ] ScrollTransform animates image+text → gallery tile on desktop only.
- [ ] Lookbook card is the only rounded element on the page.
- [ ] No banned patterns (gradients, orbs, sparkles, emojis, chat bubbles, bouncy hover).
- [ ] Zero comments in code.
- [ ] Final order exactly as listed in §4.

## 10. Storefront CMS & Content Injection Architecture

### 10.1 Master Single Source of Truth (`homepage-schema.json`)
- Strict JSON Schema defining all editable homepage sections: `seo`, `hero`, `story`, `founder`, `featured_release`, `journal`, `instagram_grid`, `store_locator`, `bespoke`.
- Enforces min/max characters on text/textarea fields to maintain typography balance.
- Enforces strict image aspect ratios (`16:9`, `1:1`, `2:3`, `4:5`, `3:4`, `1.91:1`) and minimum pixel thresholds.
- Section visibility toggle (`is_visible: boolean`) allowing immediate section hiding or publishing without code changes.

### 10.2 Pure Text/Image Injection (Style Decoupling)
- The database stores purely structured text strings and image paths.
- Zero CSS, HTML tags, or Tailwind styles are stored in the database.
- Component layouts, responsiveness, animations, and typography remain strictly in React component code (`Hero.tsx`, `Story.tsx`, `Founder.tsx`, etc.).

### 10.3 In-Built Sharp Compression & Image Engine (`/api/admin/cms/upload`)
- Server-side Sharp image pipeline for all CMS uploads.
- Auto-orientation from EXIF, metadata stripping for privacy.
- Validates aspect ratio tolerance (±4%) and minimum resolution.
- Converts to WebP format at 82 quality with savings percentage calculation.

### 10.4 Publishing Lifecycle & Revision Rollbacks
- Two-state publishing lifecycle: `draft` vs `published`.
- Live storefront only renders `published` data (`SELECT * FROM homepage_cms WHERE status = 'published'`).
- Every publish event writes an immutable revision record to `homepage_cms_history` with actor email and timestamp.
- 1-click instant rollback (`/api/admin/cms/rollback`) to restore any past revision snapshot.
- Dual storage resilience: Neon/PostgreSQL primary with local `homepage-content.json` fallback.

### 10.5 Background Asset & Route Prefetcher (`BackgroundPrefetch.tsx`)
- Mounts non-blocking background prefetcher on homepage via `window.requestIdleCallback` (with 1.5s timeout fallback).
- Prefetches heavy storefront routes (`/explore`, `/collections/lehenga`, `/collections/gown`, etc.).
- Pre-caches data endpoints (`/api/products`, `/api/categories`) with `priority: "low"` for instantaneous client-side navigation.

