import Link from "next/link";
import { toArabicDigits } from "@/lib/quran";

/** A tile in a divisions index (juz, hizb, …). */
export function DivisionCard({
  href,
  kind,
  number,
  meta,
}: {
  href: string;
  kind: string;
  number: number;
  meta?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-border bg-card/60 p-4 transition-colors hover:border-gold/60 hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span className="relative grid size-11 shrink-0 place-items-center text-primary transition-colors group-hover:text-gold">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 size-full opacity-70"
          fill="none"
          aria-hidden
        >
          <g stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
            <rect x="22" y="22" width="56" height="56" rx="10" />
            <rect
              x="22"
              y="22"
              width="56"
              height="56"
              rx="10"
              transform="rotate(45 50 50)"
            />
          </g>
        </svg>
        <span className="relative font-heading text-sm">{number}</span>
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-heading text-sm text-foreground">
          {kind} {number}
        </h3>
        {meta && <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>}
      </div>
      <span className="quran-arabic text-lg text-muted-foreground">
        {toArabicDigits(number)}
      </span>
    </Link>
  );
}
