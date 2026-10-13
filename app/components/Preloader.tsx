"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Lock body scroll while loader is visible
    document.body.style.overflow = "hidden";

    // Hold loader for exactly 2 seconds
    const fadeTimer = setTimeout(() => {
      setFading(true);
      document.body.style.overflow = "";
    }, 2000);

    // Completely remove from DOM after smooth fade-out (2700ms)
    const removeTimer = setTimeout(() => {
      setLoading(false);
    }, 2700);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black transition-opacity duration-700 ease-out select-none ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
      }`}
      aria-hidden={fading}
    >
      <div className="relative flex flex-col items-center justify-center p-6 animate-pulse">
        {/* De flores Logo in Pure White */}
        <div className="relative w-44 sm:w-56 h-52 sm:h-64 filter brightness-0 invert drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">
          <Image
            src="/logo.svg"
            alt="De flores"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Delicate luxury subtext / accent indicator */}
        <div className="mt-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-ping" />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-light text-white/70">
            De flores Atelier
          </span>
        </div>
      </div>
    </div>
  );
}
