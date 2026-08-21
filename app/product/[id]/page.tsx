"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface ColorSwatch {
  name: string;
  hex: string;
}

interface ProductDetail {
  id: string;
  title: string;
  price: string;
  description: string;
  colors: ColorSwatch[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  images: string[];
  shipping: {
    discount: string;
    package: string;
    deliveryTime: string;
    estimationArrive: string;
  };
  reviews: Array<{
    author: string;
    date: string;
    rating: number;
    quote: string;
    images: string[];
  }>;
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // States for fetching dynamic data
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(true);
  const [isShippingExpanded, setIsShippingExpanded] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // Fetch product detail and other items for recommendation
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        // Get single details
        const res = await fetch(`/api/products?id=${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
          setSelectedColor(data.product.colors[0]?.name || "");
        }

        // Get recommendations
        const recRes = await fetch("/api/products");
        const recData = await recRes.json();
        if (recData.success) {
          const others = recData.products.filter((p: any) => p.id !== id).slice(0, 3);
          setRecommendations(others);
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 text-zinc-950 font-serif text-lg">
        Synchronizing details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-zinc-950 p-6">
        <h1 className="font-serif text-3xl mb-4">Product Not Found</h1>
        <Link href="/" className="text-xs font-semibold uppercase tracking-widest underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/70 backdrop-blur-xs text-zinc-900 font-sans py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* 1. Breadcrumb link */}
        <div className="mb-8 flex items-center gap-2 text-[10px] md:text-xs font-semibold tracking-widest uppercase text-zinc-400">
          <Link href="/" className="hover:text-zinc-950 transition-colors">
            Home
          </Link>
          <span>•</span>
          <span className="text-zinc-900">Product details</span>
        </div>

        {/* 2. Top Gallery Area (Recreating the reference layout) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-12">
          {/* Left large image block: 6 columns */}
          <div className="md:col-span-6 relative aspect-[4/3] md:aspect-auto md:h-[500px] bg-zinc-100 overflow-hidden rounded-xl">
            <Image
              src={product.images[0]}
              alt={`${product.title} front`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {/* Category tag */}
            <span className="absolute top-4 left-4 bg-white/95 text-zinc-950 text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-xs">
              Bespoke
            </span>
          </div>

          {/* Right smaller layout images block: 6 columns */}
          <div className="md:col-span-6 grid grid-cols-2 gap-4">
            {/* Top row image 1 */}
            <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden rounded-xl">
              <Image
                src={product.images[1] || product.images[0]}
                alt={`${product.title} angle 1`}
                fill
                className="object-cover scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            {/* Top row image 2 */}
            <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden rounded-xl">
              <Image
                src={product.images[2] || product.images[0]}
                alt={`${product.title} angle 2`}
                fill
                className="object-cover scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            {/* Bottom wide row image */}
            <div className="col-span-2 relative aspect-[2/1] bg-zinc-100 overflow-hidden rounded-xl">
              <Image
                src={product.images[3] || product.images[0]}
                alt={`${product.title} detail`}
                fill
                className="object-cover contrast-110 brightness-95"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* 3. Bottom Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Panel (Product Info) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Title & Heart Wishlist */}
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2">
                <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-zinc-950 animate-text-reveal">
                  {product.title}
                </h1>
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                  <span className="text-amber-500">★</span>
                  <span className="font-bold text-zinc-900">{product.rating}</span>
                  <span>({product.reviewCount}) New Reviews</span>
                </div>
              </div>
              <button 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="p-3 border border-zinc-200 rounded-full hover:bg-zinc-50 transition-colors shrink-0"
                aria-label="Wishlist"
              >
                <svg 
                  className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-red-500 stroke-red-500" : "stroke-zinc-500 fill-none"}`} 
                  strokeWidth="2" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Colors Swatches selection */}
            {product.colors.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] tracking-widest font-bold uppercase text-zinc-400 block">Color</span>
                <div className="flex flex-wrap gap-4 items-center">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                    >
                      <div 
                        className={`w-6 h-6 rounded-full border shadow-xs transition-transform ${
                          selectedColor === color.name ? "ring-2 ring-zinc-950 scale-105" : "border-zinc-200"
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className={`text-[10px] font-semibold tracking-wider uppercase transition-colors ${
                        selectedColor === color.name ? "text-zinc-950" : "text-zinc-400 group-hover:text-zinc-600"
                      }`}>
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description collapsible Accordion */}
            <div className="border-t border-zinc-100 pt-6">
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="w-full flex justify-between items-center py-2 text-left font-serif text-sm font-semibold tracking-wider text-zinc-950 focus:outline-none"
              >
                <span>DESCRIPTION</span>
                <span className="text-zinc-400">{isDescExpanded ? "▲" : "▼"}</span>
              </button>
              {isDescExpanded && (
                <p className="mt-4 text-xs md:text-sm text-zinc-600 leading-relaxed font-light tracking-wide">
                  {product.description}
                </p>
              )}
            </div>

            </div>

            {/* Right Panel (Buy Box & Reviews) */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* WhatsApp Inquiry Button Box */}
              <div className="bg-zinc-950 text-white p-6 flex justify-between items-center shadow-md rounded-xl">
                <span className="font-serif text-sm tracking-widest uppercase font-bold text-zinc-100">
                  Haute Couture
                </span>
                <button 
                  onClick={() => window.open(`https://wa.me/918848200541?text=${encodeURIComponent(`Hi DeFlores, I'd like to know more about the "${product.title}".`)}`)}
                  className="bg-white text-zinc-950 text-[10px] font-bold tracking-widest uppercase px-6 py-3 rounded-full hover:bg-zinc-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  Inquire via WhatsApp
                  <span>→</span>
                </button>
              </div>

            {/* Reviews list */}
            <div className="border border-zinc-100 bg-white/40 p-6 md:p-8 space-y-6 text-left rounded-xl">
              <div className="flex justify-between items-end pb-3 border-b border-zinc-100">
                <h3 className="font-serif text-sm font-semibold tracking-wider text-zinc-950 uppercase">
                  Reviews ({product.reviewCount})
                </h3>
                <span className="text-[10px] font-semibold text-zinc-400 hover:text-zinc-900 cursor-pointer transition-colors uppercase tracking-wider">
                  See more
                </span>
              </div>

              <div className="space-y-6 divide-y divide-zinc-100/50">
                {product.reviews.map((rev, idx) => (
                  <div key={idx} className={`space-y-3 ${idx > 0 ? "pt-6" : ""}`}>
                    <div className="flex items-center gap-3">
                      {/* Placeholder Avatar */}
                      <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-600">
                        {rev.author[0]}
                      </div>
                      <div className="text-left space-y-0.5">
                        <div className="text-xs font-bold text-zinc-900">{rev.author}</div>
                        <div className="text-[9px] text-zinc-400">{rev.date}</div>
                      </div>
                      {/* Stars */}
                      <div className="ml-auto flex gap-0.5 text-[9px] text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>
                    
                    <p className="font-sans text-xs text-zinc-600 leading-relaxed font-light">
                      "{rev.quote}"
                    </p>

                    {/* Review Attached Images Grid */}
                    <div className="flex gap-2">
                      {rev.images.map((img, i) => (
                        <div key={i} className="relative w-12 h-16 bg-zinc-50 border border-zinc-100 rounded-sm overflow-hidden">
                          <Image
                            src={img}
                            alt="Attached review photo"
                            fill
                            className="object-cover"
                            sizes="50px"
                          />
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </div>

        </div>

        {/* 4. Gallery Lookbook Section */}
        {(() => {
          const lookbookList = (product as any).lookbookImages && (product as any).lookbookImages.length > 0 
            ? (product as any).lookbookImages 
            : [product.images[2], product.images[3]].filter(Boolean);

          if (lookbookList.length === 0) return null;

          return (
            <div className="mt-20 pt-16 border-t border-zinc-100 space-y-8">
              <div className="text-center space-y-2">
                <span className="text-[9px] tracking-[0.25em] font-bold uppercase text-zinc-400 block">Atmosphere</span>
                <h2 className="font-serif text-2xl md:text-3xl tracking-widest uppercase text-zinc-950 font-normal">
                  Editorial Gallery
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lookbookList.map((img: string, idx: number) => (
                  <div key={idx} className="relative aspect-[3/4] md:aspect-[4/5] bg-zinc-50 overflow-hidden rounded-xl shadow-xs">
                    <Image
                      src={img}
                      alt={`Editorial lookbook detail ${idx + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-1000"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* 5. Recommendation Section (More All You Needs) */}
        {recommendations.length > 0 && (
          <div className="mt-24 pt-16 border-t border-zinc-100">
            <h2 className="font-serif text-2xl md:text-3xl tracking-widest uppercase text-zinc-950 font-normal mb-12 text-center">
              More All You Needs.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recommendations.map((rec) => (
                <Link 
                  key={rec.id}
                  href={`/product/${rec.id}`}
                  className="product-card flex flex-col group cursor-pointer"
                >
                  <div className="product-image-container aspect-[3/4] w-full mb-4 bg-zinc-50 relative rounded-xl">
                    <Image 
                      src={rec.images[0]} 
                      alt={rec.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  <div className="space-y-1 text-left px-2">
                    <h3 className="text-[10px] tracking-widest font-semibold uppercase text-zinc-900 line-clamp-1">
                      {rec.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
