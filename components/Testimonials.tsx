export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "“The fit was unreal — I didn't need a single alteration.”",
      author: "Meera K., Bridal Client",
    },
    {
      quote:
        "“Every detail felt considered. It's the first time an outfit felt truly mine.”",
      author: "Aditi R., Occasion Wear",
    },
    {
      quote:
        "“From consultation to final fitting, De Flores made the process feel effortless.”",
      author: "Priya S., Pret Collection",
    },
  ];

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="w-full py-12 sm:py-16 min-[900px]:py-24 border-t border-line"
    >
      <div className="max-w-[1280px] mx-auto px-6 min-[900px]:px-12 flex flex-col gap-12">
        <div className="flex flex-col items-start gap-3">
          <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey">
            IN THEIR WORDS
          </span>
          <h2
            id="testimonials-heading"
            className="font-serif text-[clamp(28px,4vw,48px)] font-normal text-ink"
          >
            What our patrons say.
          </h2>
        </div>

        <div className="grid grid-cols-1 min-[900px]:grid-cols-3 gap-8 min-[900px]:gap-10">
          {testimonials.map((item, idx) => (
            <blockquote
              key={idx}
              className="flex flex-col justify-between gap-6 pt-6 min-[900px]:pt-0 border-t min-[900px]:border-t-0 min-[900px]:border-l border-line min-[900px]:first:border-l-0 min-[900px]:pl-8 min-[900px]:first:pl-0"
            >
              <p className="font-serif text-[clamp(18px,2.2vw,22px)] text-ink leading-[1.5]">
                {item.quote}
              </p>
              <footer className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey">
                — {item.author}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
