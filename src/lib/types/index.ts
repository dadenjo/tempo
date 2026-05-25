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
