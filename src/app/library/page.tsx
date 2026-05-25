"use client";

import { useMemo, useState } from "react";
import { useStore, refresh } from "@/lib/state/store";
import { Button, EmptyState, Field, Input, Select } from "@/components/shared/ui";
import { PieceForm } from "@/components/library/PieceForm";
import { deletePiece, filterPieces, pieceRotation } from "@/lib/pieces";
import { PIECE_STATUSES, type Piece, type PieceStatus } from "@/lib/types";
import Link from "next/link";

export default function LibraryPage() {
  const { instruments, pieces, sessions } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Piece | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<PieceStatus | "all">("all");
  const [instrumentId, setInstrumentId] = useState<string>("");

  const filtered = useMemo(
    () => filterPieces(pieces, { query, status, instrumentId: instrumentId || undefined }),
    [pieces, query, status, instrumentId],
  );
  const rotation = useMemo(() => pieceRotation(pieces, sessions), [pieces, sessions]);
  const rotationById = useMemo(() => {
    const m = new Map(rotation.map((r) => [r.pieceId, r]));
    return m;
  }, [rotation]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Library</h1>
          <p className="text-sm text-[color:var(--muted)] mt-1">Pieces you're working on. {pieces.length} total.</p>
        </div>
        <Button variant="primary" onClick={() => { setEditing(null); setOpen(true); }}>+ Add piece</Button>
      </div>

      {pieces.length === 0 ? (
        <EmptyState
          title="No pieces yet"
          description="Add the first piece you're learning, polishing, or maintaining."
          action={<Button variant="primary" onClick={() => { setEditing(null); setOpen(true); }}>Add piece</Button>}
        />
      ) : (
        <>
          <div className="card p-4 grid sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
            <Field label="Search">
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Title or composer..." />
            </Field>
            <Field label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value as PieceStatus | "all")}>
                <option value="all">all</option>
                {PIECE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Instrument">
              <Select value={instrumentId} onChange={(e) => setInstrumentId(e.target.value)}>
                <option value="">all</option>
                {instruments.map((i) => <option key={i.id} value={i.id}>{i.emoji} {i.name}</option>)}
              </Select>
            </Field>
          </div>

          {filtered.length === 0 ? (
            <div className="card p-8 text-center text-sm text-[color:var(--muted)]">No pieces match those filters.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => {
                const ins = instruments.find((i) => i.id === p.instrumentId);
                const r = rotationById.get(p.id);
                return (
                  <div key={p.id} className="card card-hover p-5 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link href={`/library/${p.id}`} className="text-lg font-semibold leading-snug hover:text-[color:var(--accent)] block truncate">
                          {p.title}
                        </Link>
                        <div className="text-xs text-[color:var(--muted)] mt-0.5 truncate">
                          {p.composer || "—"}{ins ? ` · ${ins.emoji} ${ins.name}` : ""}
                        </div>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-xs text-[color:var(--muted)]">
                      <span>{"●".repeat(p.difficulty)}<span className="opacity-40">{"○".repeat(5 - p.difficulty)}</span></span>
                      {p.key && <span>· {p.key}</span>}
                      {p.tempoTarget && <span>· ♩ {p.tempoTarget}</span>}
                    </div>
                    <div className="mt-4 pt-4 divider flex items-center justify-between">
                      <div className="text-xs text-[color:var(--muted)]">
                        {r ? (
                          <>
                            <span className="text-[color:var(--text)] font-semibold tabular-nums">{r.totalMinutes}</span> min ·{" "}
                            {r.daysSincePracticed === null ? "never practised" : r.daysSincePracticed === 0 ? "today" : `${r.daysSincePracticed}d ago`}
                          </>
                        ) : "—"}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(p); setOpen(true); }} className="text-xs text-[color:var(--muted)] hover:text-[color:var(--accent)]">edit</button>
                        <button
                          onClick={async () => {
                            if (confirm(`Delete "${p.title}"? Sessions remain.`)) {
                              await deletePiece(p.id);
                              await refresh();
                            }
                          }}
                          className="text-xs text-[color:var(--muted)] hover:text-[color:var(--rose)]"
                        >
                          delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <PieceForm open={open} onClose={() => setOpen(false)} initial={editing} instruments={instruments} />
    </div>
  );
}

function StatusBadge({ status }: { status: PieceStatus }) {
  const tone = status === "shelved" ? "muted" : status === "polishing" ? "accent" : status === "maintenance" ? "muted" : "rose";
  return <span className={`badge ${tone === "muted" ? "badge-muted" : tone === "rose" ? "badge-rose" : ""}`}>{status}</span>;
}
