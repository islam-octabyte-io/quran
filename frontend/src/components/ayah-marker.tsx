import { cn } from "@/lib/utils";
import { toArabicDigits } from "@/lib/quran";

/**
 * The signature element: a gold rosette that closes each verse, echoing the
 * illuminated ayah dividers of Quranic manuscripts. The verse number sits at
 * its center in Arabic-Indic numerals.
 */
export function AyahMarker({
  number,
  className,
}: {
  number: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center align-middle text-gold",
        className,
      )}
      style={{ width: "1.75em", height: "1.75em" }}
      role="img"
      aria-label={`Verse ${number}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        fill="none"
        aria-hidden
      >
        {/* Two overlapping squares form the eight-point rosette. */}
        <g
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
          opacity="0.55"
        >
          <rect x="26" y="26" width="48" height="48" rx="7" />
          <rect
            x="26"
            y="26"
            width="48"
            height="48"
            rx="7"
            transform="rotate(45 50 50)"
          />
        </g>
        <circle
          cx="50"
          cy="50"
          r="21"
          fill="var(--background)"
          stroke="currentColor"
          strokeWidth="2.5"
        />
      </svg>
      <span className="quran-arabic relative text-[0.6em] leading-none font-bold">
        {toArabicDigits(number)}
      </span>
    </span>
  );
}
