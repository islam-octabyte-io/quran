import type { Metadata } from "next";
import { getHizbs } from "@/lib/api/client";
import { DivisionCard } from "@/components/division-card";

export const metadata: Metadata = {
  title: "Hizb",
  description: "Browse the Holy Quran by its 60 hizb (halves of a juz).",
};

export default async function HizbIndexPage() {
  const hizbs = await getHizbs();

  return (
    <main className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
      <header className="pt-14 pb-8 text-center">
        <h1 className="font-display text-3xl tracking-wide text-foreground">
          Browse by Hizb
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Each juz splits into two hizb, giving 60 shorter portions in all.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {hizbs.map((hizb) => (
          <DivisionCard
            key={hizb.uci}
            href={`/hizb/${hizb.number}`}
            kind="Hizb"
            number={hizb.number}
            meta={`Juz ${hizb.juzUci.replace(/\D/g, "")} · half ${hizb.numberInJuz}`}
          />
        ))}
      </div>
    </main>
  );
}
