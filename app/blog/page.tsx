import Image from "next/image";
import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "The Art of Bespoke Bridal Customization",
      category: "DESIGN STORY",
      date: "August 12, 2026",
      excerpt: "Behind the seams of DeFlores' most intricate wedding gowns. Explore how we map traditional drapes into contemporary geometry.",
      img: "/crop_white.png"
    },
    {
      id: 2,
      title: "Symmetry in Flora: Structuring Silk Georgette",
      category: "CRAFTSMANSHIP",
      date: "July 28, 2026",
      excerpt: "A deep dive into how mathematical proportions and organic flora structures guide each petal alignment and thread density.",
      img: "/crop_green.png"
    },
    {
      id: 3,
      title: "Haute Couture: A Modern Royal Narrative",
      category: "EDITORIAL",
      date: "June 15, 2026",
      excerpt: "Discover the curation statement behind our latest collection, bridging traditional heritage with clean structural minimalism.",
      img: "/gallery_purple.jpg"
    }
  ];

  return (
    <div className="w-full bg-white/70 backdrop-blur-xs text-zinc-900 font-sans py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Breadcrumb */}
        <div className="mb-12 flex items-center gap-2 text-[10px] md:text-xs font-semibold tracking-widest uppercase text-zinc-400">
          <Link href="/" className="hover:text-zinc-950 transition-colors">Home</Link>
          <span>•</span>
          <span className="text-zinc-900">Blog</span>
        </div>

        {/* Heading */}
        <div className="text-left space-y-4 mb-16">
          <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 block">
            01 / Editorial
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-zinc-950">
            Style Chronicles
          </h1>
          <div className="w-16 h-[1px] bg-zinc-300" />
        </div>

        {/* 3-Column Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col group text-left cursor-pointer">
              <div className="relative aspect-[3/4] w-full bg-zinc-50 rounded-xl overflow-hidden mb-6 border border-zinc-200/40 shadow-xs">
                <Image
                  src={post.img}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 30vw"
                />
                <span className="absolute top-4 left-4 bg-white/95 text-zinc-950 text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
                  {post.category}
                </span>
              </div>
              <div className="space-y-3">
                <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest">
                  {post.date}
                </span>
                <h2 className="font-serif text-xl md:text-2xl font-light text-zinc-950 group-hover:text-zinc-700 transition-colors leading-tight">
                  {post.title}
                </h2>
                <p className="text-xs text-zinc-500 font-light leading-relaxed tracking-wide">
                  {post.excerpt}
                </p>
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-950 border-b border-zinc-950 pb-1 group-hover:opacity-75 transition-opacity">
                    Read Article
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
