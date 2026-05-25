import { describe, it, expect, beforeEach } from "vitest";
import { createPiece, deletePiece, filterPieces, listPieces, pieceRotation, updatePiece } from "@/lib/pieces";
import { freshDB } from "@/test/dbHelper";
import type { Session } from "@/lib/types";

const mkSession = (overrides: Partial<Session>): Session => ({
  id: Math.random().toString(36),
  instrumentId: "i1",
  pieceId: null,
  intent: "repertoire",
  tempo: null,
  startedAt: new Date().toISOString(),
  endedAt: new Date().toISOString(),
  durationSec: 600,
  note: "",
  ...overrides,
});

describe("pieces CRUD", () => {
  beforeEach(async () => { await freshDB(); });

  it("creates with sensible defaults", async () => {
    const p = await createPiece({ title: "Test" });
    expect(p.difficulty).toBe(3);
    expect(p.status).toBe("learning");
    expect(p.composer).toBe("");
  });

  it("updates and deletes", async () => {
    const p = await createPiece({ title: "Foo" });
    const up = await updatePiece(p.id, { status: "polishing" });
    expect(up?.status).toBe("polishing");
    await deletePiece(p.id);
    expect((await listPieces()).length).toBe(0);
  });

  it("update returns undefined for missing piece", async () => {
    expect(await updatePiece("nope", { notes: "x" })).toBeUndefined();
  });
});

describe("filterPieces", () => {
  const pieces = [
    { id: "p1", title: "Etude", composer: "Chopin", instrumentId: "i1", status: "learning" as const },
    { id: "p2", title: "Sonata", composer: "Mozart", instrumentId: "i2", status: "polishing" as const },
    { id: "p3", title: "Prelude", composer: "Bach", instrumentId: "i1", status: "shelved" as const },
  ].map((p) => ({
    ...p,
    difficulty: 3 as const,
    key: "",
    tempoTarget: null,
    notes: "",
    createdAt: "",
    updatedAt: "",
  }));

  it("filters by query (title and composer, case-insensitive)", () => {
    expect(filterPieces(pieces, { query: "chop" })).toHaveLength(1);
    expect(filterPieces(pieces, { query: "PRELUDE" })).toHaveLength(1);
  });

  it("filters by status and instrument", () => {
    expect(filterPieces(pieces, { status: "polishing" })).toHaveLength(1);
    expect(filterPieces(pieces, { instrumentId: "i1" })).toHaveLength(2);
  });

  it("returns everything for status='all'", () => {
    expect(filterPieces(pieces, { status: "all" })).toHaveLength(3);
  });
});

describe("pieceRotation", () => {
  it("flags neglected after 14 days and excludes shelved", () => {
    const pieces = [
      { id: "p1", title: "A", status: "polishing" as const },
      { id: "p2", title: "B", status: "shelved" as const },
      { id: "p3", title: "C", status: "learning" as const },
    ].map((p) => ({
      ...p,
      composer: "",
      instrumentId: null,
      difficulty: 3 as const,
      key: "",
      tempoTarget: null,
      notes: "",
      createdAt: "",
      updatedAt: "",
    }));

    const now = new Date("2026-03-20T12:00:00");
    const fresh = mkSession({ pieceId: "p1", startedAt: "2026-03-19T10:00:00", durationSec: 1800 });
    const stale = mkSession({ pieceId: "p3", startedAt: "2026-03-01T10:00:00", durationSec: 600 });

    const r = pieceRotation(pieces, [fresh, stale], now);
    expect(r).toHaveLength(2);
    const p1 = r.find((x) => x.pieceId === "p1")!;
    const p3 = r.find((x) => x.pieceId === "p3")!;
    expect(p1.neglected).toBe(false);
    expect(p3.neglected).toBe(true);
    expect(p1.totalMinutes).toBe(30);
  });
});
