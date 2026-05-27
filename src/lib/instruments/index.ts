/**
 * @file-summary
 * @capability tempo.instruments
 * @hash sha256-4fc67f04f697b4dc176640c1965bb2d433186683f370ca9c70e20a7ffef8cd0a
 * @generated 2026-05-26T21:17:39.640Z
 *
 * Provides CRUD operations for Instrument records stored in an IndexedDB 'instruments' object store accessed via getDB(). Supports a 'primary' flag where setting an instrument as primary clears the flag on all other instruments via a readwrite transaction. listInstruments sorts by primary-first then name; getPrimaryInstrument returns the primary or falls back to the first item. Also exposes a defaultEmojiFor mapping for six InstrumentFamily values.
 *
 * @exports CreateInstrumentInput, defaultEmojiFor, listInstruments, getInstrument, createInstrument, updateInstrument, deleteInstrument, getPrimaryInstrument
 * @imports @/lib/persistence/db (getDB), @/lib/types (Instrument, InstrumentFamily), @/lib/util/id (newId, nowIso)
 * @key-functions
 *   - defaultEmojiFor(family: InstrumentFamily) -> string [27]
 *   - listInstruments() -> Promise<Instrument[]> [31]
 *   - getInstrument(id: string) -> Promise<Instrument | undefined> [40]
 *   - createInstrument(input: CreateInstrumentInput) -> Promise<Instrument> [45]
 *   - updateInstrument(id: string, patch: Partial<Omit<Instrument,'id'|'createdAt'>>) -> Promise<Instrument | undefined> [65]
 *   - deleteInstrument(id: string) -> Promise<void> [84]
 *   - getPrimaryInstrument() -> Promise<Instrument | undefined> [89]
 *   - clearPrimaryFlag(exceptId: string) -> Promise<void> [94]
 * @evidence src/lib/instruments/index.ts:6-8, src/lib/instruments/index.ts:18-25, src/lib/instruments/index.ts:31-38, src/lib/instruments/index.ts:45-63, src/lib/instruments/index.ts:65-82, src/lib/instruments/index.ts:84-87, src/lib/instruments/index.ts:89-92, src/lib/instruments/index.ts:94-104 *
 * @amber-doc CRUD interface for the musician's instrument collection, exposing createInstrument, updateInstrument, deleteInstrument, and a primary-instrument designation that pre-populates the timer default in tempo.today.
 */
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
