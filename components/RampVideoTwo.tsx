import Placeholder from "./Placeholder";

export default function RampVideoTwo() {
  return (
    <section
      aria-labelledby="ramp-two-heading"
      className="w-full py-12 sm:py-16 min-[900px]:py-24 border-t border-line"
    >
      <div className="max-w-[1280px] mx-auto px-6 min-[900px]:px-12 mb-8 text-center flex flex-col items-center gap-3">
        <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-grey">
          SECOND LOOK
        </span>
        <h2
          id="ramp-two-heading"
          className="text-[clamp(28px,4vw,48px)] font-serif font-normal text-ink"
        >
          The runway, again.
        </h2>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 min-[900px]:px-12 flex justify-center">
        <div className="w-full max-w-[420px] max-h-[80vh] overflow-hidden flex items-center justify-center">
          <Placeholder ratio="9/16" video={true} className="w-full" />
        </div>
      </div>
    </section>
  );
}
