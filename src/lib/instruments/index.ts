/**
 * @amber-capability tempo.instruments
 * Multi-instrument management — CRUD plus a notion of a "primary" instrument
 * used as the default selection on the Today screen.
 */
import { getDB } from "@/lib/persistence/db";
import type { Instrument, InstrumentFamily } from "@/lib/types";
import { newId, nowIso } from "@/lib/util/id";

export interface CreateInstrumentInput {
  name: string;
  family: InstrumentFamily;
  emoji?: string;
  pickupDate?: string | null;
  primary?: boolean;
}

const DEFAULT_EMOJI: Record<InstrumentFamily, string> = {
  keyboard: "🎹",
  strings: "🎻",
  winds: "🎷",
  percussion: "🥁",
  electronic: "🎛️",
  voice: "🎤",
};

export function defaultEmojiFor(family: InstrumentFamily): string {
  return DEFAULT_EMOJI[family];
}

export async function listInstruments(): Promise<Instrument[]> {
  const db = await getDB();
  const all = await db.getAll("instruments");
  return all.sort((a, b) => {
    if (a.primary !== b.primary) return a.primary ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export async function getInstrument(id: string): Promise<Instrument | undefined> {
  const db = await getDB();
  return db.get("instruments", id);
}

export async function createInstrument(
  input: CreateInstrumentInput,
): Promise<Instrument> {
  const now = nowIso();
  const instrument: Instrument = {
    id: newId("ins"),
    name: input.name.trim(),
    family: input.family,
    emoji: (input.emoji || defaultEmojiFor(input.family)).trim(),
    pickupDate: input.pickupDate ?? null,
    primary: !!input.primary,
    createdAt: now,
    updatedAt: now,
  };
  const db = await getDB();
  if (instrument.primary) await clearPrimaryFlag(instrument.id);
  await db.put("instruments", instrument);
  return instrument;
}

export async function updateInstrument(
  id: string,
  patch: Partial<Omit<Instrument, "id" | "createdAt">>,
): Promise<Instrument | undefined> {
  const db = await getDB();
  const existing = await db.get("instruments", id);
  if (!existing) return undefined;
  if (patch.primary === true) await clearPrimaryFlag(id);
  const next: Instrument = {
    ...existing,
    ...patch,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: nowIso(),
  };
  await db.put("instruments", next);
  return next;
}

export async function deleteInstrument(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("instruments", id);
}

export async function getPrimaryInstrument(): Promise<Instrument | undefined> {
  const list = await listInstruments();
  return list.find((i) => i.primary) || list[0];
}

async function clearPrimaryFlag(exceptId: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("instruments", "readwrite");
  const all = await tx.store.getAll();
  for (const ins of all) {
    if (ins.id !== exceptId && ins.primary) {
      await tx.store.put({ ...ins, primary: false, updatedAt: nowIso() });
    }
  }
  await tx.done;
}
