"use client";

/**
 * @amber-capability tempo.goals
 * @amber-doc Goal creation and live evaluation for three goal types (weekly-minutes, instrument-frequency, piece-ready-by), with on-track/behind/missed status computed by evaluateGoal against the current session history.
 */

import { useState } from "react";
import { Button, Field, Input, Modal, Select } from "@/components/shared/ui";
import { createGoal } from "@/lib/goals";
import { refresh } from "@/lib/state/store";
import type { GoalType, Instrument, Piece } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  instruments: Instrument[];
  pieces: Piece[];
}

export function GoalForm({ open, onClose, instruments, pieces }: Props) {
  const [type, setType] = useState<GoalType>("weekly-minutes");
  const [title, setTitle] = useState("");
  const [targetMinutes, setTargetMinutes] = useState("150");
  const [pieceId, setPieceId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [instrumentId, setInstrumentId] = useState("");
  const [perWeek, setPerWeek] = useState("3");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const safeTitle = title.trim() || autoTitle(type, { targetMinutes, perWeek, pieces, pieceId, instruments, instrumentId, dueDate });
      await createGoal({
        type,
        title: safeTitle,
        targetMinutes: type === "weekly-minutes" ? Number(targetMinutes) : undefined,
        pieceId: type === "piece-ready-by" ? pieceId : undefined,
        dueDate: type === "piece-ready-by" ? dueDate : undefined,
        instrumentId: type === "instrument-frequency" ? instrumentId : undefined,
        perWeek: type === "instrument-frequency" ? Number(perWeek) : undefined,
      });
      await refresh();
      onClose();
      setTitle("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add goal"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={saving}>Save</Button>
        </>
      }
    >
      <Field label="Type">
        <Select value={type} onChange={(e) => setType(e.target.value as GoalType)}>
          <option value="weekly-minutes">Weekly minutes</option>
          <option value="piece-ready-by">Piece ready by date</option>
          <option value="instrument-frequency">Practice instrument N×/week</option>
        </Select>
      </Field>
      <Field label="Title (optional)">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="auto-generated if blank" />
      </Field>
      {type === "weekly-minutes" && (
        <Field label="Target minutes per week">
          <Input type="number" min={1} value={targetMinutes} onChange={(e) => setTargetMinutes(e.target.value)} />
        </Field>
      )}
      {type === "piece-ready-by" && (
        <>
          <Field label="Piece">
            <Select value={pieceId} onChange={(e) => setPieceId(e.target.value)}>
              <option value="">— choose —</option>
              {pieces.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </Select>
          </Field>
          <Field label="Due date">
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </Field>
        </>
      )}
      {type === "instrument-frequency" && (
        <>
          <Field label="Instrument">
            <Select value={instrumentId} onChange={(e) => setInstrumentId(e.target.value)}>
              <option value="">— choose —</option>
              {instruments.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
            </Select>
          </Field>
          <Field label="Days per week">
            <Input type="number" min={1} max={7} value={perWeek} onChange={(e) => setPerWeek(e.target.value)} />
          </Field>
        </>
      )}
    </Modal>
  );
}

function autoTitle(
  type: GoalType,
  ctx: { targetMinutes: string; perWeek: string; pieces: Piece[]; pieceId: string; instruments: Instrument[]; instrumentId: string; dueDate: string },
): string {
  if (type === "weekly-minutes") return `${ctx.targetMinutes} min / week`;
  if (type === "piece-ready-by") {
    const p = ctx.pieces.find((x) => x.id === ctx.pieceId);
    return `${p?.title ?? "Piece"} ready by ${ctx.dueDate || "—"}`;
  }
  const i = ctx.instruments.find((x) => x.id === ctx.instrumentId);
  return `${i?.name ?? "Instrument"} ${ctx.perWeek}×/week`;
}
