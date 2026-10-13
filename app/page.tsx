"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  Play,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Sparkles,
  ExternalLink,
} from "lucide-react";

const HERO_SLIDES = [
  {
    id: 1,
    image: "/hero/herosection1.png",
    tagline: "Cross Motion",
    titleLine1: "Every Brand.",
    titleLine2: "Every Moment.",
    year: "2026",
    description:
      "Combining human creativity and AI innovation to create fashion content built for modern audiences.",
  },
  {
    id: 2,
    image: "/hero/herosection2.png",
    tagline: "Timeless Luxury",
    titleLine1: "Every Brand.",
    titleLine2: "Every Moment.",
    year: "2026",
    description:
      "Combining human creativity and AI innovation to create fashion content built for modern audiences.",
  },
  {
    id: 3,
    image: "/hero/herosection3.png",
    tagline: "Haute Couture",
    titleLine1: "Every Brand.",
    titleLine2: "Every Moment.",
    year: "2026",
    description:
      "Combining human creativity and AI innovation to create fashion content built for modern audiences.",
  },
];

const CATEGORIES = [
  {
    id: "lehenga",
    number: "01",
    tag: "HAUTE COUTURE",
    name: "Lehenga",
    image: "/hero/herosection1.png",
  },
  {
    id: "gown",
    number: "02",
    tag: "RED CARPET",
    name: "Gown",
    image: "/hero/herosection3.png",
  },
  {
    id: "saree",
    number: "03",
    tag: "TIMELESS DRAPES",
    name: "Saree",
    image: "/new_images2/IMG_1077.webp",
  },
  {
    id: "mens-wear",
    number: "04",
    tag: "ROYAL COUTURE",
    name: "Mens Wear",
    image: "/new_images2/IMG_1078.webp",
  },
  {
    id: "party-wear",
    number: "05",
    tag: "COCKTAIL EDIT",
    name: "Party Wear",
    image: "/newimages/IMG_1064.webp",
  },
];


const TEAM_PILLARS = [
  {
    number: "01",
    tag: "FOUNDER & CREATIVE HEAD",
    title: "Anisree Sreeraj",
    role: "Couture Vision & Design Philosophy",
    description:
      "IT professional turned fashion designer leading De flores. Renowned for blending unique elegance, royalty, and class into bespoke bridal outfits and red-carpet ensembles.",
    linkText: "Read Founder Story",
    href: "/founder",
  },
  {
    number: "02",
    tag: "ATELIER CRAFTSMEN",
    title: "Master Karigars",
    role: "Zardozi & Heritage Embroidery Guild",
    description:
      "Generations of artisanal expertise mastering antique zardozi, hand-done aari, dabka work, and delicate thread embroideries on authentic pure handloom silks.",
    linkText: "Explore Collections",
    href: "/collections",
  },
  {
    number: "03",
    tag: "BESPOKE CONSULTATION",
    title: "Bridal Stylists",
    role: "Personal Couture & Trousseau Planning",
    description:
      "A dedicated styling team guiding each client through private fittings, custom shade curation, and tailored ensembles for unforgettable wedding celebrations.",
    linkText: "Book Consultation",
    href: "/contact",
  },
];

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Atelier Runway Vision",
    category: "Editorial Collection",
    tag: "HAUTE EDITORIAL",
    number: "01",
    image: "/vision_editorial.jpg",
    aspect: "aspect-video",
  },
  {
    id: 2,
    title: "Lakeside Contemporary Gowns",
    category: "Western Ensembles",
    tag: "ATELIER SIGNATURE",
    number: "02",
    image: "/newimages/IMG_1064.webp",
    aspect: "aspect-[3/4.4]",
  },
  {
    id: 3,
    title: "Heritage Bridal Lehenga",
    category: "Bridal Couture",
    tag: "HAUTE COUTURE",
    number: "03",
    image: "/hero/herosection1.png",
    aspect: "aspect-[4/3]",
  },
  {
    id: 4,
    title: "Temple Courtyard Silk Ensemble",
    category: "Pret Apparel",
    tag: "TIMELESS SILKS",
    number: "04",
    image: "/hero/herosection2.png",
    aspect: "aspect-[4/3]",
  },
  {
    id: 5,
    title: "Sunset Chiffon & Tulle Gown",
    category: "Evening Gown",
    tag: "RED CARPET",
    number: "05",
    image: "/hero/herosection3.png",
    aspect: "aspect-video",
  },
  {
    id: 6,
    title: "Zardozi Embroidered Royal Drape",
    category: "Haute Couture",
    tag: "ROYAL EMBROIDERY",
    number: "06",
    image: "/newimages/IMG_1058.webp",
    aspect: "aspect-[3/4.4]",
  },
  {
    id: 7,
    title: "Mirror Reflection Fitting",
    category: "Atelier Backstage",
    tag: "ATELIER BESPOKE",
    number: "07",
    image: "/newimages/IMG_1060.webp",
    aspect: "aspect-[3/4]",
  },
  {
    id: 8,
    title: "Courtyard Swing Duo",
    category: "Festive Occasion",
    tag: "FESTIVE COUTURE",
    number: "08",
    image: "/newimages/IMG_1062.webp",
    aspect: "aspect-[3/4.4]",
  },
  {
    id: 9,
    title: "Sacred Ceremonial Silk Saree",
    category: "Heritage Weaves",
    tag: "PURE SILK HEIRLOOM",
    number: "09",
    image: "/new_images2/IMG_1076.webp",
    aspect: "aspect-[3/4.4]",
  },
  {
    id: 10,
    title: "Peacock Jewel Handcrafted Details",
    category: "Bespoke Jewelry & Blouse",
    tag: "ARTISANAL JEWEL",
    number: "10",
    image: "/new_images2/IMG_1077.webp",
    aspect: "aspect-[3/4]",
  },
  {
    id: 11,
    title: "Celebration Sherwani & Anarkali",
    category: "Mens & Bridal",
    tag: "ROYAL COUTURE",
    number: "11",
    image: "/new_images2/IMG_1078.webp",
    aspect: "aspect-[3/4.4]",
  },
  {
    id: 12,
    title: "Lakeside Couple Embrace",
    category: "Occasion Wear",
    tag: "ROMANCE EDIT",
    number: "12",
    image: "/new_images2/IMG_1080.webp",
    aspect: "aspect-[3/4]",
  },
  {
    id: 13,
    title: "Radiant Sheer Veil Drape",
    category: "Bridal Veil",
    tag: "BRIDAL VEIL",
    number: "13",
    image: "/new_images2/IMG_1081.webp",
    aspect: "aspect-[3/4.4]",
  },
  {
    id: 14,
    title: "Embellished Peach Organza Saree",
    category: "Pret Collection",
    tag: "ORGANZA DRAPES",
    number: "14",
    image: "/new_images2/IMG_1082.webp",
    aspect: "aspect-[3/4.4]",
  },
  {
    id: 15,
    title: "Royal Violet Scalloped Blouse",
    category: "Handcrafted Zardozi",
    tag: "ZARDOZI ATELIER",
    number: "15",
    image: "/gallery_purple.jpg",
    aspect: "aspect-[3/4]",
  },
  {
    id: 16,
    title: "Pastel Mirror-Work Lehenga",
    category: "Party Wear",
    tag: "COCKTAIL EDIT",
    number: "16",
    image: "/crop_green.png",
    aspect: "aspect-[3/4]",
  },
];

interface FilmItem {
  id: string;
  driveId?: string;
  title: string;
  subtitle?: string;
  year?: string;
  googleDriveUrl?: string;
  previewUrl?: string;
  url?: string;
  description?: string;
}

const DEFAULT_FILMS: FilmItem[] = [
  {
    id: "film-01",
    driveId: "1_WZtXfS70SJwyiO094XZjdcQAVvo90Cn",
    title: "de flores — Haute Couture Film",
    subtitle: "Paris Runway & Bespoke Bridal Atelier",
    year: "2026",
    googleDriveUrl: "https://drive.google.com/file/d/1_WZtXfS70SJwyiO094XZjdcQAVvo90Cn/view?usp=drive_link",
    previewUrl: "https://drive.google.com/file/d/1_WZtXfS70SJwyiO094XZjdcQAVvo90Cn/preview",
    description: "An intimate glimpse into our bespoke bridal ateliers, handcrafted zardozi embroidery, and haute couture runway silhouettes.",
  },
  {
    id: "film-02",
    driveId: "1tXCU91L1fAR2c9XF-Df2rBfkgRIipV_Y",
    title: "The Art of Zardozi & Handloom Silk",
    subtitle: "Master Craftsmen at Work",
    year: "2026",
    googleDriveUrl: "https://drive.google.com/file/d/1tXCU91L1fAR2c9XF-Df2rBfkgRIipV_Y/view?usp=drive_link",
    previewUrl: "https://drive.google.com/file/d/1tXCU91L1fAR2c9XF-Df2rBfkgRIipV_Y/preview",
    description: "Witness centuries-old heritage weaving techniques reimagined for modern red carpet occasions.",
  },
];

function parseVideoSource(item?: FilmItem | null): { type: "iframe" | "video"; src: string } {
  const defaultDriveId = "1_WZtXfS70SJwyiO094XZjdcQAVvo90Cn";
  if (!item) {
    return {
      type: "iframe",
      src: `https://drive.google.com/file/d/${defaultDriveId}/preview`,
    };
  }

  const rawUrl = (item.googleDriveUrl || item.previewUrl || item.url || "").trim();

  // 1. Google Drive URLs (converts to official Google embed preview player)
  const driveMatch = rawUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || rawUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return {
      type: "iframe",
      src: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
    };
  }

  if (item.driveId) {
    return {
      type: "iframe",
      src: `https://drive.google.com/file/d/${item.driveId}/preview`,
    };
  }

  // 2. YouTube URLs
  const ytMatch = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      type: "iframe",
      src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
    };
  }

  // 3. Vimeo URLs
  const vimeoMatch = rawUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      type: "iframe",
      src: `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1`,
    };
  }

  // 4. Default: always Film 1 Google Drive preview (Never /customization.mp4)
  return {
    type: "iframe",
    src: `https://drive.google.com/file/d/${defaultDriveId}/preview`,
  };
}

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isWhiteMode, setIsWhiteMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [films, setFilms] = useState<FilmItem[]>(DEFAULT_FILMS);
  const [selectedFilmIndex, setSelectedFilmIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Refs for the Our Vision to Gallery Card #1 scroll transformation
  const visionSectionRef = useRef<HTMLElement>(null);
  const gallerySectionRef = useRef<HTMLElement>(null);
  const galleryFirstCardRef = useRef<HTMLDivElement>(null);
  const morphOverlayRef = useRef<HTMLDivElement>(null);
  const ivoryCardRef = useRef<HTMLDivElement>(null);
  const visionBgRef = useRef<HTMLDivElement>(null);
  const editorialPinnedRef = useRef<HTMLDivElement>(null);
  const editorialTextRef = useRef<HTMLDivElement>(null);
  const editorialScrimRef = useRef<HTMLDivElement>(null);
  const cachedCard = useRef<{
    docX: number;
    docY: number;
    width: number;
    height: number;
    radius: number;
  } | null>(null);
  const rafId = useRef<number | null>(null);

  // Ultra-performant geometry cache and scroll-driven morph
  useEffect(() => {
    const measureCard = () => {
      if (!galleryFirstCardRef.current) return;
      const rect = galleryFirstCardRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const style = window.getComputedStyle(galleryFirstCardRef.current);
      const radius = parseFloat(style.borderRadius) || 28;

      cachedCard.current = {
        docX: rect.left,
        docY: rect.top + scrollY,
        width: rect.width,
        height: rect.height,
        radius: radius,
      };
    };

    const updateMorph = () => {
      if (!visionSectionRef.current || !galleryFirstCardRef.current || !morphOverlayRef.current) return;

      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;
      const viewportW = window.innerWidth;
      const visionTop = visionSectionRef.current.offsetTop;

      // Keep card measurement fresh when above or entering morph zone
      if (scrollY <= visionTop + 30 || !cachedCard.current) {
        measureCard();
      }
      const card = cachedCard.current;
      if (!card) return;

      // Start when user reaches Our Vision
      const startScroll = visionTop;
      // End when Card 1 reaches resting viewport position (around 220px from top, or 28% of viewport)
      const targetRestingY = Math.min(260, Math.max(160, viewportH * 0.28));
      const endScroll = card.docY - targetRestingY;
      const totalDist = endScroll - startScroll;

      if (totalDist <= 0) return;

      const rawP = (scrollY - startScroll) / totalDist;
      const p = Math.min(Math.max(rawP, 0), 1);

      // Outside active scroll zone: hide morph overlay to free GPU resources
      if (scrollY < startScroll - 60 || scrollY > endScroll + 120) {
        if (morphOverlayRef.current.style.display !== "none") {
          morphOverlayRef.current.style.display = "none";
        }
        if (galleryFirstCardRef.current.style.opacity !== "1") {
          galleryFirstCardRef.current.style.opacity = "1";
        }
        if (ivoryCardRef.current) {
          if (scrollY > endScroll + 120) {
            ivoryCardRef.current.style.opacity = "0";
            ivoryCardRef.current.style.pointerEvents = "none";
          } else if (scrollY < startScroll - 60) {
            ivoryCardRef.current.style.opacity = "1";
            ivoryCardRef.current.style.transform = "translate3d(0, 0, 0)";
            ivoryCardRef.current.style.pointerEvents = "auto";
          }
        }
        if (visionBgRef.current) {
          visionBgRef.current.style.opacity = scrollY < startScroll - 60 ? "1" : "0";
        }
        return;
      }

      // Within morph zone:
      if (morphOverlayRef.current.style.display !== "block") {
        morphOverlayRef.current.style.display = "block";
      }

      // Hide Section 7's static background when morph is active to prevent duplication
      if (visionBgRef.current) {
        visionBgRef.current.style.opacity = p > 0.02 ? "0" : "1";
      }

      // 1. Ivory Vision Card: fades out smoothly and lifts in the first 22% of scroll
      if (ivoryCardRef.current) {
        const cardP = Math.min(p / 0.22, 1);
        const cardOpacity = Math.max(0, 1 - cardP);
        const cardTranslateY = -cardP * 45;
        ivoryCardRef.current.style.opacity = String(cardOpacity);
        ivoryCardRef.current.style.transform = `translate3d(0, ${cardTranslateY}px, 0)`;
        ivoryCardRef.current.style.pointerEvents = cardOpacity < 0.1 ? "none" : "auto";
      }

      // 2. Continuous Image Morph: cubic ease for luxurious physical momentum
      const morphT = Math.min(Math.max((p - 0.04) / 0.96, 0), 1);
      const e = morphT < 0.5 ? 4 * morphT * morphT * morphT : 1 - Math.pow(-2 * morphT + 2, 3) / 2;

      // Current position of Card 1 in the viewport
      const cardCurrentY = card.docY - scrollY;
      const cardX = card.docX;
      const cardW = card.width;
      const cardH = card.height;
      const cardRadius = card.radius;

      // Interpolate dimensions and coordinates
      const curW = viewportW + e * (cardW - viewportW);
      const curH = viewportH + e * (cardH - viewportH);
      const curX = e * cardX;
      const curY = e * cardCurrentY;
      const radius = e * cardRadius;

      const el = morphOverlayRef.current;
      el.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0)`;
      el.style.width = `${curW.toFixed(1)}px`;
      el.style.height = `${curH.toFixed(1)}px`;
      el.style.borderRadius = `${radius.toFixed(1)}px`;
      el.style.clipPath = "none";

      // Complete seamless handoff when p >= 0.98
      if (p >= 0.98) {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        galleryFirstCardRef.current.style.opacity = "1";
      } else {
        el.style.opacity = "1";
        el.style.pointerEvents = p > 0.8 ? "auto" : "none";
        galleryFirstCardRef.current.style.opacity = "0";
      }

      // 3. Pinned Editorial Section Animation (Best for your fit, best from us always)
      if (editorialPinnedRef.current && editorialTextRef.current) {
        const epRect = editorialPinnedRef.current.getBoundingClientRect();
        const epScrollable = epRect.height - viewportH;
        if (epScrollable > 0) {
          const epP = Math.min(Math.max(-epRect.top / epScrollable, 0), 1);
          // Text enters between 5% and 35% of the scroll track
          const textP = Math.min(Math.max((epP - 0.05) / 0.3, 0), 1);
          const easedTextP = 1 - Math.pow(1 - textP, 3);
          const textTranslateY = (1 - easedTextP) * 45;
          editorialTextRef.current.style.opacity = String(easedTextP);
          editorialTextRef.current.style.transform = `translate3d(0, ${textTranslateY.toFixed(1)}px, 0)`;

          if (editorialScrimRef.current) {
            // Scrim deepens from 0.15 to 0.55 as text appears to ensure readability
            const scrimOpacity = 0.15 + easedTextP * 0.4;
            editorialScrimRef.current.style.opacity = String(scrimOpacity);
          }
        }
      }
    };

    // Measure after mount and DOM paints
    const timer = setTimeout(() => {
      measureCard();
      updateMorph();
    }, 120);

    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = window.requestAnimationFrame(() => {
        rafId.current = null;
        updateMorph();
      });
    };

    const onResize = () => {
      measureCard();
      updateMorph();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && galleryFirstCardRef.current) {
      ro = new ResizeObserver(() => {
        measureCard();
        updateMorph();
      });
      ro.observe(galleryFirstCardRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
      if (rafId.current !== null) {
        window.cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // Load films configuration from public/data/films.json
  useEffect(() => {
    fetch("/data/films.json")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("films.json not available");
      })
      .then((data) => {
        if (data && Array.isArray(data.films) && data.films.length > 0) {
          setFilms(data.films);
        }
      })
      .catch((err) => {
        console.warn("Using fallback films configuration:", err);
      });
  }, []);

  // Track scroll position to toggle navbar appearance and pin hero canvas
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 40);
      setIsPastHero(scrollY > (window.innerHeight || 800));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Preload hero images into browser cache
  useEffect(() => {
    HERO_SLIDES.forEach((s) => {
      const img = new window.Image();
      img.src = s.image;
    });
  }, []);

  // Auto carousel cycling
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 font-sans ${isWhiteMode ? "bg-[#faf9f6] text-zinc-900" : "bg-black text-white"
        }`}
    >
      {/* 1. TOP LUXURY NAVBAR: TRANSPARENT AT TOP, WHITE ON SCROLL */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 flex items-center justify-between transition-all duration-300 ${isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-zinc-200/80 text-zinc-900 py-4 shadow-sm"
            : "bg-transparent border-b border-transparent text-white py-6 sm:py-7"
          }`}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          className={`font-serif tracking-[0.25em] text-2xl sm:text-3xl font-light uppercase hover:opacity-80 transition-all ${isScrolled ? "text-zinc-950" : "text-white drop-shadow-sm"
            }`}
        >
          De flores
        </Link>

        {/* Desktop Nav Links */}
        <nav
          className={`hidden md:flex items-center space-x-9 text-xs tracking-[0.22em] uppercase font-medium transition-colors ${isScrolled ? "text-zinc-600" : "text-white/90"
            }`}
        >
          <Link
            href="/collections"
            className={isScrolled ? "hover:text-black transition-colors" : "hover:text-white transition-colors"}
          >
            Collections
          </Link>
          <Link
            href="/about"
            className={isScrolled ? "hover:text-black transition-colors" : "hover:text-white transition-colors"}
          >
            About
          </Link>
          <Link
            href="/journal"
            className={isScrolled ? "hover:text-black transition-colors" : "hover:text-white transition-colors"}
          >
            Journal
          </Link>
          <Link
            href="/sustainability"
            className={isScrolled ? "hover:text-black transition-colors" : "hover:text-white transition-colors"}
          >
            Sustainability
          </Link>
          <Link
            href="/contact"
            className={isScrolled ? "hover:text-black transition-colors" : "hover:text-white transition-colors"}
          >
            Contact
          </Link>
        </nav>

        {/* Right Nav Actions */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          {/* Mode Toggle */}
          <button
            onClick={() => setIsWhiteMode(!isWhiteMode)}
            className={`p-2 rounded-full transition-all ${isScrolled
                ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
                : "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
              }`}
            title={isWhiteMode ? "Switch to Dark Mode" : "Switch to White Mode"}
            aria-label="Toggle Theme Mode"
          >
            {isWhiteMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search"
            className={`p-2 transition-opacity hover:opacity-75 ${isScrolled ? "text-zinc-800" : "text-white"
              }`}
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
          </button>

          {/* Sign In */}
          <Link
            href="/login"
            className={`hidden sm:inline-block text-xs uppercase tracking-[0.2em] font-medium transition-colors ${isScrolled ? "text-zinc-800 hover:text-black" : "text-white/90 hover:text-white"
              }`}
          >
            Sign In
          </Link>

          {/* Shop Now */}
          <Link
            href="/collections"
            className={`rounded-full px-5 sm:px-6 py-2 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-sm ${isScrolled
                ? "bg-zinc-950 text-white hover:bg-zinc-800"
                : "border border-white/80 bg-white/10 text-white hover:bg-white hover:text-black backdrop-blur-sm"
              }`}
          >
            Shop Now
          </Link>

          {/* Mobile Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition-colors ${isScrolled ? "text-zinc-900" : "text-white"
              }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* 2. TRUE FULL SCREEN HERO SECTION (Pinned Fixed Background Canvas) */}
      <div className="relative w-full h-screen">
        <section
          className="fixed top-0 left-0 right-0 w-full h-screen overflow-hidden bg-black select-none z-0"
          style={{
            pointerEvents: isPastHero ? "none" : "auto",
            visibility: isPastHero ? "hidden" : "visible",
          }}
        >
          {/* Preloaded Background Images */}
          {HERO_SLIDES.map((item, idx) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
            >
              <Image
                src={item.image}
                alt={`Hero Slide ${item.id}`}
                fill
                priority={true}
                sizes="100vw"
                quality={90}
                className="object-cover object-center"
              />
            </div>
          ))}

          {/* Soft Contrast Gradient */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

          {/* Hero Content Overlay */}
          <div className="relative z-20 w-full h-full pt-28 sm:pt-32 px-6 sm:px-12 md:px-16 pb-12 flex flex-col justify-between text-white">
            {/* Top Row: Tagline & Carousel Switcher */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm tracking-[0.3em] font-light uppercase text-white/90 drop-shadow">
                {slide.tagline}
              </span>

              {/* Quick Slide Switcher (01 / 02 / 03) */}
              <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                  className="p-1 hover:text-white/70 transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {HERO_SLIDES.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlide(i)}
                    className={`text-xs px-2.5 py-0.5 rounded-full transition-all ${i === currentSlide
                        ? "bg-white text-black font-semibold shadow-sm"
                        : "text-white/70 hover:text-white"
                      }`}
                  >
                    0{s.id}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                  className="p-1 hover:text-white/70 transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Middle Row: Left Headline & Right Paragraph (Hidden on Mobile view) */}
            <div className="hidden sm:grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
              {/* Left Headline */}
              <div className="lg:col-span-8 space-y-2">
                <h1 className="font-serif italic font-normal text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] leading-[1.02] tracking-tight text-white drop-shadow-lg">
                  <span className="block">{slide.titleLine1}</span>
                  <span className="block font-sans not-italic font-light tracking-normal text-4xl sm:text-6xl md:text-7xl lg:text-[6.5rem]">
                    {slide.titleLine2}
                  </span>
                </h1>
              </div>

              {/* Right Paragraph */}
              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <p className="text-sm sm:text-base font-light text-white/90 leading-relaxed max-w-sm drop-shadow-md">
                  {slide.description}
                </p>
              </div>
            </div>

            {/* Bottom Area: 2 CTAs In Same Row Below + Year Bar */}
            <div className="mt-auto pt-6 flex flex-col space-y-5 sm:space-y-6">
              {/* 2 CTAs Side-by-Side in Same Row */}
              <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 w-full max-w-lg mx-auto">
                <Link
                  href="/collections"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 sm:space-x-3 bg-white text-zinc-950 rounded-full px-4 sm:px-8 py-3 sm:py-3.5 text-[10px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.25em] font-medium hover:bg-zinc-200 transition-all duration-300 shadow-2xl hover:scale-[1.02] whitespace-nowrap"
                >
                  <span>Explore Collections</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>

                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 sm:space-x-3 backdrop-blur-md bg-black/40 border border-white/40 text-white rounded-full px-4 sm:px-8 py-3 sm:py-3.5 text-[10px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.25em] font-medium hover:bg-white hover:text-black transition-all duration-300 shadow-2xl hover:scale-[1.02] whitespace-nowrap"
                >
                  <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                  <span>Watch Film</span>
                </button>
              </div>

              {/* Year & Tag Bar */}
              <div className="flex items-center justify-between text-xs tracking-widest text-white/70 pt-2">
                <span>{slide.year}</span>
                <div className="flex items-center space-x-2">
                  <span className="w-12 h-[1px] bg-white/40" />
                  <span className="uppercase text-[10px] tracking-[0.3em]">Couture Digital</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 3. SHOP BY CATEGORY (Glides smoothly on top of Hero) */}
      <section
        className={`relative z-10 w-full py-16 sm:py-28 px-5 sm:px-10 lg:px-16 transition-colors duration-500 rounded-none shadow-[0_-25px_60px_rgba(0,0,0,0.35)] border-t border-zinc-200/80 dark:border-white/10 ${
          isWhiteMode ? "bg-[#faf9f6]" : "bg-zinc-950"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Top Metadata Bar */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-zinc-400 mb-8 border-b border-zinc-200/60 dark:border-white/10 pb-4">
            <span>Curated Collections</span>
            <span>Shop by Category</span>
            <span>2026</span>
          </div>

          {/* Section Title */}
          <div className="text-center mb-12 sm:mb-20">
            <h2
              className={`text-4xl sm:text-6xl md:text-7xl font-light tracking-tight ${
                isWhiteMode ? "text-zinc-900" : "text-white"
              }`}
            >
              Shop by
              <span className="block font-serif italic font-normal mt-1 sm:mt-2 text-5xl sm:text-7xl md:text-8xl">
                Category
              </span>
            </h2>
          </div>

          {/* 5 Category Cards across 2 Rows: 3 on Row 1, 2 Centered on Row 2 */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {CATEGORIES.map((cat, index) => {
              const isLast = index === CATEGORIES.length - 1;

              return (
                <Link
                  key={cat.id}
                  href={`/collections?category=${cat.id}`}
                  className={`group relative block overflow-hidden rounded-[1.8rem] sm:rounded-[2.2rem] bg-zinc-900 shadow-xl border border-black/5 dark:border-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl w-[calc(50%-0.6rem)] md:w-[calc(33.333%-1.5rem)] lg:w-[calc(33.333%-1.75rem)] max-w-[340px] shrink-0 ${
                    isLast ? "max-w-[calc(50%-0.6rem)] md:max-w-[340px]" : ""
                  }`}
                >
                  <div className="relative w-full aspect-[3/4.2] overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 340px"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Bottom Bar: Category Name & Circular Arrow */}
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex items-center justify-between z-10">
                      <span className="font-serif text-base sm:text-lg lg:text-xl font-normal tracking-wide text-white drop-shadow-md">
                        {cat.name}
                      </span>

                      <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg shrink-0 group-hover:bg-white group-hover:text-black group-hover:scale-110 transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2]" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Section Bottom CTA Pill */}
          <div className="mt-16 sm:mt-24 text-center">
            <Link
              href="/collections"
              className={`inline-flex items-center space-x-3 rounded-full px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium transition-all duration-300 shadow-md ${
                isWhiteMode
                  ? "bg-zinc-950 text-white hover:bg-zinc-800"
                  : "bg-white text-zinc-950 hover:bg-zinc-200"
              }`}
            >
              <span>Explore All Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. DE FLORES STORY / OUR VISION SECTION (Full-Bleed Full-Screen Editorial Canvas) */}
      <section
        ref={visionSectionRef}
        className="relative z-[36] w-full min-h-screen flex items-center justify-end overflow-hidden"
      >
        {/* Full-Bleed Edge-to-Edge Background Image */}
        <div
          ref={visionBgRef}
          className="absolute inset-0 w-full h-full transition-opacity duration-300"
        >
          <Image
            src="/vision_editorial.jpg"
            alt="Our Vision - Haute Couture Runway"
            fill
            priority
            sizes="100vw"
            quality={95}
            className="object-cover object-center"
          />
          {/* Subtle Contrast Vignette for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/25 pointer-events-none" />
        </div>

        {/* Floating Ivory Vision Card on the Right (Glides and fades smoothly on scroll) */}
        <div
          ref={ivoryCardRef}
          className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 py-16 sm:py-24 flex justify-end will-change-transform"
        >
          <div className="w-full sm:w-[50%] md:w-[44%] lg:w-[38%] max-w-[460px] bg-[#fff7ef]/98 backdrop-blur-md rounded-[2.2rem] sm:rounded-[2.6rem] p-8 sm:p-11 lg:p-12 shadow-[0_30px_70px_rgba(0,0,0,0.3)] border border-white/80 flex flex-col justify-between min-h-[440px] sm:min-h-[500px]">
            {/* Title */}
            <h2 className="font-sans text-3xl sm:text-5xl lg:text-[3.25rem] font-normal tracking-tight text-zinc-950 leading-[1.05]">
              Our Vision
            </h2>

            {/* Tagline & Paragraph pushed down with generous breathing room */}
            <div className="mt-auto pt-16 sm:pt-24 lg:pt-32">
              <span className="text-[10px] sm:text-xs tracking-[0.22em] uppercase font-semibold text-[#c07a48] mb-3 sm:mb-4 block">
                CONTENT WITHOUT LIMITS
              </span>

              <p className="text-xs sm:text-[13px] lg:text-sm font-light text-zinc-700 leading-relaxed pb-2 sm:pb-4">
                We believe that every fashion and beauty brand — regardless of size or budget — deserves content that looks like it was shot on a Paris runway. Our platform makes that standard the new baseline, not the luxury exception reserved for heritage houses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HIGH-PERFORMANCE GPU MORPH CANVAS: OUR VISION TO GALLERY CARD #1 */}
      <div
        ref={morphOverlayRef}
        onClick={() => {
          setSelectedGalleryImage("/vision_editorial.jpg");
        }}
        className="fixed top-0 left-0 z-[34] overflow-hidden cursor-pointer select-none"
        style={{
          display: "none",
          width: "100vw",
          height: "100vh",
          transform: "translate3d(0px, 0px, 0px)",
          willChange: "transform, width, height, border-radius, opacity",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <Image
          src="/vision_editorial.jpg"
          alt="Our Vision Runway Morph"
          fill
          priority
          sizes="100vw"
          quality={95}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 5. ATELIER GALLERY LOOKBOOK (Fluid Editorial Grid with Category Filter & Lightbox) */}
      <section
        ref={gallerySectionRef}
        id="gallery-section"
        className={`relative z-[30] w-full py-20 sm:py-28 px-5 sm:px-10 lg:px-16 transition-colors duration-500 border-t ${
          isWhiteMode
            ? "bg-[#faf9f6] text-zinc-900 border-zinc-200/80"
            : "bg-black text-white border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Top Metadata Bar */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-zinc-400 mb-8 border-b border-zinc-200/60 dark:border-white/10 pb-4">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
              Lookbook Archive
            </span>
            <span>The Haute Edit</span>
            <span>2026 Collection</span>
          </div>

          {/* Section Heading */}
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className={`text-4xl sm:text-6xl md:text-7xl font-light tracking-tight ${
                isWhiteMode ? "text-zinc-900" : "text-white"
              }`}
            >
              Atelier Gallery
              <span className="block font-serif italic font-normal text-5xl sm:text-7xl md:text-8xl mt-1 sm:mt-2">
                The Curated Edit
              </span>
            </h2>
            <p className="text-sm sm:text-base font-light text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mt-4 sm:mt-6 leading-relaxed">
              Explore bespoke couture creations, bridal trousseaus, and red-carpet ensembles handcrafted by our master artisans.
            </p>
          </div>

          {/* Responsive Gallery Grid: Authentic Pinterest Masonry Lookbook */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6">
            {(showAllGallery ? GALLERY_ITEMS : GALLERY_ITEMS.slice(0, 8)).map((item, index) => {
              const isFirst = index === 0;

              return (
                <div
                  key={item.id}
                  className="break-inside-avoid mb-4 sm:mb-6 w-full inline-block"
                >
                  <div
                    ref={isFirst ? galleryFirstCardRef : undefined}
                    onClick={() => setSelectedGalleryImage(item.image)}
                    className={`group relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-zinc-900 shadow-md cursor-pointer transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-2xl border border-black/5 dark:border-white/10 ${item.aspect}`}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show More / Show Less Toggle Button */}
          <div className="mt-14 sm:mt-18 text-center">
            <button
              onClick={() => setShowAllGallery(!showAllGallery)}
              className={`inline-flex items-center space-x-2.5 rounded-full px-8 py-3.5 text-xs uppercase tracking-[0.22em] font-medium transition-all duration-300 shadow-md ${
                isWhiteMode
                  ? "bg-zinc-950 text-white hover:bg-zinc-800"
                  : "bg-white text-zinc-950 hover:bg-zinc-200"
              }`}
            >
              <span>{showAllGallery ? "Show Less Looks" : `Show More (${GALLERY_ITEMS.length} Looks)`}</span>
              {showAllGallery ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 6. WHAT WE DELIVER */}
      <section
        className={`relative z-10 w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 transition-colors duration-500 ${
          isWhiteMode ? "bg-[#f5f3ec] text-zinc-900" : "bg-black text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto">

          {/* Section Heading */}
          <div className="mb-12 sm:mb-16">
            <h2
              className={`text-4xl sm:text-6xl md:text-7xl font-light tracking-tight ${
                isWhiteMode ? "text-zinc-950" : "text-white"
              }`}
            >
              What We Deliver
            </h2>
          </div>

          {/* Main 2-Column Grid: Image Left, Deliverables Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column: Portrait Editorial Image */}
            <div className="lg:col-span-5">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-black/5 dark:border-white/10">
                <Image
                  src="/gallery_purple.jpg"
                  alt="What We Deliver - Couture Craftsmanship"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
            </div>

            {/* Right Column: 4 Editorial Deliverables */}
            <div className="lg:col-span-7 flex flex-col space-y-7 sm:space-y-9">
              {/* Item 1 */}
              <div className="flex items-start space-x-4 sm:space-x-5">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-zinc-800 dark:bg-white mt-2.5 shrink-0" />
                <p className={`text-sm sm:text-base leading-relaxed font-light ${isWhiteMode ? "text-zinc-700" : "text-zinc-300"}`}>
                  <strong className={`font-semibold ${isWhiteMode ? "text-zinc-950" : "text-white"}`}>
                    Bespoke Artisanal Tailoring
                  </strong>{" "}
                  — Every garment is meticulously designed and sculpted to your exact measurements, incorporating hand-guided zardozi embroidery, bespoke draping, and personalized fit consultations for a silhouette made exclusively for you.
                </p>
              </div>

              {/* Item 2 */}
              <div className="flex items-start space-x-4 sm:space-x-5">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-zinc-800 dark:bg-white mt-2.5 shrink-0" />
                <p className={`text-sm sm:text-base leading-relaxed font-light ${isWhiteMode ? "text-zinc-700" : "text-zinc-300"}`}>
                  <strong className={`font-semibold ${isWhiteMode ? "text-zinc-950" : "text-white"}`}>
                    Heritage Craftsmanship Meets Modern Form
                  </strong>{" "}
                  — Revitalizing centuries-old handloom weaves and regal heritage techniques, re-engineered for contemporary global wardrobes and modern red-carpet occasions without compromising authenticity.
                </p>
              </div>

              {/* Item 3 */}
              <div className="flex items-start space-x-4 sm:space-x-5">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-zinc-800 dark:bg-white mt-2.5 shrink-0" />
                <p className={`text-sm sm:text-base leading-relaxed font-light ${isWhiteMode ? "text-zinc-700" : "text-zinc-300"}`}>
                  <strong className={`font-semibold ${isWhiteMode ? "text-zinc-950" : "text-white"}`}>
                    Bridal & Occasion Trousseau Concierge
                  </strong>{" "}
                  — Full bridal concierge styling from statement reception lehengas and pure silk sarees to coordinated groom&apos;s sherwanis and festive party wear collections.
                </p>
              </div>

              {/* Item 4 */}
              <div className="flex items-start space-x-4 sm:space-x-5">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-zinc-800 dark:bg-white mt-2.5 shrink-0" />
                <p className={`text-sm sm:text-base leading-relaxed font-light ${isWhiteMode ? "text-zinc-700" : "text-zinc-300"}`}>
                  <strong className={`font-semibold ${isWhiteMode ? "text-zinc-950" : "text-white"}`}>
                    Global White-Glove Delivery & Consultations
                  </strong>{" "}
                  — Seamless express insured delivery worldwide, paired with private video styling appointments, custom fabric swatches, and lifetime aftercare support.
                </p>
              </div>

              {/* Section CTA */}
              <div className="pt-4">
                <Link
                  href="/about"
                  className={`inline-flex items-center space-x-3 text-xs uppercase tracking-[0.25em] font-medium border-b pb-1.5 transition-colors ${
                    isWhiteMode
                      ? "border-zinc-900 text-zinc-950 hover:text-zinc-600 hover:border-zinc-400"
                      : "border-white text-white hover:text-white/70 hover:border-white/50"
                  }`}
                >
                  <span>Discover Our Atelier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FULL-SCREEN EDITORIAL IMAGE PINNED SCROLL WITH TEXT ENTRANCE */}
      <div
        ref={editorialPinnedRef}
        className="relative h-[230vh] sm:h-[260vh] z-20"
      >
        <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
          {/* Static Full-Screen Editorial Background Image */}
          <Image
            src="/newimages/IMG_1058.webp"
            alt="De flores Editorial Couture"
            fill
            priority
            sizes="100vw"
            quality={95}
            className="object-cover object-center"
          />

          {/* Dynamic Contrast Scrim (Subtle at first, deepens as text enters) */}
          <div
            ref={editorialScrimRef}
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/35 pointer-events-none transition-opacity duration-150"
            style={{ opacity: 0.15 }}
          />

          {/* Centered Editorial Text Overlay that glides in on scroll */}
          <div
            ref={editorialTextRef}
            className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 text-center text-white will-change-transform"
            style={{ opacity: 0, transform: "translate3d(0, 50px, 0)" }}
          >
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 mb-5 sm:mb-7 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.28em] font-medium text-white/90">
                Our Atelier Promise
              </span>
            </div>

            {/* Main Statement */}
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.08] text-white drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
              Best for your fit,
              <span className="block italic font-normal mt-2 sm:mt-3 text-amber-200/95 font-serif">
                best from us always.
              </span>
            </h2>

            {/* Subtext */}
            <p className="text-xs sm:text-base md:text-lg font-light text-white/85 max-w-xl mx-auto mt-6 sm:mt-8 leading-relaxed tracking-wide drop-shadow-md">
              Every silhouette sculpted with intention, every thread woven with generational mastery. Bespoke couture tailored for your grandest moments.
            </p>
          </div>
        </div>
      </div>

      {/* 8. THE TEAM BEHIND SECTION (Glides smoothly above the full-screen image) */}
      <section
        className={`relative z-30 w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 rounded-none shadow-[0_-30px_70px_rgba(0,0,0,0.35)] border-t border-zinc-200/80 dark:border-white/10 transition-colors duration-500 ${
          isWhiteMode ? "bg-[#faf9f6] text-zinc-900" : "bg-zinc-950 text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Top Metadata Bar */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-zinc-400 mb-8 border-b border-zinc-200/60 dark:border-white/10 pb-4">
            <span>Leadership & Culture</span>
            <span>De flores Atelier</span>
            <span>03 / 2026</span>
          </div>

          {/* Heading matching reference */}
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className={`text-4xl sm:text-6xl md:text-7xl font-light tracking-tight ${
                isWhiteMode ? "text-zinc-900" : "text-white"
              }`}
            >
              The Team Behind
              <span className="block font-serif italic font-normal mt-1 sm:mt-2 text-5xl sm:text-7xl md:text-8xl">
                De flores
              </span>
            </h2>
            <p className="text-sm sm:text-base font-light text-zinc-600 dark:text-zinc-400 text-center max-w-xl mx-auto mt-4 sm:mt-6 leading-relaxed">
              Design visionaries, master karigars, and bespoke stylists dedicated to crafting royalty, class, and bespoke couture.
            </p>
          </div>

          {/* 3 Team & Atelier Pillar Boxes (No Images) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {TEAM_PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                className="group relative flex flex-col justify-between p-8 sm:p-10 rounded-[1.8rem] sm:rounded-[2.2rem] bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-white/10 shadow-lg shadow-black/5 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 min-h-[380px]"
              >
                {/* Top Info */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tracking-widest text-[#c07a48] dark:text-[#e09865] bg-[#c07a48]/10 px-3 py-1 rounded-full font-semibold">
                      {pillar.number}
                    </span>
                    <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-zinc-400">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-zinc-950 dark:text-white mt-6 tracking-tight group-hover:text-[#c07a48] dark:group-hover:text-[#e09865] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
                    {pillar.role}
                  </p>

                  <div className="w-12 h-[1px] bg-zinc-200 dark:bg-white/15 my-6 group-hover:w-20 group-hover:bg-[#c07a48] transition-all duration-500" />

                  <p className="text-xs sm:text-sm font-light text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                {/* Bottom Link Action */}
                <div className="mt-8 pt-5 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between">
                  <Link
                    href={pillar.href}
                    className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-medium text-zinc-900 dark:text-white hover:text-[#c07a48] dark:hover:text-[#e09865] transition-colors"
                  >
                    <span>{pillar.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <span className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/10 flex items-center justify-center text-zinc-600 dark:text-white group-hover:bg-[#c07a48] group-hover:text-white transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. GALLERY IMAGE LIGHTBOX MODAL */}
      {selectedGalleryImage && (
        <div
          onClick={() => setSelectedGalleryImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8 animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black"
          >
            <button
              onClick={() => setSelectedGalleryImage(null)}
              className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-all"
              aria-label="Close image"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full h-[80vh]">
              <Image
                src={selectedGalleryImage}
                alt="Enlarged Atelier Look"
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* FLOATING BOTTOM-LEFT "WATCH FILM" CIRCLE (Docked when scrolled) */}
      <div
        className={`fixed bottom-6 left-6 sm:bottom-8 sm:left-8 z-40 transition-all duration-500 ease-out ${
          isScrolled
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-8 scale-75 pointer-events-none"
        }`}
      >
        <button
          onClick={() => setIsVideoModalOpen(true)}
          className="group relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-zinc-950/90 hover:bg-black text-white backdrop-blur-xl border border-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.55)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40"
          title="Watch Campaign Film"
          aria-label="Watch Campaign Film"
        >
          {/* Subtle Ambient Pulse Ring */}
          <span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-30 pointer-events-none" />

          {/* Play Icon */}
          <Play className="w-5 h-5 fill-white text-white ml-0.5 group-hover:scale-110 transition-transform" />

          {/* Hover Pill Label that expands gracefully to the right */}
          <span className="absolute left-full ml-3 px-3.5 py-1.5 rounded-full bg-zinc-950/95 backdrop-blur-md text-white text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium border border-white/15 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl -translate-x-2 group-hover:translate-x-0">
            Watch Film
          </span>
        </button>
      </div>

      {/* 10. VIDEO LIGHTBOX MODAL (Plays Google Drive, YouTube, or Local Video from /data/films.json) */}
      {isVideoModalOpen && (() => {
        const activeFilm = films[selectedFilmIndex] || films[0] || DEFAULT_FILMS[0];
        const videoSource = parseVideoSource(activeFilm);

        return (
          <div
            onClick={() => setIsVideoModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-3 sm:p-6 animate-fadeIn cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[420px] sm:max-w-[450px] max-h-[94vh] bg-zinc-950 rounded-[1.8rem] sm:rounded-[2.2rem] overflow-hidden border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col cursor-default my-auto"
            >
              {/* Header Bar */}
              <div className="px-4 sm:px-6 py-3.5 bg-zinc-900/95 border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold text-white/70 truncate">
                      Vertical Film · 9:16
                    </span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-normal text-white tracking-wide truncate mt-0.5">
                    {activeFilm.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {activeFilm.googleDriveUrl && (
                    <a
                      href={activeFilm.googleDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all flex items-center gap-1.5 text-[10px] tracking-wider uppercase px-2.5 sm:px-3"
                      title="Open in Google Drive"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Drive</span>
                    </a>
                  )}
                  {videoSource.type === "video" && (
                    <button
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.muted = !videoRef.current.muted;
                          setIsMuted(videoRef.current.muted);
                        }
                      }}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all"
                      aria-label="Toggle mute"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  )}
                  <button
                    onClick={() => setIsVideoModalOpen(false)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all"
                    aria-label="Close video"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Video Player Canvas - 9:16 Vertical Aspect Ratio with Remounting Key */}
              <div className="relative w-full aspect-[9/16] max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                {videoSource.type === "iframe" ? (
                  <iframe
                    key={videoSource.src}
                    src={videoSource.src}
                    title={activeFilm.title}
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    key={videoSource.src}
                    ref={videoRef}
                    src={videoSource.src}
                    autoPlay
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Multiple Film Selector Tabs */}
              {films.length > 1 && (
                <div className="px-4 sm:px-6 py-3.5 bg-zinc-900/95 border-t border-white/10 flex items-center justify-center gap-3 shrink-0">
                  <span className="text-[10px] uppercase tracking-widest text-white/50 shrink-0">
                    Switch Film:
                  </span>
                  {films.map((f, idx) => {
                    const isSelected = idx === selectedFilmIndex;
                    return (
                      <button
                        key={f.id || idx}
                        onClick={() => setSelectedFilmIndex(idx)}
                        className={`text-xs px-4 py-1.5 rounded-full transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? "bg-white text-black font-semibold shadow-lg scale-105"
                            : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isSelected ? "bg-emerald-500 animate-pulse" : "bg-white/40"
                          }`}
                        />
                        <span>Film {String(idx + 1).padStart(2, "0")}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* 5. SEARCH MODAL */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-md px-6">
          <div className="relative w-full max-w-xl bg-white text-zinc-900 border border-zinc-200 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <div className="flex items-center space-x-3 w-full">
                <Search className="w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search collections, pieces, editorial..."
                  autoFocus
                  className="bg-transparent text-zinc-900 placeholder-zinc-400 focus:outline-none w-full text-base font-light"
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-zinc-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="pt-4 flex flex-wrap gap-2 text-xs uppercase tracking-wider text-zinc-500">
              <span>Trending:</span>
              <Link href="/collections?category=lehenga" className="hover:text-black underline">
                Lehenga
              </Link>
              <span>•</span>
              <Link href="/collections?category=gown" className="hover:text-black underline">
                Gown
              </Link>
              <span>•</span>
              <Link href="/collections?category=saree" className="hover:text-black underline">
                Saree
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 6. MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div
          className={`fixed inset-0 z-50 flex flex-col justify-between p-8 md:hidden animate-fadeIn ${isWhiteMode ? "bg-white text-zinc-900" : "bg-black text-white"
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-serif tracking-[0.25em] text-2xl uppercase">De flores</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col space-y-6 text-xl uppercase tracking-[0.2em] font-light">
            <Link
              href="/collections"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:opacity-60 transition-opacity"
            >
              Collections
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:opacity-60 transition-opacity"
            >
              About
            </Link>
            <Link
              href="/journal"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:opacity-60 transition-opacity"
            >
              Journal
            </Link>
            <Link
              href="/sustainability"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:opacity-60 transition-opacity"
            >
              Sustainability
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:opacity-60 transition-opacity"
            >
              Contact
            </Link>
          </nav>

          <div className="flex flex-col space-y-4 pt-6 border-t border-zinc-200">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-center py-3 border rounded-full text-xs uppercase tracking-[0.2em] ${isWhiteMode ? "border-zinc-300" : "border-white/30"
                }`}
            >
              Sign In
            </Link>
            <Link
              href="/collections"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-center py-3 rounded-full text-xs uppercase tracking-[0.2em] font-medium ${isWhiteMode ? "bg-zinc-950 text-white" : "bg-white text-black"
                }`}
            >
              Shop Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
