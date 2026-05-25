"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/state/store";
import { heatmapCells, instrumentSplit, intentSplit, timeOfDayHistogram, totalMinutes } from "@/lib/stats";
import { streakFromSessions } from "@/lib/sessions";
import { pieceRotation } from "@/lib/pieces";
import { Heatmap } from "@/components/stats/Heatmap";
import { BarChart, PieChart } from "@/components/stats/Charts";
import { EmptyState } from "@/components/shared/ui";
import Link from "next/link";

export default function StatsPage() {
  const { sessions, pieces, instruments } = useStore();

  const cells = useMemo(() => heatmapCells(sessions, new Date(), 365), [sessions]);
  const tod = useMemo(() => timeOfDayHistogram(sessions), [sessions]);
  const insSplit = useMemo(() => instrumentSplit(sessions), [sessions]);
  const intSplit = useMemo(() => intentSplit(sessions), [sessions]);
  const rotation = useMemo(() => pieceRotation(pieces, sessions), [pieces, sessions]);
  const streak = useMemo(() => streakFromSessions(sessions), [sessions]);
  const total = useMemo(() => totalMinutes(sessions), [sessions]);
  const activeDays = useMemo(() => new Set(cells.filter((c) => c.minutes > 0).map((c) => c.date)).size, [cells]);

  if (sessions.length === 0) {
    return (
      <EmptyState
        title="No data to chart yet"
        description="Log a few sessions on the Today screen and patterns will start to emerge here."
        action={<Link href="/" className="btn btn-primary">Go to Today</Link>}
      />
    );
  }

  const insLabel = (id: string) => instruments.find((i) => i.id === id)?.name ?? "—";

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Stats</h1>
        <p className="text-sm text-[color:var(--muted)] mt-1">A picture of how your practice is going.</p>
      </header>

      <div className="grid sm:grid-cols-4 gap-4">
        <Stat label="Current streak" value={`${streak.current} d`} />
        <Stat label="Longest streak" value={`${streak.longest} d`} />
        <Stat label="Active days (1y)" value={String(activeDays)} />
        <Stat label="Total practised" value={`${total} min`} />
      </div>

      <section>
        <h2 className="text-sm uppercase tracking-wider text-[color:var(--muted)] mb-3">Last 365 days</h2>
        <Heatmap cells={cells} />
      </section>

      <div className="grid lg:grid-cols-2 gap-5">
        <section className="card p-5">
          <h2 className="text-sm uppercase tracking-wider text-[color:var(--muted)] mb-3">Time of day</h2>
          <BarChart
            data={tod.map((v, h) => ({ label: h % 3 === 0 ? `${h}` : "", value: v }))}
            format={(n) => `${n} session${n === 1 ? "" : "s"}`}
          />
        </section>
        <section className="card p-5">
          <h2 className="text-sm uppercase tracking-wider text-[color:var(--muted)] mb-3">Intent split</h2>
          <PieChart slices={intSplit} />
        </section>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <section className="card p-5">
          <h2 className="text-sm uppercase tracking-wider text-[color:var(--muted)] mb-3">Instrument split</h2>
          <PieChart slices={insSplit} labelFor={insLabel} />
        </section>
        <section className="card p-5">
          <h2 className="text-sm uppercase tracking-wider text-[color:var(--muted)] mb-3">Pieces in rotation</h2>
          {rotation.length === 0 ? (
            <p className="text-sm text-[color:var(--muted)]">No active pieces.</p>
          ) : (
            <ul className="space-y-2">
              {rotation.slice(0, 8).map((r) => {
                const p = pieces.find((pp) => pp.id === r.pieceId);
                if (!p) return null;
                return (
                  <li key={r.pieceId} className="flex items-center justify-between gap-3">
                    <Link href={`/library/${p.id}`} className="text-sm truncate hover:text-[color:var(--accent)]">
                      {p.title}
                    </Link>
                    <span className={`text-xs ${r.neglected ? "text-[color:var(--rose)]" : "text-[color:var(--muted)]"}`}>
                      {r.totalMinutes}m · {r.daysSincePracticed === null ? "never" : `${r.daysSincePracticed}d ago`}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <div className="text-xs uppercase tracking-wider text-[color:var(--muted)] mb-1">{label}</div>
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}
