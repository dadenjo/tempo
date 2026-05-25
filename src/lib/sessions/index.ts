/**
 * @amber-capability tempo.sessions
 * Practice session lifecycle — create, update, delete and aggregate.
 * Provides streak calculation and daily totals used by the Today screen.
 */
import { getDB } from "@/lib/persistence/db";
import type { Session, SessionIntent } from "@/lib/types";
import { newId } from "@/lib/util/id";
import { addDays, dayKey, todayKey } from "@/lib/util/date";

export interface CreateSessionInput {
  instrumentId: string;
  pieceId?: string | null;
  intent: SessionIntent;
  tempo?: number | null;
  startedAt: string;
  endedAt: string;
  note?: string;
}

export async function listSessions(): Promise<Session[]> {
  const db = await getDB();
  const all = await db.getAll("sessions");
  return all.sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1));
}

export async function getSession(id: string): Promise<Session | undefined> {
  const db = await getDB();
  return db.get("sessions", id);
}

export async function createSession(
  input: CreateSessionInput,
): Promise<Session> {
  const start = new Date(input.startedAt).getTime();
  const end = new Date(input.endedAt).getTime();
  const durationSec = Math.max(0, Math.round((end - start) / 1000));
  const session: Session = {
    id: newId("ss"),
    instrumentId: input.instrumentId,
    pieceId: input.pieceId ?? null,
    intent: input.intent,
    tempo: input.tempo ?? null,
    startedAt: input.startedAt,
    endedAt: input.endedAt,
    durationSec,
    note: (input.note ?? "").trim(),
  };
  const db = await getDB();
  await db.put("sessions", session);
  return session;
}

export async function updateSession(
  id: string,
  patch: Partial<Omit<Session, "id">>,
): Promise<Session | undefined> {
  const db = await getDB();
  const existing = await db.get("sessions", id);
  if (!existing) return undefined;
  const next: Session = { ...existing, ...patch, id: existing.id };
  if (patch.startedAt || patch.endedAt) {
    const start = new Date(next.startedAt).getTime();
    const end = new Date(next.endedAt).getTime();
    next.durationSec = Math.max(0, Math.round((end - start) / 1000));
  }
  await db.put("sessions", next);
  return next;
}

export async function deleteSession(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("sessions", id);
}

/** Total seconds practised on a given local date. */
export function totalSecondsForDay(
  sessions: Session[],
  day: string = todayKey(),
): number {
  return sessions
    .filter((s) => dayKey(s.startedAt) === day)
    .reduce((acc, s) => acc + s.durationSec, 0);
}

export function totalMinutesForDay(
  sessions: Session[],
  day: string = todayKey(),
): number {
  return Math.round(totalSecondsForDay(sessions, day) / 60);
}

/** Compute current and longest streak in days, where a "practice day" has at
 * least 60 seconds of logged time. */
export function streakFromSessions(
  sessions: Session[],
  now: Date = new Date(),
): { current: number; longest: number } {
  const minSeconds = 60;
  const byDay = new Map<string, number>();
  for (const s of sessions) {
    const k = dayKey(s.startedAt);
    byDay.set(k, (byDay.get(k) ?? 0) + s.durationSec);
  }

  // Longest: scan all unique days sorted ascending
  const days = Array.from(byDay.keys())
    .filter((d) => (byDay.get(d) ?? 0) >= minSeconds)
    .sort();
  let longest = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const d of days) {
    const date = new Date(d);
    if (prev === null) {
      run = 1;
    } else {
      const expected = dayKey(addDays(prev, 1));
      run = expected === d ? run + 1 : 1;
    }
    if (run > longest) longest = run;
    prev = date;
  }

  // Current: walk back from today (or yesterday if today empty)
  let cursor = new Date(now);
  if ((byDay.get(dayKey(cursor)) ?? 0) < minSeconds) {
    cursor = addDays(cursor, -1);
  }
  let current = 0;
  while ((byDay.get(dayKey(cursor)) ?? 0) >= minSeconds) {
    current++;
    cursor = addDays(cursor, -1);
  }

  return { current, longest };
}
