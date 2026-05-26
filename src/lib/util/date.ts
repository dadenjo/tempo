/**
 * @file-summary
 * @capability tempo.platform
 * @hash sha256-6fc5ec0853fcc1bcdd904f512cd526ff44296c517e90a6e5cb95b5a00d0e4ce0
 * @generated 2026-05-26T21:19:58.555Z
 *
 * Date and time utility module providing helpers for working with local-time-anchored ISO date strings (YYYY-MM-DD 'day keys') and duration formatting. Includes functions to convert dates to day keys, get today's key, add days, compute day differences, find Monday-based week start, generate a range of recent day keys, and format seconds as human-readable durations or clock strings. No external imports.
 *
 * @exports dayKey, todayKey, addDays, diffDays, startOfWeek, rangeDays, formatDuration, formatClock
 * @imports 
 * @key-functions
 *   - dayKey(d: Date | string) -> string [7]
 *   - todayKey() -> string [15]
 *   - addDays(d: Date, n: number) -> Date [19]
 *   - diffDays(a: Date | string, b: Date | string) -> number [25]
 *   - startOfWeek(d: Date) -> Date [32]
 *   - rangeDays(end: Date, count: number) -> string[] [42]
 *   - formatDuration(seconds: number) -> string [50]
 *   - formatClock(seconds: number) -> string [60]
 * @evidence src/lib/util/date.ts:1-68, src/lib/util/date.ts:7-13, src/lib/util/date.ts:32-40, src/lib/util/date.ts:42-48, src/lib/util/date.ts:50-58, src/lib/util/date.ts:60-66
 */
/**
 * Date helpers used throughout the app.
 * All "day keys" are ISO date strings (YYYY-MM-DD) anchored to local time
 * so that "today" lines up with the user's calendar, not UTC.
 */

export function dayKey(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return dayKey(new Date());
}

export function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

export function diffDays(a: Date | string, b: Date | string): number {
  const da = typeof a === "string" ? new Date(a) : a;
  const db = typeof b === "string" ? new Date(b) : b;
  const ms = da.getTime() - db.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function startOfWeek(d: Date): Date {
  // Monday-based week start
  const out = new Date(d);
  const day = out.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  out.setDate(out.getDate() + diff);
  out.setHours(0, 0, 0, 0);
  return out;
}

export function rangeDays(end: Date, count: number): string[] {
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    keys.push(dayKey(addDays(end, -i)));
  }
  return keys;
}

export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}
