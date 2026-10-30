import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "../../../components/Nav";
import Footer from "../../../components/Footer";
import { getCategoryByKey, getCategories, Category } from "../../../lib/categories";
import { sql } from "../../lib/db";
import defaultProducts from "../../data/products.json";

interface CollectionProduct {
  id: string;
  title: string;
  price: string;
  category?: string;
  subcategory?: string;
  badge?: string;
  gender?: string;
  fabric?: string;
  craft?: string;
  description?: string;
  image: string;
}

async function getCollectionProducts(slug: string, cat: Category | null): Promise<CollectionProduct[]> {
  try {
    const dbRows = await sql`
      SELECT p.id, p.title, p.price, p.category, p.subcategory, p.badge, p.gender, p.occasion, p.fabric, p.craft, p.description,
             COALESCE(
               (SELECT json_agg(pi.image_url ORDER BY pi.id ASC) FROM product_images pi WHERE pi.product_id = p.id AND (pi.image_type = 'showcase' OR pi.image_type IS NULL)),
               '[]'::json
             ) as images
      FROM products p
      WHERE p.deleted_at IS NULL
      ORDER BY p.created_at DESC
    `;

    const activeList = dbRows && dbRows.length > 0 ? dbRows : (defaultProducts as any[]);

    const isAll = slug.toLowerCase() === "all";
    const targetKey = (cat?.key || slug).toLowerCase();
    const targetTitle = (cat?.title || "").toLowerCase();
    const normalizedSlug = slug.toLowerCase().replace(/-/g, " ");

    const matched = isAll
      ? activeList
      : activeList.filter((item: any) => {
          const c = (item.category || "").toLowerCase();
          const s = (item.subcategory || "").toLowerCase();
          const t = (item.title || "").toLowerCase();
          return (
            c === targetKey ||
            c === targetTitle ||
            c === normalizedSlug ||
            c.includes(targetKey) ||
            targetTitle.includes(c) ||
            s === targetKey ||
            s.includes(targetKey) ||
            t.includes(targetKey) ||
            t.includes(targetTitle)
          );
        });

    return matched.map((item: any) => {
      const rawImgs = Array.isArray(item.images) ? item.images : [];
      const primary = rawImgs[0] || "/crop_green.png";
      return {
        id: item.id,
        title: item.title,
        price: item.price || "Haute Couture",
        category: item.category || cat?.title || "Bespoke",
        subcategory: item.subcategory || "",
        badge: item.badge || item.category || "Bespoke",
        gender: item.gender || "Women",
        fabric: item.fabric || "",
        craft: item.craft || "",
        description: item.description || "",
        image: primary,
      };
    });
  } catch (err) {
    console.error("Error fetching collection products:", err);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryByKey(slug);
  const title = cat ? `${cat.title} Collection | De Flores Haute Couture` : "Collection | De Flores";
  const desc = cat?.description || `Explore luxury bespoke ${slug.replace(/-/g, " ")} at De Flores Cochin atelier.`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: cat?.image ? [{ url: cat.image }] : [],
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [cat, allCategories] = await Promise.all([
    getCategoryByKey(slug),
    getCategories(),
  ]);

  const products = await getCollectionProducts(slug, cat);
  const displayName = cat?.title || slug.replace(/-/g, " ");
  const subcategories = cat && Array.isArray(cat.subcategories) ? cat.subcategories : [];

  return (
    <>
      <Nav categories={allCategories} />
      <main className="min-h-screen bg-paper text-ink pb-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 min-[900px]:px-12 pt-4 sm:pt-6 pb-2">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-grey">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/collections/all" className="hover:text-ink transition-colors">
              Collections
            </Link>
            <span>/</span>
            <span className="text-ink font-semibold">{displayName}</span>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 min-[900px]:px-12 space-y-12">
          <div className="border-b border-line pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-grey block mb-1">
                {cat?.tag || "ATELIER ARCHIVE & RUNWAY PIECES"} {cat?.num ? `• NO. ${cat.num}` : ""}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-ink">
                {displayName} Creations {products.length > 0 ? `(${products.length})` : ""}
              </h1>
            </div>
            <span className="text-xs text-grey font-light">
              Bespoke made-to-measure tailoring & custom draping
            </span>
          </div>

          {products.length > 0 ? (
            <section aria-labelledby="collection-creations-heading" className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group border border-line bg-paper flex flex-col overflow-hidden hover:border-ink transition-all duration-300"
                  >
                    <div className="relative aspect-[9/16] w-full bg-phBg overflow-hidden border-b border-line">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized={typeof product.image === "string" && (product.image.startsWith("http") || product.image.startsWith("/uploads/"))}
                      />
                      <div className="absolute top-3 left-3 bg-paper/95 text-ink text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 border border-line backdrop-blur-xs">
                        {product.badge || product.category || "Bespoke"}
                      </div>
                    </div>

                    <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] tracking-widest uppercase text-grey">
                          <span>{product.gender || "Women"}</span>
                          {product.fabric && <span>{product.fabric}</span>}
                        </div>

                        <h3 className="font-serif text-lg font-normal text-ink group-hover:text-coral transition-colors line-clamp-1">
                          {product.title}
                        </h3>

                        {product.craft && (
                          <p className="text-[11px] text-grey font-light line-clamp-1">
                            {product.craft}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-line/60 flex items-center justify-between">
                        <span className="font-serif text-base text-ink font-normal">
                          {product.price}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-ink group-hover:text-coral transition-colors">
                          View Creation →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : subcategories.length === 0 ? (
            <div className="p-12 border border-line bg-white/50 text-center space-y-4">
              <span className="text-[10px] font-bold tracking-widest uppercase text-grey block">
                ATELIER ARCHIVE
              </span>
              <h3 className="text-xl font-serif font-normal text-ink">
                Atelier Collection Currently In Curation
              </h3>
              <p className="text-xs text-grey max-w-md mx-auto leading-relaxed font-light">
                Our bespoke tailoring team crafts individual commissions for {displayName}. Contact us to schedule an atelier preview or consultation in Cochin.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-4">
                <Link
                  href="/#bespoke"
                  className="inline-block bg-ink text-white hover:bg-coral text-[11px] uppercase tracking-[0.18em] font-medium px-6 py-3 transition-colors duration-200"
                >
                  Request Bespoke Commission
                </Link>
                <Link
                  href="/explore"
                  className="inline-block border border-line bg-paper text-ink hover:border-ink text-[11px] uppercase tracking-[0.18em] font-medium px-6 py-3 transition-colors duration-200"
                >
                  Explore All Creations
                </Link>
              </div>
            </div>
          ) : null}

          {subcategories.length > 0 && (
            <section aria-labelledby="subcategories-heading" className="space-y-8">
              <div className="border-b border-line pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-grey block mb-1">
                    CURATED SILHOUETTES & VARIATIONS
                  </span>
                  <h2 id="subcategories-heading" className="text-xl sm:text-2xl font-serif font-normal text-ink">
                    Sub-Categories ({subcategories.length})
                  </h2>
                </div>
                <span className="text-xs text-grey font-light">
                  Tailored to your bespoke fit and color palette
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subcategories.map((sub, sIdx) => (
                  <div
                    key={sIdx}
                    className="border border-line bg-white/70 p-6 flex flex-col justify-between gap-4 transition-all hover:border-zinc-400 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[9px] font-mono text-grey uppercase tracking-wider">
                        <span>STYLE #{sIdx + 1 < 10 ? `0${sIdx + 1}` : sIdx + 1}</span>
                        <span className="text-coral">BESPOKE</span>
                      </div>
                      {sub.image && (
                        <div className="relative w-full aspect-[4/3] overflow-hidden bg-zinc-100 my-2">
                          <Image
                            src={sub.image}
                            alt={sub.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      )}
                      <h3 className="text-base font-serif font-normal text-ink group-hover:text-coral transition-colors">
                        {sub.title}
                      </h3>
                      {sub.desc && (
                        <p className="text-xs text-grey leading-relaxed font-light">
                          {sub.desc}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-line/60 flex items-center justify-between">
                      <Link
                        href={`/#bespoke?category=${cat?.key || slug}&style=${encodeURIComponent(sub.title)}`}
                        className="text-[10px] uppercase tracking-widest font-bold text-ink group-hover:text-coral transition-colors"
                      >
                        Inquire Style →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="border border-line bg-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-[10px] font-bold tracking-widest uppercase text-coral">
                BESPOKE COMMISSION
              </span>
              <h3 className="text-2xl font-serif font-light text-ink">
                Desire a personalized {displayName}?
              </h3>
              <p className="text-xs text-grey leading-relaxed">
                Connect directly with our master drapers and artisans in Cochin to customize fabrics, hand-embroidery motifs, and measurements.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/#bespoke"
                className="bg-ink hover:bg-coral text-white text-[11px] uppercase tracking-[0.18em] font-medium px-6 py-3.5 transition-colors duration-200 select-none whitespace-nowrap"
              >
                Book Consultation
              </Link>
              <Link
                href="/"
                className="text-grey hover:text-ink text-[11px] uppercase tracking-[0.18em] font-medium transition-colors"
              >
                ← Return Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
