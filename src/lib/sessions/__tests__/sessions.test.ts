import { describe, it, expect, beforeEach } from "vitest";
import { createSession, deleteSession, getSession, listSessions, streakFromSessions, totalMinutesForDay, totalSecondsForDay, updateSession } from "@/lib/sessions";
import { freshDB } from "@/test/dbHelper";
import type { Session } from "@/lib/types";

const make = (overrides: Partial<Session> = {}): Session => ({
  id: "x",
  instrumentId: "i1",
  pieceId: null,
  intent: "repertoire",
  tempo: null,
  startedAt: "2026-03-15T10:00:00",
  endedAt: "2026-03-15T10:30:00",
  durationSec: 1800,
  note: "",
  ...overrides,
});

describe("sessions CRUD", () => {
  beforeEach(async () => { await freshDB(); });

  it("creates with computed duration", async () => {
    const s = await createSession({
      instrumentId: "i1",
      intent: "warmup",
      startedAt: "2026-03-15T10:00:00",
      endedAt: "2026-03-15T10:10:30",
    });
    expect(s.durationSec).toBe(630);
  });

  it("updates and recomputes duration when times change", async () => {
    const s = await createSession({
      instrumentId: "i1",
      intent: "warmup",
      startedAt: "2026-03-15T10:00:00",
      endedAt: "2026-03-15T10:05:00",
    });
    const up = await updateSession(s.id, { endedAt: "2026-03-15T10:20:00" });
    expect(up?.durationSec).toBe(1200);
  });

  it("deletes", async () => {
    const s = await createSession({
      instrumentId: "i1",
      intent: "warmup",
      startedAt: "2026-03-15T10:00:00",
      endedAt: "2026-03-15T10:05:00",
    });
    await deleteSession(s.id);
    expect(await getSession(s.id)).toBeUndefined();
    expect(await listSessions()).toHaveLength(0);
  });
});

describe("totalSecondsForDay / totalMinutesForDay", () => {
  it("sums sessions on the given local day only", () => {
    const sessions = [
      make({ startedAt: "2026-03-15T10:00:00", durationSec: 600 }),
      make({ startedAt: "2026-03-15T22:00:00", durationSec: 1200 }),
      make({ startedAt: "2026-03-14T10:00:00", durationSec: 999 }),
    ];
    expect(totalSecondsForDay(sessions, "2026-03-15")).toBe(1800);
    expect(totalMinutesForDay(sessions, "2026-03-15")).toBe(30);
  });
});

describe("streakFromSessions", () => {
  it("returns 0/0 with no sessions", () => {
    expect(streakFromSessions([])).toEqual({ current: 0, longest: 0 });
  });

  it("requires at least 60s per day", () => {
    const sessions = [make({ startedAt: "2026-03-15T10:00:00", durationSec: 30 })];
    expect(streakFromSessions(sessions, new Date("2026-03-15T12:00:00"))).toEqual({ current: 0, longest: 0 });
  });

  it("computes current streak counting back from today", () => {
    const now = new Date("2026-03-15T12:00:00");
    const days = ["2026-03-13", "2026-03-14", "2026-03-15"];
    const sessions = days.map((d) => make({ startedAt: `${d}T10:00:00`, durationSec: 600 }));
    expect(streakFromSessions(sessions, now)).toEqual({ current: 3, longest: 3 });
  });

  it("if today is empty, still counts yesterday-led streak", () => {
    const now = new Date("2026-03-15T12:00:00");
    const sessions = [
      make({ startedAt: "2026-03-13T10:00:00", durationSec: 600 }),
      make({ startedAt: "2026-03-14T10:00:00", durationSec: 600 }),
    ];
    expect(streakFromSessions(sessions, now).current).toBe(2);
  });

  it("longest streak handles gaps", () => {
    const sessions = [
      make({ startedAt: "2026-03-01T10:00:00", durationSec: 600 }),
      make({ startedAt: "2026-03-02T10:00:00", durationSec: 600 }),
      make({ startedAt: "2026-03-03T10:00:00", durationSec: 600 }),
      // gap
      make({ startedAt: "2026-03-10T10:00:00", durationSec: 600 }),
    ];
    expect(streakFromSessions(sessions, new Date("2026-03-20T12:00:00")).longest).toBe(3);
  });
});
