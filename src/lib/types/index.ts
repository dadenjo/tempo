/**
 * @file-summary
 * @capability tempo.platform
 * @hash sha256-5cc02a28e52a50a0452e83b34bb4e00689441130e62ab66c463eca34b723d4c3
 * @generated 2026-05-26T21:19:41.601Z
 *
 * Defines shared TypeScript domain types and string-literal unions for a music practice domain: instruments, pieces, sessions, goals, and an aggregate AppData container. Exports both type aliases/interfaces and runtime arrays enumerating allowed values (INSTRUMENT_FAMILIES, PIECE_STATUSES, SESSION_INTENTS). Comments state IDs are short base36 strings and timestamps are ISO 8601.
 *
 * @exports InstrumentFamily, INSTRUMENT_FAMILIES, Instrument, PieceStatus, PIECE_STATUSES, Piece, SessionIntent, SESSION_INTENTS, Session, GoalType, Goal, AppData
 * @imports 
 * @key-functions
 * @evidence src/lib/types/index.ts:8-14, src/lib/types/index.ts:16-23, src/lib/types/index.ts:25-34, src/lib/types/index.ts:36-47, src/lib/types/index.ts:49-61, src/lib/types/index.ts:63-76, src/lib/types/index.ts:78-88, src/lib/types/index.ts:90-93, src/lib/types/index.ts:95-109, src/lib/types/index.ts:111-118
 */
/**
 * Shared domain types used across the Tempo app.
 *
 * IDs are short random base36 strings (no UUID dependency).
 * All timestamps are ISO 8601 strings unless otherwise noted.
 */

export type InstrumentFamily =
  | "keyboard"
  | "strings"
  | "winds"
  | "percussion"
  | "electronic"
  | "voice";

export const INSTRUMENT_FAMILIES: InstrumentFamily[] = [
  "keyboard",
  "strings",
  "winds",
  "percussion",
  "electronic",
  "voice",
];

export interface Instrument {
  id: string;
  name: string;
  family: InstrumentFamily;
  emoji: string;
  pickupDate: string | null; // ISO date (YYYY-MM-DD)
  primary: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PieceStatus =
  | "learning"
  | "polishing"
  | "maintenance"
  | "shelved";

export const PIECE_STATUSES: PieceStatus[] = [
  "learning",
  "polishing",
  "maintenance",
  "shelved",
];

export interface Piece {
  id: string;
  title: string;
  composer: string;
  instrumentId: string | null;
  difficulty: 1 | 2 | 3 | 4 | 5;
  status: PieceStatus;
  key: string;
  tempoTarget: number | null; // BPM
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type SessionIntent =
  | "warmup"
  | "technique"
  | "repertoire"
  | "sight-reading"
  | "improvisation";

export const SESSION_INTENTS: SessionIntent[] = [
  "warmup",
  "technique",
  "repertoire",
  "sight-reading",
  "improvisation",
];

export interface Session {
  id: string;
  instrumentId: string;
  pieceId: string | null;
  intent: SessionIntent;
  tempo: number | null; // BPM the user practised at
  startedAt: string; // ISO datetime
  endedAt: string; // ISO datetime
  durationSec: number;
  note: string;
}

export type GoalType =
  | "weekly-minutes"
  | "piece-ready-by"
  | "instrument-frequency";

export interface Goal {
  id: string;
  type: GoalType;
  title: string;
  // weekly-minutes
  targetMinutes?: number;
  // piece-ready-by
  pieceId?: string;
  dueDate?: string; // ISO date
  // instrument-frequency
  instrumentId?: string;
  perWeek?: number;
  createdAt: string;
  archivedAt: string | null;
}

export interface AppData {
  version: number;
  instruments: Instrument[];
  pieces: Piece[];
  sessions: Session[];
  goals: Goal[];
  exportedAt: string;
}
