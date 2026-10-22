"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Category } from "../lib/categories";

function BookIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="2.5" y="3.5" width="15" height="14" />
      <line x1="2.5" y1="7.5" x2="17.5" y2="7.5" />
      <line x1="6.5" y1="1.5" x2="6.5" y2="4.5" strokeLinecap="round" />
      <line x1="13.5" y1="1.5" x2="13.5" y2="4.5" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M12.5 12.5L17 17" strokeLinecap="round" />
    </svg>
  );
}

const defaultLinks: Category[] = [
  { key: "lehenga", title: "Lehenga", num: "01", tag: "BRIDAL & FESTIVE", image: "", description: "", subcategories: [] },
  { key: "gown", title: "Gown", num: "02", tag: "ROYAL SILHOUETTES", image: "", description: "", subcategories: [] },
  { key: "saree", title: "Saree", num: "03", tag: "HERITAGE DRAPES", image: "", description: "", subcategories: [] },
  { key: "party-wears", title: "Party Wear", num: "04", tag: "FESTIVE COUTURE", image: "", description: "", subcategories: [] },
  { key: "mens-wear", title: "Mens Wear", num: "05", tag: "SHARP TAILORING", image: "", description: "", subcategories: [] },
];

interface NavProps {
  categories?: Category[];
}

export default function Nav({ categories: propCategories }: NavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [clientCategories, setClientCategories] = useState<Category[]>([]);
  const categoriesList = propCategories && propCategories.length > 0
    ? propCategories
    : clientCategories.length > 0
    ? clientCategories
    : defaultLinks;

  useEffect(() => {
    if (propCategories && propCategories.length > 0) return;

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          setClientCategories(data.categories);
        }
      } catch (err) {
        console.warn("Client nav category fetch warning:", err);
      }
    };

    fetchCategories();
  }, [propCategories]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-paper border-b border-line">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 min-[900px]:px-12 h-16 grid grid-cols-[1fr_auto_1fr] items-center">
        <div className="flex items-center gap-3 sm:gap-6 justify-self-start">
          <button
            type="button"
            onClick={() => {
              setIsOpen(!isOpen);
              if (isSearchOpen) setIsSearchOpen(false);
            }}
            aria-expanded={isOpen}
            aria-controls="nav-menu"
            aria-label="Toggle navigation menu"
            className="p-2 -ml-2 text-ink hover:text-coral transition-colors duration-200"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              {isOpen ? (
                <path d="M4 4L16 16M4 16L16 4" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" />
              )}
            </svg>
          </button>

          <div className="hidden min-[900px]:flex items-center gap-6">
            {categoriesList.map((cat) => {
              const href = `/collections/${cat.key}`;
              const hasSubs = Array.isArray(cat.subcategories) && cat.subcategories.length > 0;

              return (
                <div key={cat.key} className="relative group/nav py-5">
                  <Link
                    href={href}
                    className="text-[11px] uppercase tracking-[0.18em] font-medium text-ink hover:text-coral transition-colors duration-200 inline-flex items-center gap-1"
                  >
                    <span>{cat.title}</span>
                    {hasSubs && (
                      <svg
                        className="w-2.5 h-2.5 text-zinc-400 group-hover/nav:text-coral transition-transform duration-200 group-hover/nav:rotate-180"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </Link>

                  {hasSubs && (
                    <div className="absolute top-[calc(100%-4px)] left-0 hidden group-hover/nav:block pt-1 z-50 min-w-[220px]">
                      <div className="bg-paper border border-line shadow-lg p-2.5 flex flex-col gap-1">
                        <div className="text-[9px] uppercase tracking-widest text-grey font-mono pb-1.5 border-b border-line px-2">
                          {cat.tag || cat.title} Styles
                        </div>
                        {cat.subcategories.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            href={`/collections/${cat.key}?sub=${encodeURIComponent(sub.title)}`}
                            className="text-[10px] uppercase tracking-wider text-ink hover:text-coral hover:bg-zinc-100/60 px-2 py-1.5 transition-colors block text-left"
                          >
                            {sub.title}
                          </Link>
                        ))}
                        <Link
                          href={href}
                          className="text-[10px] uppercase tracking-widest font-semibold text-coral px-2 pt-2 border-t border-line text-left block hover:underline"
                        >
                          View All {cat.title} →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="justify-self-center text-center">
          <Link
            href="/"
            className="text-[15px] sm:text-[16px] tracking-[0.2em] font-serif uppercase text-ink hover:opacity-80 transition-opacity duration-200 whitespace-nowrap"
          >
            DE FLORES<span className="text-coral">.</span>
          </Link>
        </div>

        <div className="flex items-center justify-end gap-2.5 sm:gap-4 justify-self-end">
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (isOpen) setIsOpen(false);
            }}
            aria-expanded={isSearchOpen}
            aria-label="Search collections"
            className="p-2 text-ink hover:text-coral transition-colors duration-200"
          >
            <SearchIcon />
          </button>

          <span className="hidden min-[900px]:inline-block text-[11px] uppercase tracking-[0.18em] font-medium text-ink cursor-pointer hover:text-coral transition-colors duration-200">
            Cart (0)
          </span>

          <Link
            href="/#bespoke"
            aria-label="Book a consultation"
            className="bg-coral text-white hover:bg-ink transition-colors duration-200 p-2.5 flex items-center justify-center select-none"
          >
            <BookIcon />
          </Link>
        </div>
      </div>

      {isSearchOpen && (
        <div className="border-t border-line bg-paper px-4 sm:px-6 min-[900px]:px-12 py-3 flex items-center gap-3">
          <SearchIcon />
          <form
            action="/explore"
            method="GET"
            className="flex-1 flex items-center"
            onSubmit={() => setIsSearchOpen(false)}
          >
            <input
              type="search"
              name="q"
              placeholder="Search couture, lehenga, saree, gown..."
              autoFocus
              className="w-full bg-transparent text-[12px] sm:text-[13px] text-ink placeholder:text-grey tracking-wider uppercase outline-none"
            />
          </form>
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
            className="text-grey hover:text-ink text-[11px] uppercase tracking-widest px-2 py-1"
          >
            Close
          </button>
        </div>
      )}

      {isOpen && (
        <div
          id="nav-menu"
          className="border-t border-line bg-paper px-6 py-6 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-3">
            {categoriesList.map((cat) => {
              const href = `/collections/${cat.key}`;
              const hasSubs = Array.isArray(cat.subcategories) && cat.subcategories.length > 0;

              return (
                <div key={cat.key} className="flex flex-col gap-1 py-1">
                  <Link
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className="text-[12px] uppercase tracking-[0.2em] font-medium text-ink hover:text-coral transition-colors duration-200"
                  >
                    {cat.title}
                  </Link>

                  {hasSubs && (
                    <div className="pl-3 flex flex-col gap-1 border-l border-line/60 ml-1 mt-0.5">
                      {cat.subcategories.map((sub, sIdx) => (
                        <Link
                          key={sIdx}
                          href={`/collections/${cat.key}?sub=${encodeURIComponent(sub.title)}`}
                          onClick={() => setIsOpen(false)}
                          className="text-[10px] uppercase tracking-widest text-grey hover:text-coral transition-colors py-0.5 text-left"
                        >
                          · {sub.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-line flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-ink cursor-pointer hover:text-coral transition-colors duration-200">
              Cart (0)
            </span>
          </div>

          <div className="pt-2">
            <Link
              href="/#bespoke"
              onClick={() => setIsOpen(false)}
              className="w-full bg-coral text-white hover:bg-ink transition-colors duration-200 py-3.5 px-4 flex items-center justify-center gap-2.5 text-[12px] uppercase tracking-[0.2em] font-medium select-none"
            >
              <BookIcon />
              <span>BOOK CONSULTANT</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
