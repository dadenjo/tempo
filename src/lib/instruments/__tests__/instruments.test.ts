import { describe, it, expect, beforeEach } from "vitest";
import { createInstrument, deleteInstrument, getInstrument, getPrimaryInstrument, listInstruments, updateInstrument, defaultEmojiFor } from "@/lib/instruments";
import { freshDB } from "@/test/dbHelper";

describe("instruments", () => {
  beforeEach(async () => { await freshDB(); });

  it("creates with defaults and lists primaries first", async () => {
    const a = await createInstrument({ name: "Guitar", family: "strings" });
    const b = await createInstrument({ name: "Piano", family: "keyboard", primary: true });
    const list = await listInstruments();
    expect(list[0]!.id).toBe(b.id);
    expect(list[1]!.id).toBe(a.id);
    expect(a.emoji).toBe(defaultEmojiFor("strings"));
  });

  it("only one primary at a time", async () => {
    const a = await createInstrument({ name: "A", family: "strings", primary: true });
    await createInstrument({ name: "B", family: "keyboard", primary: true });
    const refreshedA = await getInstrument(a.id);
    expect(refreshedA?.primary).toBe(false);
  });

  it("updates and deletes", async () => {
    const a = await createInstrument({ name: "Old", family: "winds" });
    const updated = await updateInstrument(a.id, { name: "New" });
    expect(updated?.name).toBe("New");
    await deleteInstrument(a.id);
    expect(await getInstrument(a.id)).toBeUndefined();
  });

  it("getPrimaryInstrument falls back to first when none flagged", async () => {
    await createInstrument({ name: "Solo", family: "voice" });
    const p = await getPrimaryInstrument();
    expect(p?.name).toBe("Solo");
  });
});
