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
