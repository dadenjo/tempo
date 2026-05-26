/**
 * @file-summary
 * @capability tempo.platform
 * @hash sha256-9f3900a375d5ee63599d9b431080aebb5ad82288b1eb7c222746e5eafdcfc02e
 * @generated 2026-05-26T21:19:50.745Z
 *
 * Vitest test suite for id utility functions imported from `../id`. Tests verify that `newId` produces 200 unique values across calls, that `newId(prefix)` returns a string starting with `${prefix}_`, and that `nowIso()` and `todayIso()` return strings matching ISO datetime and date regex patterns respectively.
 *
 * @exports 
 * @imports vitest (describe, it, expect), ../id (newId, nowIso, todayIso)
 * @key-functions
 * @evidence src/lib/util/__tests__/id.test.ts:1-19
 */
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
