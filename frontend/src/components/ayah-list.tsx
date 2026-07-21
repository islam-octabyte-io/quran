import type { Ayah } from "@/lib/api/client";
import { AyahMarker } from "@/components/ayah-marker";
import { toArabicDigits } from "@/lib/quran";
import { cn } from "@/lib/utils";

function arabicText(ayah: Ayah) {
  return ayah.texts.find((t) => t.type === "original");
}

function translationText(ayah: Ayah) {
  return ayah.texts.find((t) => t.type === "translation");
}

/**
 * Renders a run of verses: Arabic scripture closed by its gold rosette, with
 * the Urdu translation beneath. Reused by the surah, juz, and hizb readers.
 */
export function AyahList({ ayahs }: { ayahs: Ayah[] }) {
  return (
    <ol className="divide-y divide-border/70">
      {ayahs.map((ayah) => {
        const arabic = arabicText(ayah);
        const translation = translationText(ayah);
        return (
          <li
            key={ayah.uci}
            id={`v${ayah.numberInSurah}`}
            className="scroll-mt-20 py-7 transition-colors target:bg-accent/40"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="quran-arabic text-xs text-muted-foreground">
                {toArabicDigits(ayah.numberInSurah)}
              </span>
              {ayah.sajda && (
                <span className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-[color:var(--gold)]">
                  ۩ Sajda ({ayah.sajda})
                </span>
              )}
            </div>

            {arabic && (
              <p
                dir="rtl"
                lang="ar"
                className="quran-arabic text-2xl leading-[2.1] text-foreground sm:text-3xl"
              >
                {arabic.text}{" "}
                <AyahMarker number={ayah.numberInSurah} />
              </p>
            )}

            {translation && (
              <p
                dir="rtl"
                lang={translation.language}
                className={cn(
                  "quran-nastaliq mt-4 text-lg text-muted-foreground sm:text-xl",
                )}
              >
                {translation.text}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
