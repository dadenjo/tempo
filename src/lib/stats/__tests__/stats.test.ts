import { describe, it, expect } from "vitest";
import { heatmapCells, instrumentSplit, intentSplit, levelForMinutes, sessionsThisWeek, timeOfDayHistogram, totalMinutes } from "@/lib/stats";
import type { Session } from "@/lib/types";

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

describe("levelForMinutes", () => {
  it("buckets correctly", () => {
    expect(levelForMinutes(0)).toBe(0);
    expect(levelForMinutes(10)).toBe(1);
    expect(levelForMinutes(20)).toBe(2);
    expect(levelForMinutes(45)).toBe(3);
    expect(levelForMinutes(120)).toBe(4);
  });
});

describe("heatmapCells", () => {
  it("returns the requested number of cells ending at the anchor", () => {
    const end = new Date("2026-03-15T12:00:00");
    const cells = heatmapCells([make({ startedAt: "2026-03-15T10:00:00", durationSec: 3600 })], end, 7);
    expect(cells).toHaveLength(7);
    const last = cells[cells.length - 1]!;
    expect(last.date).toBe("2026-03-15");
    expect(last.minutes).toBe(60);
    expect(last.level).toBe(4);
  });

  it("aggregates multiple sessions on the same day", () => {
    const end = new Date("2026-03-15T12:00:00");
    const cells = heatmapCells(
      [
        make({ startedAt: "2026-03-15T08:00:00", durationSec: 900 }),
        make({ startedAt: "2026-03-15T20:00:00", durationSec: 1800 }),
      ],
      end,
      3,
    );
    expect(cells[2]!.minutes).toBe(45);
  });
});

describe("timeOfDayHistogram", () => {
  it("counts sessions into 24 hour buckets", () => {
    const buckets = timeOfDayHistogram([
      make({ startedAt: "2026-03-15T07:30:00" }),
      make({ startedAt: "2026-03-15T07:55:00" }),
      make({ startedAt: "2026-03-15T22:10:00" }),
    ]);
    expect(buckets).toHaveLength(24);
    expect(buckets[7]).toBe(2);
    expect(buckets[22]).toBe(1);
  });
});

describe("splits", () => {
  it("instrumentSplit sums by instrument", () => {
    const s = instrumentSplit([
      make({ instrumentId: "a", durationSec: 600 }),
      make({ instrumentId: "a", durationSec: 600 }),
      make({ instrumentId: "b", durationSec: 1200 }),
    ]);
    const a = s.find((x) => x.key === "a")!;
    const b = s.find((x) => x.key === "b")!;
    expect(a.minutes).toBe(20);
    expect(b.minutes).toBe(20);
  });

  it("intentSplit sums by intent", () => {
    const s = intentSplit([
      make({ intent: "warmup", durationSec: 300 }),
      make({ intent: "technique", durationSec: 600 }),
      make({ intent: "technique", durationSec: 600 }),
    ]);
    expect(s.find((x) => x.key === "technique")!.minutes).toBe(20);
  });
});

describe("totalMinutes and sessionsThisWeek", () => {
  it("totalMinutes", () => {
    expect(totalMinutes([make({ durationSec: 3600 }), make({ durationSec: 1800 })])).toBe(90);
  });

  it("sessionsThisWeek filters from Monday 00:00", () => {
    // 2026-03-15 is a Sunday → Monday of that week is 2026-03-09
    const now = new Date("2026-03-15T15:00:00");
    const wk = sessionsThisWeek(
      [
        make({ startedAt: "2026-03-08T10:00:00" }), // prev Sunday — excluded
        make({ startedAt: "2026-03-09T10:00:00" }), // Monday — included
        make({ startedAt: "2026-03-15T10:00:00" }), // Sunday — included
      ],
      now,
    );
    expect(wk).toHaveLength(2);
  });
});
