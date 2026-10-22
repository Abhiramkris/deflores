"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import Placeholder from "./Placeholder";
import type { Category } from "../lib/categories";

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

interface CollectionsProps {
  categories?: Category[];
}

export default function Collections({ categories: initialCategories }: CollectionsProps) {
  const [clientItems, setClientItems] = useState<Category[]>([]);
  const items = initialCategories && initialCategories.length > 0
    ? initialCategories
    : clientItems.length > 0
    ? clientItems
    : [];

  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) return;

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          setClientItems(data.categories);
        }
      } catch (err) {
        console.warn("Failed fetching categories client-side:", err);
      }
    };

    fetchCategories();
  }, [initialCategories]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="collections-heading"
      className="relative w-full py-12 sm:py-16 min-[900px]:py-24 border-t border-line overflow-hidden bg-paper"
    >
      <div aria-hidden="true" className="floral-bg-wrapper" />
      <div aria-hidden="true" className="floral-gradient-overlay" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 min-[900px]:px-12 flex flex-col gap-10">
        <div className="text-center">
          <span
            id="collections-heading"
            className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey"
          >
            EXPLORE * OUR COLLECTIONS
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 min-[900px]:grid-cols-5 gap-3 sm:gap-4 min-[900px]:gap-8">
          {items.map((cat, idx) => {
            const delay = `${idx * 100}ms`;
            const transform = prefersReducedMotion
              ? "none"
              : isVisible
              ? "translateX(0)"
              : "translateX(-50px)";
            const transition = prefersReducedMotion
              ? `opacity 600ms ease-out ${delay}`
              : `transform 600ms ease-out ${delay}, opacity 600ms ease-out ${delay}`;

            const href = `/collections/${cat.key}`;
            const subCount = Array.isArray(cat.subcategories) ? cat.subcategories.length : 0;

            return (
              <div
                key={cat.key || idx}
                style={{
                  transform,
                  opacity: isVisible ? 1 : 0,
                  transition,
                  willChange: prefersReducedMotion ? "opacity" : "transform, opacity",
                }}
                className="flex flex-col gap-3 group"
              >
                <Link href={href} className="block w-full">
                  <div className="glass-card w-full relative aspect-[2/3] overflow-hidden bg-zinc-100">
                    {cat.image ? (
                      <>
                        <Image
                          src={cat.image}
                          alt={cat.title}
                          fill
                          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 900px) 33vw, 20vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                        {cat.tag && (
                          <span className="absolute top-2 left-2 text-[8px] font-bold tracking-widest uppercase bg-black/60 text-white px-2 py-0.5 backdrop-blur-xs">
                            {cat.tag}
                          </span>
                        )}
                        {cat.num && (
                          <span className="absolute top-2 right-2 text-[9px] font-mono text-white/80">
                            {cat.num}
                          </span>
                        )}
                      </>
                    ) : (
                      <Placeholder ratio="2/3" label={cat.title.toUpperCase()} />
                    )}
                  </div>
                </Link>

                <div className="flex flex-col gap-0.5 pt-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={href}
                      className="text-[13px] font-medium text-ink uppercase tracking-[0.05em] hover:text-coral transition-colors"
                    >
                      {cat.title}
                    </Link>
                    <Link
                      href={href}
                      className="text-[12px] text-coral hover:underline font-medium"
                    >
                      Explore →
                    </Link>
                  </div>

                  {subCount > 0 && (
                    <span className="text-[10px] text-zinc-400 tracking-wider uppercase">
                      {subCount} {subCount === 1 ? "Style" : "Styles"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
