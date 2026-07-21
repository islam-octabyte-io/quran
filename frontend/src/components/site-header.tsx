import Link from "next/link";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2.5">
          <span
            className="quran-arabic text-2xl leading-none text-gold transition-colors group-hover:text-gold-bright"
            aria-hidden
          >
            القرآن
          </span>
          <span className="font-display text-lg tracking-[0.18em] text-foreground">
            AL&#8202;-&#8202;QUR&rsquo;AN
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <MainNav />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
