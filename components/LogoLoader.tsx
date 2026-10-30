"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function LogoLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const minDuration = 1300;
    const maxDuration = 5000;

    let hasDismissed = false;

    const dismissLoader = () => {
      if (hasDismissed) return;
      hasDismissed = true;

      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          setIsVisible(false);
        }, 600);
      }, delay);
    };

    if (document.readyState === "complete") {
      dismissLoader();
    } else {
      window.addEventListener("load", dismissLoader);
    }

    const maxTimeout = setTimeout(() => {
      dismissLoader();
    }, maxDuration);

    return () => {
      window.removeEventListener("load", dismissLoader);
      clearTimeout(maxTimeout);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-paper transition-opacity duration-700 ease-out select-none ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center text-center px-6">
        <div className="w-14 h-14 relative mb-6">
          <Image
            src="/logo.svg"
            alt="De Flores Haute Couture"
            fill
            priority
            className="object-contain"
          />
        </div>

        <span className="font-serif text-2xl sm:text-3xl tracking-[0.28em] uppercase text-ink font-normal">
          De Flores
        </span>
        <span className="text-[10px] tracking-[0.45em] uppercase text-grey font-medium mt-2">
          Haute Couture · Atelier
        </span>

        <div className="w-24 h-[1px] bg-line relative mt-8 overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-8 bg-coral animate-[shimmer_1.4s_infinite_linear]" />
        </div>
      </div>
    </div>
  );
}
