"use client";

/**
 * @amber-capability tempo.pieces
 * @amber-doc Browse and inspect the music piece repertoire: a list view with active/polishing/shelved status badges and a detail page aggregating per-piece session history, total practice time, and a 60-day activity breakdown.
 */

import { useMemo, use } from "react";
import { useStore } from "@/lib/state/store";
import { formatDuration, dayKey, rangeDays } from "@/lib/util/date";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default function PieceDetail({ params }: Props) {
  const { id } = use(params);
  const { pieces, instruments, sessions } = useStore();
  const piece = pieces.find((p) => p.id === id);
  const sessionsForPiece = useMemo(
    () => sessions.filter((s) => s.pieceId === id),
    [sessions, id],
  );
  const totalSec = sessionsForPiece.reduce((acc, s) => acc + s.durationSec, 0);

  const last60 = useMemo(() => {
    const totals = new Map<string, number>();
    for (const s of sessionsForPiece) {
      const k = dayKey(s.startedAt);
      totals.set(k, (totals.get(k) ?? 0) + s.durationSec);
    }
    const days = rangeDays(new Date(), 60);
    const max = Math.max(1, ...days.map((d) => totals.get(d) ?? 0));
    return days.map((d) => ({ d, sec: totals.get(d) ?? 0, max }));
  }, [sessionsForPiece]);

  if (!piece) {
    return (
      <div className="space-y-4">
        <Link href="/library" className="link text-sm">← Library</Link>
        <div className="card p-8 text-center text-sm text-[color:var(--muted)]">Piece not found.</div>
      </div>
    );
  }

  const ins = instruments.find((i) => i.id === piece.instrumentId);

  return (
    <div className="space-y-6">
      <Link href="/library" className="text-sm text-[color:var(--muted)] hover:text-[color:var(--accent)]">← Library</Link>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{piece.title}</h1>
          <div className="text-[color:var(--muted)] mt-1">
            {piece.composer || "—"}{ins ? ` · ${ins.emoji} ${ins.name}` : ""}
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <span className="badge">{piece.status}</span>
          {piece.key && <span className="badge badge-muted">{piece.key}</span>}
          {piece.tempoTarget && <span className="badge badge-muted">♩ {piece.tempoTarget}</span>}
        </div>
      </header>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Total practised" value={formatDuration(totalSec)} />
        <Stat label="Sessions" value={String(sessionsForPiece.length)} />
        <Stat label="Difficulty" value={"●".repeat(piece.difficulty) + "○".repeat(5 - piece.difficulty)} />
      </div>

      <section>
        <h2 className="text-sm uppercase tracking-wider text-[color:var(--muted)] mb-3">Last 60 days</h2>
        <div className="card p-5">
          <div className="flex items-end gap-[2px] h-32">
            {last60.map(({ d, sec, max }) => {
              const h = sec === 0 ? 2 : Math.max(4, Math.round((sec / max) * 120));
              return (
                <div
                  key={d}
                  title={`${d}: ${formatDuration(sec)}`}
                  className="flex-1 rounded-sm transition-colors"
                  style={{
                    height: `${h}px`,
                    background: sec === 0
                      ? "color-mix(in oklab, var(--muted) 14%, transparent)"
                      : "var(--accent)",
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>

      {piece.notes && (
        <section>
          <h2 className="text-sm uppercase tracking-wider text-[color:var(--muted)] mb-3">Notes</h2>
          <div className="card p-5 text-sm whitespace-pre-wrap">{piece.notes}</div>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <div className="text-xs uppercase tracking-wider text-[color:var(--muted)] mb-1">{label}</div>
      <div className="text-xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}
