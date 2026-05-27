/**
 * @file-summary
 * @capability tempo.pieces
 * @hash sha256-42dd972982cdaabd5fcf4f549e74c9e7fe2e5e7cf3932b65f8641af1f7b863f4
 * @generated 2026-05-26T21:18:26.530Z
 *
 * CRUD operations for a piece repertoire stored in IndexedDB via getDB, plus a filtering helper and a rotation analysis function. listPieces, getPiece, createPiece, updatePiece, and deletePiece operate on the 'pieces' store. filterPieces filters by status, instrumentId, and a case-insensitive query over title/composer. pieceRotation aggregates session durations per piece, computes last-practiced date and days since, and flags pieces as neglected when never practiced or practiced 14+ days ago, excluding pieces with status 'shelved'.
 *
 * @exports CreatePieceInput, listPieces, getPiece, createPiece, updatePiece, deletePiece, PieceFilter, filterPieces, PieceRotation, pieceRotation
 * @imports @/lib/persistence/db (getDB), @/lib/types (Piece, PieceStatus, Session), @/lib/util/id (newId, nowIso), @/lib/util/date (diffDays)
 * @key-functions
 *   - listPieces() -> Promise<Piece[]> [22]
 *   - getPiece(id: string) -> Promise<Piece | undefined> [28]
 *   - createPiece(input: CreatePieceInput) -> Promise<Piece> [33]
 *   - updatePiece(id: string, patch: Partial<Omit<Piece,'id'|'createdAt'>>) -> Promise<Piece | undefined> [53]
 *   - deletePiece(id: string) -> Promise<void> [71]
 *   - filterPieces(pieces: Piece[], filter: PieceFilter) -> Piece[] [82]
 *   - pieceRotation(pieces: Piece[], sessions: Session[], now?: Date) -> PieceRotation[] [111]
 * @evidence src/lib/pieces/index.ts:6-9, src/lib/pieces/index.ts:22-26, src/lib/pieces/index.ts:33-51, src/lib/pieces/index.ts:53-69, src/lib/pieces/index.ts:71-74, src/lib/pieces/index.ts:82-98, src/lib/pieces/index.ts:111-138, src/lib/pieces/index.ts:117, src/lib/pieces/index.ts:135 *
 * @amber-doc Browse and inspect the music piece repertoire: a list view with active/polishing/shelved status badges and a detail page aggregating per-piece session history, total practice time, and a 60-day activity breakdown.
 */
/**
 * @amber-capability tempo.pieces
 * Piece library — CRUD on the user's repertoire plus rotation analysis
 * (which pieces are getting attention vs. neglected).
 */
import { getDB } from "@/lib/persistence/db";
import type { Piece, PieceStatus, Session } from "@/lib/types";
import { newId, nowIso } from "@/lib/util/id";
import { diffDays } from "@/lib/util/date";

export interface CreatePieceInput {
  title: string;
  composer?: string;
  instrumentId?: string | null;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  status?: PieceStatus;
  key?: string;
  tempoTarget?: number | null;
  notes?: string;
}

export async function listPieces(): Promise<Piece[]> {
  const db = await getDB();
  const all = await db.getAll("pieces");
  return all.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getPiece(id: string): Promise<Piece | undefined> {
  const db = await getDB();
  return db.get("pieces", id);
}

export async function createPiece(input: CreatePieceInput): Promise<Piece> {
  const now = nowIso();
  const piece: Piece = {
    id: newId("pc"),
    title: input.title.trim(),
    composer: (input.composer ?? "").trim(),
    instrumentId: input.instrumentId ?? null,
    difficulty: input.difficulty ?? 3,
    status: input.status ?? "learning",
    key: (input.key ?? "").trim(),
    tempoTarget: input.tempoTarget ?? null,
    notes: input.notes ?? "",
    createdAt: now,
    updatedAt: now,
  };
  const db = await getDB();
  await db.put("pieces", piece);
  return piece;
}

export async function updatePiece(
  id: string,
  patch: Partial<Omit<Piece, "id" | "createdAt">>,
): Promise<Piece | undefined> {
  const db = await getDB();
  const existing = await db.get("pieces", id);
  if (!existing) return undefined;
  const next: Piece = {
    ...existing,
    ...patch,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: nowIso(),
  };
  await db.put("pieces", next);
  return next;
}

export async function deletePiece(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("pieces", id);
}

export interface PieceFilter {
  query?: string;
  status?: PieceStatus | "all";
  instrumentId?: string | null;
}

export function filterPieces(pieces: Piece[], filter: PieceFilter): Piece[] {
  return pieces.filter((p) => {
    if (filter.status && filter.status !== "all" && p.status !== filter.status)
      return false;
    if (filter.instrumentId && p.instrumentId !== filter.instrumentId)
      return false;
    if (filter.query) {
      const q = filter.query.toLowerCase();
      if (
        !p.title.toLowerCase().includes(q) &&
        !p.composer.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}

export interface PieceRotation {
  pieceId: string;
  totalMinutes: number;
  sessionCount: number;
  lastPracticedAt: string | null;
  daysSincePracticed: number | null;
  neglected: boolean;
}

/** Compute per-piece rotation metrics. Active pieces not practiced in 14+ days
 * are considered neglected. */
export function pieceRotation(
  pieces: Piece[],
  sessions: Session[],
  now: Date = new Date(),
): PieceRotation[] {
  return pieces
    .filter((p) => p.status !== "shelved")
    .map((p) => {
      const mine = sessions.filter((s) => s.pieceId === p.id);
      const totalMinutes = Math.round(
        mine.reduce((acc, s) => acc + s.durationSec, 0) / 60,
      );
      const last = mine.reduce<string | null>(
        (acc, s) => (acc === null || s.startedAt > acc ? s.startedAt : acc),
        null,
      );
      const days =
        last === null ? null : Math.max(0, diffDays(now, new Date(last)));
      return {
        pieceId: p.id,
        totalMinutes,
        sessionCount: mine.length,
        lastPracticedAt: last,
        daysSincePracticed: days,
        neglected: days === null || days >= 14,
      };
    })
    .sort((a, b) => b.totalMinutes - a.totalMinutes);
}
