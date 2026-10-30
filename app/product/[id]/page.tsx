"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Nav from "../../../components/Nav";
import Footer from "../../../components/Footer";

interface ColorSwatch {
  name: string;
  hex: string;
}

interface ProductDetail {
  id: string;
  title: string;
  price: string;
  category?: string;
  subcategory?: string;
  badge?: string;
  description: string;
  colors: ColorSwatch[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  images: string[];
  lookbookImages?: string[];
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

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(true);
  const [isCraftExpanded, setIsCraftExpanded] = useState(false);
  const [isDeliveryExpanded, setIsDeliveryExpanded] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products?id=${id}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          if (data.product.colors && data.product.colors.length > 0) {
            setSelectedColor(data.product.colors[0].name);
          }
          if (data.product.sizes && data.product.sizes.length > 0) {
            setSelectedSize(data.product.sizes[0]);
          }
        }

        const recRes = await fetch("/api/products");
        const recData = await recRes.json();
        if (recData.success && Array.isArray(recData.products)) {
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
      <div className="min-h-screen flex flex-col justify-between bg-paper text-ink">
        <Nav />
        <div className="flex-1 flex flex-col items-center justify-center py-32">
          <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey mb-3">Atelier Archive</span>
          <div className="font-serif text-2xl uppercase tracking-wider text-ink animate-pulse">
            Synchronizing Details...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-paper text-ink">
        <Nav />
        <div className="flex-1 flex flex-col items-center justify-center py-32 px-6 text-center">
          <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey mb-3">Atelier Catalog</span>
          <h1 className="font-serif text-3xl md:text-4xl text-ink uppercase tracking-wide mb-6">Product Not Found</h1>
          <Link
            href="/"
            className="inline-block bg-ink text-white hover:bg-coral text-[12px] uppercase tracking-[0.18em] font-medium px-8 py-3.5 transition-colors duration-200"
          >
            Return to Atelier Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryName = product.category || "Bespoke";
  const badgeLabel = product.badge || product.category || "Bespoke";

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col justify-between selection:bg-blush selection:text-ink">
      <Nav />

      <main className="w-full pt-28 md:pt-36 pb-20 md:pb-32">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          
          <div className="mb-8 flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-grey">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/collections/all" className="hover:text-ink transition-colors">
              Collections
            </Link>
            <span>/</span>
            <span className="text-ink font-semibold">{product.title}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-16">
            <div className="md:col-span-6 relative aspect-[4/3] md:aspect-auto md:h-[580px] bg-phBg overflow-hidden border border-line">
              <Image
                src={product.images[0]}
                alt={`${product.title} main view`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <span className="absolute top-4 left-4 bg-paper/95 text-ink text-[10px] font-medium tracking-[0.18em] uppercase px-3.5 py-1.5 border border-line backdrop-blur-xs">
                {badgeLabel}
              </span>
            </div>

            <div className="md:col-span-6 grid grid-cols-2 gap-4">
              <div className="relative aspect-[4/3] bg-phBg overflow-hidden border border-line">
                <Image
                  src={product.images[1] || product.images[0]}
                  alt={`${product.title} silhouette angle`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-[4/3] bg-phBg overflow-hidden border border-line">
                <Image
                  src={product.images[2] || product.images[0]}
                  alt={`${product.title} draping angle`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="col-span-2 relative aspect-[2/1] bg-phBg overflow-hidden border border-line">
                <Image
                  src={product.images[3] || product.images[0]}
                  alt={`${product.title} craftsmanship detail`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey">
                    {categoryName} {product.subcategory ? `• ${product.subcategory}` : ""}
                  </span>
                  <span className="w-1 h-1 bg-grey rounded-full" />
                  <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey">
                    Atelier Exclusive
                  </span>
                </div>

                <h1 className="font-serif text-[clamp(28px,4vw,52px)] font-normal text-ink uppercase tracking-[0.02em] leading-tight">
                  {product.title}
                </h1>

                <div className="font-serif text-[24px] sm:text-[28px] text-ink font-normal tracking-wide pt-1">
                  {product.price}
                </div>

                <div className="flex items-center gap-3 pt-1 text-[12px]">
                  <div className="flex gap-0.5 text-coral">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                  </div>
                  <span className="font-semibold text-ink">{product.rating.toFixed(1)}</span>
                  <span className="text-grey font-light">({product.reviewCount} Client Feedback)</span>
                </div>
              </div>

              {product.colors && product.colors.length > 0 && (
                <div className="space-y-3 border-t border-line pt-6">
                  <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey block">
                    COLOR — <span className="text-ink font-semibold">{selectedColor}</span>
                  </span>
                  <div className="flex flex-wrap gap-3 items-center">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor === color.name;
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setSelectedColor(color.name)}
                          className={`flex items-center gap-2 px-3 py-1.5 border transition-all cursor-pointer ${
                            isSelected ? "border-ink ring-1 ring-ink ring-offset-2 ring-offset-paper bg-white" : "border-line bg-paper hover:border-grey"
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 border border-line"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className={`text-[11px] uppercase tracking-[0.18em] font-medium ${isSelected ? "text-ink" : "text-grey"}`}>
                            {color.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3 border-t border-line pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey block">
                      SIZE & FIT — <span className="text-ink font-semibold">{selectedSize}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => window.open(`https://wa.me/918848200541?text=${encodeURIComponent(`Hi DeFlores, I need size consultation for "${product.title}".`)}`)}
                      className="text-[10px] uppercase tracking-[0.18em] text-coral font-medium hover:underline cursor-pointer"
                    >
                      Bespoke Measurement Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-12 px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] font-medium border transition-colors cursor-pointer ${
                            isSelected ? "bg-ink text-white border-ink" : "bg-paper text-ink border-line hover:border-ink"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-4 border-t border-line pt-6">
                <div className="border-b border-line pb-4">
                  <button
                    type="button"
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="w-full flex justify-between items-center py-2 text-left font-serif text-[15px] tracking-[0.15em] font-medium text-ink hover:text-coral transition-colors cursor-pointer"
                  >
                    <span>DESCRIPTION & SILHOUETTE</span>
                    <span className="font-mono text-base font-normal">{isDescExpanded ? "−" : "+"}</span>
                  </button>
                  {isDescExpanded && (
                    <div className="mt-3 text-[14px] sm:text-[15px] leading-[1.8] text-ink/90 font-light space-y-3">
                      <p>{product.description}</p>
                    </div>
                  )}
                </div>

                <div className="border-b border-line pb-4">
                  <button
                    type="button"
                    onClick={() => setIsCraftExpanded(!isCraftExpanded)}
                    className="w-full flex justify-between items-center py-2 text-left font-serif text-[15px] tracking-[0.15em] font-medium text-ink hover:text-coral transition-colors cursor-pointer"
                  >
                    <span>ATELIER CRAFTSMANSHIP & CARE</span>
                    <span className="font-mono text-base font-normal">{isCraftExpanded ? "−" : "+"}</span>
                  </button>
                  {isCraftExpanded && (
                    <div className="mt-3 text-[14px] sm:text-[15px] leading-[1.8] text-ink/90 font-light space-y-3">
                      <p>
                        Hand-embroidered by skilled heritage artisans at De Flores Cochin atelier. Fabricated in pure georgette, silk cotton, and fine thread zari. Dry clean only. Preserve in soft breathable cotton storage bags.
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-b border-line pb-4">
                  <button
                    type="button"
                    onClick={() => setIsDeliveryExpanded(!isDeliveryExpanded)}
                    className="w-full flex justify-between items-center py-2 text-left font-serif text-[15px] tracking-[0.15em] font-medium text-ink hover:text-coral transition-colors cursor-pointer"
                  >
                    <span>DELIVERY & COMPLIMENTARY FITTINGS</span>
                    <span className="font-mono text-base font-normal">{isDeliveryExpanded ? "−" : "+"}</span>
                  </button>
                  {isDeliveryExpanded && (
                    <div className="mt-3 text-[14px] sm:text-[15px] leading-[1.8] text-ink/90 font-light space-y-2">
                      <p>• {product.shipping.deliveryTime} domestic delivery.</p>
                      <p>• {product.shipping.package} included with every commission.</p>
                      <p>• Worldwide insured shipping available. Dedicated virtual tailoring sessions available upon request.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-8">
              <div className="border border-line bg-paper p-6 sm:p-8 space-y-6 text-left shadow-xs">
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey block">
                    Bespoke Commission
                  </span>
                  <h3 className="font-serif text-2xl uppercase tracking-[0.06em] text-ink leading-tight">
                    Haute Couture Inquiry
                  </h3>
                  <p className="text-[13px] text-grey leading-relaxed font-light">
                    Every piece is individually handcrafted in our Cochin atelier. Connect directly with our lead bridal stylists for bespoke sizing, fabric customisation, or international dispatch.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        `https://wa.me/918848200541?text=${encodeURIComponent(
                          `Hi DeFlores, I'd like to inquire about the "${product.title}" (${selectedColor || "Standard"}, Size: ${selectedSize || "Custom"}).`
                        )}`
                      )
                    }
                    className="w-full bg-ink text-white hover:bg-coral text-[13px] sm:text-[14px] uppercase tracking-[0.18em] font-medium px-8 py-4 transition-colors duration-200 flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <span>Inquire via WhatsApp</span>
                    <span>→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="w-full border border-line hover:border-ink text-ink text-[12px] uppercase tracking-[0.18em] font-medium py-3.5 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <svg
                      className={`w-4 h-4 transition-colors ${isWishlisted ? "fill-coral stroke-coral" : "stroke-current fill-none"}`}
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    <span>{isWishlisted ? "Saved to Atelier Wishlist" : "Save to Wishlist"}</span>
                  </button>
                </div>

                <div className="border-t border-line pt-4 text-[12px] text-grey space-y-1 font-light">
                  <p>✓ In-studio fittings at our Panampilly Nagar boutique</p>
                  <p>✓ Virtual consultation with master couturiers</p>
                  <p>✓ Worldwide insured white-glove dispatch</p>
                </div>
              </div>

              {product.reviews && product.reviews.length > 0 && (
                <div className="border border-line bg-paper p-6 sm:p-8 space-y-6 text-left">
                  <div className="flex justify-between items-end pb-3 border-b border-line">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.18em] font-medium text-grey block">Patron Feedback</span>
                      <h3 className="font-serif text-lg tracking-[0.06em] text-ink uppercase">
                        Reviews ({product.reviewCount})
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-coral text-xs">
                      <span>★</span>
                      <span className="text-ink font-semibold">{product.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="space-y-6 divide-y divide-line">
                    {product.reviews.map((rev, idx) => (
                      <div key={idx} className={`space-y-3 ${idx > 0 ? "pt-6" : ""}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="font-serif text-[15px] font-normal text-ink uppercase tracking-wide">
                              {rev.author}
                            </div>
                            <div className="text-[10px] uppercase tracking-[0.15em] text-grey">{rev.date}</div>
                          </div>
                          <div className="flex gap-0.5 text-xs text-coral">
                            {[...Array(rev.rating)].map((_, i) => (
                              <span key={i}>★</span>
                            ))}
                          </div>
                        </div>

                        <p className="text-[13px] sm:text-[14px] text-ink/80 leading-relaxed font-light italic">
                          "{rev.quote}"
                        </p>

                        {rev.images && rev.images.length > 0 && (
                          <div className="flex gap-2 pt-1">
                            {rev.images.map((img, i) => (
                              <div key={i} className="relative w-14 h-16 bg-phBg border border-line overflow-hidden">
                                <Image
                                  src={img}
                                  alt={`Patron review photo ${i + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="60px"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {(() => {
            const lookbookList = product.lookbookImages && product.lookbookImages.length > 0
              ? product.lookbookImages
              : [product.images[2], product.images[3]].filter(Boolean);

            if (lookbookList.length === 0) return null;

            return (
              <div className="mt-24 pt-16 border-t border-line space-y-8">
                <div className="text-center space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey block">
                    Atmosphere
                  </span>
                  <h2 className="font-serif text-[clamp(26px,3.5vw,42px)] tracking-[0.06em] uppercase text-ink font-normal">
                    Editorial Lookbook
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {lookbookList.map((img: string, idx: number) => (
                    <div key={idx} className="relative aspect-[3/4] md:aspect-[4/5] bg-phBg overflow-hidden border border-line">
                      <Image
                        src={img}
                        alt={`Editorial atmospheric shot ${idx + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {recommendations.length > 0 && (
            <div className="mt-24 pt-16 border-t border-line">
              <div className="text-center space-y-2 mb-12">
                <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey block">
                  Curated Selections
                </span>
                <h2 className="font-serif text-[clamp(26px,3.5vw,42px)] tracking-[0.06em] uppercase text-ink font-normal">
                  More From The Atelier
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recommendations.map((rec) => {
                  const recThumb = (rec.images && rec.images[0]) || "/crop_green.png";
                  return (
                    <Link
                      key={rec.id}
                      href={`/product/${rec.id}`}
                      className="group flex flex-col text-left cursor-pointer"
                    >
                      <div className="aspect-[3/4] w-full mb-4 bg-phBg relative overflow-hidden border border-line">
                        <Image
                          src={recThumb}
                          alt={rec.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <span className="absolute top-3 left-3 bg-paper/95 text-ink text-[9px] font-medium tracking-[0.15em] uppercase px-2.5 py-1 border border-line">
                          {rec.badge || rec.category || "Atelier"}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-[0.18em] font-medium text-grey block">
                          {rec.category || "Haute Couture"}
                        </span>
                        <h3 className="font-serif text-[17px] tracking-[0.04em] uppercase text-ink group-hover:text-coral transition-colors line-clamp-1">
                          {rec.title}
                        </h3>
                        <p className="font-serif text-[15px] text-ink font-light">
                          {rec.price || "Haute Couture"}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
