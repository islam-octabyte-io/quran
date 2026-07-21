/** Render a number with Arabic-Indic numerals (٠١٢…), as used in manuscripts. */
export function toArabicDigits(n: number | string): string {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}

/** Strip the "QS"/"QJ"/… prefix from a UCI, leaving the numeric part. */
export function uciNumber(uci: string): number {
  return Number(uci.replace(/\D/g, ""));
}
