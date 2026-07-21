import Link from "next/link";
import type { Surah } from "@/lib/api/client";
import { RevelationTag } from "@/components/revelation-tag";
import { toArabicDigits } from "@/lib/quran";

/** A single surah in the index grid: number medallion, names, and meta. */
export function SurahCard({ surah }: { surah: Surah }) {
  return (
    <Link
      href={`/surah/${surah.number}`}
      className="group flex items-center gap-4 rounded-xl border border-border bg-card/60 p-4 transition-colors hover:border-gold/60 hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {/* Shamsa medallion holding the surah number. */}
      <span className="relative grid size-12 shrink-0 place-items-center text-primary transition-colors group-hover:text-gold">
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
        <span className="relative font-heading text-sm">{surah.number}</span>
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="font-heading text-base leading-tight text-foreground">
          {surah.nameEnglish}
        </h3>
        <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
          <RevelationTag place={surah.revelationPlace} />
          <span aria-hidden>·</span>
          <span>{surah.ayahCount} verses</span>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <span
          dir="rtl"
          lang="ar"
          className="quran-arabic text-2xl leading-tight text-foreground"
        >
          {surah.nameArabic}
        </span>
        <span className="quran-arabic mt-0.5 block text-xs text-muted-foreground">
          {toArabicDigits(surah.number)}
        </span>
      </div>
    </Link>
  );
}
