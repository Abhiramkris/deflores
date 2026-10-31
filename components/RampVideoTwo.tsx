"use client";

import { useEffect, useRef, useState } from "react";

interface RampVideoProps {
  url?: string;
  eyebrow?: string;
  title?: string;
  is_visible?: boolean;
}

export default function RampVideoTwo({
  url = "/ramp_video_2.mp4",
  eyebrow = "SECOND LOOK",
  title = "The runway, again.",
  is_visible = true,
}: RampVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.play().catch(() => {});
  }, [url]);

  const toggleSound = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const nextState = !video.muted;
    video.muted = nextState;
    setIsMuted(nextState);
    if (video.paused) {
      video.play().catch(() => {});
    }
  };

  if (is_visible === false) return null;

  return (
    <section
      aria-labelledby="ramp-two-heading"
      className="w-full py-12 sm:py-16 min-[900px]:py-24 border-t border-line"
    >
      <div className="max-w-[1280px] mx-auto px-6 min-[900px]:px-12 mb-8 text-center flex flex-col items-center gap-3">
        <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey">
          {eyebrow}
        </span>
        <h2
          id="ramp-two-heading"
          className="text-[clamp(28px,4vw,48px)] font-serif font-normal text-ink"
        >
          {title}
        </h2>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 min-[900px]:px-12 flex justify-center">
        <div
          onClick={() => toggleSound()}
          className="w-full max-w-[420px] aspect-[9/16] relative overflow-hidden bg-ink/5 border border-line cursor-pointer group"
        >
          <video
            ref={videoRef}
            src={url || "/ramp_video_2.mp4"}
            autoPlay
            loop
            playsInline
            muted={isMuted}
            preload="auto"
            className="w-full h-full object-cover"
          />

          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            className="absolute bottom-4 right-4 z-10 p-2.5 bg-paper/85 backdrop-blur-sm text-ink border border-line hover:bg-paper transition-colors duration-200"
          >
            {isMuted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.2" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.2" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
