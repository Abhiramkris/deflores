"use client";

import { useState, useEffect, useRef } from "react";

export default function LuxuryEffects() {
  // 1. Mouse Custom Cursor Tracking with Negative Difference Effect
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("a") || 
        target.closest("button") ||
        target.classList.contains("cursor-pointer")
      ) {
        setIsHoveringClickable(true);
      } else {
        setIsHoveringClickable(false);
      }
    };

    window.addEventListener("mousemove", updateMouse);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMouse);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isVisible]);

  // 2. Cookie Consent Banner
  const [showCookies, setShowCookies] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Small delay for clean entrance
      const timer = setTimeout(() => setShowCookies(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShowCookies(false);
  };

  return (
    <>
      {/* custom negative effect cursor */}
      {isVisible && (
        <div 
          className="fixed pointer-events-none z-50 rounded-full bg-white mix-blend-difference transition-all duration-150 ease-out hidden md:block"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            width: isHoveringClickable ? "44px" : "14px",
            height: isHoveringClickable ? "44px" : "14px",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {/* Cookie Consent Banner */}
      {showCookies && (
        <div className="fixed bottom-6 right-6 z-40 max-w-sm bg-zinc-950 text-white border border-white/10 p-5 rounded-xl shadow-2xl animate-fade-in-up">
          <div className="space-y-4 text-left">
            <span className="text-[9px] tracking-[0.25em] font-bold text-zinc-400 uppercase">COOKIE CONSENT</span>
            <p className="text-[10px] leading-relaxed text-zinc-300 font-light">
              This digital atelier uses cookies to enhance custom drapes, collection previews, and analytics logs.
            </p>
            <div className="flex gap-3.5 pt-1">
              <button 
                onClick={acceptCookies}
                className="bg-white text-zinc-950 text-[9px] font-bold tracking-widest uppercase px-4 py-2 hover:bg-zinc-150 transition-colors"
              >
                Accept
              </button>
              <button 
                onClick={() => setShowCookies(false)}
                className="border border-white/20 text-white text-[9px] font-bold tracking-widest uppercase px-4 py-2 hover:bg-white/10 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
