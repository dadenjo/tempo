import { describe, it, expect } from "vitest";
import { newId, nowIso, todayIso } from "../id";

describe("id utils", () => {
  it("newId is unique enough across calls", () => {
    const a = new Set<string>();
    for (let i = 0; i < 200; i++) a.add(newId("x"));
    expect(a.size).toBe(200);
  });

  it("newId honours the prefix", () => {
    expect(newId("ss").startsWith("ss_")).toBe(true);
  });

  it("nowIso and todayIso return ISO strings", () => {
    expect(/\d{4}-\d{2}-\d{2}T/.test(nowIso())).toBe(true);
    expect(/^\d{4}-\d{2}-\d{2}$/.test(todayIso())).toBe(true);
  });
});
