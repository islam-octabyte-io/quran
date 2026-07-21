import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-md flex-col items-center px-6 py-32 text-center">
      <p className="quran-arabic text-5xl text-gold">۝</p>
      <h1 className="mt-6 font-display text-2xl tracking-wide text-foreground">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        That surah, juz, or hizb doesn&rsquo;t exist. Try browsing from the
        index.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full border border-gold/40 px-4 py-2 font-heading text-sm text-foreground transition-colors hover:bg-gold/10"
      >
        Back to the surahs
      </Link>
    </main>
  );
}
