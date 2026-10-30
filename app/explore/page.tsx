"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

interface Product {
  id: string;
  title: string;
  price: string;
  category?: string;
  subcategory?: string;
  badge?: string;
  gender?: string;
  occasion?: string[];
  fabric?: string;
  craft?: string;
  description: string;
  images: string[];
  thumbnail?: string;
}

const DEPARTMENTS = ["All", "Women", "Men", "Bridal", "Unisex"];
const OCCASIONS = [
  "All",
  "Bridal",
  "Reception",
  "Sangeet & Haldi",
  "Cocktail & Party",
  "Festive Heirloom",
  "Evening Gala",
  "Bespoke Couture",
];
const FABRICS = [
  "All",
  "Pure Georgette",
  "Silk Cotton",
  "Raw Silk",
  "Organza",
  "Chiffon",
  "Handloom Silk",
  "Velvet",
  "Banarasi Brocade",
];

export default function ExplorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedOccasion, setSelectedOccasion] = useState("All");
  const [selectedFabric, setSelectedFabric] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Error fetching explore catalog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedGender !== "All") {
      result = result.filter(
        (p) => (p.gender || "Women").toLowerCase() === selectedGender.toLowerCase()
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(
        (p) => (p.category || "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedOccasion !== "All") {
      result = result.filter(
        (p) =>
          Array.isArray(p.occasion) &&
          p.occasion.some(
            (o) => o.toLowerCase() === selectedOccasion.toLowerCase()
          )
      );
    }

    if (selectedFabric !== "All") {
      result = result.filter((p) =>
        (p.fabric || "").toLowerCase().includes(selectedFabric.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.fabric && p.fabric.toLowerCase().includes(q)) ||
          (p.craft && p.craft.toLowerCase().includes(q)) ||
          (Array.isArray(p.occasion) &&
            p.occasion.some((o) => o.toLowerCase().includes(q)))
      );
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => {
        const numA = parseInt(a.price.replace(/[^0-9]/g, "")) || 0;
        const numB = parseInt(b.price.replace(/[^0-9]/g, "")) || 0;
        return numA - numB;
      });
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => {
        const numA = parseInt(a.price.replace(/[^0-9]/g, "")) || 0;
        const numB = parseInt(b.price.replace(/[^0-9]/g, "")) || 0;
        return numB - numA;
      });
    }

    return result;
  }, [
    products,
    selectedGender,
    selectedCategory,
    selectedOccasion,
    selectedFabric,
    searchQuery,
    sortBy,
  ]);

  const activeFiltersCount =
    (selectedGender !== "All" ? 1 : 0) +
    (selectedCategory !== "All" ? 1 : 0) +
    (selectedOccasion !== "All" ? 1 : 0) +
    (selectedFabric !== "All" ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedGender("All");
    setSelectedCategory("All");
    setSelectedOccasion("All");
    setSelectedFabric("All");
    setSearchQuery("");
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col justify-between selection:bg-blush selection:text-ink">
      <Nav />

      <main className="w-full pt-4 sm:pt-6 md:pt-10 pb-20 md:pb-32">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12">

          <div className="mb-4 md:mb-8 flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-grey">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-ink font-semibold">Collections Archive</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-line">
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-coral block">
                Atelier Catalog
              </span>
              <h1 className="font-serif text-[clamp(32px,5vw,56px)] font-normal text-ink uppercase tracking-wide leading-none">
                Explore Haute Couture
              </h1>
              <p className="text-grey text-xs md:text-sm font-light max-w-xl leading-relaxed">
                Filter handcrafted bridal lehengas, architectural evening gowns, heritage sarees, and bespoke attire tailored in our Cochin atelier.
              </p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey block">
                Archival Count
              </span>
              <div className="font-serif text-2xl text-ink font-light">
                {filteredProducts.length} {filteredProducts.length === 1 ? "Piece" : "Pieces"}
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-line scrollbar-none">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-grey mr-2 shrink-0">
                Department:
              </span>
              {DEPARTMENTS.map((dept) => {
                const isSelected = selectedGender === dept;
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setSelectedGender(dept)}
                    className={`px-4 py-2 text-[11px] uppercase tracking-[0.18em] font-medium shrink-0 transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-ink text-white border-ink"
                        : "bg-paper text-ink border-line hover:border-ink"
                    }`}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              <div className="lg:col-span-4 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search silhouettes, fabrics, crafts..."
                  className="w-full bg-white border border-line text-xs px-4 py-3 pl-9 tracking-wider text-ink focus:outline-none focus:border-ink rounded-none placeholder:text-grey/70"
                />
                <svg
                  className="w-4 h-4 text-grey absolute left-3 top-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" strokeWidth="1.5" />
                  <path d="M21 21L16.65 16.65" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>

              <div className="lg:col-span-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-white border border-line text-xs px-3 py-3 tracking-wider text-ink focus:outline-none focus:border-ink rounded-none cursor-pointer uppercase"
                >
                  <option value="All">Category: All</option>
                  {availableCategories.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="w-full bg-white border border-line text-xs px-3 py-3 tracking-wider text-ink focus:outline-none focus:border-ink rounded-none cursor-pointer uppercase"
                >
                  <option value="All">Occasion: All</option>
                  {OCCASIONS.filter((o) => o !== "All").map((occ) => (
                    <option key={occ} value={occ}>
                      {occ}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <select
                  value={selectedFabric}
                  onChange={(e) => setSelectedFabric(e.target.value)}
                  className="w-full bg-white border border-line text-xs px-3 py-3 tracking-wider text-ink focus:outline-none focus:border-ink rounded-none cursor-pointer uppercase"
                >
                  <option value="All">Fabric: All</option>
                  {FABRICS.filter((f) => f !== "All").map((fab) => (
                    <option key={fab} value={fab}>
                      {fab}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-white border border-line text-xs px-3 py-3 tracking-wider text-ink focus:outline-none focus:border-ink rounded-none cursor-pointer uppercase"
                >
                  <option value="featured">Sort: Curated</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-[10px] uppercase tracking-widest text-grey font-medium">
                  Active Filters:
                </span>
                {selectedGender !== "All" && (
                  <button
                    type="button"
                    onClick={() => setSelectedGender("All")}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-line text-[10px] uppercase tracking-wider text-ink hover:border-coral transition-colors cursor-pointer"
                  >
                    Dept: {selectedGender} ✕
                  </button>
                )}
                {selectedCategory !== "All" && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("All")}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-line text-[10px] uppercase tracking-wider text-ink hover:border-coral transition-colors cursor-pointer"
                  >
                    Category: {selectedCategory} ✕
                  </button>
                )}
                {selectedOccasion !== "All" && (
                  <button
                    type="button"
                    onClick={() => setSelectedOccasion("All")}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-line text-[10px] uppercase tracking-wider text-ink hover:border-coral transition-colors cursor-pointer"
                  >
                    Occasion: {selectedOccasion} ✕
                  </button>
                )}
                {selectedFabric !== "All" && (
                  <button
                    type="button"
                    onClick={() => setSelectedFabric("All")}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-line text-[10px] uppercase tracking-wider text-ink hover:border-coral transition-colors cursor-pointer"
                  >
                    Fabric: {selectedFabric} ✕
                  </button>
                )}
                {searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-line text-[10px] uppercase tracking-wider text-ink hover:border-coral transition-colors cursor-pointer"
                  >
                    Search: "{searchQuery}" ✕
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-[10px] uppercase tracking-widest font-semibold text-coral underline ml-2 cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          <div className="mt-12">
            {loading ? (
              <div className="py-32 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-grey mb-3">
                  Atelier Catalog
                </span>
                <div className="font-serif text-2xl uppercase tracking-wider text-ink animate-pulse">
                  Synchronizing Collection...
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-24 border border-line bg-white/50 text-center flex flex-col items-center justify-center px-6">
                <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-coral mb-3">
                  Zero Matching Pieces
                </span>
                <h3 className="font-serif text-3xl uppercase text-ink font-normal mb-3">
                  No Creations Found
                </h3>
                <p className="text-grey text-xs md:text-sm max-w-md font-light leading-relaxed mb-6">
                  No couture items match your currently active filter selections. Reset filters or inquire directly for bespoke custom design.
                </p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="px-6 py-3 bg-ink text-white text-[11px] uppercase tracking-[0.18em] font-medium hover:bg-coral transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => window.open("https://wa.me/918848200541?text=Hi%20DeFlores%20Atelier%2C%20I%20would%20like%20to%20commission%20a%20bespoke%20creation.")}
                    className="px-6 py-3 border border-ink text-ink text-[11px] uppercase tracking-[0.18em] font-medium hover:bg-ink hover:text-white transition-colors cursor-pointer"
                  >
                    Bespoke Inquiry →
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {filteredProducts.map((item) => {
                  const thumb = item.thumbnail || (item.images && item.images[0]) || "/crop_green.png";
                  return (
                    <Link
                      key={item.id}
                      href={`/product/${item.id}`}
                      className="group flex flex-col text-left cursor-pointer border border-line bg-paper hover:border-ink transition-colors p-2"
                    >
                      <div className="relative aspect-[9/16] w-full bg-phBg overflow-hidden border border-line">
                        <Image
                          src={thumb}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <span className="absolute top-3 left-3 bg-paper/95 text-ink text-[9px] font-medium tracking-[0.15em] uppercase px-2.5 py-1 border border-line">
                          {item.badge || item.category || "Atelier"}
                        </span>
                        {item.gender && (
                          <span className="absolute bottom-3 left-3 bg-paper/90 text-grey text-[8px] font-medium tracking-widest uppercase px-2 py-0.5 border border-line">
                            {item.gender}
                          </span>
                        )}
                      </div>

                      <div className="p-3 space-y-2">
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] font-medium text-grey">
                          <span>{item.category || "Couture"}</span>
                          {item.fabric && <span className="line-clamp-1">{item.fabric}</span>}
                        </div>
                        <h3 className="font-serif text-[17px] tracking-[0.04em] uppercase text-ink group-hover:text-coral transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="font-serif text-[15px] text-ink font-light">
                          {item.price}
                        </p>
                        <div className="pt-2 border-t border-line flex items-center justify-between">
                          <span className="text-[9px] uppercase tracking-widest font-semibold text-ink group-hover:text-coral transition-colors">
                            View Creation →
                          </span>
                          {item.occasion && item.occasion.length > 0 && (
                            <span className="text-[8px] uppercase tracking-wider text-grey line-clamp-1 max-w-[120px]">
                              {item.occasion[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
