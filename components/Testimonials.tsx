import Image from "next/image";
import Link from "next/link";

export interface PatronItem {
  id?: string;
  quote: string;
  author: string;
  image?: string;
  title?: string;
  productId?: string;
}

interface TestimonialsProps {
  eyebrow?: string;
  title?: string;
  items?: PatronItem[];
}

const DEFAULT_PATRONS: PatronItem[] = [
  {
    quote: "“The fit was unreal — I didn't need a single alteration for my reception evening.”",
    author: "Meera K., Bridal Client",
    title: "Mint Sequin Lehenga",
    image: "/crop_green.png",
    productId: "1",
  },
  {
    quote: "“Every detail felt considered. It's the first time an outfit felt truly bespoke and mine.”",
    author: "Aditi R., Occasion Wear",
    title: "Ivory Embroidered Festive Chic",
    image: "/crop_white.png",
    productId: "2",
  },
  {
    quote: "“From initial consultation to final fitting, De Flores made the process feel completely effortless.”",
    author: "Priya S., Pret Collection",
    title: "Scarlet Draped Georgette Gown",
    image: "/crop_red.png",
    productId: "3",
  },
];

export default function Testimonials({
  eyebrow = "IN THEIR WORDS",
  title = "What our patrons say.",
  items,
}: TestimonialsProps) {
  const displayItems = items && items.length > 0 ? items : DEFAULT_PATRONS;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="w-full py-12 sm:py-16 min-[900px]:py-24 border-t border-line bg-paper"
    >
      <div className="max-w-[1280px] mx-auto px-6 min-[900px]:px-12 flex flex-col gap-12">
        <div className="flex flex-col items-start gap-3">
          <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey">
            {eyebrow}
          </span>
          <h2
            id="testimonials-heading"
            className="font-serif text-[clamp(28px,4vw,48px)] font-normal text-ink"
          >
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 min-[900px]:grid-cols-3 gap-8 min-[900px]:gap-10">
          {displayItems.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between gap-6 pt-6 min-[900px]:pt-0 border-t min-[900px]:border-t-0 min-[900px]:border-l border-line min-[900px]:first:border-l-0 min-[900px]:pl-8 min-[900px]:first:pl-0 group"
            >
              {item.image && (
                <div className="relative aspect-[9/16] w-full max-h-[360px] overflow-hidden border border-line bg-phBg">
                  <Image
                    src={item.image}
                    alt={item.title ? `${item.title} worn by ${item.author}` : "Patron creation"}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {item.productId && (
                    <Link
                      href={`/product/${item.productId}`}
                      className="absolute bottom-3 left-3 bg-paper/95 text-ink text-[9px] uppercase tracking-widest px-2.5 py-1 border border-line hover:bg-coral hover:text-white transition-colors"
                    >
                      View Dress →
                    </Link>
                  )}
                </div>
              )}

              <blockquote className="space-y-4">
                <p className="font-serif text-[clamp(17px,2vw,20px)] text-ink leading-[1.5] font-light">
                  {item.quote.startsWith("“") ? item.quote : `“${item.quote}”`}
                </p>
                <footer className="space-y-1">
                  <div className="text-[11px] uppercase tracking-[0.18em] font-medium text-ink">
                    — {item.author}
                  </div>
                  {item.title && (
                    <div className="text-[10px] uppercase tracking-[0.15em] font-light text-grey">
                      Attire: {item.title}
                    </div>
                  )}
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
