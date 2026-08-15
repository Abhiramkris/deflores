"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import productsData from "../../data/products.json";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Fetch product from local JSON data
  const product = productsData.find((p) => p.id === id);

  // States for interactivity
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || "");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(true);
  const [isShippingExpanded, setIsShippingExpanded] = useState(true);

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

  // Get other products for recommendation
  const recommendations = productsData.filter((p) => p.id !== id).slice(0, 3);

  return (
    <div className="w-full bg-white/70 backdrop-blur-xs text-zinc-900 font-sans py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* 1. Breadcrumb link */}
        <div className="mb-8 flex items-center gap-2 text-[10px] md:text-xs font-semibold tracking-widest uppercase text-zinc-400">
          <Link href="/" className="hover:text-zinc-950 transition-colors">
            ← Home
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
                src={product.images[0]}
                alt={`${product.title} angle 1`}
                fill
                className="object-cover scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            {/* Top row image 2 */}
            <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden rounded-xl">
              <Image
                src={product.images[0]}
                alt={`${product.title} angle 2`}
                fill
                className="object-cover scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            {/* Bottom wide row image */}
            <div className="col-span-2 relative aspect-[2/1] bg-zinc-100 overflow-hidden rounded-xl">
              <Image
                src={product.images[0]}
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
                <h1 className="font-serif text-3xl md:text-5xl font-light tracking-wide text-zinc-950">
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

            {/* Shipping grid section */}
            <div className="border-t border-zinc-100 pt-6">
              <button
                onClick={() => setIsShippingExpanded(!isShippingExpanded)}
                className="w-full flex justify-between items-center py-2 text-left font-serif text-sm font-semibold tracking-wider text-zinc-950 focus:outline-none"
              >
                <span>SHIPPING INFO</span>
                <span className="text-zinc-400">{isShippingExpanded ? "▲" : "▼"}</span>
              </button>
              {isShippingExpanded && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                  
                  {/* Grid item 1 */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-950 shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4m-4 0H8m12 3a2 2 0 10-4 0v1H8v-1a2 2 0 10-4 0v1h16v-1z" />
                      </svg>
                    </div>
                    <div className="text-left space-y-0.5">
                      <h4 className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Discount</h4>
                      <p className="text-xs font-semibold text-zinc-800">{product.shipping.discount}</p>
                    </div>
                  </div>

                  {/* Grid item 2 */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-950 shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="text-left space-y-0.5">
                      <h4 className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Package</h4>
                      <p className="text-xs font-semibold text-zinc-800">{product.shipping.package}</p>
                    </div>
                  </div>

                  {/* Grid item 3 */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-950 shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left space-y-0.5">
                      <h4 className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Delivery Time</h4>
                      <p className="text-xs font-semibold text-zinc-800">{product.shipping.deliveryTime}</p>
                    </div>
                  </div>

                  {/* Grid item 4 */}
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-950 shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-left space-y-0.5">
                      <h4 className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Estimation Arrive</h4>
                      <p className="text-xs font-semibold text-zinc-800">{product.shipping.estimationArrive}</p>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>

          {/* Right Panel (Buy Box & Reviews) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Price Box with WhatsApp redirect */}
            <div className="bg-zinc-950 text-white p-6 flex justify-between items-center shadow-md rounded-xl">
              <span className="font-serif text-2xl md:text-3xl font-light tracking-wide">
                {product.price}
              </span>
              <button 
                onClick={() => window.open(`https://wa.me/919999999999?text=${encodeURIComponent(`Hi DeFlores, I'd like to know more about the "${product.title}" (${product.price}).`)}`)}
                className="bg-white text-zinc-950 text-[10px] font-bold tracking-widest uppercase px-6 py-3 rounded-full hover:bg-zinc-100 transition-colors flex items-center gap-1.5"
              >
                WhatsApp
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

        {/* 4. Recommendation Section (More All You Needs) */}
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
                  <p className="text-[10px] font-medium text-zinc-500 tracking-wider">
                    {rec.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
