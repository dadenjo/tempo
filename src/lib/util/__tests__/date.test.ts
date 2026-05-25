import { describe, it, expect } from "vitest";
import { addDays, dayKey, diffDays, formatClock, formatDuration, rangeDays, startOfWeek } from "../date";

describe("date utils", () => {
  it("dayKey returns YYYY-MM-DD using local time", () => {
    expect(dayKey(new Date("2026-03-15T10:00:00"))).toBe("2026-03-15");
  });

  it("addDays moves a date forward and backward", () => {
    const base = new Date("2026-01-10T00:00:00");
    expect(dayKey(addDays(base, 5))).toBe("2026-01-15");
    expect(dayKey(addDays(base, -10))).toBe("2025-12-31");
  });

  it("diffDays computes floor difference in days", () => {
    expect(diffDays(new Date("2026-01-10"), new Date("2026-01-01"))).toBe(9);
  });

  it("startOfWeek snaps to Monday", () => {
    // Wed 2026-03-11
    const sow = startOfWeek(new Date("2026-03-11T15:00:00"));
    expect(sow.getDay()).toBe(1);
    expect(sow.getHours()).toBe(0);
  });

  it("rangeDays returns the requested count anchored at end", () => {
    const days = rangeDays(new Date("2026-01-05T00:00:00"), 3);
    expect(days).toEqual(["2026-01-03", "2026-01-04", "2026-01-05"]);
  });

  it("formatDuration renders human time", () => {
    expect(formatDuration(0)).toBe("0s");
    expect(formatDuration(45)).toBe("45s");
    expect(formatDuration(125)).toBe("2m 5s");
    expect(formatDuration(3660)).toBe("1h 1m");
  });

  it("formatClock pads minutes and seconds", () => {
    expect(formatClock(0)).toBe("00:00");
    expect(formatClock(5)).toBe("00:05");
    expect(formatClock(65)).toBe("01:05");
    expect(formatClock(3725)).toBe("01:02:05");
  });
});
