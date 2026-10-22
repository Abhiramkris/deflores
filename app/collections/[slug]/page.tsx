import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "../../../components/Nav";
import Footer from "../../../components/Footer";
import { getCategoryByKey, getCategories } from "../../../lib/categories";

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

  const displayName = cat?.title || slug.replace(/-/g, " ");
  const subcategories = cat && Array.isArray(cat.subcategories) ? cat.subcategories : [];

  return (
    <>
      <Nav categories={allCategories} />
      <main className="min-h-screen bg-paper text-ink pb-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 min-[900px]:px-12 pt-8 pb-4">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-grey">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-grey">Collections</span>
            <span>/</span>
            <span className="text-ink font-semibold">{displayName}</span>
          </div>
        </div>

        {cat?.image ? (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 min-[900px]:px-12 mb-12">
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[480px] overflow-hidden bg-zinc-950 border border-line">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <div className="absolute inset-0 bg-black/45" />

              <div className="absolute inset-0 p-6 sm:p-10 md:p-14 flex flex-col justify-end text-white">
                <div className="flex items-center gap-3 mb-3">
                  {cat.tag && (
                    <span className="text-[9px] font-bold tracking-widest uppercase bg-white/20 text-white backdrop-blur-xs px-2.5 py-1">
                      {cat.tag}
                    </span>
                  )}
                  {cat.num && (
                    <span className="text-[10px] font-mono tracking-widest text-white/70">
                      NO. {cat.num}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-wide text-white mb-3">
                  {cat.title}
                </h1>

                {cat.description && (
                  <p className="max-w-2xl text-xs sm:text-sm text-white/90 leading-relaxed font-light tracking-wide">
                    {cat.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 min-[900px]:px-12 py-12 border-b border-line mb-12">
            <div className="flex items-center gap-3 mb-3">
              {cat?.tag && (
                <span className="text-[9px] font-bold tracking-widest uppercase bg-zinc-100 text-zinc-800 px-2.5 py-1">
                  {cat.tag}
                </span>
              )}
              {cat?.num && (
                <span className="text-[10px] font-mono tracking-widest text-grey">
                  NO. {cat.num}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-ink tracking-wide mb-4">
              {displayName}
            </h1>

            {cat?.description ? (
              <p className="max-w-2xl text-xs sm:text-sm text-grey leading-relaxed">
                {cat.description}
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-grey leading-relaxed">
                Bespoke luxury silhouettes curated by De Flores atelier.
              </p>
            )}
          </div>
        )}

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 min-[900px]:px-12 space-y-16">
          {subcategories.length > 0 ? (
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
          ) : (
            <div className="p-8 border border-line bg-white/50 text-center space-y-3">
              <h3 className="text-lg font-serif font-normal text-ink">
                Atelier Collection Currently In Curation
              </h3>
              <p className="text-xs text-grey max-w-md mx-auto leading-relaxed">
                Our bespoke tailoring team crafts individual commissions for this category. Contact us to schedule an atelier preview or consultation.
              </p>
            </div>
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
