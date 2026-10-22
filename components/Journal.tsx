import Link from "next/link";
import Placeholder from "./Placeholder";

interface Article {
  eyebrow: string;
  title: string;
  excerpt: string;
  slug: string;
}

const defaultArticles: Article[] = [
  {
    eyebrow: "CRAFT",
    title: "The Art of Hand Zardozi",
    excerpt: "Why machine embroidery can never replicate the human hand.",
    slug: "the-art-of-hand-zardozi",
  },
  {
    eyebrow: "STYLING",
    title: "Choosing Your Bridal Palette",
    excerpt: "How to select colors that photograph beautifully under Indian wedding lighting.",
    slug: "choosing-your-bridal-palette",
  },
  {
    eyebrow: "HERITAGE",
    title: "The Revival of Kanchipuram",
    excerpt: "Sourcing authentic pure-zari silks directly from weaver cooperatives.",
    slug: "the-revival-of-kanchipuram",
  },
];

interface JournalProps {
  eyebrow?: string;
  headline?: string;
  link_text?: string;
  link_href?: string;
}

export default function Journal({
  eyebrow = "THE JOURNAL",
  headline = "Notes from the Atelier.",
  link_text = "Read All Stories →",
  link_href = "/explore",
}: JournalProps) {
  return (
    <section
      aria-labelledby="journal-heading"
      className="w-full py-12 sm:py-16 min-[900px]:py-24 border-t border-line"
    >
      <div className="max-w-[1280px] mx-auto px-6 min-[900px]:px-12 flex flex-col gap-8 sm:gap-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey">
              {eyebrow}
            </span>
            <h2
              id="journal-heading"
              className="font-serif text-[clamp(28px,4vw,44px)] font-normal text-ink leading-tight"
            >
              {headline}
            </h2>
          </div>
          <Link
            href={link_href}
            className="text-[12px] uppercase tracking-[0.18em] font-medium text-ink hover:text-coral transition-colors duration-200 inline-flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
          >
            {link_text}
          </Link>
        </div>

        <div className="grid grid-cols-1 min-[900px]:grid-cols-3 gap-8 sm:gap-10">
          {defaultArticles.map((article) => (
            <Link
              key={article.slug}
              href={link_href}
              className="flex flex-col gap-4 group cursor-pointer"
            >
              <div className="overflow-hidden bg-phBg border border-line">
                <Placeholder
                  ratio="16/9"
                  label="ARTICLE"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-coral">
                  {article.eyebrow}
                </span>
                <h3 className="font-serif text-[20px] sm:text-[22px] text-ink leading-snug group-hover:text-coral transition-colors duration-200">
                  {article.title}
                </h3>
                <p className="text-[14px] text-grey leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
