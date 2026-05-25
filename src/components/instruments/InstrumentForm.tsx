"use client";

import { useState } from "react";
import { Button, Field, Input, Modal, Select } from "@/components/shared/ui";
import { INSTRUMENT_FAMILIES, type Instrument, type InstrumentFamily } from "@/lib/types";
import { createInstrument, defaultEmojiFor, updateInstrument } from "@/lib/instruments";
import { refresh } from "@/lib/state/store";

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: Instrument | null;
}

export function InstrumentForm({ open, onClose, initial }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [family, setFamily] = useState<InstrumentFamily>(initial?.family ?? "keyboard");
  const [emoji, setEmoji] = useState(initial?.emoji ?? defaultEmojiFor(initial?.family ?? "keyboard"));
  const [pickupDate, setPickupDate] = useState(initial?.pickupDate ?? "");
  const [primary, setPrimary] = useState(initial?.primary ?? false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (initial) {
        await updateInstrument(initial.id, {
          name: name.trim(),
          family,
          emoji,
          pickupDate: pickupDate || null,
          primary,
        });
      } else {
        await createInstrument({
          name: name.trim(),
          family,
          emoji,
          pickupDate: pickupDate || null,
          primary,
        });
      }
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
      title={initial ? "Edit instrument" : "Add instrument"}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={!name.trim() || saving}>Save</Button>
        </>
      }
    >
      <Field label="Name">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Upright Piano" autoFocus />
      </Field>
      <div className="grid grid-cols-[1fr_5rem] gap-3">
        <Field label="Family">
          <Select
            value={family}
            onChange={(e) => {
              const f = e.target.value as InstrumentFamily;
              setFamily(f);
              setEmoji(defaultEmojiFor(f));
            }}
          >
            {INSTRUMENT_FAMILIES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </Select>
        </Field>
        <Field label="Emoji">
          <Input value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={4} />
        </Field>
      </div>
      <Field label="Pickup date">
        <Input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
      </Field>
      <label className="flex items-center gap-2 text-sm pt-1">
        <input type="checkbox" checked={primary} onChange={(e) => setPrimary(e.target.checked)} />
        <span>Mark as primary (default on Today)</span>
      </label>
    </Modal>
  );
}
