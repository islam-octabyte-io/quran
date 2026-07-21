import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getHizbAyahs } from "@/lib/api/client";
import { DivisionReader } from "@/components/division-reader";

type Params = { identifier: string };

export function generateStaticParams(): Params[] {
  return Array.from({ length: 60 }, (_, i) => ({ identifier: String(i + 1) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { identifier } = await params;
  return { title: `Hizb ${identifier}` };
}

export default async function HizbPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { identifier } = await params;
  const number = Number(identifier);
  if (!Number.isInteger(number) || number < 1 || number > 60) notFound();

  let ayahs;
  try {
    ayahs = await getHizbAyahs(number);
  } catch {
    notFound();
  }

  return (
    <DivisionReader
      kind="Hizb"
      number={number}
      ayahs={ayahs}
      prev={number > 1 ? { href: `/hizb/${number - 1}`, label: `Hizb ${number - 1}` } : null}
      next={number < 60 ? { href: `/hizb/${number + 1}`, label: `Hizb ${number + 1}` } : null}
    />
  );
}
