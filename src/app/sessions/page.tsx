"use client";

/**
 * @amber-capability tempo.sessions
 */

import { useMemo, useState } from "react";
import { useStore, refresh } from "@/lib/state/store";
import { Button, EmptyState, Field, Input, Select } from "@/components/shared/ui";
import { deleteSession } from "@/lib/sessions";
import { formatDuration, dayKey } from "@/lib/util/date";
import { SESSION_INTENTS, type SessionIntent } from "@/lib/types";

export default function SessionsPage() {
  const { sessions, instruments, pieces } = useStore();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [instrumentId, setInstrumentId] = useState("");
  const [pieceId, setPieceId] = useState("");
  const [intent, setIntent] = useState<SessionIntent | "">("");

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const d = dayKey(s.startedAt);
      if (from && d < from) return false;
      if (to && d > to) return false;
      if (instrumentId && s.instrumentId !== instrumentId) return false;
      if (pieceId && s.pieceId !== pieceId) return false;
      if (intent && s.intent !== intent) return false;
      return true;
    });
  }, [sessions, from, to, instrumentId, pieceId, intent]);

  const grouped = useMemo(() => {
    const m = new Map<string, typeof filtered>();
    for (const s of filtered) {
      const k = dayKey(s.startedAt);
      const arr = m.get(k) ?? [];
      arr.push(s);
      m.set(k, arr);
    }
    return Array.from(m.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Sessions</h1>
        <p className="text-sm text-[color:var(--muted)] mt-1">{sessions.length} total · {filtered.length} matching filters</p>
      </div>

      <div className="card p-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
        <Field label="From"><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></Field>
        <Field label="To"><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></Field>
        <Field label="Instrument">
          <Select value={instrumentId} onChange={(e) => setInstrumentId(e.target.value)}>
            <option value="">all</option>
            {instruments.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </Select>
        </Field>
        <Field label="Piece">
          <Select value={pieceId} onChange={(e) => setPieceId(e.target.value)}>
            <option value="">all</option>
            {pieces.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </Select>
        </Field>
        <Field label="Intent">
          <Select value={intent} onChange={(e) => setIntent(e.target.value as SessionIntent | "")}>
            <option value="">all</option>
            {SESSION_INTENTS.map((i) => <option key={i} value={i}>{i}</option>)}
          </Select>
        </Field>
      </div>

      {sessions.length === 0 ? (
        <EmptyState title="No sessions yet" description="Start a timer on the Today screen to record your first session." action={<a href="/" className="btn btn-primary">Go to Today</a>} />
      ) : filtered.length === 0 ? (
        <div className="card p-8 text-center text-sm text-[color:var(--muted)]">No sessions match your filters.</div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([day, list]) => {
            const sum = list.reduce((a, s) => a + s.durationSec, 0);
            return (
              <div key={day}>
                <div className="flex items-baseline justify-between mb-2 px-1">
                  <h3 className="text-sm font-semibold">{new Date(day).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</h3>
                  <span className="text-xs text-[color:var(--muted)]">{formatDuration(sum)} · {list.length} session{list.length === 1 ? "" : "s"}</span>
                </div>
                <div className="card divide-y divide-[color:var(--border)] overflow-hidden">
                  {list.map((s) => {
                    const ins = instruments.find((i) => i.id === s.instrumentId);
                    const pc = s.pieceId ? pieces.find((p) => p.id === s.pieceId) : null;
                    const time = new Date(s.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                    return (
                      <div key={s.id} className="p-4 flex items-center gap-4">
                        <span className="text-xl">{ins?.emoji ?? "🎵"}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {pc?.title ?? <span className="text-[color:var(--muted)]">Freeform</span>}
                            <span className="text-[color:var(--muted)] font-normal text-sm"> · {s.intent}</span>
                          </div>
                          <div className="text-xs text-[color:var(--muted)] mt-0.5">
                            {time} · {ins?.name ?? "—"}{s.tempo ? ` · ${s.tempo} BPM` : ""}
                          </div>
                          {s.note && <div className="text-sm mt-1 text-[color:var(--muted)]">“{s.note}”</div>}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold tabular-nums">{formatDuration(s.durationSec)}</div>
                          <button
                            onClick={async () => { await deleteSession(s.id); await refresh(); }}
                            className="text-xs text-[color:var(--muted)] hover:text-[color:var(--rose)] mt-1"
                          >
                            delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
