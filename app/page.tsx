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
  ExternalLink,
} from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const HERO_SLIDES = [
  {
    id: 1,
    image: "/hero/herosection1.png",
    tagline: "Haute Couture Atelier · Est. 2026",
    titleLine1: "Every Silhouette.",
    titleLine2: "EVERY MOMENT.",
    year: "2026",
    description:
      "Bespoke bridal couture, sculpted silhouettes, and generational handlooms tailored to your grandest fantasies.",
  },
  {
    id: 2,
    image: "/hero/herosection2.png",
    tagline: "Royal Heritage Weaves",
    titleLine1: "Timeless Elegance.",
    titleLine2: "ROYAL DISTINCTION.",
    year: "2026",
    description:
      "Generations of artisanal zardozi embroidery and Kanchipuram mulberry silks sculpted into contemporary masterpieces.",
  },
  {
    id: 3,
    image: "/hero/herosection3.png",
    tagline: "Bespoke Red Carpet & Pret",
    titleLine1: "Chastity & Loveliness.",
    titleLine2: "EXQUISITE FORM.",
    year: "2026",
    description:
      "Translating 'flowers' in Spanish — an ode to botanical grace, ethereal drapes, and bespoke contour draping.",
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
    role: "Couture Vision & Philosophy",
    description:
      "IT professional turned fashion designer leading De flores. Renowned for blending unique elegance, royalty, and class into bespoke bridal outfits.",
    image: "/crop_green.png",
    linkText: "Read Founder Story",
    href: "/founder",
  },
  {
    number: "02",
    tag: "ATELIER CRAFTSMEN",
    title: "Master Karigars",
    role: "Zardozi & Heritage Guild",
    description:
      "Generations of artisanal mastery crafting antique zardozi, hand-done aari, dabka work, and intricate gold thread embroideries on pure silks.",
    image: "/gallery_purple.jpg",
    linkText: "Explore Creations",
    href: "/explore",
  },
  {
    number: "03",
    tag: "BESPOKE CONSULTATION",
    title: "Bridal Stylists",
    role: "Personal Trousseau Planning",
    description:
      "Dedicated bespoke stylists guiding each bride through custom color palettes, silhouette sculpting, and tailored wedding ensembles.",
    image: "/new_images2/IMG_1076.webp",
    linkText: "Book Consultation",
    href: "/contact",
  },
  {
    number: "04",
    tag: "EDITORIAL ARCHIVES",
    title: "Runway & Occasion",
    role: "Contemporary Haute Couture",
    description:
      "Exploring novel style statements across statement lehengas, western gowns, and red-carpet showstoppers designed without compromise.",
    image: "/newimages/IMG_1062.webp",
    linkText: "View Lookbook",
    href: "/gallery",
  },
];

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Atelier Runway Vision",
    category: "Editorial Collection",
    tag: "HAUTE EDITORIAL",
    fabric: "Raw Silk Habotai · Antique Metallic Wirework",
    number: "01",
    image: "/vision_editorial.jpg",
    aspect: "aspect-video",
  },
  {
    id: 2,
    title: "Lakeside Contemporary Gowns",
    category: "Western Ensembles",
    tag: "ATELIER SIGNATURE",
    fabric: "French Tulle & Sculpted Mikado Silk",
    number: "02",
    image: "/newimages/IMG_1064.webp",
    aspect: "aspect-[3/4.4]",
  },
  {
    id: 3,
    title: "Heritage Bridal Lehenga",
    category: "Bridal Couture",
    tag: "HAUTE COUTURE",
    fabric: "Pure Mulberry Silk Handloom · Antique Zardozi Guild",
    number: "03",
    image: "/hero/herosection1.png",
    aspect: "aspect-[4/3]",
  },
  {
    id: 4,
    title: "Temple Courtyard Silk Ensemble",
    category: "Pret Apparel",
    tag: "TIMELESS SILKS",
    fabric: "Kanchipuram Brocade & Pure Zari Weave",
    number: "04",
    image: "/hero/herosection2.png",
    aspect: "aspect-[4/3]",
  },
  {
    id: 5,
    title: "Sunset Chiffon & Tulle Gown",
    category: "Evening Gown",
    tag: "RED CARPET",
    fabric: "Mulberry Silk Chiffon · Hand-cut Resham Petals",
    number: "05",
    image: "/hero/herosection3.png",
    aspect: "aspect-video",
  },
  {
    id: 6,
    title: "Zardozi Embroidered Royal Drape",
    category: "Haute Couture",
    tag: "ROYAL EMBROIDERY",
    fabric: "Varanasi Tissue Silk · Dabka & Mukaish Guild",
    number: "06",
    image: "/newimages/IMG_1058.webp",
    aspect: "aspect-[3/4.4]",
  },
  {
    id: 7,
    title: "Mirror Reflection Fitting",
    category: "Atelier Backstage",
    tag: "ATELIER BESPOKE",
    fabric: "Hand-pleated Georgette & Seed Pearl Borders",
    number: "07",
    image: "/newimages/IMG_1060.webp",
    aspect: "aspect-[3/4]",
  },
  {
    id: 8,
    title: "Courtyard Swing Duo",
    category: "Festive Occasion",
    tag: "FESTIVE COUTURE",
    fabric: "Brocade Tanchoi Silk · Handloom Weave",
    number: "08",
    image: "/newimages/IMG_1062.webp",
    aspect: "aspect-[3/4.4]",
  },
  {
    id: 9,
    title: "Sacred Ceremonial Silk Saree",
    category: "Heritage Weaves",
    tag: "PURE SILK HEIRLOOM",
    fabric: "Pure Kanchipuram Silk · Korvai Temple Borders",
    number: "09",
    image: "/new_images2/IMG_1076.webp",
    aspect: "aspect-[3/4.4]",
  },
  {
    id: 10,
    title: "Peacock Jewel Handcrafted Details",
    category: "Bespoke Jewelry & Blouse",
    tag: "ARTISANAL JEWEL",
    fabric: "Antique Gold Threadwork · Glass Kundan Detailing",
    number: "10",
    image: "/new_images2/IMG_1077.webp",
    aspect: "aspect-[3/4]",
  },
  {
    id: 11,
    title: "Celebration Sherwani & Anarkali",
    category: "Mens & Bridal",
    tag: "ROYAL COUTURE",
    fabric: "Raw Matka Silk & Zardozi Cartouches",
    number: "11",
    image: "/new_images2/IMG_1078.webp",
    aspect: "aspect-[3/4.4]",
  },
  {
    id: 12,
    title: "Lakeside Couple Embrace",
    category: "Occasion Wear",
    tag: "ROMANCE EDIT",
    fabric: "Chanderi Tissue & Organza Drapes",
    number: "12",
    image: "/new_images2/IMG_1080.webp",
    aspect: "aspect-[3/4]",
  },
  {
    id: 13,
    title: "Radiant Sheer Veil Drape",
    category: "Bridal Veil",
    tag: "BRIDAL VEIL",
    fabric: "Fine French Silk Net · Scalloped Gotapatti",
    number: "13",
    image: "/new_images2/IMG_1081.webp",
    aspect: "aspect-[3/4.4]",
  },
  {
    id: 14,
    title: "Embellished Peach Organza Saree",
    category: "Pret Collection",
    tag: "ORGANZA DRAPES",
    fabric: "Hand-painted Organza & Cutdana Borders",
    number: "14",
    image: "/new_images2/IMG_1082.webp",
    aspect: "aspect-[3/4.4]",
  },
  {
    id: 15,
    title: "Royal Violet Scalloped Blouse",
    category: "Handcrafted Zardozi",
    tag: "ZARDOZI ATELIER",
    fabric: "Deep Violet Velvet & Antique Gold Zardozi",
    number: "15",
    image: "/gallery_purple.jpg",
    aspect: "aspect-[3/4]",
  },
  {
    id: 16,
    title: "Pastel Mirror-Work Lehenga",
    category: "Party Wear",
    tag: "COCKTAIL EDIT",
    fabric: "Georgette Silk with Convex Glass Mirror Work",
    number: "16",
    image: "/crop_green.png",
    aspect: "aspect-[3/4]",
  },
];

const JOURNAL_ARTICLES = [
  {
    id: 1,
    category: "CRAFTSMANSHIP",
    readTime: "6 MIN READ",
    title: "The Art of Zardozi: Reviving Imperial Metallic Wire Embroidery",
    excerpt:
      "Exploring the intricate patience of Old Delhi karigars as gold and silver dabka wires are hand-sewn into pure organza silhouettes.",
    image: "/newimages/IMG_1058.webp",
    date: "OCTOBER 2026",
    href: "/blog",
  },
  {
    id: 2,
    category: "BRIDAL ATELIER",
    readTime: "4 MIN READ",
    title: "Curating Your Bridal Silhouette: The Architecture of Royal Drapes",
    excerpt:
      "How our bespoke contour draping and personalized shade consultations sculpt an unmistakable presence for reception evenings.",
    image: "/hero/herosection1.png",
    date: "SEPTEMBER 2026",
    href: "/blog",
  },
  {
    id: 3,
    category: "MAISON DE FLORES",
    readTime: "5 MIN READ",
    title: "Behind the Seams: The 2026 Runway Edit at Cochin International Atelier",
    excerpt:
      "A glimpse inside our bespoke showroom near Cochin Airport, where heritage handlooms meet contemporary western ensembles.",
    image: "/vision_editorial.jpg",
    date: "AUGUST 2026",
    href: "/blog",
  },
];

const INSTAGRAM_SHOTS = [
  { id: 1, image: "/hero/herosection1.png", tag: "@deflores.couture" },
  { id: 2, image: "/new_images2/IMG_1077.webp", tag: "@deflores.couture" },
  { id: 3, image: "/newimages/IMG_1064.webp", tag: "@deflores.couture" },
  { id: 4, image: "/new_images2/IMG_1078.webp", tag: "@deflores.couture" },
  { id: 5, image: "/newimages/IMG_1062.webp", tag: "@deflores.couture" },
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
  const editorialImageRef = useRef<HTMLDivElement>(null);
  const cachedCard = useRef<{
    docX: number;
    docY: number;
    width: number;
    height: number;
    radius: number;
  } | null>(null);
  const rafId = useRef<number | null>(null);
  const teamScrollRef = useRef<HTMLDivElement>(null);

  const scrollTeam = (direction: "left" | "right") => {
    if (teamScrollRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      teamScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

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
            ivoryCardRef.current.style.transform = "translate3d(0, 0, 0) scale(1)";
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

      // 1. Continuous Image Morph: cubic ease for luxurious physical momentum
      const morphT = Math.min(Math.max((p - 0.04) / 0.96, 0), 1);
      const e = morphT < 0.5 ? 4 * morphT * morphT * morphT : 1 - Math.pow(-2 * morphT + 2, 3) / 2;

      // 2. Ivory Vision Card: fades with the image and glides in the direction of the image (down and leftwards toward Card 1)
      if (ivoryCardRef.current) {
        // Fades smoothly with the image across the entire transition
        const cardOpacity = Math.max(0, 1 - Math.pow(e, 0.9));
        // Glides in the trajectory of the morphing image (towards the left and downwards)
        const cardTranslateX = -e * Math.min(viewportW * 0.32, 170);
        const cardTranslateY = e * Math.min(viewportH * 0.22, 130);
        const cardScale = 1 - e * 0.12;

        ivoryCardRef.current.style.opacity = cardOpacity.toFixed(3);
        ivoryCardRef.current.style.transform = `translate3d(${cardTranslateX.toFixed(1)}px, ${cardTranslateY.toFixed(1)}px, 0) scale(${cardScale.toFixed(3)})`;
        ivoryCardRef.current.style.pointerEvents = cardOpacity < 0.05 ? "none" : "auto";
      }

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
    };

    const updateEditorialParallax = () => {
      if (!editorialPinnedRef.current || !editorialImageRef.current) return;
      const rect = editorialPinnedRef.current.getBoundingClientRect();
      const viewportH = window.innerHeight || 800;

      // Skip calculation if section is far outside the viewport
      if (rect.bottom < -100 || rect.top > viewportH + 100) return;

      // Progress of scroll across the section
      const totalRange = rect.height + viewportH;
      const p = Math.min(Math.max((viewportH - rect.top) / totalRange, 0), 1);

      // Smooth parallax translation on the background image (-70px to +70px)
      const imageOffset = (p - 0.5) * 140;
      editorialImageRef.current.style.transform = `translate3d(0, ${imageOffset.toFixed(1)}px, 0) scale(1.08)`;
    };

    // Initial check on mount
    updateEditorialParallax();

    // Measure after mount and DOM paints
    const timer = setTimeout(() => {
      measureCard();
      updateMorph();
      updateEditorialParallax();
    }, 120);

    const onScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = window.requestAnimationFrame(() => {
        rafId.current = null;
        updateMorph();
        updateEditorialParallax();
      });
    };

    const onResize = () => {
      measureCard();
      updateMorph();
      updateEditorialParallax();
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

  // Synchronize documentElement dark mode class with isWhiteMode state
  useEffect(() => {
    if (isWhiteMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [isWhiteMode]);

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
            ? isWhiteMode
              ? "bg-white/95 backdrop-blur-md border-b border-zinc-200/80 text-zinc-900 py-3 sm:py-3.5 shadow-sm"
              : "bg-zinc-950/90 backdrop-blur-md border-b border-white/10 text-white py-3 sm:py-3.5 shadow-sm"
            : "bg-transparent border-b border-transparent text-white py-4 sm:py-5"
          }`}
      >
        {/* Brand Emblem */}
        <Link
          href="/"
          className="flex items-center group transition-transform duration-300 hover:scale-105"
          aria-label="De Flores Atelier"
        >
          <div
            className={`relative aspect-[5/6] transition-all duration-300 ${
              isScrolled
                ? "h-[50px] sm:h-[58px]"
                : "h-[62px] sm:h-[76px] md:h-[90px]"
            }`}
          >
            <Image
              src="/logo.svg"
              alt="De flores"
              fill
              priority
              className={`object-contain transition-all duration-300 ${
                isScrolled
                  ? isWhiteMode
                    ? "brightness-0"
                    : "brightness-0 invert drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]"
                  : "brightness-0 invert drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
              }`}
            />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav
          className={`hidden md:flex items-center space-x-9 text-xs tracking-[0.25em] uppercase font-medium transition-colors ${isScrolled ? "text-zinc-700" : "text-white/90"
            }`}
        >
          <Link
            href="#lookbook"
            className={isScrolled ? "hover:text-[#2B0A0E] transition-colors" : "hover:text-[#C5A059] transition-colors"}
          >
            Lookbook
          </Link>
          <Link
            href="#craft"
            className={isScrolled ? "hover:text-[#2B0A0E] transition-colors" : "hover:text-[#C5A059] transition-colors"}
          >
            The Craft
          </Link>
          <Link
            href="/founder"
            className={isScrolled ? "hover:text-[#2B0A0E] transition-colors" : "hover:text-[#C5A059] transition-colors"}
          >
            About
          </Link>
          <Link
            href="#journal"
            className={isScrolled ? "hover:text-[#2B0A0E] transition-colors" : "hover:text-[#C5A059] transition-colors"}
          >
            Journal
          </Link>
          <Link
            href="/contact"
            className={isScrolled ? "hover:text-[#2B0A0E] transition-colors" : "hover:text-[#C5A059] transition-colors"}
          >
            Contact
          </Link>
        </nav>

        {/* Right Nav Actions */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          {/* Search (Disabled) */}
          <button
            type="button"
            disabled
            aria-disabled="true"
            aria-label="Search (Disabled)"
            className={`p-2 opacity-40 cursor-not-allowed pointer-events-none transition-opacity ${
              isScrolled ? "text-zinc-500" : "text-white/50"
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

          {/* Book Consultation (Luxury Pill Button) */}
          <Link
            href="/contact"
            data-cursor="BOOK"
            className={`rounded-full px-6 sm:px-7 py-2.5 text-[11px] sm:text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-300 shadow-sm ${isScrolled
                ? "bg-[#2B0A0E] text-[#C5A059] border border-[#C5A059]/40 hover:bg-black hover:text-white"
                : "border border-[#C5A059] bg-[#2B0A0E]/70 text-[#FDFBF7] hover:bg-[#C5A059] hover:text-[#2B0A0E] backdrop-blur-sm"
              }`}
          >
            Book Consultation
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
          {/* Film Grain Texture Overlay */}
          <div className="film-grain absolute inset-0 z-[15] pointer-events-none opacity-40 mix-blend-overlay" />

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
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/20 to-black/40 pointer-events-none" />

          {/* Hero Content Overlay */}
          <div className="relative z-20 w-full h-full pt-24 sm:pt-28 px-5 sm:px-12 md:px-16 pb-6 sm:pb-8 flex flex-col justify-between text-white">
            {/* Top Row: Tagline & Carousel Switcher */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm tracking-[0.32em] font-semibold uppercase text-[#C5A059] drop-shadow">
                {slide.tagline}
              </span>

              {/* Quick Slide Switcher (01 / 02 / 03) */}
              <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C5A059]/40">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                  className="p-1 hover:text-[#C5A059] transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {HERO_SLIDES.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlide(i)}
                    className={`text-xs px-2.5 py-0.5 rounded-full transition-all ${i === currentSlide
                        ? "bg-[#C5A059] text-[#2B0A0E] font-bold shadow-sm"
                        : "text-white/70 hover:text-white"
                      }`}
                  >
                    0{s.id}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                  className="p-1 hover:text-[#C5A059] transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Middle Row: Left Headline & Right Paragraph (Hidden on Mobile view) */}
            <div className="hidden sm:grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto py-2">
              {/* Left Headline: High-Contrast Editorial Typography */}
              <div className="lg:col-span-8 space-y-1 sm:space-y-2">
                <h1 className="font-serif italic font-bold text-5xl sm:text-6xl md:text-7xl lg:text-[6.2rem] xl:text-[7.2rem] leading-[1.02] tracking-tight text-[#FDFBF7] drop-shadow-lg">
                  <span className="block">{slide.titleLine1}</span>
                  <span className="block font-sans not-italic font-black tracking-wider text-3xl sm:text-5xl md:text-6xl lg:text-[5.2rem] xl:text-[6.2rem] text-white/95 mt-1">
                    {slide.titleLine2}
                  </span>
                </h1>
              </div>

              {/* Right Paragraph */}
              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <p className="text-sm sm:text-base font-light text-[#FDFBF7]/90 leading-relaxed max-w-sm drop-shadow-md border-l-2 border-[#C5A059]/60 pl-4">
                  {slide.description}
                </p>
              </div>
            </div>

            {/* Bottom Area: 2 Centered CTAs */}
            <div className="mt-auto pb-4 sm:pb-6 flex justify-center">
              <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 w-full max-w-lg mx-auto">
                <Link
                  href="/explore"
                  data-cursor="COLLECTION"
                  className="group relative flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 sm:space-x-3 rounded-full bg-[#FDFBF7] text-[#111111] hover:bg-[#C5A059] hover:text-[#2B0A0E] border border-white px-6 sm:px-9 py-3 sm:py-3.5 text-[10px] sm:text-xs uppercase tracking-[0.22em] font-bold transition-all duration-300 shadow-2xl hover:scale-[1.02] whitespace-nowrap overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  data-cursor="FILM"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 sm:space-x-3 rounded-full backdrop-blur-md bg-black/50 border border-[#C5A059]/80 text-[#FDFBF7] hover:bg-[#2B0A0E]/80 hover:border-[#C5A059] px-6 sm:px-9 py-3 sm:py-3.5 text-[10px] sm:text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-300 shadow-2xl hover:scale-[1.02] whitespace-nowrap"
                >
                  <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current text-[#C5A059]" />
                  <span>Watch Film</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 3. THE SIGNATURE COLLECTIONS (Glides smoothly on top of Hero) */}
      <section
        id="collections"
        className={`relative z-10 w-full py-16 sm:py-28 px-5 sm:px-10 lg:px-16 transition-colors duration-500 rounded-none shadow-[0_-25px_60px_rgba(0,0,0,0.35)] border-t border-zinc-200/80 dark:border-white/10 overflow-hidden ${
          isWhiteMode ? "bg-[#faf9f6]" : "bg-zinc-950"
        }`}
      >
        {/* Monogram Pattern Background (Continuous Seamless Repeating Offset Wallpaper) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none select-none z-0 opacity-[0.22] dark:opacity-[0.28]"
          style={{
            backgroundImage: "url('/floral-pattern.svg')",
            backgroundRepeat: "repeat",
            backgroundSize: "140px 120px",
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Title */}
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-[#C5A059] block mb-3">
              Shop by Category
            </span>
            <h2
              className={`text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight ${
                isWhiteMode ? "text-zinc-900" : "text-white"
              }`}
            >
              The Signature
              <span className={`block font-serif italic font-bold text-4xl sm:text-5xl lg:text-6xl mt-1 sm:mt-2 ${
                isWhiteMode ? "text-[#2B0A0E]" : "text-[#C5A059]"
              }`}>
                Collections
              </span>
            </h2>
            <p className="text-sm sm:text-base font-light text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mt-4 sm:mt-5 leading-relaxed">
              Explore handcrafted bridal lehengas, royal wedding gowns, timeless silk sarees, and bespoke celebration wear.
            </p>
          </div>

          {/* Category Cards: 2 columns on mobile; if odd, last card spans full width as a horizontal wide image */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {CATEGORIES.map((cat, index) => {
              const isTotalOdd = CATEGORIES.length % 2 !== 0;
              const isLast = index === CATEGORIES.length - 1;
              const isLastAndOdd = isTotalOdd && isLast;

              return (
                <Link
                  key={cat.id}
                  href={`/collections?category=${cat.id}`}
                  data-cursor="LOOK"
                  className={`group relative block overflow-hidden rounded-[1.8rem] sm:rounded-[2.2rem] bg-zinc-900 shadow-xl border border-black/5 dark:border-white/10 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shrink-0 ${
                    isLastAndOdd
                      ? "w-full max-w-full md:w-[calc(33.333%-1.5rem)] lg:w-[calc(33.333%-1.75rem)] md:max-w-[340px]"
                      : "w-[calc(50%-0.6rem)] md:w-[calc(33.333%-1.5rem)] lg:w-[calc(33.333%-1.75rem)] max-w-[340px]"
                  }`}
                >
                  <div
                    className={`relative w-full overflow-hidden ${
                      isLastAndOdd
                        ? "aspect-[16/9] sm:aspect-[2/1] md:aspect-[3/4.2]"
                        : "aspect-[3/4.2]"
                    }`}
                  >
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes={
                        isLastAndOdd
                          ? "(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 340px"
                          : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 340px"
                      }
                      className={`object-cover transition-transform duration-700 ease-out group-hover:scale-106 ${
                        isLastAndOdd
                          ? "object-[center_60%] md:object-center"
                          : "object-center"
                      }`}
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Top Tag Pill */}
                    <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10">
                      <span className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-bold text-[#FDFBF7] bg-black/50 backdrop-blur-md px-3 py-1 border border-white/20 rounded-full">
                        {cat.tag}
                      </span>
                    </div>

                    {/* Bottom Bar: Category Name & Sleek Gold Arrow */}
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex items-center justify-between z-10">
                      <div>
                        <span className="font-serif text-lg sm:text-xl lg:text-2xl font-bold tracking-wide text-white drop-shadow-md block">
                          {cat.name}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-medium hidden sm:block">
                          View Lookbook
                        </span>
                      </div>

                      <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#C5A059]/20 backdrop-blur-md border border-[#C5A059]/60 flex items-center justify-center text-[#C5A059] shadow-lg shrink-0 group-hover:bg-[#C5A059] group-hover:text-[#2B0A0E] group-hover:scale-110 transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/30 pointer-events-none" />
        </div>

        {/* Floating Ivory Vision Card on the Right (Slender & Elongated, matching reference) */}
        <div
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 py-12 sm:py-20 flex justify-end"
        >
          <div
            ref={ivoryCardRef}
            className="w-[78%] sm:w-[320px] md:w-[300px] lg:w-[285px] max-w-[305px] bg-[#fff7ef]/95 backdrop-blur-md rounded-[2.4rem] sm:rounded-[2.8rem] p-6 sm:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.3)] border border-white/80 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] will-change-transform origin-center"
          >
            {/* Top Heading matching reference */}
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.5rem] font-medium tracking-tight text-zinc-950 leading-[1.08]">
                Our Vision
              </h2>
            </div>

            {/* Bottom Content Area */}
            <div>
              <span className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase font-bold text-[#D96C3A] block mb-3">
                FLOWERS IN SPANISH · BESPOKE ELEGANCE
              </span>

              <p className="text-xs sm:text-[13px] font-light text-zinc-700 leading-relaxed">
                ‘de flores’ stemmed from a young fashion designer’s passion for crafting unique and novel style statements — to create an unmistakable distinction. Translating to <strong className="font-semibold text-zinc-900">‘flowers’ in Spanish</strong>, our atelier symbolises elegance, chastity, and loveliness in every attire we design.
              </p>

              <p className="text-xs sm:text-[13px] font-light text-zinc-700 leading-relaxed mt-3">
                For those who don&apos;t fancy off-the-peg shopping, ‘de flores’ is a perfect choice for any occasion. We tailor-make pret apparel, designer bridal clothing, occasion wear, and western ensembles with uncompromised quality, master embroidery, and trust.
              </p>

              {/* Showroom Footnote */}
              <div className="mt-5 pt-4 border-t border-zinc-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.22em] font-semibold text-zinc-400 block">
                    Bespoke Showroom
                  </span>
                  <span className="font-serif text-xs sm:text-sm text-zinc-900 font-medium italic">
                    Near Cochin Int&apos;l Airport
                  </span>
                </div>

                <Link
                  href="/founder"
                  data-cursor="STORY"
                  className="w-8 h-8 rounded-full bg-[#2B0A0E] text-[#C5A059] flex items-center justify-center hover:bg-[#C5A059] hover:text-[#2B0A0E] transition-colors shadow-md shrink-0"
                  title="Founder Story"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
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
        id="lookbook"
        className={`relative z-[30] w-full py-20 sm:py-28 px-5 sm:px-10 lg:px-16 transition-colors duration-500 border-t ${
          isWhiteMode
            ? "bg-[#faf9f6] text-zinc-900 border-zinc-200/80"
            : "bg-black text-white border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-[#C5A059] block mb-3">
              Our Masterpieces
            </span>
            <h2
              className={`text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight ${
                isWhiteMode ? "text-zinc-900" : "text-white"
              }`}
            >
              Featured
              <span className={`block font-serif italic font-bold text-4xl sm:text-5xl lg:text-6xl mt-1 sm:mt-2 ${
                isWhiteMode ? "text-[#2B0A0E]" : "text-[#C5A059]"
              }`}>
                Designs
              </span>
            </h2>
            <p className="text-sm sm:text-base font-light text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mt-4 sm:mt-5 leading-relaxed">
              Explore our bespoke bridal lehengas, royal wedding gowns, timeless sarees, and red-carpet couture handcrafted by master artisans.
            </p>
          </div>

          {/* Responsive Gallery Grid: Authentic Pinterest Masonry Lookbook with Fabric Overlays */}
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
                    data-cursor="VIEW"
                    className={`group relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-zinc-900 shadow-md cursor-pointer transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-2xl border border-black/5 dark:border-white/10 ${item.aspect}`}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                    />

                    {/* Gradient Overlay for Fabric Spec and Title Reveal on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-5 pointer-events-none">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-[0.22em] font-bold text-[#C5A059] bg-black/60 px-2 py-0.5 border border-[#C5A059]/40">
                          {item.tag}
                        </span>
                        <span className="text-[10px] font-mono text-[#FDFBF7]/80">
                          {item.number}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-serif text-sm sm:text-base font-bold text-white tracking-wide leading-tight drop-shadow-md">
                          {item.title}
                        </h4>
                        {item.fabric && (
                          <p className="text-[10px] sm:text-[11px] font-sans font-light text-[#C5A059] tracking-wider mt-1 drop-shadow">
                            {item.fabric}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show More / Show Less Toggle Button */}
          <div className="mt-14 sm:mt-18 text-center">
            <button
              onClick={() => setShowAllGallery(!showAllGallery)}
              data-cursor="TOGGLE"
              className={`inline-flex items-center space-x-2.5 rounded-full px-9 py-4 text-xs uppercase tracking-[0.25em] font-bold transition-all duration-300 shadow-md ${
                isWhiteMode
                  ? "bg-[#2B0A0E] text-[#C5A059] border border-[#C5A059]/40 hover:bg-black hover:text-white"
                  : "bg-[#FDFBF7] text-[#2B0A0E] hover:bg-[#C5A059] hover:text-[#2B0A0E]"
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

      {/* 6. BEHIND THE SEAMS (The Atelier Discipline) */}
      <section
        id="craft"
        className={`relative z-10 w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 transition-colors duration-500 ${
          isWhiteMode ? "bg-[#f5f3ec] text-zinc-900" : "bg-black text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto">

          {/* Section Heading */}
          <div className="mb-12 sm:mb-16">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-[#C5A059] block mb-3">
              Authentic Handwork & Embroidery
            </span>
            <h2
              className={`text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight ${
                isWhiteMode ? "text-zinc-900" : "text-white"
              }`}
            >
              Behind the
              <span className={`block font-serif italic font-bold text-4xl sm:text-5xl lg:text-6xl mt-1 sm:mt-2 ${
                isWhiteMode ? "text-[#2B0A0E]" : "text-[#C5A059]"
              }`}>
                Craft
              </span>
            </h2>
            <p className="text-sm sm:text-base font-light text-zinc-600 dark:text-zinc-400 max-w-xl mt-4 sm:mt-5 leading-relaxed">
              Generations of master artisans, authentic antique zardozi wirework, and pure handloom silks tailored to perfection.
            </p>
          </div>

          {/* Main 2-Column Grid: Image Left, Storytelling Deliverables Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column: Portrait Editorial Image */}
            <div className="lg:col-span-5">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-black/5 dark:border-white/10">
                <Image
                  src="/gallery_purple.jpg"
                  alt="Behind the Craft - Couture Craftsmanship"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
            </div>

            {/* Right Column: 4 Haute Couture Storytelling Pillars */}
            <div className="lg:col-span-7 flex flex-col space-y-7 sm:space-y-9">
              {/* Pillar 1 */}
              <div className="flex items-start space-x-4 sm:space-x-5">
                <span className="w-2 h-2 rounded-full bg-[#C5A059] mt-2.5 shrink-0" />
                <p className={`text-sm sm:text-base leading-relaxed font-light ${isWhiteMode ? "text-zinc-700" : "text-zinc-300"}`}>
                  <strong className={`font-serif font-bold text-base sm:text-lg block mb-1 ${isWhiteMode ? "text-[#2B0A0E]" : "text-white"}`}>
                    Guild of Master Karigars
                  </strong>
                  Generations of artisanal lineage in Old Delhi and Lucknow specializing in authentic antique *zardozi*, *aari*, *dabka*, and *mukaish* wire hand-embroidery.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="flex items-start space-x-4 sm:space-x-5">
                <span className="w-2 h-2 rounded-full bg-[#C5A059] mt-2.5 shrink-0" />
                <p className={`text-sm sm:text-base leading-relaxed font-light ${isWhiteMode ? "text-zinc-700" : "text-zinc-300"}`}>
                  <strong className={`font-serif font-bold text-base sm:text-lg block mb-1 ${isWhiteMode ? "text-[#2B0A0E]" : "text-white"}`}>
                    Pure Heritage Handloom Weaves
                  </strong>
                  Sourced directly from artisan weaver cooperatives across Varanasi, Kanchipuram, and Chanderi — uncompromised mulberry silks, metallic tissues, and tissue organzas.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="flex items-start space-x-4 sm:space-x-5">
                <span className="w-2 h-2 rounded-full bg-[#C5A059] mt-2.5 shrink-0" />
                <p className={`text-sm sm:text-base leading-relaxed font-light ${isWhiteMode ? "text-zinc-700" : "text-zinc-300"}`}>
                  <strong className={`font-serif font-bold text-base sm:text-lg block mb-1 ${isWhiteMode ? "text-[#2B0A0E]" : "text-white"}`}>
                    Bespoke Shade & Silhouette Sculpting
                  </strong>
                  Every garment is sculpted through private contour draping, personalized color-matching palettes, and hand-cut pattern draftsmanship tailored specifically to your posture.
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="flex items-start space-x-4 sm:space-x-5">
                <span className="w-2 h-2 rounded-full bg-[#C5A059] mt-2.5 shrink-0" />
                <p className={`text-sm sm:text-base leading-relaxed font-light ${isWhiteMode ? "text-zinc-700" : "text-zinc-300"}`}>
                  <strong className={`font-serif font-bold text-base sm:text-lg block mb-1 ${isWhiteMode ? "text-[#2B0A0E]" : "text-white"}`}>
                    Bridal & Trousseau Concierge
                  </strong>
                  Dedicated master designer consultations, custom swatch presentation kits, global private video fittings, and heirloom conservation guidance for your grandest moments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 & 8: FULL-SCREEN EDITORIAL IMAGE WITH PARALLAX & THE TEAM SECTION ROLLING ABOVE */}
      <div id="editorial-archive" ref={editorialPinnedRef} className="relative w-full">
        {/* 7. Full-Screen Editorial Background Canvas with Parallax */}
        <div className="relative w-full h-[135vh]">
          <div className="sticky top-0 w-full h-screen z-10 overflow-hidden flex items-center justify-center">
            {/* Parallax Image Canvas */}
            <div
              ref={editorialImageRef}
              className="absolute -top-[10%] -bottom-[10%] -left-[5%] -right-[5%] w-[110%] h-[120%] will-change-transform"
            >
              <Image
                src="/newimages/IMG_1058.webp"
                alt="De flores Editorial Couture"
                fill
                priority
                sizes="100vw"
                quality={95}
                className="object-cover object-center"
              />
            </div>

            {/* Subtle Depth Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/20 pointer-events-none z-[2]" />

            {/* Prominently Viewable Explore Collection Button */}
            <div className="absolute bottom-[20vh] sm:bottom-[23vh] md:bottom-[25vh] inset-x-0 z-20 flex flex-col items-center justify-center px-4 pointer-events-auto">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-semibold text-[#FDFBF7]/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-3 text-center">
                The 2026 Bridal & Occasion Collection
              </span>
              <Link
                href="/explore"
                data-cursor="EXPLORE"
                className="group relative inline-flex items-center gap-3.5 sm:gap-4 px-8 sm:px-10 py-4 sm:py-4.5 rounded-full bg-[#2B0A0E] hover:bg-[#3D0E14] text-[#FDFBF7] border border-[#C5A059] shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(197,160,89,0.35)] overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95"
              >
                {/* Shimmer light sweep - strictly contained inside overflow-hidden */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                {/* Continuous glowing radar beacon */}
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C5A059]" />
                </span>

                <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#FDFBF7] group-hover:text-[#C5A059] transition-colors whitespace-nowrap">
                  Explore Collection
                </span>

                <span className="w-7 h-7 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-[#2B0A0E] group-hover:translate-x-1 transition-all duration-300">
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* 8. THE TEAM BEHIND SECTION (Side-by-side scrollable grey image boxes) */}
        <section
          className={`relative z-20 w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 rounded-none border-t border-zinc-200/80 dark:border-white/10 transition-colors duration-500 ${
            isWhiteMode ? "bg-[#faf9f6] text-zinc-900" : "bg-zinc-950 text-white"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {/* Heading with Navigation Controls */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 sm:mb-14">
              <div>
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-[#C5A059] block mb-3">
                  Our Designers & Artisans
                </span>
                <h2
                  className={`text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight ${
                    isWhiteMode ? "text-zinc-900" : "text-white"
                  }`}
                >
                  The People Behind
                  <span className={`block font-serif italic font-bold text-4xl sm:text-5xl lg:text-6xl mt-1 sm:mt-2 ${
                    isWhiteMode ? "text-[#2B0A0E]" : "text-[#C5A059]"
                  }`}>
                    De flores
                  </span>
                </h2>
                <p className="text-sm sm:text-base font-light text-zinc-600 dark:text-zinc-400 max-w-xl mt-4 sm:mt-5 leading-relaxed">
                  Meet our passionate designers, master tailors, and bridal stylists dedicated to bringing your dream outfits to life.
                </p>
              </div>

              {/* Scroll Controls (Desktop & Mobile) */}
              <div className="flex items-center gap-3 mt-6 md:mt-0">
                <button
                  type="button"
                  onClick={() => scrollTeam("left")}
                  aria-label="Scroll previous team card"
                  className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 active:scale-95 ${
                    isWhiteMode
                      ? "bg-white hover:bg-zinc-200/90 border-zinc-300 text-zinc-900 shadow-sm"
                      : "bg-[#252528] hover:bg-zinc-800 border-white/10 text-white hover:border-[#C5A059]/50 shadow-md"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollTeam("right")}
                  aria-label="Scroll next team card"
                  className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 active:scale-95 ${
                    isWhiteMode
                      ? "bg-white hover:bg-zinc-200/90 border-zinc-300 text-zinc-900 shadow-sm"
                      : "bg-[#252528] hover:bg-zinc-800 border-white/10 text-white hover:border-[#C5A059]/50 shadow-md"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Side-by-side scrollable grey boxes of images */}
            <div
              ref={teamScrollRef}
              className="flex overflow-x-auto gap-5 sm:gap-6 pb-8 pt-2 snap-x snap-mandatory scrollbar-none -mx-6 px-6 sm:-mx-12 sm:px-12 lg:-mx-20 lg:px-20"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {TEAM_PILLARS.map((pillar) => (
                <Link
                  key={pillar.number}
                  href={pillar.href}
                  data-cursor="EXPLORE"
                  className={`group shrink-0 snap-start w-[290px] sm:w-[340px] md:w-[380px] rounded-[2rem] p-4 sm:p-5 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2.5 shadow-xl cursor-pointer ${
                    isWhiteMode
                      ? "bg-zinc-100 hover:bg-zinc-200/90 border border-zinc-300/80 hover:border-zinc-400/80 shadow-zinc-200/60"
                      : "bg-[#252528] hover:bg-[#2e2e33] border border-white/10 hover:border-[#C5A059]/40 shadow-black/50"
                  }`}
                >
                  <div>
                    {/* Architectural Grey Box (in place of image) */}
                    <div className={`relative aspect-[4/3.8] w-full rounded-[1.5rem] overflow-hidden mb-5 p-5 flex flex-col justify-between transition-colors duration-500 border ${
                      isWhiteMode
                        ? "bg-zinc-200/80 group-hover:bg-zinc-300/80 border-zinc-300/80 text-zinc-900"
                        : "bg-[#1c1c1f] group-hover:bg-[#25252a] border-white/10 text-white"
                    }`}>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between z-10">
                        <span className={`font-mono text-xs tracking-widest px-3 py-1 font-semibold rounded-full border ${
                          isWhiteMode
                            ? "bg-white/80 text-[#2B0A0E] border-zinc-300/80 shadow-xs"
                            : "bg-black/60 text-[#C5A059] border-[#C5A059]/30"
                        }`}>
                          {pillar.number}
                        </span>
                        <span className={`text-[9px] tracking-[0.2em] uppercase font-bold px-2.5 py-1 rounded-full border ${
                          isWhiteMode
                            ? "bg-white/60 text-zinc-600 border-zinc-300/60"
                            : "bg-white/10 text-white/80 border-white/15"
                        }`}>
                          {pillar.tag}
                        </span>
                      </div>

                      {/* Center Monogram Emblem Watermark */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                        <div className="relative w-16 h-16 opacity-15 dark:opacity-20 transition-transform duration-500 group-hover:scale-110 filter contrast-125">
                          <img
                            src="/floral.svg"
                            alt=""
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>

                      {/* Bottom Title & Role inside Grey Box */}
                      <div className="relative z-10">
                        <p className={`text-[11px] font-medium uppercase tracking-wider mb-0.5 ${
                          isWhiteMode ? "text-[#9E7A32]" : "text-[#C5A059]"
                        }`}>
                          {pillar.role}
                        </p>
                        <h3 className={`font-serif text-2xl sm:text-[1.7rem] font-bold tracking-tight leading-tight ${
                          isWhiteMode ? "text-zinc-950 group-hover:text-[#2B0A0E]" : "text-white group-hover:text-[#C5A059]"
                        }`}>
                          {pillar.title}
                        </h3>
                      </div>
                    </div>

                    {/* Description inside grey box */}
                    <p className={`text-xs sm:text-sm font-light leading-relaxed line-clamp-3 px-1 ${
                      isWhiteMode ? "text-zinc-600" : "text-zinc-300"
                    }`}>
                      {pillar.description}
                    </p>
                  </div>

                  {/* Footer Action inside Grey Box */}
                  <div className={`mt-6 pt-4 border-t flex items-center justify-between px-1 ${
                    isWhiteMode ? "border-zinc-200/90" : "border-white/10"
                  }`}>
                    <span className={`inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-semibold transition-colors ${
                      isWhiteMode
                        ? "text-zinc-900 group-hover:text-[#2B0A0E]"
                        : "text-white group-hover:text-[#C5A059]"
                    }`}>
                      <span>{pillar.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                    </span>

                    <span className="w-9 h-9 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-[#2B0A0E] group-hover:rotate-45 transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
    </div>

      {/* 9. THE ATELIER JOURNAL (Editorial Articles & Craft Stories) */}
      <section
        id="journal"
        className={`relative z-10 w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 transition-colors duration-500 border-t ${
          isWhiteMode
            ? "bg-[#faf9f6] text-zinc-900 border-zinc-200/80"
            : "bg-black text-white border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div>
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-[#C5A059] block mb-3">
                Style Guides & Bridal Stories
              </span>
              <h2
                className={`text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight ${
                  isWhiteMode ? "text-zinc-900" : "text-white"
                }`}
              >
                Bridal & Fashion
                <span className={`block font-serif italic font-bold text-4xl sm:text-5xl lg:text-6xl mt-1 sm:mt-2 ${
                  isWhiteMode ? "text-[#2B0A0E]" : "text-[#C5A059]"
                }`}>
                  Journal
                </span>
              </h2>
              <p className="text-sm sm:text-base font-light text-zinc-600 dark:text-zinc-400 max-w-xl mt-4 sm:mt-5 leading-relaxed">
                Inspiration, styling guides, real bride stories, and behind-the-scenes insights from our craft workshop.
              </p>
            </div>

            <Link
              href="/blog"
              data-cursor="READ"
              className={`inline-flex items-center space-x-3 text-xs uppercase tracking-[0.25em] font-semibold border-b pb-1.5 transition-colors self-start md:self-end ${
                isWhiteMode
                  ? "border-zinc-900 text-zinc-950 hover:text-[#C5A059] hover:border-[#C5A059]"
                  : "border-white text-white hover:text-[#C5A059] hover:border-[#C5A059]"
              }`}
            >
              <span>Read All Stories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 3 Editorial Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {JOURNAL_ARTICLES.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 mb-6 bg-zinc-900">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="flex items-center justify-between text-[10px] tracking-[0.25em] uppercase font-bold text-[#C5A059] mb-3">
                    <span>{article.category}</span>
                    <span className="font-mono text-zinc-400">{article.readTime}</span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-white leading-snug group-hover:text-[#2B0A0E] dark:group-hover:text-[#C5A059] transition-colors mb-3">
                    {article.title}
                  </h3>

                  <p className="text-xs sm:text-sm font-light text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-200/80 dark:border-white/10 flex items-center justify-between">
                  <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-mono">
                    {article.date}
                  </span>
                  <Link
                    href={article.href}
                    data-cursor="READ"
                    className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-[0.2em] font-semibold text-[#2B0A0E] dark:text-[#C5A059] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 10. INSTAGRAM LOOKBOOK RIBBON */}
      <section
        className={`relative z-10 w-full py-16 sm:py-20 px-4 sm:px-8 transition-colors duration-500 border-t ${
          isWhiteMode
            ? "bg-[#f5f3ec] text-zinc-900 border-zinc-200/80"
            : "bg-zinc-950 text-white border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="INSTAGRAM"
              className="inline-flex items-center space-x-2 text-[11px] sm:text-xs uppercase tracking-[0.3em] font-semibold text-[#C5A059] hover:opacity-80 transition-opacity mb-3"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>@deflores.india</span>
            </a>
            <h2
              className={`text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight ${
                isWhiteMode ? "text-zinc-900" : "text-white"
              }`}
            >
              Follow Our Journey
              <span className={`block font-serif italic font-bold text-4xl sm:text-5xl lg:text-6xl mt-1 sm:mt-2 ${
                isWhiteMode ? "text-[#2B0A0E]" : "text-[#C5A059]"
              }`}>
                On Instagram
              </span>
            </h2>
            <p className="text-sm sm:text-base font-light text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mt-4 sm:mt-5 leading-relaxed">
              Daily bridal inspirations, real bride portraits, and behind-the-scenes moments from our Cochin atelier.
            </p>
          </div>

          {/* 5-Item Lookbook Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {INSTAGRAM_SHOTS.map((shot) => (
              <a
                key={shot.id}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="INSTAGRAM"
                className="group relative aspect-square overflow-hidden rounded-2xl bg-zinc-900 border border-black/5 dark:border-white/10 block"
              >
                <Image
                  src={shot.image}
                  alt="De flores Instagram Couture"
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-3 text-center">
                  <InstagramIcon className="w-6 h-6 text-[#C5A059] mb-2 transform scale-75 group-hover:scale-100 transition-transform duration-300" />
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-[#FDFBF7]">
                    {shot.tag}
                  </span>
                </div>
              </a>
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
          className={`fixed inset-0 z-50 flex flex-col justify-between p-8 md:hidden animate-fadeIn ${isWhiteMode ? "bg-[#faf9f6] text-zinc-900" : "bg-black text-white"
            }`}
        >
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center group"
              aria-label="De Flores Atelier"
            >
              <div className="relative h-[68px] sm:h-[76px] aspect-[5/6]">
                <Image
                  src="/logo.svg"
                  alt="De flores"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
            </Link>
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
              href="#lookbook"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-[#C5A059] transition-colors"
            >
              Lookbook
            </Link>
            <Link
              href="#craft"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-[#C5A059] transition-colors"
            >
              The Craft
            </Link>
            <Link
              href="/founder"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-[#C5A059] transition-colors"
            >
              About
            </Link>
            <Link
              href="#journal"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-[#C5A059] transition-colors"
            >
              Journal
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-[#C5A059] transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex flex-col space-y-4 pt-6 border-t border-zinc-200 dark:border-white/10">
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-center py-3 border rounded-full text-xs uppercase tracking-[0.2em] font-semibold ${isWhiteMode ? "border-zinc-300 text-zinc-800" : "border-white/30 text-white"
                }`}
            >
              Sign In
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center py-3.5 rounded-full text-xs uppercase tracking-[0.22em] font-bold bg-[#2B0A0E] text-[#C5A059] border border-[#C5A059]"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
