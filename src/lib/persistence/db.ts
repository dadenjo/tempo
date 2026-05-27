/**
 * @file-summary
 * @capability tempo.persistence
 * @hash sha256-6fe0c54c469a8ea2ae59516391c48264a76dca2c4a06ba815206a2c01697a0b7
 * @generated 2026-05-26T21:17:46.832Z
 *
 * Defines an IndexedDB wrapper using the `idb` library for a database named 'tempo' at version 1. Declares a typed schema (`TempoDBSchema`) with five object stores: instruments, pieces, sessions, goals, and meta, with indexes on pieces (by-instrument) and sessions (by-instrument, by-piece, by-startedAt). Exposes `getDB` for lazy singleton access (throws if `indexedDB` is undefined), `resetDB` to clear all stores, and `_resetDbCacheForTests` to close and discard the cached connection for test isolation.
 *
 * @exports TempoDBSchema, getDB, resetDB, _resetDbCacheForTests
 * @imports idb (openDB, IDBPDatabase, DBSchema), @/lib/types (Goal, Instrument, Piece, Session)
 * @key-functions
 *   - getDB() -> Promise<IDBPDatabase<TempoDBSchema>> [25]
 *   - resetDB() -> Promise<void> [49]
 *   - _resetDbCacheForTests() -> Promise<void> [61]
 * @evidence src/lib/persistence/db.ts:4-5, src/lib/persistence/db.ts:7-21, src/lib/persistence/db.ts:25-47, src/lib/persistence/db.ts:32-42, src/lib/persistence/db.ts:49-58, src/lib/persistence/db.ts:60-71 *
 * @amber-capability tempo.persistence
 * @amber-doc IndexedDB persistence layer exposing getDB (schema init + migrations) and resetDB (full store wipe), used by every domain module as the single access point for local storage.
 */
import { openDB, type IDBPDatabase, type DBSchema } from "idb";
import type { Goal, Instrument, Piece, Session } from "@/lib/types";

const DB_NAME = "tempo";
const DB_VERSION = 1;

export interface TempoDBSchema extends DBSchema {
  instruments: { key: string; value: Instrument };
  pieces: { key: string; value: Piece; indexes: { "by-instrument": string } };
  sessions: {
    key: string;
    value: Session;
    indexes: {
      "by-instrument": string;
      "by-piece": string;
      "by-startedAt": string;
    };
  };
  goals: { key: string; value: Goal };
  meta: { key: string; value: unknown };
}

let dbPromise: Promise<IDBPDatabase<TempoDBSchema>> | null = null;

export function getDB(): Promise<IDBPDatabase<TempoDBSchema>> {
  if (typeof indexedDB === "undefined") {
    throw new Error("IndexedDB not available in this environment");
  }
  if (!dbPromise) {
    dbPromise = openDB<TempoDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore("instruments", { keyPath: "id" });
          const pieces = db.createObjectStore("pieces", { keyPath: "id" });
          pieces.createIndex("by-instrument", "instrumentId");
          const sessions = db.createObjectStore("sessions", { keyPath: "id" });
          sessions.createIndex("by-instrument", "instrumentId");
          sessions.createIndex("by-piece", "pieceId");
          sessions.createIndex("by-startedAt", "startedAt");
          db.createObjectStore("goals", { keyPath: "id" });
          db.createObjectStore("meta");
        }
      },
    });
  }
  return dbPromise;
}

export async function resetDB(): Promise<void> {
  const db = await getDB();
  await Promise.all([
    db.clear("instruments"),
    db.clear("pieces"),
    db.clear("sessions"),
    db.clear("goals"),
    db.clear("meta"),
  ]);
}

/** Test-only — drop the cached connection so tests can use fake-indexeddb fresh. */
export async function _resetDbCacheForTests(): Promise<void> {
  if (dbPromise) {
    try {
      const db = await dbPromise;
      db.close();
    } catch {
      /* ignore */
    }
  }
  dbPromise = null;
}
