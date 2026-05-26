/**
 * @file-summary
 * @capability tempo.persistence
 * @hash sha256-c1ee2d15e6dcdc9abbdea471b4c15fdcdced3460bfa4f2931d3b728f3a5b1860
 * @generated 2026-05-26T21:17:59.915Z
 *
 * Client-side in-memory store that loads instruments, pieces, sessions, and goals from IndexedDB (via getDB) into a module-level state object. Exposes a React hook `useStore` built on `useSyncExternalStore` with a listener Set for pub/sub, plus `reload`/`refresh` functions to repopulate the data. On load, collections are sorted: instruments by primary-flag then name, pieces by title, sessions and goals by date descending. The `ensureLoaded` helper guards against concurrent initial loads using a `loadingPromise`.
 *
 * @exports StoreState, reload, useStore, refresh
 * @imports react (useEffect, useSyncExternalStore), @/lib/persistence/db (getDB), @/lib/types (Goal, Instrument, Piece, Session)
 * @key-functions
 *   - reload() -> Promise<void> [35]
 *   - ensureLoaded() -> void [56]
 *   - subscribe(cb: () => void) -> () => void [63]
 *   - useStore() -> StoreState [72]
 *   - refresh() -> Promise<void> [84]
 *   - notify() -> void [31]
 * @evidence src/lib/state/store.ts:6, src/lib/state/store.ts:8-10, src/lib/state/store.ts:12-18, src/lib/state/store.ts:20-29, src/lib/state/store.ts:35-54, src/lib/state/store.ts:43-51, src/lib/state/store.ts:56-61, src/lib/state/store.ts:63-68, src/lib/state/store.ts:70, src/lib/state/store.ts:72-81, src/lib/state/store.ts:84-86
 */
/**
 * Light client-side store. Loads all data from IndexedDB into memory and
 * pub/subs to react components via a tiny listener pattern. The dataset is
 * small (single-user, local) so keeping it in memory is fine.
 */
"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getDB } from "@/lib/persistence/db";
import type { Goal, Instrument, Piece, Session } from "@/lib/types";

export interface StoreState {
  loaded: boolean;
  instruments: Instrument[];
  pieces: Piece[];
  sessions: Session[];
  goals: Goal[];
}

const state: StoreState = {
  loaded: false,
  instruments: [],
  pieces: [],
  sessions: [],
  goals: [],
};

const listeners = new Set<() => void>();
let loadingPromise: Promise<void> | null = null;

function notify(): void {
  for (const l of listeners) l();
}

export async function reload(): Promise<void> {
  const db = await getDB();
  const [instruments, pieces, sessions, goals] = await Promise.all([
    db.getAll("instruments"),
    db.getAll("pieces"),
    db.getAll("sessions"),
    db.getAll("goals"),
  ]);
  state.instruments = instruments.sort((a, b) => {
    if (a.primary !== b.primary) return a.primary ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  state.pieces = pieces.sort((a, b) => a.title.localeCompare(b.title));
  state.sessions = sessions.sort((a, b) =>
    a.startedAt < b.startedAt ? 1 : -1,
  );
  state.goals = goals.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  state.loaded = true;
  notify();
}

function ensureLoaded(): void {
  if (state.loaded || loadingPromise) return;
  loadingPromise = reload().finally(() => {
    loadingPromise = null;
  });
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

const serverSnapshot: StoreState = { ...state };

export function useStore(): StoreState {
  useEffect(() => {
    ensureLoaded();
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => serverSnapshot,
  );
}

/** Force-refresh after a mutation. */
export function refresh(): Promise<void> {
  return reload();
}
