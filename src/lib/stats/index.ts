/**
 * @file-summary
 * @capability tempo.stats
 * @hash sha256-45a4937bbe9676c0d867284a3eec2fe08ceff13216ca3e80c962501f8fd942dd
 * @generated 2026-05-26T21:19:15.137Z
 *
 * Pure analytics functions over Session arrays. Provides a GitHub-style heatmap cell builder with discrete level bucketing, an hour-of-day session count histogram, instrument and intent duration splits (in minutes, sorted desc), a total minutes sum, and a Monday-based ISO week filter. All computations aggregate durationSec and round to minutes; no I/O or side effects are present.
 *
 * @exports HeatmapCell, heatmapCells, levelForMinutes, timeOfDayHistogram, SplitSlice, instrumentSplit, intentSplit, totalMinutes, sessionsThisWeek
 * @imports @/lib/types (Session, SessionIntent), @/lib/util/date (dayKey, rangeDays)
 * @key-functions
 *   - heatmapCells(sessions: Session[], end?: Date, days?: number) -> HeatmapCell[] [16]
 *   - levelForMinutes(m: number) -> 0|1|2|3|4 [32]
 *   - timeOfDayHistogram(sessions: Session[]) -> number[] [41]
 *   - instrumentSplit(sessions: Session[]) -> SplitSlice[] [56]
 *   - intentSplit(sessions: Session[]) -> SplitSlice[] [65]
 *   - totalMinutes(sessions: Session[]) -> number [74]
 *   - sessionsThisWeek(sessions: Session[], now?: Date) -> Session[] [80]
 * @evidence src/lib/stats/index.ts:6-7, src/lib/stats/index.ts:9-13, src/lib/stats/index.ts:16-30, src/lib/stats/index.ts:32-38, src/lib/stats/index.ts:41-49, src/lib/stats/index.ts:51-54, src/lib/stats/index.ts:56-63, src/lib/stats/index.ts:65-72, src/lib/stats/index.ts:74-78, src/lib/stats/index.ts:80-88
 */
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
