"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Field, Input, Select, Textarea } from "@/components/shared/ui";
import { formatClock } from "@/lib/util/date";
import type { Instrument, Piece, SessionIntent } from "@/lib/types";
import { SESSION_INTENTS } from "@/lib/types";
import { createSession } from "@/lib/sessions";
import { refresh } from "@/lib/state/store";

type Phase = "idle" | "running" | "paused";

interface Props {
  instruments: Instrument[];
  pieces: Piece[];
  defaultInstrumentId: string | null;
}

export function TimerPanel({ instruments, pieces, defaultInstrumentId }: Props) {
  const [instrumentId, setInstrumentId] = useState<string>(defaultInstrumentId ?? instruments[0]?.id ?? "");
  const [pieceId, setPieceId] = useState<string>("");
  const [intent, setIntent] = useState<SessionIntent>("repertoire");
  const [tempo, setTempo] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const accRef = useRef(0); // accumulated seconds across pause cycles
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase === "running") {
      tickRef.current = setInterval(() => {
        const now = Date.now();
        const live = startRef.current ? Math.floor((now - startRef.current) / 1000) : 0;
        setElapsed(accRef.current + live);
      }, 500);
    } else if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [phase]);

  const piecesForInstrument = useMemo(
    () => pieces.filter((p) => !instrumentId || p.instrumentId === instrumentId || !p.instrumentId),
    [pieces, instrumentId],
  );

  const start = () => {
    if (!instrumentId) return;
    startRef.current = Date.now();
    accRef.current = 0;
    setElapsed(0);
    setPhase("running");
  };

  const pause = () => {
    if (startRef.current) {
      accRef.current += Math.floor((Date.now() - startRef.current) / 1000);
      startRef.current = null;
    }
    setPhase("paused");
  };

  const resume = () => {
    startRef.current = Date.now();
    setPhase("running");
  };

  const save = async () => {
    if (phase === "running" && startRef.current) {
      accRef.current += Math.floor((Date.now() - startRef.current) / 1000);
      startRef.current = null;
    }
    const seconds = accRef.current;
    if (seconds < 5) {
      reset();
      return;
    }
    const endedAt = new Date();
    const startedAt = new Date(endedAt.getTime() - seconds * 1000);
    await createSession({
      instrumentId,
      pieceId: pieceId || null,
      intent,
      tempo: tempo ? Number(tempo) : null,
      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
      note,
    });
    await refresh();
    reset();
  };

  const reset = () => {
    setPhase("idle");
    setElapsed(0);
    accRef.current = 0;
    startRef.current = null;
    setNote("");
  };

  const running = phase === "running";

  return (
    <div className="card p-6 relative overflow-hidden">
      <div className="grid md:grid-cols-[1fr_auto] gap-6 items-stretch">
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Instrument">
              <Select value={instrumentId} onChange={(e) => setInstrumentId(e.target.value)} disabled={running}>
                {instruments.length === 0 && <option value="">No instruments yet</option>}
                {instruments.map((i) => (
                  <option key={i.id} value={i.id}>{i.emoji} {i.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Piece">
              <Select value={pieceId} onChange={(e) => setPieceId(e.target.value)} disabled={running}>
                <option value="">— freeform —</option>
                {piecesForInstrument.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}{p.composer ? ` · ${p.composer}` : ""}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Intent">
              <Select value={intent} onChange={(e) => setIntent(e.target.value as SessionIntent)} disabled={running}>
                {SESSION_INTENTS.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </Select>
            </Field>
            <Field label="Tempo (BPM)">
              <Input
                type="number"
                inputMode="numeric"
                min={20}
                max={300}
                value={tempo}
                onChange={(e) => setTempo(e.target.value)}
                placeholder="optional"
                disabled={running}
              />
            </Field>
          </div>
          {phase !== "idle" && (
            <Field label="Reflection (saved with session)">
              <Textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What did you work on? What clicked?"
              />
            </Field>
          )}
        </div>

        <div className="flex flex-col items-center justify-center gap-4 min-w-[14rem]">
          <div
            className={`w-44 h-44 rounded-full flex items-center justify-center text-4xl font-semibold tabular-nums ${running ? "timer-pulse" : ""}`}
            style={{
              background: running
                ? "color-mix(in oklab, var(--accent) 22%, transparent)"
                : "color-mix(in oklab, var(--muted) 12%, transparent)",
              color: running ? "var(--accent)" : "var(--text)",
              border: `1px solid ${running ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            {formatClock(elapsed)}
          </div>
          <div className="flex gap-2">
            {phase === "idle" && (
              <Button variant="primary" onClick={start} disabled={!instrumentId}>
                ▶ Start
              </Button>
            )}
            {phase === "running" && (
              <>
                <Button onClick={pause}>⏸ Pause</Button>
                <Button variant="primary" onClick={save}>✓ Save</Button>
              </>
            )}
            {phase === "paused" && (
              <>
                <Button onClick={resume}>▶ Resume</Button>
                <Button variant="primary" onClick={save}>✓ Save</Button>
                <Button variant="danger" onClick={reset}>Discard</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
