import type { Metadata } from "next";
import { getJuzs } from "@/lib/api/client";
import { DivisionCard } from "@/components/division-card";

export const metadata: Metadata = {
  title: "Juz",
  description: "Browse the Holy Quran by its 30 juz (parts).",
};

export default async function JuzIndexPage() {
  const juzs = await getJuzs();

  return (
    <main className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
      <header className="pt-14 pb-8 text-center">
        <h1 className="font-display text-3xl tracking-wide text-foreground">
          Browse by Juz
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The Quran is divided into 30 juz of roughly equal length — one for
          each night of the month.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {juzs.map((juz) => (
          <DivisionCard
            key={juz.uci}
            href={`/juz/${juz.number}`}
            kind="Juz"
            number={juz.number}
            meta={`Verses ${juz.startAyahNumber}–${juz.endAyahNumber}`}
          />
        ))}
      </div>
    </main>
  );
}
