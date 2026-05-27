"use client";

/**
 * @amber-capability tempo.stats
 */

import { useMemo } from "react";
import type { HeatmapCell } from "@/lib/stats";

interface Props { cells: HeatmapCell[] }

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function Heatmap({ cells }: Props) {
  // Arrange into 7-row columns, padding leading days so each column starts on Monday(=0).
  const columns = useMemo(() => {
    if (cells.length === 0) return [] as HeatmapCell[][];
    const first = cells[0]!;
    const firstDate = new Date(first.date);
    const day = firstDate.getDay(); // 0=Sun
    const offset = day === 0 ? 6 : day - 1;
    const padded: (HeatmapCell | null)[] = Array(offset).fill(null).concat(cells);
    const cols: (HeatmapCell | null)[][] = [];
    for (let i = 0; i < padded.length; i += 7) cols.push(padded.slice(i, i + 7));
    return cols;
  }, [cells]);

  const monthMarkers = useMemo(() => {
    const out: { col: number; label: string }[] = [];
    let prevMonth = -1;
    columns.forEach((col, idx) => {
      const firstReal = col.find((c) => c !== null) as HeatmapCell | undefined;
      if (!firstReal) return;
      const m = new Date(firstReal.date).getMonth();
      if (m !== prevMonth) {
        out.push({ col: idx, label: MONTH_LABELS[m] ?? "" });
        prevMonth = m;
      }
    });
    return out;
  }, [columns]);

  return (
    <div className="card p-5 scroll-x">
      <div className="min-w-max">
        <div className="flex gap-[3px] pl-7 mb-1 text-[10px] text-[color:var(--muted)]">
          {columns.map((_, i) => {
            const marker = monthMarkers.find((m) => m.col === i);
            return (
              <div key={i} style={{ width: 11 }}>
                {marker ? marker.label : ""}
              </div>
            );
          })}
        </div>
        <div className="flex gap-[3px]">
          <div className="flex flex-col gap-[3px] pr-2 text-[10px] text-[color:var(--muted)] justify-between" style={{ height: 11 * 7 + 6 * 3 }}>
            <span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span><span></span>
          </div>
          {columns.map((col, i) => (
            <div key={i} className="flex flex-col gap-[3px]">
              {col.map((cell, r) =>
                cell ? (
                  <div
                    key={r}
                    className="heatmap-cell"
                    data-level={cell.level}
                    title={`${cell.date}: ${cell.minutes} min`}
                  />
                ) : (
                  <div key={r} style={{ width: 11, height: 11 }} />
                ),
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-[color:var(--muted)]">
          less
          {[0, 1, 2, 3, 4].map((l) => (
            <div key={l} className="heatmap-cell" data-level={l} />
          ))}
          more
        </div>
      </div>
    </div>
  );
}
