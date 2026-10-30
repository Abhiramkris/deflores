import Image from "next/image";

interface Props {
  ratio: string;
  label?: string;
  video?: boolean;
  className?: string;
  src?: string;
  alt?: string;
  focalPoint?: string;
}

export default function Placeholder({
  ratio,
  label = "IMAGE",
  video = false,
  className = "",
  src = "",
  alt = "",
  focalPoint = "center",
}: Props) {
  const displayText = video ? "▶ RAMP WALK VIDEO" : label;
  const validSrc = typeof src === "string" && src.trim() !== "" && src !== "undefined" && src !== "null" ? src.trim() : "";

  if (validSrc) {
    return (
      <div
        style={{ aspectRatio: ratio }}
        className={`w-full overflow-hidden relative bg-phBg ${className}`}
      >
        <Image
          src={validSrc}
          alt={alt || label}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          style={{ objectPosition: focalPoint }}
          loading="lazy"
          className="object-cover select-none"
          unoptimized={validSrc.startsWith("/uploads/") || validSrc.startsWith("http")}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{ aspectRatio: ratio }}
      className={`w-full bg-phBg flex items-center justify-center select-none ${className}`}
    >
      <span className="text-[11px] uppercase tracking-[0.2em] text-grey font-medium text-center px-4">
        {displayText}
      </span>
    </div>
  );
}
