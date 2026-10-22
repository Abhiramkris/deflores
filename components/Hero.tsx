"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface SplitWordProps {
  word: string;
  startIndex: number;
}

function SplitWord({ word, startIndex }: SplitWordProps) {
  return (
    <span className="inline-block whitespace-nowrap">
      {Array.from(word).map((char, index) => (
        <span
          key={index}
          className="ch"
          style={{ "--i": startIndex + index } as React.CSSProperties}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

interface HeroProps {
  eyebrow?: string;
  headline_word_1?: string;
  headline_word_2?: string;
  headline_word_3?: string;
  description?: string;
  cta_text?: string;
  cta_link?: string;
  image_1?: string;
  image_2?: string;
  image_3?: string;
  image_4?: string;
}

export default function Hero({
  eyebrow = "EST. 2025 · HAUTE COUTURE",
  headline_word_1 = "DEFINE",
  headline_word_2 = "YOUR",
  headline_word_3 = "LOOK",
  description = "Style, quality, craftsmanship, confidence. Premium apparel designed for those who refuse to blend in.",
  cta_text = "VIEW COLLECTION →",
  cta_link = "/collections/new-arrivals",
  image_1 = "",
  image_2 = "",
  image_3 = "",
  image_4 = "",
}: HeroProps) {
  const [isIn, setIsIn] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const rawSlides = [image_1, image_2, image_3, image_4];
  const slides = rawSlides.filter((s): s is string => typeof s === "string" && s.trim().length > 0);
  const hasImages = slides.length > 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIn(true);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const w1 = headline_word_1.trim();
  const w2 = headline_word_2.trim();
  const w3 = headline_word_3.trim();
  const startIdx2 = w1.length + 1;
  const startIdx3 = startIdx2 + w2.length + 1;

  return (
    <section
      aria-labelledby="hero-heading"
      className="w-full pt-4 pb-12 sm:pb-16 min-[900px]:pb-20"
    >
      <div className="w-[93%] max-w-[1500px] mx-auto flex flex-col gap-6 sm:gap-8">
        <div className="relative w-full h-[55vh] min-[900px]:h-[75vh] min-h-[360px] bg-phBg flex flex-col items-center justify-center gap-4 sm:gap-6 px-4 sm:px-6 overflow-hidden border border-line">
          {hasImages && (
            <>
              <div className="absolute inset-0 z-0 overflow-hidden">
                {slides.map((src, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                      index === activeSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`De Flores Haute Couture - Slide ${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1500px) 93vw, 1500px"
                      className="object-cover object-center"
                    />
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
            </>
          )}

          <span
            className={`text-[11px] md:text-[13px] uppercase tracking-[0.25em] font-medium text-center z-20 transition-all duration-700 ease-out delay-500 motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
              hasImages ? "text-white/85 drop-shadow-xs" : "text-grey"
            } ${isIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
          >
            {eyebrow}
          </span>

          <h1
            id="hero-heading"
            data-split="true"
            className={`rise ${isIn ? "is-in" : ""} font-serif uppercase tracking-tight text-center px-4 leading-[0.95] z-20`}
          >
            <span className="sr-only">{`${w1} ${w2} ${w3}`}</span>
            <span
              aria-hidden="true"
              className={`block whitespace-nowrap font-normal mb-1 ${
                hasImages ? "text-white drop-shadow-md" : "text-ink"
              }`}
            >
              <SplitWord word={w1} startIndex={0} />
              <span className="inline-block">&nbsp;</span>
              <SplitWord word={w2} startIndex={startIdx2} />
            </span>
            <span
              aria-hidden="true"
              className={`block whitespace-nowrap ${
                hasImages ? "text-coral font-normal drop-shadow-sm" : "text-grey font-light"
              }`}
            >
              <SplitWord word={w3} startIndex={startIdx3} />
            </span>
          </h1>

          <div
            className={`text-[11px] md:text-[13px] uppercase tracking-[0.22em] font-medium flex flex-wrap items-center justify-center gap-3 z-20 transition-all duration-700 ease-out delay-700 motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
              hasImages ? "text-white/85" : "text-grey"
            } ${isIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
          >
            <Link
              href="/collections/lehenga"
              className={`transition-colors ${hasImages ? "hover:text-white" : "hover:text-ink"}`}
            >
              NEW ARRIVALS
            </Link>
            <span>·</span>
            <Link
              href="/collections/mens-wear"
              className={`transition-colors ${hasImages ? "hover:text-white" : "hover:text-ink"}`}
            >
              MEN
            </Link>
            <span>·</span>
            <Link
              href="/collections/gown"
              className={`transition-colors ${hasImages ? "hover:text-white" : "hover:text-ink"}`}
            >
              WOMEN
            </Link>
          </div>

          {slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-0.5 transition-all duration-300 cursor-pointer ${
                    idx === activeSlide ? "w-8 bg-coral" : "w-4 bg-white/40 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div
          className={`w-full flex flex-col items-center text-center gap-5 sm:gap-6 transition-all duration-700 ease-out delay-900 motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
            isIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <p className="text-[14px] sm:text-[15px] leading-[1.7] text-ink max-w-[52ch]">
            {description}
          </p>

          <Link
            href={cta_link}
            className="bg-ink text-white hover:bg-coral text-[12px] uppercase tracking-[0.18em] font-medium px-8 py-3.5 transition-colors duration-200 inline-flex items-center gap-2 whitespace-nowrap select-none"
          >
            {cta_text}
          </Link>
        </div>
      </div>
    </section>
  );
}
