import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getSurah, getSurahAyahs, type Surah } from "@/lib/api/client";
import { AyahList } from "@/components/ayah-list";
import { Bismillah } from "@/components/bismillah";
import { RevelationTag } from "@/components/revelation-tag";

type Params = { identifier: string };

export function generateStaticParams(): Params[] {
  return Array.from({ length: 114 }, (_, i) => ({ identifier: String(i + 1) }));
}

async function loadSurah(identifier: string): Promise<Surah | null> {
  try {
    return await getSurah(identifier);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { identifier } = await params;
  const surah = await loadSurah(identifier);
  if (!surah) return { title: "Surah not found" };
  return {
    title: `${surah.number}. ${surah.nameEnglish}`,
    description: `Read Surah ${surah.nameEnglish} (${surah.nameArabic}) — ${surah.ayahCount} verses in Arabic with Urdu translation.`,
  };
}

export default async function SurahPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { identifier } = await params;
  const surah = await loadSurah(identifier);
  if (!surah) notFound();

  const ayahs = await getSurahAyahs(surah.number);
  const prev = surah.number > 1 ? surah.number - 1 : null;
  const next = surah.number < 114 ? surah.number + 1 : null;

  return (
    <main className="mx-auto max-w-2xl px-4 pb-24 sm:px-6">
      <header className="border-b border-border/70 pt-12 pb-8 text-center">
        <p className="font-display text-xs tracking-[0.3em] text-muted-foreground uppercase">
          Surah {surah.number}
        </p>
        <h1
          dir="rtl"
          lang="ar"
          className="quran-arabic mt-3 text-5xl text-foreground sm:text-6xl"
        >
          {surah.nameArabic}
        </h1>
        <p className="mt-2 font-display text-xl tracking-wide text-foreground">
          {surah.nameEnglish}
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <RevelationTag place={surah.revelationPlace} />
          <span aria-hidden>·</span>
          <span>{surah.ayahCount} verses</span>
          <span aria-hidden>·</span>
          <span>{surah.rukuCount} ruku</span>
        </div>
      </header>

      {surah.bismillahPrefix && (
        <Bismillah variant="surah" className="pt-10 pb-2" />
      )}

      <AyahList ayahs={ayahs} />

      <nav
        className="mt-8 flex items-center justify-between gap-3 border-t border-border/70 pt-6 font-heading text-sm"
        aria-label="Surah navigation"
      >
        {prev ? (
          <Link
            href={`/surah/${prev}`}
            className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-gold"
          >
            <ChevronLeft className="size-4" /> Surah {prev}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/surah/${next}`}
            className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-gold"
          >
            Surah {next} <ChevronRight className="size-4" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
