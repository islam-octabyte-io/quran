"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Surahs", match: (p: string) => p === "/" || p.startsWith("/surah") },
  { href: "/juz", label: "Juz", match: (p: string) => p.startsWith("/juz") },
  { href: "/hizb", label: "Hizb", match: (p: string) => p.startsWith("/hizb") },
] as const;

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 text-sm" aria-label="Primary">
      {LINKS.map((link) => {
        const active = link.match(pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative rounded-full px-3 py-1.5 font-heading tracking-wide transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {link.label}
            {active && (
              <span className="absolute inset-x-3 -bottom-px h-px bg-gold" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
