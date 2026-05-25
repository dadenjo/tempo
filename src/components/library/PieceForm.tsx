"use client";

import { useState } from "react";
import { Button, Field, Input, Modal, Select, Textarea } from "@/components/shared/ui";
import { PIECE_STATUSES, type Instrument, type Piece, type PieceStatus } from "@/lib/types";
import { createPiece, updatePiece } from "@/lib/pieces";
import { refresh } from "@/lib/state/store";

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: Piece | null;
  instruments: Instrument[];
}

export function PieceForm({ open, onClose, initial, instruments }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [composer, setComposer] = useState(initial?.composer ?? "");
  const [instrumentId, setInstrumentId] = useState(initial?.instrumentId ?? "");
  const [difficulty, setDifficulty] = useState<number>(initial?.difficulty ?? 3);
  const [status, setStatus] = useState<PieceStatus>(initial?.status ?? "learning");
  const [key, setKey] = useState(initial?.key ?? "");
  const [tempoTarget, setTempoTarget] = useState<string>(initial?.tempoTarget?.toString() ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        composer: composer.trim(),
        instrumentId: instrumentId || null,
        difficulty: Math.min(5, Math.max(1, Math.round(difficulty))) as 1 | 2 | 3 | 4 | 5,
        status,
        key,
        tempoTarget: tempoTarget ? Number(tempoTarget) : null,
        notes,
      };
      if (initial) await updatePiece(initial.id, payload);
      else await createPiece(payload);
      await refresh();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Edit piece" : "Add piece"}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={!title.trim() || saving}>Save</Button>
        </>
      }
    >
      <Field label="Title">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus placeholder="e.g. Prelude in C" />
      </Field>
      <Field label="Composer">
        <Input value={composer} onChange={(e) => setComposer(e.target.value)} placeholder="optional" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Instrument">
          <Select value={instrumentId} onChange={(e) => setInstrumentId(e.target.value)}>
            <option value="">— any —</option>
            {instruments.map((i) => (
              <option key={i.id} value={i.id}>{i.emoji} {i.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={status} onChange={(e) => setStatus(e.target.value as PieceStatus)}>
            {PIECE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Difficulty (1–5)">
          <Input type="number" min={1} max={5} value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))} />
        </Field>
        <Field label="Key">
          <Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="C, A min..." />
        </Field>
        <Field label="Target BPM">
          <Input type="number" min={20} max={300} value={tempoTarget} onChange={(e) => setTempoTarget(e.target.value)} placeholder="optional" />
        </Field>
      </div>
      <Field label="Notes">
        <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What are you working on with this piece?" />
      </Field>
    </Modal>
  );
}
