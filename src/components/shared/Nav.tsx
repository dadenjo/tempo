"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Today" },
  { href: "/library", label: "Library" },
  { href: "/instruments", label: "Instruments" },
  { href: "/sessions", label: "Sessions" },
  { href: "/stats", label: "Stats" },
  { href: "/goals", label: "Goals" },
  { href: "/settings", label: "Settings" },
];

export function Nav() {
  const path = usePathname();
  return (
    <nav className="border-b border-[color:var(--border)] sticky top-0 z-40 backdrop-blur" style={{ background: "color-mix(in oklab, var(--bg) 80%, transparent)" }}>
      <div className="mx-auto max-w-6xl px-5 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span
            aria-hidden
            className="inline-block w-6 h-6 rounded-md"
            style={{
              background:
                "conic-gradient(from 210deg, var(--accent), var(--accent-strong), var(--rose), var(--accent))",
            }}
          />
          <span>Tempo</span>
        </Link>
        <div className="flex items-center gap-1 overflow-x-auto scroll-x">
          {LINKS.map((l) => {
            const active = l.href === "/" ? path === "/" : path === l.href || path.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 rounded-md text-sm transition-colors"
                style={{
                  color: active ? "var(--accent)" : "var(--text)",
                  background: active ? "color-mix(in oklab, var(--accent) 12%, transparent)" : "transparent",
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
