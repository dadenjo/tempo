/**
 * @file-summary
 * @capability tempo.sync
 * @hash sha256-2cbcf76c0146e232af0a03506c7288f035abd3a24d48bfbd235538281b8ac475
 * @generated 2026-05-26T21:19:33.143Z
 *
 * Provides client-side data portability for the app's IndexedDB store: exports all records from the instruments, pieces, sessions, and goals object stores into an AppData object with a version and timestamp, serializes it to pretty-printed JSON, and imports JSON after shape validation. Import optionally replaces existing data via resetDB, then puts records into each store in a single readwrite transaction and returns counts. Also exposes a clearAllData helper that calls resetDB. Rejects imports whose version exceeds CURRENT_DATA_VERSION (1) or whose JSON shape is invalid.
 *
 * @exports CURRENT_DATA_VERSION, exportData, serializeData, ImportResult, parseAppData, importData, clearAllData
 * @imports @/lib/persistence/db (getDB, resetDB), @/lib/types (AppData, Goal, Instrument, Piece, Session), @/lib/util/id (nowIso)
 * @key-functions
 *   - exportData() -> Promise<AppData> [12]
 *   - serializeData(data: AppData) -> string [30]
 *   - parseAppData(raw: string) -> AppData | null [40]
 *   - importData(raw: string, opts?: { replace?: boolean }) -> Promise<ImportResult> [55]
 *   - clearAllData() -> Promise<void> [87]
 * @evidence src/lib/sync/index.ts:10, src/lib/sync/index.ts:12-28, src/lib/sync/index.ts:30-32, src/lib/sync/index.ts:34-38, src/lib/sync/index.ts:40-53, src/lib/sync/index.ts:55-85, src/lib/sync/index.ts:61-62, src/lib/sync/index.ts:63-68, src/lib/sync/index.ts:87-89 *
 * @amber-doc Data portability interface exposing JSON export, JSON import (with optional replace), and full data clear via src/lib/sync, surfaced to the user on the Settings page alongside a theme toggle.
 */
/**
 * @amber-capability tempo.sync
 * Data portability — JSON export, JSON import with shape validation, and
 * a clear-all utility. No network calls; entirely client-side.
 */
import { getDB, resetDB } from "@/lib/persistence/db";
import type { AppData, Goal, Instrument, Piece, Session } from "@/lib/types";
import { nowIso } from "@/lib/util/id";

export const CURRENT_DATA_VERSION = 1;

export async function exportData(): Promise<AppData> {
  const db = await getDB();
  const [instruments, pieces, sessions, goals] = await Promise.all([
    db.getAll("instruments"),
    db.getAll("pieces"),
    db.getAll("sessions"),
    db.getAll("goals"),
  ]);
  return {
    version: CURRENT_DATA_VERSION,
    instruments,
    pieces,
    sessions,
    goals,
    exportedAt: nowIso(),
  };
}

export function serializeData(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

export interface ImportResult {
  ok: boolean;
  reason?: string;
  counts?: { instruments: number; pieces: number; sessions: number; goals: number };
}

export function parseAppData(raw: string): AppData | null {
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    if (typeof data.version !== "number") return null;
    if (!Array.isArray(data.instruments)) return null;
    if (!Array.isArray(data.pieces)) return null;
    if (!Array.isArray(data.sessions)) return null;
    if (!Array.isArray(data.goals)) return null;
    return data as AppData;
  } catch {
    return null;
  }
}

export async function importData(
  raw: string,
  opts: { replace?: boolean } = {},
): Promise<ImportResult> {
  const data = parseAppData(raw);
  if (!data) return { ok: false, reason: "Invalid JSON shape" };
  if (data.version > CURRENT_DATA_VERSION)
    return { ok: false, reason: `Unsupported version ${data.version}` };
  if (opts.replace) await resetDB();
  const db = await getDB();
  const tx = db.transaction(
    ["instruments", "pieces", "sessions", "goals"],
    "readwrite",
  );
  await Promise.all([
    ...data.instruments.map((i: Instrument) => tx.objectStore("instruments").put(i)),
    ...data.pieces.map((p: Piece) => tx.objectStore("pieces").put(p)),
    ...data.sessions.map((s: Session) => tx.objectStore("sessions").put(s)),
    ...data.goals.map((g: Goal) => tx.objectStore("goals").put(g)),
  ]);
  await tx.done;
  return {
    ok: true,
    counts: {
      instruments: data.instruments.length,
      pieces: data.pieces.length,
      sessions: data.sessions.length,
      goals: data.goals.length,
    },
  };
}

export async function clearAllData(): Promise<void> {
  await resetDB();
}
