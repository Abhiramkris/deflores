"use client";

import { ReactNode, useEffect } from "react";
import { ReactLenis } from "lenis/react";

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // Ensure native scroll-behavior doesn't fight Lenis
    document.documentElement.style.scrollBehavior = "auto";
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  );
}
