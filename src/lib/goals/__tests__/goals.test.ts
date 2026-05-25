import { describe, it, expect, beforeEach } from "vitest";
import { createGoal, deleteGoal, evaluateGoal, listGoals, updateGoal } from "@/lib/goals";
import { freshDB } from "@/test/dbHelper";
import type { Goal, Session } from "@/lib/types";

const make = (o: Partial<Session>): Session => ({
  id: Math.random().toString(36),
  instrumentId: "i1",
  pieceId: null,
  intent: "repertoire",
  tempo: null,
  startedAt: "2026-03-15T10:00:00",
  endedAt: "2026-03-15T10:30:00",
  durationSec: 1800,
  note: "",
  ...o,
});

describe("goals CRUD", () => {
  beforeEach(async () => { await freshDB(); });

  it("creates, updates, deletes", async () => {
    const g = await createGoal({ type: "weekly-minutes", title: "150/wk", targetMinutes: 150 });
    expect(g.id).toBeTruthy();
    const up = await updateGoal(g.id, { title: "Renamed" });
    expect(up?.title).toBe("Renamed");
    await deleteGoal(g.id);
    expect(await listGoals()).toHaveLength(0);
  });
});

describe("evaluateGoal — weekly-minutes", () => {
  const baseGoal: Goal = {
    id: "g1",
    type: "weekly-minutes",
    title: "150",
    targetMinutes: 150,
    createdAt: "",
    archivedAt: null,
  };

  it("done when exceeded", () => {
    const now = new Date("2026-03-15T12:00:00"); // Sunday
    const sessions = [make({ startedAt: "2026-03-09T10:00:00", durationSec: 9000 })]; // 150m
    const p = evaluateGoal(baseGoal, sessions, now);
    expect(p.percent).toBeGreaterThanOrEqual(100);
    expect(p.status).toBe("done");
  });

  it("behind when below day-proportion expectation", () => {
    const now = new Date("2026-03-15T12:00:00"); // Sunday → full week elapsed
    const p = evaluateGoal(baseGoal, [], now);
    expect(p.percent).toBe(0);
    expect(p.status).toBe("behind");
  });
});

describe("evaluateGoal — piece-ready-by", () => {
  it("missed when overdue and not enough minutes", () => {
    const goal: Goal = {
      id: "g2",
      type: "piece-ready-by",
      title: "X",
      pieceId: "p1",
      dueDate: "2026-01-01",
      createdAt: "",
      archivedAt: null,
    };
    const now = new Date("2026-03-15T12:00:00");
    const p = evaluateGoal(goal, [], now);
    expect(p.status).toBe("missed");
  });

  it("flags misconfiguration", () => {
    const goal: Goal = { id: "g3", type: "piece-ready-by", title: "X", createdAt: "", archivedAt: null };
    expect(evaluateGoal(goal, [], new Date()).status).toBe("behind");
  });
});

describe("evaluateGoal — instrument-frequency", () => {
  it("counts distinct practice days", () => {
    const goal: Goal = {
      id: "g4",
      type: "instrument-frequency",
      title: "Piano 3x/week",
      instrumentId: "i1",
      perWeek: 3,
      createdAt: "",
      archivedAt: null,
    };
    const now = new Date("2026-03-15T12:00:00");
    const sessions = [
      make({ startedAt: "2026-03-10T10:00:00", instrumentId: "i1" }),
      make({ startedAt: "2026-03-11T10:00:00", instrumentId: "i1" }),
      make({ startedAt: "2026-03-12T10:00:00", instrumentId: "i1" }),
    ];
    const p = evaluateGoal(goal, sessions, now);
    expect(p.percent).toBe(100);
    expect(p.status).toBe("done");
  });
});
