/**
 * @file-summary
 * @capability tempo.sync
 * @hash sha256-cf4b47f83c08e8ee21592a5022eb4f8d47776290d856d6c1d1b6a47606aaa351
 * @generated 2026-05-26T21:19:23.262Z
 *
 * Vitest test suite for the sync module covering parseAppData validation, export/import round-trip, version rejection, and replace-mode behavior. Each test starts with a fresh DB via beforeEach. Tests exercise exportData, importData, serializeData, parseAppData, and clearAllData using helper factories for instruments, pieces, and sessions.
 *
 * @exports 
 * @imports vitest (describe, it, expect, beforeEach), @/lib/sync (exportData, importData, parseAppData, serializeData, clearAllData), @/lib/instruments (createInstrument), @/lib/pieces (createPiece), @/lib/sessions (createSession), @/test/dbHelper (freshDB)
 * @key-functions
 *   - it(() -> void) [11]
 *   - it(() -> void) [17]
 *   - it(async () -> Promise<void>) [29]
 *   - it(async () -> Promise<void>) [55]
 *   - it(async () -> Promise<void>) [68]
 * @evidence src/lib/sync/__tests__/sync.test.ts:1-9, src/lib/sync/__tests__/sync.test.ts:11-15, src/lib/sync/__tests__/sync.test.ts:17-27, src/lib/sync/__tests__/sync.test.ts:29-53, src/lib/sync/__tests__/sync.test.ts:55-66, src/lib/sync/__tests__/sync.test.ts:68-76
 */
import { describe, it, expect, beforeEach } from "vitest";
import { exportData, importData, parseAppData, serializeData, clearAllData } from "@/lib/sync";
import { createInstrument } from "@/lib/instruments";
import { createPiece } from "@/lib/pieces";
import { createSession } from "@/lib/sessions";
import { freshDB } from "@/test/dbHelper";

describe("sync", () => {
  beforeEach(async () => { await freshDB(); });

  it("parseAppData rejects garbage", () => {
    expect(parseAppData("not-json")).toBeNull();
    expect(parseAppData("[]")).toBeNull();
    expect(parseAppData(JSON.stringify({ version: 1 }))).toBeNull();
  });

  it("parseAppData accepts well-formed data", () => {
    const raw = JSON.stringify({
      version: 1,
      instruments: [],
      pieces: [],
      sessions: [],
      goals: [],
      exportedAt: "",
    });
    expect(parseAppData(raw)).not.toBeNull();
  });

  it("round-trips a snapshot", async () => {
    const ins = await createInstrument({ name: "Piano", family: "keyboard", primary: true });
    const p = await createPiece({ title: "Prelude" });
    await createSession({
      instrumentId: ins.id,
      pieceId: p.id,
      intent: "repertoire",
      startedAt: new Date().toISOString(),
      endedAt: new Date(Date.now() + 600_000).toISOString(),
    });

    const snapshot = await exportData();
    expect(snapshot.instruments).toHaveLength(1);
    expect(snapshot.sessions).toHaveLength(1);

    await clearAllData();
    const empty = await exportData();
    expect(empty.sessions).toHaveLength(0);

    const result = await importData(serializeData(snapshot));
    expect(result.ok).toBe(true);
    const restored = await exportData();
    expect(restored.sessions).toHaveLength(1);
    expect(restored.pieces[0]!.title).toBe("Prelude");
  });

  it("rejects unsupported future versions", async () => {
    const result = await importData(JSON.stringify({
      version: 99,
      instruments: [],
      pieces: [],
      sessions: [],
      goals: [],
      exportedAt: "",
    }));
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/Unsupported/);
  });

  it("replace=true wipes existing data", async () => {
    await createInstrument({ name: "Old", family: "winds" });
    const fresh = await importData(JSON.stringify({
      version: 1, instruments: [], pieces: [], sessions: [], goals: [], exportedAt: "",
    }), { replace: true });
    expect(fresh.ok).toBe(true);
    const snap = await exportData();
    expect(snap.instruments).toHaveLength(0);
  });
});
