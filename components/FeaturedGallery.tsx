"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Placeholder from "./Placeholder";

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

interface FeaturedGalleryProps {
  is_visible?: boolean;
  isVisible?: boolean;
  eyebrow?: string;
  headline_1?: string;
  headline1?: string;
  headline_2?: string;
  headline2?: string;
  image_hero?: string;
  imageHero?: string;
  image_1?: string;
  image1?: string;
  image_2?: string;
  image2?: string;
  image_3?: string;
  image3?: string;
  image_4?: string;
  image4?: string;
  image_5?: string;
  image5?: string;
  image_6?: string;
  image6?: string;
  image_7?: string;
  image7?: string;
}

export default function FeaturedGallery(props: FeaturedGalleryProps = {}) {
  const eyebrowText = props.eyebrow || "Atelier";
  const headline1Text = props.headline_1 || props.headline1 || "CURATED STYLE.";
  const headline2Text = props.headline_2 || props.headline2 || "ELEVATED EVERY DAY.";
  const heroSrc = props.image_hero || props.imageHero || "";
  const img1 = props.image_1 || props.image1 || "";
  const img2 = props.image_2 || props.image2 || "";
  const img3 = props.image_3 || props.image3 || "";
  const img4 = props.image_4 || props.image4 || "";
  const img5 = props.image_5 || props.image5 || "";
  const img6 = props.image_6 || props.image6 || "";
  const img7 = props.image_7 || props.image7 || "";

  const containerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const settledLabelRef = useRef<HTMLDivElement>(null);

  const metricsRef = useRef({
    initX: 0,
    initY: 0,
    targetLeft: 0,
    targetTop: 0,
    targetScale: 1,
    ready: false,
  });

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    const apply = (p: number) => {
      const m = metricsRef.current;
      if (!m.ready || !heroRef.current || !textRef.current || !galleryRef.current) return;

      const currentScale = 1 - p * (1 - m.targetScale);
      const currentX = m.initX + p * (m.targetLeft - m.initX);
      const currentY = m.initY + p * (m.targetTop - m.initY);
      const textOpacity = p >= 0.7 ? 0 : 1 - p / 0.7;
      const galleryOffset = (1 - p) * 80;
      const galleryOpacity = Math.min(1, p * 2);

      heroRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${currentScale})`;
      textRef.current.style.opacity = `${textOpacity}`;

      if (settledLabelRef.current) {
        const labelOpacity = p < 0.7 ? 0 : (p - 0.7) / 0.3;
        settledLabelRef.current.style.opacity = `${labelOpacity}`;
      }

      galleryRef.current.style.transform = `translate3d(0, ${galleryOffset}px, 0)`;
      galleryRef.current.style.opacity = `${galleryOpacity}`;
    };

    const compute = () => {
      if (
        !containerRef.current ||
        !stickyRef.current ||
        !galleryRef.current ||
        !slotRef.current ||
        !heroRef.current ||
        !textRef.current
      ) {
        return;
      }

      galleryRef.current.style.transform = "none";

      const stickyRect = stickyRef.current.getBoundingClientRect();
      const slotRect = slotRef.current.getBoundingClientRect();

      const Vw = stickyRect.width;
      const Vh = stickyRect.height;
      const tWidth = slotRect.width;
      const tHeight = slotRect.height;

      if (Vw <= 0 || Vh <= 0 || tWidth <= 0 || tHeight <= 0) return;

      const targetRatio = tWidth / tHeight;
      let W0 = Vw;
      let H0 = Vw / targetRatio;
      let initX = 0;
      let initY = (Vh - H0) / 2;

      if (Vw / Vh <= targetRatio) {
        H0 = Vh;
        W0 = Vh * targetRatio;
        initY = 0;
        initX = (Vw - W0) / 2;
      }

      heroRef.current.style.width = `${W0}px`;
      heroRef.current.style.height = `${H0}px`;

      const targetScale = tWidth / W0;
      const targetLeft = slotRect.left - stickyRect.left;
      const targetTop = slotRect.top - stickyRect.top;

      metricsRef.current = {
        initX,
        initY,
        targetLeft,
        targetTop,
        targetScale,
        ready: true,
      };

      const containerRect = containerRef.current.getBoundingClientRect();
      const totalScroll = containerRect.height - window.innerHeight;
      const currentScroll = -containerRect.top;
      const p = totalScroll > 0 ? Math.max(0, Math.min(1, currentScroll / totalScroll)) : 0;
      apply(p);
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const totalScroll = containerRect.height - window.innerHeight;
            const currentScroll = -containerRect.top;
            const p = totalScroll > 0 ? Math.max(0, Math.min(1, currentScroll / totalScroll)) : 0;
            apply(p);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    compute();
    const rafId = requestAnimationFrame(compute);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <section
        id="featured-gallery"
        aria-label="Featured Gallery"
        className="w-full py-16 md:py-24 bg-paper border-t border-line"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="block text-xs sm:text-sm tracking-widest uppercase mb-3 font-sans font-medium text-grey">
              {eyebrowText}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl uppercase leading-tight tracking-tight text-ink">
              {headline1Text}
              <br />
              {headline2Text}
            </h2>
          </div>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            <div className="mb-4 break-inside-avoid">
              <Placeholder ratio="4/5" label="ATELIER" src={heroSrc} />
            </div>
            <div className="mb-4 break-inside-avoid">
              <Placeholder ratio="1/1" label="SILHOUETTE" src={img1} />
            </div>
            <div className="mb-4 break-inside-avoid">
              <Placeholder ratio="3/4" label="TEXTURE" src={img2} />
            </div>
            <div className="mb-4 break-inside-avoid">
              <Placeholder ratio="4/5" label="ARCHIVE" src={img3} />
            </div>
            <div className="mb-4 break-inside-avoid">
              <Placeholder ratio="2/3" label="DETAIL" src={img4} />
            </div>
            <div className="mb-4 break-inside-avoid">
              <Placeholder ratio="3/4" label="CRAFT" src={img5} />
            </div>
            <div className="mb-4 break-inside-avoid">
              <Placeholder ratio="4/5" label="HERITAGE" src={img6} />
            </div>
            <div className="mb-4 break-inside-avoid">
              <Placeholder ratio="1/1" label="RUNWAY" src={img7} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      id="featured-gallery"
      aria-label="Featured Gallery"
      style={{ height: "250vh" }}
      className="relative w-full bg-paper border-t border-line"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
      >
        <div
          ref={galleryRef}
          style={{ willChange: "transform, opacity" }}
          className="absolute inset-0 pt-24 px-6 md:px-12 overflow-hidden"
        >
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 max-w-[1400px] mx-auto">
            <div
              ref={slotRef}
              id="target-slot"
              className="aspect-[4/5] mb-4 bg-transparent break-inside-avoid"
            />
            <div className="mb-4 break-inside-avoid">
              <Placeholder ratio="1/1" label="SILHOUETTE" src={img1} />
            </div>
            <div className="mb-4 break-inside-avoid">
              <Placeholder ratio="3/4" label="TEXTURE" src={img2} />
            </div>
            <div className="mb-4 break-inside-avoid">
              <Placeholder ratio="4/5" label="ARCHIVE" src={img3} />
            </div>
            <div className="mb-4 break-inside-avoid">
              <Placeholder ratio="2/3" label="DETAIL" src={img4} />
            </div>
            <div className="mb-4 break-inside-avoid">
              <Placeholder ratio="3/4" label="CRAFT" src={img5} />
            </div>
            <div className="mb-4 break-inside-avoid">
              <Placeholder ratio="4/5" label="HERITAGE" src={img6} />
            </div>
            <div className="mb-4 break-inside-avoid">
              <Placeholder ratio="1/1" label="RUNWAY" src={img7} />
            </div>
          </div>
        </div>

        <div
          ref={heroRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 20,
            backgroundColor: "var(--phBg)",
            transformOrigin: "0 0",
            willChange: "transform",
          }}
          className="flex items-center justify-center pointer-events-none overflow-hidden"
        >
          {heroSrc && (
            <Image
              src={heroSrc}
              alt={eyebrowText}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center select-none"
              unoptimized={heroSrc.startsWith("/uploads/") || heroSrc.startsWith("http")}
            />
          )}

          <div
            ref={textRef}
            className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 sm:px-6 z-10"
          >
            <div className="absolute inset-0 bg-black/45 pointer-events-none" />
            <div className="relative z-10">
              <span className="block text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4 font-sans font-medium">
                {eyebrowText}
              </span>
              <h2 className="font-serif text-[clamp(24px,6.2vw,72px)] uppercase leading-[1.05] tracking-tight">
                {headline1Text}
                <br />
                {headline2Text}
              </h2>
            </div>
          </div>

          <div
            ref={settledLabelRef}
            style={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            {!heroSrc && (
              <span className="text-[11px] uppercase tracking-[0.2em] text-grey font-medium text-center px-4">
                {eyebrowText}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
