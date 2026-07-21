import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getSurahs, type Ayah } from "@/lib/api/client";
import { AyahList } from "@/components/ayah-list";
import { uciNumber } from "@/lib/quran";

type NavLink = { href: string; label: string } | null;

/**
 * Reader for a division (juz, hizb, …) whose verses cross surah boundaries.
 * Verses are grouped under their surah so the reader keeps their bearings.
 */
export async function DivisionReader({
  kind,
  number,
  ayahs,
  prev,
  next,
}: {
  kind: string;
  number: number;
  ayahs: Ayah[];
  prev: NavLink;
  next: NavLink;
}) {
  const surahs = await getSurahs();
  const nameByUci = new Map(surahs.map((s) => [s.uci, s]));

  // Preserve order while splitting into consecutive same-surah runs.
  const groups: { uci: string; ayahs: Ayah[] }[] = [];
  for (const ayah of ayahs) {
    const last = groups.at(-1);
    if (last && last.uci === ayah.surahUci) last.ayahs.push(ayah);
    else groups.push({ uci: ayah.surahUci, ayahs: [ayah] });
  }

  return (
    <main className="mx-auto max-w-2xl px-4 pb-24 sm:px-6">
      <header className="border-b border-border/70 pt-12 pb-8 text-center">
        <p className="font-display text-xs tracking-[0.3em] text-muted-foreground uppercase">
          {kind}
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-wide text-foreground">
          {kind} {number}
        </h1>
        <p className="mt-3 text-xs text-muted-foreground">
          {ayahs.length} verses across {groups.length}{" "}
          {groups.length === 1 ? "surah" : "surahs"}
        </p>
      </header>

      {groups.map((group) => {
        const surah = nameByUci.get(group.uci);
        const surahNumber = uciNumber(group.uci);
        return (
          <section key={group.uci}>
            <div className="flex items-center gap-3 pt-8 pb-1">
              <span className="h-px flex-1 bg-border" aria-hidden />
              <Link
                href={`/surah/${surahNumber}`}
                className="flex items-baseline gap-2 font-heading text-sm text-muted-foreground transition-colors hover:text-gold"
              >
                <span>{surah?.nameEnglish ?? `Surah ${surahNumber}`}</span>
                <span dir="rtl" lang="ar" className="quran-arabic text-lg">
                  {surah?.nameArabic}
                </span>
              </Link>
              <span className="h-px flex-1 bg-border" aria-hidden />
            </div>
            <AyahList ayahs={group.ayahs} />
          </section>
        );
      })}

      <nav
        className="mt-8 flex items-center justify-between gap-3 border-t border-border/70 pt-6 font-heading text-sm"
        aria-label={`${kind} navigation`}
      >
        {prev ? (
          <Link
            href={prev.href}
            className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-gold"
          >
            <ChevronLeft className="size-4" /> {prev.label}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={next.href}
            className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-gold"
          >
            {next.label} <ChevronRight className="size-4" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
