"use client";

import type { SplitSlice } from "@/lib/stats";

export function BarChart({
  data,
  height = 140,
  format,
}: {
  data: { label: string; value: number }[];
  height?: number;
  format?: (n: number) => string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((d, i) => {
        const h = d.value === 0 ? 2 : Math.max(4, Math.round((d.value / max) * (height - 18)));
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <div
              className="w-full rounded-sm transition-all"
              style={{
                height: `${h}px`,
                background: d.value === 0
                  ? "color-mix(in oklab, var(--muted) 16%, transparent)"
                  : "var(--accent)",
              }}
              title={format ? format(d.value) : String(d.value)}
            />
            <div className="text-[9px] text-[color:var(--muted)] truncate w-full text-center">{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

const PIE_COLORS = ["#f59e0b", "#ea580c", "#f43f5e", "#d97706", "#b45309", "#9a3412", "#7c2d12"];

export function PieChart({ slices, labelFor }: { slices: SplitSlice[]; labelFor?: (k: string) => string }) {
  const total = slices.reduce((a, s) => a + s.minutes, 0);
  if (total === 0) {
    return <div className="text-sm text-[color:var(--muted)]">No data yet.</div>;
  }
  let cumulative = 0;
  const gradients = slices.map((s, i) => {
    const start = (cumulative / total) * 360;
    cumulative += s.minutes;
    const end = (cumulative / total) * 360;
    const color = PIE_COLORS[i % PIE_COLORS.length];
    return `${color} ${start}deg ${end}deg`;
  });
  return (
    <div className="flex items-center gap-5 flex-wrap">
      <div
        className="rounded-full shrink-0"
        style={{
          width: 120,
          height: 120,
          background: `conic-gradient(${gradients.join(", ")})`,
          maskImage: "radial-gradient(circle, transparent 38px, #000 39px)",
          WebkitMaskImage: "radial-gradient(circle, transparent 38px, #000 39px)",
        }}
      />
      <ul className="space-y-1 text-sm">
        {slices.map((s, i) => {
          const pct = total === 0 ? 0 : Math.round((s.minutes / total) * 100);
          return (
            <li key={s.key} className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-sm" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
              <span className="text-[color:var(--text)] capitalize">{labelFor ? labelFor(s.key) : s.key}</span>
              <span className="text-[color:var(--muted)] text-xs">· {s.minutes}m ({pct}%)</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
