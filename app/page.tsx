"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// 1. Bezier Curve Trail Section Component
function RingTrailSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress starting when section enters viewport until it leaves
      if (rect.top < windowHeight && rect.bottom > 0) {
        const totalHeight = windowHeight + rect.height;
        const currentProgress = (windowHeight - rect.top) / totalHeight;
        // Scale it so it starts drawing a bit later and finishes before leaving
        const scaledProgress = Math.min(1, Math.max(0, (currentProgress - 0.2) / 0.6));
        setProgress(scaledProgress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Curve points (start, control 1, control 2, end)
  const p0 = { x: 18, y: 55 };  // Bottom of left image
  const p1 = { x: 26, y: 90 };  // Lower curve sweep
  const p2 = { x: 42, y: 80 };  // Curve sweep crossing gap
  const p3 = { x: 55, y: 66 };  // Reaching right image

  const totalSteps = 24;
  const trailPoints = [];

  for (let i = 0; i <= totalSteps; i++) {
    const t = i / totalSteps;
    // Cubic Bezier formula
    const x = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * t * t * p2.x + Math.pow(t, 3) * p3.x;
    const y = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * t * t * p2.y + Math.pow(t, 3) * p3.y;
    
    // Rotation based on tangent slope
    const dx = 3 * Math.pow(1 - t, 2) * (p1.x - p0.x) + 6 * (1 - t) * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
    const dy = 3 * Math.pow(1 - t, 2) * (p1.y - p0.y) + 6 * (1 - t) * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    trailPoints.push({ x, y, angle, threshold: t });
  }

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full min-h-[90vh] bg-white py-24 overflow-hidden border-b border-zinc-100 flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 relative">
        
        {/* Left Column: Tall image */}
        <div className="relative aspect-[3/4.2] w-full md:w-[85%] bg-zinc-50 overflow-hidden rounded-sm shadow-xs z-10">
          <Image 
            src="/newimages/IMG_1058.JPG" 
            alt="Atelier ring styling"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        </div>

        {/* Right Column: Text & Lower image */}
        <div className="flex flex-col justify-between items-start space-y-12 md:space-y-0 text-left relative z-10 md:pt-16">
          <div className="space-y-2 md:self-end md:text-right">
            <span className="text-[10px] tracking-[0.3em] font-bold text-zinc-400 uppercase">NOMADIC -</span>
            <h2 className="font-serif text-3xl font-light text-zinc-950 uppercase tracking-widest">
              - RHYTHM
            </h2>
          </div>

          <div className="relative aspect-[4/3] w-full md:w-[90%] md:self-end bg-zinc-50 overflow-hidden rounded-sm shadow-xs mt-12">
            <Image 
              src="/newimages/IMG_1060.JPG" 
              alt="Hands detail with jewelry"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </div>

        {/* Trail rendering container overlay */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {trailPoints.map((pt, idx) => {
            const isVisible = progress >= pt.threshold;
            return (
              <div
                key={idx}
                style={{
                  left: `${pt.x}%`,
                  top: `${pt.y}%`,
                  transform: `translate(-50%, -50%) rotate(${pt.angle}deg) scale(${isVisible ? 1 : 0.8})`,
                  opacity: isVisible ? 0.78 : 0,
                }}
                className="absolute w-20 h-20 transition-all duration-300 ease-out"
              >
                <Image 
                  src="/ring-float.webp" 
                  alt="Ring trail particle" 
                  width={80} 
                  height={80} 
                  className="w-full h-full object-contain filter grayscale contrast-125 brightness-95"
                />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (hasAutoOpened) return;
      const scrollPos = window.innerHeight + window.scrollY;
      const totalHeight = document.documentElement.scrollHeight;
      if (scrollPos >= totalHeight - 600) {
        setIsPopupOpen(true);
        setHasAutoOpened(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasAutoOpened]);

  useEffect(() => {
    const fetchHomeGallery = async () => {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        if (data.success) {
          setGalleryImages(data.images.slice(0, 6));
        }
      } catch (err) {
        console.error("Home gallery fetch failed:", err);
      }
    };
    fetchHomeGallery();
  }, []);

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      try {
        const deviceId = localStorage.getItem("device_id") || "";
        const res = await fetch("/api/newsletter/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailInput, deviceId })
        });
        if (res.ok) {
          localStorage.setItem("subscriber_email", emailInput.trim());
          setIsSubscribed(true);
          setTimeout(() => {
            setIsPopupOpen(false);
          }, 2000);
        }
      } catch (err) {
        console.error("Subscription failed:", err);
      }
    }
  };

  return (
    <div className="w-full bg-[#fbfbfa] text-zinc-900 font-sans selection:bg-zinc-950 selection:text-white">
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[90vh] bg-zinc-950 overflow-hidden flex items-end">
        <div 
          className="absolute inset-0 bg-cover bg-center brightness-[0.82]"
          style={{ backgroundImage: "url('/newimages/IMG_1066.JPG')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent z-1" />

        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pb-24 relative z-10 grid grid-cols-1 md:grid-cols-2 items-end gap-12">
          <div className="space-y-6 text-white text-left">
            <p className="text-[10px] tracking-[0.3em] font-bold text-zinc-300 uppercase">THE INVISIBLE ECHO</p>
            <h1 className="font-serif text-5xl md:text-8xl font-light leading-[0.9] tracking-[-0.03em] uppercase">
              DEFLORE
            </h1>
            <div className="pt-4">
              <Link 
                href="#trail-section" 
                className="text-[10px] font-bold tracking-[0.2em] uppercase text-white pb-2 border-b border-white hover:text-zinc-200 hover:border-zinc-200 transition-colors"
              >
                DISCOVER RHYTHM
              </Link>
            </div>
          </div>

          <div className="text-white md:text-right space-y-3">
            <div className="font-serif text-3xl md:text-5xl font-light tracking-wide">
              24/25
            </div>
            <div className="text-[9px] md:text-[10px] tracking-[0.25em] font-semibold uppercase text-zinc-300">
              HIGH VALUE WOMEN CUSTOM DESIGN SECTIONS
            </div>
          </div>
        </div>
      </section>

      {/* RHYTHM SECTION WITH SCROLLING TRAIL */}
      <div id="trail-section">
        <RingTrailSection />
      </div>

      {/* SIGNATURE CATALOG GRID */}
      <section className="py-24 md:py-32 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="flex justify-between items-end mb-12 pb-4 border-b border-zinc-200">
            <h2 className="font-serif text-3xl tracking-widest uppercase text-zinc-950 font-normal">
              Signature Outfits
            </h2>
            <Link 
              href="#gallery" 
              className="group flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-zinc-900 hover:opacity-60 transition-all"
            >
              See Lookbook 
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { id: 1, img: "/newimages/IMG_1059.JPG", title: "MINT GLITTER SEQUIN LEHENGA", price: "₹28,500" },
              { id: 2, img: "/newimages/IMG_1061.JPG", title: "IVORY EMBROIDERED FESTIVE CHIC", price: "₹24,000" },
              { id: 3, img: "/newimages/IMG_1063.JPG", title: "SCARLET DRAPED GEORGETTE GOWN", price: "₹22,500" },
              { id: 4, img: "/newimages/IMG_1065.JPG", title: "EMERALD DESIGNER LEHENGA SET", price: "₹32,000" }
            ].map((item) => (
              <Link href={`/product/${item.id}`} key={item.id} className="product-card flex flex-col group cursor-pointer">
                <div className="product-image-container aspect-[3/4] w-full mb-4 bg-zinc-100 overflow-hidden relative rounded-lg">
                  <Image 
                    src={item.img} 
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="space-y-1 text-left">
                  <h3 className="text-[10px] tracking-widest font-semibold uppercase text-zinc-900 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[10px] font-medium text-zinc-500 tracking-wider">
                    {item.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* GALLERY LOOKBOOK SECTION */}
      <section id="gallery" className="py-24 bg-transparent border-t border-zinc-200/20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="flex justify-between items-end mb-12 pb-4 border-b border-zinc-200">
            <h2 className="font-serif text-3xl tracking-widest uppercase text-zinc-950 font-normal">
              Editorial Exposé
            </h2>
            <div className="text-[9px] tracking-widest font-semibold uppercase text-zinc-400">
              DEFLORE LOOKBOOK
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {galleryImages.map((item) => (
                <div key={item.id} className="relative aspect-[3/4.5] w-full bg-zinc-100 overflow-hidden group rounded-lg">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.description || "Gallery Photo"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-95"
                    sizes="(max-width: 768px) 50vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-[9px] tracking-widest uppercase text-white font-semibold">
                      {item.description || "HAUTE COUTURE"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="gallery-blur-overlay" />

            <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center">
              <Link 
                href="/gallery"
                className="px-8 py-3.5 bg-zinc-950 text-white text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-md active:scale-95"
              >
                Show More
                <svg className="w-3.5 h-3.5 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* POPUP CONSENT */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-zinc-200/40 p-8 md:p-10 shadow-2xl relative text-center rounded-xl">
            
            <button 
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-950 transition-colors"
              aria-label="Close dialog"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-6">
              <h3 className="font-serif text-2xl tracking-widest uppercase text-zinc-950">
                Subscribe
              </h3>
              <p className="text-zinc-500 text-xs leading-relaxed font-light">
                Join our newsletter list to receive seasonal curation updates, private runway launches, and exclusive offers.
              </p>

              {isSubscribed ? (
                <div className="py-4 text-emerald-600 font-semibold text-xs tracking-wider animate-pulse">
                  THANK YOU! REDIRECTING TO INSTAGRAM...
                </div>
              ) : (
                <form onSubmit={handleSubscribeSubmit} className="space-y-4">
                  <input
                    type="email"
                    required
                    placeholder="YOUR EMAIL ADDRESS"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full border border-zinc-200 text-xs px-4 py-3 tracking-wider text-zinc-950 text-center placeholder:text-zinc-300 focus:outline-none focus:border-zinc-500 rounded-none bg-transparent"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="submit"
                      className="bg-zinc-950 text-white text-[10px] font-bold tracking-widest uppercase py-3.5 hover:bg-zinc-800 transition-colors"
                    >
                      Subscribe
                    </button>
                    <a 
                      href="https://www.instagram.com/de_flores_official"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-zinc-950 text-zinc-950 text-[10px] font-bold tracking-widest uppercase py-3.5 hover:bg-zinc-50 transition-colors flex items-center justify-center"
                    >
                      Continue
                    </a>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
