"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Placeholder from "./Placeholder";

export interface FeaturedReleaseProduct {
  id?: string;
  name: string;
  price: string;
  image?: string;
  href?: string;
  isPatron?: boolean;
}

interface FeaturedReleaseProps {
  eyebrow?: string;
  headline?: string;
  subhead_link_text?: string;
  subhead_link_href?: string;
  items?: FeaturedReleaseProduct[];
}

const DEFAULT_ITEMS: FeaturedReleaseProduct[] = [
  { id: "1", name: "The Coral Bloom Lehenga", price: "Rs. 527,990", image: "/crop_green.png", href: "/collections/all" },
  { id: "2", name: "Garden of Wilderness Gown", price: "Rs. 421,990", image: "/crop_white.png", href: "/collections/all" },
  { id: "3", name: "The Tuscan Sunset Saree", price: "Rs. 307,490", image: "/crop_red.png", href: "/collections/all" },
  { id: "4", name: "Lavender Court Sherwani", price: "Rs. 560,990", image: "/crop_yellow.png", href: "/collections/all" },
  { id: "5", name: "Royal Ivory Anarkali", price: "Rs. 385,490", image: "/crop_pink.png", href: "/collections/all" },
  { id: "6", name: "Midnight Velvet Bandhgala", price: "Rs. 489,990", image: "/crop_blue.png", href: "/collections/all" },
  { id: "7", name: "Emerald Cascade Saree", price: "Rs. 342,000", image: "/crop_green.png", href: "/collections/all" },
  { id: "8", name: "Rose Quartz Embroidered Cape", price: "Rs. 298,500", image: "/crop_red.png", href: "/collections/all" },
];

export default function FeaturedRelease({
  eyebrow = "FEATURED RELEASE",
  headline = "OUR PATRONS",
  subhead_link_text = "View All",
  subhead_link_href = "/collections/all",
  items,
}: FeaturedReleaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [animDone, setAnimDone] = useState(false);
  const [products, setProducts] = useState<FeaturedReleaseProduct[]>(
    items && items.length > 0 ? items : DEFAULT_ITEMS
  );

  useEffect(() => {
    if (items && items.length > 0) {
      setProducts(items);
      return;
    }

    const fetchPatrons = async () => {
      try {
        const res = await fetch("/api/products?patron=true");
        const data = await res.json();
        let list = Array.isArray(data) ? data : data.products || [];
        if (list.length === 0) {
          const resAll = await fetch("/api/products");
          const dataAll = await resAll.json();
          list = Array.isArray(dataAll) ? dataAll : dataAll.products || [];
        }
        if (list.length > 0) {
          const mapped: FeaturedReleaseProduct[] = list.map((p: any) => ({
            id: String(p.id),
            name: p.title || p.name,
            price: p.price || "Haute Couture",
            image: p.thumbnail || p.images?.[0] || p.imageUrl || p.image,
            href: `/product/${p.id}`,
            isPatron: Boolean(p.isPatron),
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.warn("Failed to fetch patron products on client:", err);
      }
    };
    fetchPatrons();
  }, [items]);

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

  const displayProducts =
    products.length > 0 && products.length < 4
      ? [
          ...products,
          ...DEFAULT_ITEMS.filter(
            (d) =>
              !products.some(
                (p) => p.id === d.id || p.name.toLowerCase() === d.name.toLowerCase()
              )
          ).slice(0, 8 - products.length),
        ]
      : products.length > 0
      ? products
      : DEFAULT_ITEMS;

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
          {displayProducts.map((item, idx) => {
            const productHref = item.href || (item.id ? `/product/${item.id}` : subhead_link_href);
            return (
              <div
                key={item.id || item.name || idx}
                className={`shrink-0 w-[260px] sm:w-[280px] min-[900px]:w-[320px] snap-start flex flex-col items-center text-center group cursor-pointer ${
                  shouldAnimate ? "animate-peek" : ""
                }`}
              >
                <Link href={productHref} className="relative w-full block">
                  <div className="relative w-full aspect-[2/3] overflow-hidden bg-phBg">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 260px, (max-width: 900px) 280px, 320px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        unoptimized={
                          typeof item.image === "string" &&
                          (item.image.startsWith("/uploads/") || item.image.startsWith("http"))
                        }
                      />
                    ) : (
                      <Placeholder ratio="2/3" label="PATRON" />
                    )}
                    <div
                      aria-hidden="true"
                      className="absolute bottom-0 right-0 w-6 h-6 bg-white text-ink flex items-center justify-center text-[14px] font-normal select-none pointer-events-none group-hover:bg-coral group-hover:text-white transition-colors"
                    >
                      +
                    </div>
                  </div>
                </Link>

                <Link
                  href={productHref}
                  className="font-serif text-[16px] text-ink pt-3 hover:text-coral transition-colors"
                >
                  {item.name}
                </Link>
                <span className="font-serif text-[15px] text-grey pt-1">
                  {item.price}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
