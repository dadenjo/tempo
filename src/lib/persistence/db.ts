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
