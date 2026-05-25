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
