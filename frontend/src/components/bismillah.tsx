import { cn } from "@/lib/utils";

const BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ";

/**
 * The opening invocation. `hero` sets it large as a page-opening statement;
 * `surah` renders the quieter header shown above a surah's verses.
 */
export function Bismillah({
  variant = "surah",
  className,
}: {
  variant?: "hero" | "surah";
  className?: string;
}) {
  return (
    <p
      dir="rtl"
      lang="ar"
      className={cn(
        "quran-arabic text-center text-gold",
        variant === "hero"
          ? "text-4xl sm:text-5xl md:text-6xl"
          : "text-2xl sm:text-3xl",
        className,
      )}
    >
      {BISMILLAH}
    </p>
  );
}
