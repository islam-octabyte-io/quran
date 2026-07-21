import createClient from "openapi-fetch";
import type { components, paths } from "./schema";

/**
 * Typed client for the Quran API. All reads run server-side (in Server
 * Components), so requests go server-to-server and the backend's lack of CORS
 * never comes into play.
 */
export const api = createClient<paths>({
  baseUrl: process.env.API_URL ?? "http://localhost:3001",
});

/** Both seeded editions: Arabic original + Urdu translation. */
export const DEFAULT_EDITIONS = "quran-simple,ur-kanzuliman";

export type Surah = components["schemas"]["SurahDto"];
export type Ayah = components["schemas"]["AyahWithTextDto"];
export type AyahText = Ayah["texts"][number];
export type Edition = components["schemas"]["EditionDto"];
export type Juz = components["schemas"]["JuzDto"];
export type Hizb = components["schemas"]["HizbDto"];

/** Thrown when the API responds with a non-2xx status. */
class ApiError extends Error {
  constructor(
    readonly status: number,
    resource: string,
  ) {
    super(`Quran API request for ${resource} failed (${status}).`);
    this.name = "ApiError";
  }
}

function unwrap<T>(
  resource: string,
  result: { data?: T; error?: unknown; response: Response },
): T {
  if (result.error !== undefined || result.data === undefined) {
    throw new ApiError(result.response.status, resource);
  }
  return result.data;
}

export async function getSurahs(): Promise<Surah[]> {
  return unwrap("surahs", await api.GET("/surahs"));
}

export async function getSurah(identifier: string | number): Promise<Surah> {
  return unwrap(
    `surah ${identifier}`,
    await api.GET("/surahs/{identifier}", {
      params: { path: { identifier: String(identifier) } },
    }),
  );
}

export async function getSurahAyahs(
  identifier: string | number,
  editions: string = DEFAULT_EDITIONS,
): Promise<Ayah[]> {
  return unwrap(
    `surah ${identifier} ayahs`,
    await api.GET("/surahs/{identifier}/ayahs", {
      params: {
        path: { identifier: String(identifier) },
        query: { edition: editions },
      },
    }),
  );
}

export async function getJuzs(): Promise<Juz[]> {
  return unwrap("juzs", await api.GET("/juzs"));
}

export async function getJuzAyahs(
  identifier: string | number,
  editions: string = DEFAULT_EDITIONS,
): Promise<Ayah[]> {
  return unwrap(
    `juz ${identifier} ayahs`,
    await api.GET("/juzs/{identifier}/ayahs", {
      params: {
        path: { identifier: String(identifier) },
        query: { edition: editions },
      },
    }),
  );
}

export async function getHizbs(): Promise<Hizb[]> {
  return unwrap("hizbs", await api.GET("/hizbs"));
}

export async function getHizbAyahs(
  identifier: string | number,
  editions: string = DEFAULT_EDITIONS,
): Promise<Ayah[]> {
  return unwrap(
    `hizb ${identifier} ayahs`,
    await api.GET("/hizbs/{identifier}/ayahs", {
      params: {
        path: { identifier: String(identifier) },
        query: { edition: editions },
      },
    }),
  );
}

/** Pull the text for one edition slug out of an ayah's texts array. */
export function textFor(ayah: Ayah, slug: string): AyahText | undefined {
  return ayah.texts.find((t) => t.edition === slug);
}
