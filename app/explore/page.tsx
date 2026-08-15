import Image from "next/image";
import Link from "next/link";
import productsData from "../data/products.json";

export default function ExplorePage() {
  return (
    <div className="w-full bg-white/70 backdrop-blur-xs text-zinc-900 font-sans py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Breadcrumb */}
        <div className="mb-12 flex items-center gap-2 text-[10px] md:text-xs font-semibold tracking-widest uppercase text-zinc-400">
          <Link href="/" className="hover:text-zinc-950 transition-colors">Home</Link>
          <span>•</span>
          <span className="text-zinc-900">Explore</span>
        </div>

        {/* Heading */}
        <div className="text-left space-y-4 mb-16">
          <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 block">
            03 / Collections
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-zinc-950">
            Explore Couture
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm font-light max-w-lg leading-relaxed tracking-wide mt-2">
            Browse our full catalog of luxury ready-to-wear, custom bridal wear, and occasional attire mapped to organic geometric order.
          </p>
          <div className="w-16 h-[1px] bg-zinc-300" />
        </div>

        {/* Product List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {productsData.map((item) => (
            <Link 
              key={item.id}
              href={`/product/${item.id}`}
              className="product-card flex flex-col group cursor-pointer bg-white/40 border border-zinc-200/20 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-zinc-300/30 transition-all p-1.5"
            >
              {/* Product Image Frame */}
              <div className="product-image-container aspect-[3/4] w-full bg-zinc-50 relative rounded-xl">
                <Image 
                  src={item.images[0]} 
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>

              {/* Product details */}
              <div className="p-4 space-y-2 text-left mt-auto">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-[11px] tracking-widest font-bold uppercase text-zinc-900 line-clamp-1">
                    {item.title}
                  </h3>
                  <span className="text-[10px] font-medium text-zinc-500 tracking-wider">
                    {item.price}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-500 font-light leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                <div className="pt-2">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-zinc-900 border-b border-zinc-950 pb-0.5 hover:opacity-75 transition-opacity">
                    Inquire Details
                  </span>
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
