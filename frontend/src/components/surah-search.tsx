"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Surah } from "@/lib/api/client";
import { Input } from "@/components/ui/input";
import { SurahCard } from "@/components/surah-card";

/** The 114-surah index with client-side filtering by name or number. */
export function SurahSearch({ surahs }: { surahs: Surah[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return surahs;
    return surahs.filter(
      (s) =>
        s.nameEnglish.toLowerCase().includes(q) ||
        s.nameArabic.includes(q) ||
        String(s.number) === q,
    );
  }, [query, surahs]);

  return (
    <div>
      <div className="relative mx-auto max-w-md">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or number…"
          aria-label="Search surahs"
          className="pl-9"
        />
      </div>

      {results.length === 0 ? (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          No surah matches &ldquo;{query}&rdquo;. Try a name like
          &ldquo;Baqara&rdquo; or a number from 1 to 114.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
          {results.map((surah) => (
            <SurahCard key={surah.uci} surah={surah} />
          ))}
        </div>
      )}
    </div>
  );
}
