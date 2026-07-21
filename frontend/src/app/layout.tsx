import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Amiri,
  Marcellus,
  Noto_Nastaliq_Urdu,
} from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Amiri — a naskh typeface designed for setting Quranic text.
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

// Noto Nastaliq Urdu — the calligraphic script Urdu Qurans are traditionally set in.
const nastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-nastaliq-urdu",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

// Marcellus — an inscriptional roman for Latin display type.
const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Al-Qur'an — Read the Holy Quran",
    template: "%s · Al-Qur'an",
  },
  description:
    "Read the Holy Quran in Arabic with Urdu translation — browse all 114 surahs, or by juz and hizb.",
};

// Set the saved theme before paint to avoid a flash of the wrong mode.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} ${nastaliq.variable} ${marcellus.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-border/70 py-8 text-center">
          <p className="font-display text-sm tracking-wide text-foreground">
            Powered by{" "}
            <a
              href="https://octabyte.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline-offset-4 transition-colors hover:text-gold-bright hover:underline"
            >
              OctaByte
            </a>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Quran text &amp; translation from the{" "}
            <a
              href="https://tanzil.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Tanzil Project
            </a>{" "}
            (CC BY 3.0).
          </p>
        </footer>
      </body>
    </html>
  );
}
