# de-flores-featured-gallery.md — Section Execution Prompt
This replaces previous gallery and scroll-transform specs with a single, precise implementation guide inspired strictly by the concept of the reference (sticky full-screen image, scroll-driven shrink, overlapping masonry reveal).

## 1. The Concept (Reference to Implementation)
The reference site uses a sticky scroll track to keep a large image pinned to the viewport, overlays text, and then uses a secondary overlapping section to "slide up" and cover it.

Our required execution:
- The section starts as a Full-Screen Image (100vw, 100vh).
- As you scroll, this image scales down and translates to become the first item (the largest tile) in a Pinterest Masonry Grid.
- The Masonry Grid is pre-rendered underneath and scrolls up naturally as the sticky phase ends.

## 2. Technical Architecture
- **File:** `components/FeaturedGallery.tsx` (`'use client'`)
- **Scroll Logic:** Custom `requestAnimationFrame` scroll hook or `useScroll` bound to a wrapper with `height: 250vh`.

### DOM Structure
```tsx
<section ref={containerRef} className="relative h-[250vh] w-full bg-[--paper]">
  <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
    <div className="absolute inset-0 pt-24 px-6 md:px-12 opacity-100">
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 max-w-[1400px] mx-auto">
         <div id="target-slot" className="aspect-[4/5] mb-4 bg-transparent"></div>
         <div className="aspect-square mb-4 break-inside-avoid bg-[--phBg]" />
         <div className="aspect-[3/4] mb-4 break-inside-avoid bg-[--phBg]" />
         <div className="aspect-[4/5] mb-4 break-inside-avoid bg-[--phBg]" />
         <div className="aspect-[2/3] mb-4 break-inside-avoid bg-[--phBg]" />
      </div>
    </div>

    <div 
      style={{ scale, y, borderRadius: 0 }} 
      className="absolute inset-0 z-20 bg-[--phBg] flex items-center justify-center"
    >
      <div className="text-center text-white mix-blend-difference">
        <span className="block text-sm tracking-widest uppercase mb-4">Atelier</span>
        <h2 className="font-serif text-5xl md:text-7xl">CURATED STYLE.<br/>ELEVATED EVERY DAY.</h2>
      </div>
    </div>

  </div>
</section>
```

## 3. Animation Mechanics (Aspect-Ratio-Preserving Transform)
- Coordinates & Scaling: Calculate bounding box of `#target-slot` using `getBoundingClientRect()` on mount/resize.
- Aspect Ratio Preservation: The initial hero dimensions `(W0, H0)` are computed to cover the viewport while matching the exact aspect ratio of `#target-slot` (`targetRatio = tWidth / tHeight`). A single uniform scale factor `targetScale = tWidth / W0 === tHeight / H0` is applied (`scale(${currentScale})`), ensuring the image aspect ratio never distorts during scroll.
- Translation & Landing: The hero translates from centered initial position `(initX, initY)` to `#target-slot` `(targetLeft, targetTop)` via `translate3d(x, y, 0)`.
- Masonry Reveal: The underlying masonry grid rises smoothly with `translate3d(0, (1 - p) * 80px, 0)` and fades in (`opacity: 0 -> 1`), seamlessly meeting the hero tile as it settles into place with its `ATELIER` label.

## 4. Masonry Grid Specs
- Use CSS columns for Pinterest flow: `columns-2` mobile, `columns-3` tablet (`md:`), `columns-4` desktop (`lg:`).
- Gap: `gap-4` (16px) universally.
- Sharp 0px corners, no shadows.
- Landing Pad: First item has aspect ratio `4/5`.

## 5. Typography & Overlay
- Centered in the flying image with `max-w-[100vw]` containment to prevent mobile edge clipping.
- Eyebrow: `ATELIER`
- Headline: `CURATED STYLE. ELEVATED EVERY DAY.` (Serif, `clamp(24px, 6.2vw, 72px)`, uppercase, `leading-[1.05]`).
- Fade: Overlay text fades out (`opacity: 1 -> 0`) as progress reaches 0.7.

## 6. Content Deck (Copy)
- Header/Eyebrow: `ATELIER`
- Overlay Headline: `CURATED STYLE. ELEVATED EVERY DAY.`
- Placeholder Labels (in the grid): `SILHOUETTE`, `TEXTURE`, `ARCHIVE`, `DETAIL`, `CRAFT`, `HERITAGE`, `RUNWAY`.

## 7. Acceptance Checklist
- [x] Section height: 250vh to create scroll track.
- [x] Sticky container: top-0 h-screen.
- [x] Hero image scales down to match the top-left masonry slot.
- [x] Masonry grid uses CSS columns (2 col mobile, 3 col tablet, 4 col desktop) with varying aspect ratios.
- [x] No rounded corners or shadows on any placeholder.
- [x] Text overlay fades out on scroll.
- [x] prefers-reduced-motion check bypasses sticky/scroll and just renders the grid instantly.
- [x] Zero comments in the code.
