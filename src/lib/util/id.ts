/**
 * @file-summary
 * @capability tempo.platform
 * @hash sha256-cf08ad7e28a428d3bf8c3d08c4681f5318bc2837fa2c71ed6030dc9f9e8c2c5f
 * @generated 2026-05-26T21:20:04.160Z
 *
 * Utility module providing three helpers: `newId` generates a short identifier by concatenating a base36 timestamp with a 6-character base36 random suffix, optionally prefixed; `nowIso` returns the current time as an ISO string; `todayIso` returns the current date as a YYYY-MM-DD string by slicing the first 10 characters of the ISO timestamp. No external dependencies are imported.
 *
 * @exports newId, nowIso, todayIso
 * @imports 
 * @key-functions
 *   - newId(prefix?: string) -> string [5]
 *   - nowIso() -> string [11]
 *   - todayIso() -> string [15]
 * @evidence src/lib/util/id.ts:5-9, src/lib/util/id.ts:11-13, src/lib/util/id.ts:15-17
 */
/**
 * Generate short, sortable-ish unique IDs without an external dep.
 * Combines a base36 timestamp prefix with random suffix.
 */
export function newId(prefix = ""): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return prefix ? `${prefix}_${ts}${rand}` : `${ts}${rand}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
