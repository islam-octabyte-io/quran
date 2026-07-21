import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getJuzAyahs } from "@/lib/api/client";
import { DivisionReader } from "@/components/division-reader";

type Params = { identifier: string };

export function generateStaticParams(): Params[] {
  return Array.from({ length: 30 }, (_, i) => ({ identifier: String(i + 1) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { identifier } = await params;
  return { title: `Juz ${identifier}` };
}

export default async function JuzPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { identifier } = await params;
  const number = Number(identifier);
  if (!Number.isInteger(number) || number < 1 || number > 30) notFound();

  let ayahs;
  try {
    ayahs = await getJuzAyahs(number);
  } catch {
    notFound();
  }

  return (
    <DivisionReader
      kind="Juz"
      number={number}
      ayahs={ayahs}
      prev={number > 1 ? { href: `/juz/${number - 1}`, label: `Juz ${number - 1}` } : null}
      next={number < 30 ? { href: `/juz/${number + 1}`, label: `Juz ${number + 1}` } : null}
    />
  );
}
