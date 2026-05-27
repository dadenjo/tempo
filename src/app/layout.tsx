/**
 * @amber-capability tempo.today
 * @amber-doc The home dashboard where musicians start a timed practice session, watch the running clock, save completed sessions, and view their current streak — composed from src/app/page.tsx and the TimerPanel, TodaySessionList, and StreakBadge components.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/shared/Nav";
import { ThemeBoot } from "@/components/shared/ThemeBoot";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tempo — practice tracker",
  description: "A local-first practice tracker for hobby musicians.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <ThemeBoot />
      </head>
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1 mx-auto w-full max-w-6xl px-5 py-8">{children}</main>
        <footer className="mx-auto w-full max-w-6xl px-5 py-8 text-xs text-[color:var(--muted)]">
          Tempo · local-first · your data never leaves this browser.
        </footer>
      </body>
    </html>
  );
}
