"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Placeholder from "./Placeholder";

interface FeaturedReleaseProps {
  eyebrow?: string;
  headline?: string;
  subhead_link_text?: string;
  subhead_link_href?: string;
}

export default function FeaturedRelease({
  eyebrow = "FEATURED RELEASE",
  headline = "OUR PATRONS",
  subhead_link_text = "View All",
  subhead_link_href = "/collections/all",
}: FeaturedReleaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [animDone, setAnimDone] = useState(false);

  const items = [
    { name: "The Coral Bloom Lehenga", price: "Rs. 527,990" },
    { name: "Garden of Wilderness Gown", price: "Rs. 421,990" },
    { name: "The Tuscan Sunset Saree", price: "Rs. 307,490" },
    { name: "Lavender Court Sherwani", price: "Rs. 560,990" },
    { name: "Royal Ivory Anarkali", price: "Rs. 385,490" },
    { name: "Midnight Velvet Bandhgala", price: "Rs. 489,990" },
    { name: "Emerald Cascade Saree", price: "Rs. 342,000" },
    { name: "Rose Quartz Embroidered Cape", price: "Rs. 298,500" },
  ];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && !hasScrolled && !animDone) {
      const timer = setTimeout(() => {
        setAnimDone(true);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasScrolled, animDone]);

  const handleScroll = () => {
    if (!hasScrolled && scrollRef.current && scrollRef.current.scrollLeft > 10) {
      setHasScrolled(true);
    }
  };

  const scroll = (direction: "left" | "right") => {
    setHasScrolled(true);
    if (!scrollRef.current) return;
    const distance = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  const shouldAnimate = isInView && !hasScrolled && !animDone;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="featured-heading"
      className="w-full py-12 sm:py-16 min-[900px]:py-24 border-t border-line"
    >
      <div className="max-w-[1280px] mx-auto px-6 min-[900px]:px-12 flex flex-col gap-8">
        <div className="text-center flex flex-col items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey">
            {eyebrow}
          </span>
          <h2
            id="featured-heading"
            className="font-serif text-[clamp(28px,4vw,48px)] tracking-[0.08em] uppercase text-ink"
          >
            {headline}
          </h2>
        </div>

        <div className="flex items-center justify-between w-full pt-1">
          <Link
            href={subhead_link_href}
            className="font-serif italic text-[14px] text-grey hover:text-coral transition-colors duration-200"
          >
            {subhead_link_text}
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Scroll previous patron cards"
              onClick={() => scroll("left")}
              className="w-8 h-8 border border-line flex items-center justify-center hover:border-ink hover:text-ink text-grey transition-colors text-[13px]"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Scroll next patron cards"
              onClick={() => scroll("right")}
              className="w-8 h-8 border border-line flex items-center justify-center hover:border-ink hover:text-ink text-grey transition-colors text-[13px]"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full overflow-x-auto snap-x snap-mandatory flex gap-4 min-[900px]:gap-6 pb-4 scrollbar-none"
        >
          {items.map((item) => (
            <div
              key={item.name}
              className={`shrink-0 w-[260px] sm:w-[280px] min-[900px]:w-[320px] snap-start flex flex-col items-center text-center group cursor-pointer ${
                shouldAnimate ? "animate-peek" : ""
              }`}
            >
              <div className="relative w-full">
                <Placeholder ratio="2/3" label="PATRON" />
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 right-0 w-6 h-6 bg-white text-ink flex items-center justify-center text-[14px] font-normal select-none pointer-events-none"
                >
                  +
                </div>
              </div>

              <span className="font-serif text-[16px] text-ink pt-3">
                {item.name}
              </span>
              <span className="font-serif text-[15px] text-grey pt-1">
                {item.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
