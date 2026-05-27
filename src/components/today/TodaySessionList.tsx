"use client";

/**
 * @amber-capability tempo.today
 * @amber-doc The home dashboard where musicians start a timed practice session, watch the running clock, save completed sessions, and view their current streak — composed from src/app/page.tsx and the TimerPanel, TodaySessionList, and StreakBadge components.
 */

import type { Instrument, Piece, Session } from "@/lib/types";
import { formatDuration } from "@/lib/util/date";
import { deleteSession } from "@/lib/sessions";
import { refresh } from "@/lib/state/store";

interface Props {
  sessions: Session[];
  instruments: Instrument[];
  pieces: Piece[];
}

export function TodaySessionList({ sessions, instruments, pieces }: Props) {
  if (sessions.length === 0) {
    return (
      <div className="card p-6 text-sm text-[color:var(--muted)]">
        No sessions yet today. Hit start — even five minutes counts.
      </div>
    );
  }
  return (
    <div className="card divide-y divide-[color:var(--border)] overflow-hidden">
      {sessions.map((s) => {
        const ins = instruments.find((i) => i.id === s.instrumentId);
        const pc = s.pieceId ? pieces.find((p) => p.id === s.pieceId) : undefined;
        const time = new Date(s.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        return (
          <div key={s.id} className="p-4 flex items-center gap-4">
            <span className="text-xl" aria-hidden>{ins?.emoji ?? "🎵"}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">
                {pc ? pc.title : <span className="text-[color:var(--muted)]">Freeform</span>}
                <span className="text-[color:var(--muted)] font-normal text-sm"> · {s.intent}</span>
              </div>
              <div className="text-xs text-[color:var(--muted)] mt-0.5">
                {time} · {ins?.name ?? "—"}
                {s.tempo ? ` · ${s.tempo} BPM` : ""}
              </div>
              {s.note && <div className="text-sm mt-1 text-[color:var(--muted)]">“{s.note}”</div>}
            </div>
            <div className="text-right">
              <div className="font-semibold tabular-nums">{formatDuration(s.durationSec)}</div>
              <button
                onClick={async () => {
                  await deleteSession(s.id);
                  await refresh();
                }}
                className="text-xs text-[color:var(--muted)] hover:text-[color:var(--rose)] mt-1"
              >
                delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
