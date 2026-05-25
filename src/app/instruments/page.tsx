"use client";

import { useMemo, useState } from "react";
import { useStore, refresh } from "@/lib/state/store";
import { Button, EmptyState } from "@/components/shared/ui";
import { InstrumentForm } from "@/components/instruments/InstrumentForm";
import { deleteInstrument } from "@/lib/instruments";
import type { Instrument } from "@/lib/types";

export default function InstrumentsPage() {
  const { instruments, sessions } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Instrument | null>(null);

  const totalsByInstrument = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of sessions) m.set(s.instrumentId, (m.get(s.instrumentId) ?? 0) + s.durationSec);
    return m;
  }, [sessions]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Instruments</h1>
          <p className="text-sm text-[color:var(--muted)] mt-1">Your kit. Mark one as primary to make it the default on Today.</p>
        </div>
        <Button variant="primary" onClick={() => { setEditing(null); setOpen(true); }}>+ Add instrument</Button>
      </div>

      {instruments.length === 0 ? (
        <EmptyState
          title="No instruments yet"
          description="Add the first instrument you want to track."
          action={<Button variant="primary" onClick={() => { setEditing(null); setOpen(true); }}>Add instrument</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {instruments.map((ins) => {
            const totalMin = Math.round((totalsByInstrument.get(ins.id) ?? 0) / 60);
            return (
              <div key={ins.id} className="card card-hover p-5 flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="text-4xl" aria-hidden>{ins.emoji}</div>
                  {ins.primary && <span className="badge">primary</span>}
                </div>
                <div className="mt-3">
                  <div className="text-lg font-semibold">{ins.name}</div>
                  <div className="text-xs text-[color:var(--muted)] mt-0.5 capitalize">
                    {ins.family}{ins.pickupDate ? ` · since ${ins.pickupDate}` : ""}
                  </div>
                </div>
                <div className="mt-4 pt-4 divider flex items-center justify-between">
                  <div className="text-sm text-[color:var(--muted)]">
                    <span className="text-[color:var(--text)] font-semibold tabular-nums">{totalMin}</span> min logged
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditing(ins); setOpen(true); }}
                      className="text-xs text-[color:var(--muted)] hover:text-[color:var(--accent)]"
                    >
                      edit
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm(`Delete ${ins.name}? Sessions remain.`)) {
                          await deleteInstrument(ins.id);
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

      <InstrumentForm open={open} onClose={() => setOpen(false)} initial={editing} />
    </div>
  );
}
