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

  // 2. Ambient Audio Controller
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Royalty-free loopable background music (SoundHelix minimal ambient audio)
    audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.2;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.log("Browser auto-play restriction block:", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  // 3. Cookie Consent Banner
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

      {/* Floating Audio Controller */}
      <div className="fixed bottom-6 left-6 z-40 bg-zinc-950/80 backdrop-blur-md text-white border border-white/10 px-4 py-3 rounded-full flex items-center gap-3.5 shadow-lg select-none">
        <button 
          onClick={toggleSound}
          className="flex items-center gap-2.5 text-[9px] font-bold tracking-[0.25em] uppercase hover:opacity-85 transition-opacity"
        >
          {isPlaying ? (
            <span className="text-[10px] text-emerald-400">● SOUND ON</span>
          ) : (
            <span className="text-[10px] text-zinc-400">○ SOUND OFF</span>
          )}
          
          {/* Animated sound bars */}
          <div className="flex items-end gap-[2px] h-3 w-5">
            <div className={`w-[2px] bg-white rounded-full transition-all duration-300 ${isPlaying ? "animate-[sound-bar-1_0.8s_infinite_alternate]" : "h-1"}`} style={{ height: isPlaying ? undefined : "4px" }} />
            <div className={`w-[2px] bg-white rounded-full transition-all duration-300 ${isPlaying ? "animate-[sound-bar-2_0.5s_infinite_alternate]" : "h-2"}`} style={{ height: isPlaying ? undefined : "6px" }} />
            <div className={`w-[2px] bg-white rounded-full transition-all duration-300 ${isPlaying ? "animate-[sound-bar-3_0.7s_infinite_alternate]" : "h-1"}`} style={{ height: isPlaying ? undefined : "3px" }} />
            <div className={`w-[2px] bg-white rounded-full transition-all duration-300 ${isPlaying ? "animate-[sound-bar-4_0.6s_infinite_alternate]" : "h-2.5"}`} style={{ height: isPlaying ? undefined : "5px" }} />
          </div>
        </button>
      </div>

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
