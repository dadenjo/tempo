/**
 * @amber-capability tempo.stats
 * Pure analytics over session data — heatmap cells, time-of-day buckets,
 * instrument/intent splits. Components consume these to render charts.
 */
import type { Session, SessionIntent } from "@/lib/types";
import { dayKey, rangeDays } from "@/lib/util/date";

export interface HeatmapCell {
  date: string;
  minutes: number;
  level: 0 | 1 | 2 | 3 | 4;
}

/** Compute 365 (or N) days of GitHub-style heatmap cells anchored at `end`. */
export function heatmapCells(
  sessions: Session[],
  end: Date = new Date(),
  days = 365,
): HeatmapCell[] {
  const totals = new Map<string, number>();
  for (const s of sessions) {
    const k = dayKey(s.startedAt);
    totals.set(k, (totals.get(k) ?? 0) + s.durationSec);
  }
  return rangeDays(end, days).map((date) => {
    const minutes = Math.round((totals.get(date) ?? 0) / 60);
    return { date, minutes, level: levelForMinutes(minutes) };
  });
}

export function levelForMinutes(m: number): 0 | 1 | 2 | 3 | 4 {
  if (m <= 0) return 0;
  if (m < 15) return 1;
  if (m < 30) return 2;
  if (m < 60) return 3;
  return 4;
}

/** Histogram of session count per hour-of-day (0-23). */
export function timeOfDayHistogram(sessions: Session[]): number[] {
  const buckets = new Array<number>(24).fill(0);
  for (const s of sessions) {
    const h = new Date(s.startedAt).getHours();
    const cur = buckets[h] ?? 0;
    buckets[h] = cur + 1;
  }
  return buckets;
}

export interface SplitSlice {
  key: string;
  minutes: number;
}

export function instrumentSplit(sessions: Session[]): SplitSlice[] {
  const m = new Map<string, number>();
  for (const s of sessions)
    m.set(s.instrumentId, (m.get(s.instrumentId) ?? 0) + s.durationSec);
  return Array.from(m.entries())
    .map(([key, sec]) => ({ key, minutes: Math.round(sec / 60) }))
    .sort((a, b) => b.minutes - a.minutes);
}

export function intentSplit(sessions: Session[]): SplitSlice[] {
  const m = new Map<SessionIntent, number>();
  for (const s of sessions)
    m.set(s.intent, (m.get(s.intent) ?? 0) + s.durationSec);
  return Array.from(m.entries())
    .map(([key, sec]) => ({ key, minutes: Math.round(sec / 60) }))
    .sort((a, b) => b.minutes - a.minutes);
}

export function totalMinutes(sessions: Session[]): number {
  return Math.round(
    sessions.reduce((acc, s) => acc + s.durationSec, 0) / 60,
  );
}

export function sessionsThisWeek(sessions: Session[], now = new Date()): Session[] {
  // Monday-based ISO week
  const start = new Date(now);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return sessions.filter((s) => new Date(s.startedAt) >= start);
}
