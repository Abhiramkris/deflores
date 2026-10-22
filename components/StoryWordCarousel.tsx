"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const DEFAULT_WORDS = ["EVERY WOMAN", "EVERY MAN", "EVERY COUPLE", "EVERY ACHIEVER"];

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

interface StoryWordCarouselProps {
  words?: string[];
}

export default function StoryWordCarousel({ words = DEFAULT_WORDS }: StoryWordCarouselProps) {
  const activeWords = words.length > 0 ? words : DEFAULT_WORDS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const currentIndexRef = useRef(0);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    let animTimeout: ReturnType<typeof setTimeout> | undefined;

    const interval = setInterval(() => {
      const fromIndex = currentIndexRef.current;
      const toIndex = (fromIndex + 1) % activeWords.length;
      currentIndexRef.current = toIndex;
      setPrevIndex(fromIndex);
      setCurrentIndex(toIndex);

      animTimeout = setTimeout(() => {
        setPrevIndex(null);
      }, 450);
    }, 2000);

    return () => {
      clearInterval(interval);
      if (animTimeout) clearTimeout(animTimeout);
    };
  }, [prefersReducedMotion, activeWords.length]);

  return (
    <div className="w-full">
      <span className="sr-only">
        {activeWords.join(", ")}
      </span>
      <div
        aria-hidden="true"
        role="presentation"
        className="carousel-container"
      >
        {activeWords.map((word, idx) => {
          let transform = "translateY(100%)";
          let transition = "none";

          if (idx === currentIndex) {
            transform = "translateY(0%)";
            transition = prefersReducedMotion
              ? "none"
              : "transform 450ms cubic-bezier(0.65, 0, 0.35, 1)";
          } else if (idx === prevIndex) {
            transform = "translateY(-100%)";
            transition = prefersReducedMotion
              ? "none"
              : "transform 450ms cubic-bezier(0.65, 0, 0.35, 1)";
          }

          return (
            <span
              key={`${word}-${idx}`}
              style={{
                transform,
                transition,
                willChange: prefersReducedMotion ? "auto" : "transform",
              }}
              className="carousel-word text-ink"
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
}
