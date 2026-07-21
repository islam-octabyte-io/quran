import { getSurahs } from "@/lib/api/client";
import { Bismillah } from "@/components/bismillah";
import { SurahSearch } from "@/components/surah-search";

export default async function Home() {
  const surahs = await getSurahs();

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6">
      {/* Hero: the Bismillah as the page's opening statement. */}
      <section className="relative flex flex-col items-center pt-16 pb-14 text-center sm:pt-24 sm:pb-20">
        <div className="pointer-events-none absolute inset-x-0 top-8 mx-auto h-56 max-w-2xl rounded-t-[999px] border border-b-0 border-gold/25" />
        <p className="relative font-display text-xs tracking-[0.35em] text-muted-foreground uppercase">
          In the name of God
        </p>
        <Bismillah variant="hero" className="relative mt-6" />
        <div className="relative mt-8 flex items-center gap-3 text-muted-foreground">
          <span className="h-px w-8 bg-gold/50" aria-hidden />
          <p className="max-w-md text-sm sm:text-base">
            The Holy Quran — read all 114 surahs in Arabic, with the Urdu
            translation of Kanz&nbsp;ul&nbsp;Iman.
          </p>
          <span className="h-px w-8 bg-gold/50" aria-hidden />
        </div>
      </section>

      <section className="pb-20">
        <h2 className="sr-only">Surahs</h2>
        <SurahSearch surahs={surahs} />
      </section>
    </main>
  );
}
