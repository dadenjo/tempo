import { _resetDbCacheForTests } from "@/lib/persistence/db";

/** Wipe the in-memory IndexedDB and the cached DB connection between tests. */
export async function freshDB(): Promise<void> {
  await _resetDbCacheForTests();
  await new Promise<void>((resolve) => {
    const req = indexedDB.deleteDatabase("tempo");
    req.onsuccess = () => resolve();
    req.onerror = () => resolve();
    req.onblocked = () => resolve();
  });
}
