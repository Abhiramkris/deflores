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
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-paper transition-opacity duration-700 ease-out select-none ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="w-20 h-20 sm:w-28 sm:h-28 relative">
        <Image
          src="/logo.svg"
          alt="De Flores"
          fill
          priority
          className="object-contain"
        />
      </div>
    </div>
  );
}
