export interface CraftPillar {
  title: string;
  subtitle: string;
  description: string;
}

export interface InstagramPost {
  id: string;
  handle: string;
  location: string;
  image: string;
  caption: string;
  likes: string;
  url: string;
}

export interface ClientReview {
  id: string;
  author: string;
  role: string;
  occasion: string;
  city: string;
  date: string;
  rating: number;
  quote: string;
  brideImage?: string;
}

export interface CouturePiece {
  id: string;
  title: string;
  subtitle: string;
  collection: string;
  tag: string;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  craftStory: string;
  specifications: {
    fabric: string;
    embroidery: string;
    silhouette: string;
    color: string;
    leadTime: string;
    includes: string;
  };
  trustPillars: CraftPillar[];
  processSteps: {
    step: string;
    title: string;
    description: string;
  }[];
  instagramFeed: InstagramPost[];
  reviews: ClientReview[];
}

export const COUTURE_PIECES: CouturePiece[] = [
  {
    id: "lavender-couture-lehenga",
    title: "The Lilac Reverie",
    subtitle: "Bespoke Lavender Floral Kalidar Lehenga",
    collection: "Haute Couture 2026",
    tag: "Haute Couture",
    rating: 4.9,
    reviewCount: 48,
    images: [
      "/couture/lavender-1.jpg",
      "/couture/lavender-2.jpg",
      "/couture/lavender-3.jpg",
      "/couture/lavender-4.jpg",
    ],
    description:
      "A testament to botanical grace and modern Indian royalty. Handcrafted in luminous lilac Italian tulle and mulberry silk, The Lilac Reverie features sweeping chevron motifs encrusted with antique zardozi, micro cutdana, and Japanese seed beads. Completed with an architecturally sculpted full-sleeve blouse and an ethereal sheer scalloped dupatta.",
    craftStory:
      "Every petal and architectural panel on The Lilac Reverie is individually mapped across 16 kalis to guarantee an uninterrupted visual cadence from waist to hemline. Our master karigars spend upwards of 180 hours executing tone-on-tone dabka embroidery that shimmers softly under evening candlelight without weighing down the bride.",
    specifications: {
      fabric: "Pure Italian Tulle, Mulberry Raw Silk lining, Micro-scalloped Net",
      embroidery: "Hand-done Aari & Zardozi, Micro Cutdana, Resham threadwork, Japanese seed beads",
      silhouette: "16-Kali Flared Circular Lehenga with Sculpted Sweetheart Bodice",
      color: "Lavender Mist with Champagne Gold & Antique Rose accents",
      leadTime: "8 to 12 Weeks (Express bridal timeline available on consultation)",
      includes: "Flared Kalidar Lehenga Skirt, Fully Embroidered Blouse, Scalloped Border Dupatta, Signature Wooden Archival Box",
    },
    trustPillars: [
      {
        title: "180+ Artisanal Hours",
        subtitle: "HAND-EMBROIDERED HERITAGE",
        description:
          "Every petal and chevron motif is brought to life by master karigars over weeks of meticulous handwork — blending antique zardozi, glistening cutdana, and micro Japanese beads that illuminate under evening candlelight.",
      },
      {
        title: "Bespoke Made-to-Measure",
        subtitle: "SCULPTED CONTOUR ARCHITECTURE",
        description:
          "Calico muslin toile fittings contour the ensemble precisely to your posture and silhouette. Engineered with balanced weight distribution, ensuring zero waist gaping and effortless, floating grace.",
      },
      {
        title: "Pure French Tulle & Silk",
        subtitle: "AUTHENTIC PURE TEXTILES",
        description:
          "Woven from airy Italian tulle and lined with pure mulberry raw silk for supreme breathability. Drapes like liquid poetry, keeping you comfortable, confident, and weightless throughout your celebrations.",
      },
      {
        title: "Signature Wooden Trunk",
        subtitle: "BESPOKE ATELIER DISPATCH",
        description:
          "Arrives steam-finished and personally inspected in our signature wooden bridal chest, accompanied by museum-grade pure cotton muslin preservation wrapping and private trousseau care guide.",
      },
    ],
    processSteps: [
      {
        step: "01",
        title: "Private Bridal Consultation",
        description:
          "One-on-one session with Anisree Sreeraj and our couture stylists to understand your celebration venue, lighting, and aesthetic vision.",
      },
      {
        step: "02",
        title: "Custom Swatches & Color Sampling",
        description:
          "Bespoke embroidery swatches and dyed silk samples shipped directly to your door for approval under ambient evening light.",
      },
      {
        step: "03",
        title: "Calico Toile Fitting",
        description:
          "A trial muslin garment tailored to your exact measurements to perfect the silhouette, neckline, and flare before cutting pure fabrics.",
      },
      {
        step: "04",
        title: "Artisanal Hand-Embroidery",
        description:
          "Our master artisans hand-stitch thousands of crystals, beads, and gold threads across each individual kalidar panel.",
      },
      {
        step: "05",
        title: "White-Glove Atelier Handover",
        description:
          "Final steam press, monogrammed bridal label insertion, and insured door-to-door delivery in an archival bridal trunk.",
      },
    ],
    instagramFeed: [
      {
        id: "ig-1",
        handle: "@tarini_weddings",
        location: "The Leela Palace, Udaipur",
        image: "/couture/lavender-1.jpg",
        caption:
          "Felt like absolute royalty on our Sangeet night. Thank you @deflores.atelier for turning my dream silhouette into reality! ✨💜",
        likes: "3,420",
        url: "https://www.instagram.com/deflores.atelier",
      },
      {
        id: "ig-2",
        handle: "@dr.sneha_mehra",
        location: "Taj Lake Palace, Udaipur",
        image: "/couture/lavender-2.jpg",
        caption:
          "The way the cutdana catches the stage lighting... pure poetry. Still not over this lilac masterpiece. @deflores.atelier",
        likes: "4,180",
        url: "https://www.instagram.com/deflores.atelier",
      },
      {
        id: "ig-3",
        handle: "@meera.couture",
        location: "Oberoi Sukhvilas, Chandigarh",
        image: "/couture/lavender-3.jpg",
        caption:
          "Details that take your breath away up close. Every single bead hand-stitched by @deflores.atelier karigars. #BespokeBride",
        likes: "2,890",
        url: "https://www.instagram.com/deflores.atelier",
      },
      {
        id: "ig-4",
        handle: "@avantika_k",
        location: "ITC Grand Chola, Chennai",
        image: "/couture/lavender-4.jpg",
        caption:
          "The flare, the weightlessness, the elegance! Dancing in this lehenga was an absolute breeze. @deflores.atelier",
        likes: "3,750",
        url: "https://www.instagram.com/deflores.atelier",
      },
    ],
    reviews: [
      {
        id: "rev-1",
        author: "Avantika Kapoor",
        role: "Bespoke Bride",
        occasion: "Sangeet Night",
        city: "Udaipur, Rajasthan",
        date: "February 2026",
        rating: 5,
        quote:
          "I was worried about ordering a bespoke bridal outfit from abroad, but the De Flores team made the entire experience seamless. The virtual fitting and swatch approvals gave me so much confidence. When the trunk arrived and I wore it for my Sangeet in Udaipur, everyone was speechless. It drapes like liquid silk!",
        brideImage: "/couture/lavender-2.jpg",
      },
      {
        id: "rev-2",
        author: "Rhea Singhania",
        role: "Bespoke Bride",
        occasion: "Wedding Reception",
        city: "Mumbai, Maharashtra",
        date: "January 2026",
        rating: 5,
        quote:
          "The craftsmanship is beyond anything you find in off-the-rack luxury. You can literally feel the 180+ hours of love poured into every crystal and thread. The fit was 100% spot on without needing even a millimetre of alteration.",
        brideImage: "/couture/lavender-3.jpg",
      },
      {
        id: "rev-3",
        author: "Devika Nambiar",
        role: "Bespoke Bride",
        occasion: "Engagement Gala",
        city: "Kochi, Kerala",
        date: "December 2025",
        rating: 5,
        quote:
          "Anisree and her team listened to every tiny detail I wanted — from higher neckline support to personalized latkans with our initials. The lilac hue is unique and royal without being overwhelming. Best investment of our wedding!",
        brideImage: "/couture/lavender-4.jpg",
      },
    ],
  },
];

// Always return the single flagship creation
export function getCouturePiece(_id?: string): CouturePiece {
  return COUTURE_PIECES[0];
}
