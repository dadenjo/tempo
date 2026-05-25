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
