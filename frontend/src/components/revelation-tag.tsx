import { Badge } from "@/components/ui/badge";

/**
 * Where a surah was revealed. Meccan surahs carry a gold marker, Medinan a
 * lapis one — the two illumination colors doing quiet double duty as a key.
 */
export function RevelationTag({
  place,
}: {
  place: "meccan" | "medinan";
}) {
  const meccan = place === "meccan";
  return (
    <Badge variant={meccan ? "gold" : "lapis"}>
      <span
        aria-hidden
        className={`size-1.5 rounded-full ${meccan ? "bg-gold" : "bg-primary"}`}
      />
      {meccan ? "Meccan" : "Medinan"}
    </Badge>
  );
}
