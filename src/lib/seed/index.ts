/**
 * @file-summary
 * @capability tempo.persistence
 * @hash sha256-d1c04294c976fc9f2fba126591d900f22243f8cd459bd1becb0489e1a8e0d3e6
 * @generated 2026-05-26T21:18:07.501Z
 *
 * Generates synthetic seed data for an empty-state demo by creating 2 instruments (Upright Piano, Classical Guitar), 4 pieces tied to those instruments, and ~30 days of sessions with rough alternation between instruments. Uses a deterministic pseudo-random function based on Math.sin for reproducibility, skipping ~20% of days and producing 1-3 sessions per active day. Each session randomizes instrument, piece (from pool matching instrument), intent, hour (8-20), and duration (12-47 minutes).
 *
 * @exports seedExampleData
 * @imports @/lib/instruments (createInstrument), @/lib/pieces (createPiece), @/lib/sessions (createSession), @/lib/util/date (addDays), @/lib/types (SessionIntent)
 * @key-functions
 *   - seedExampleData() -> Promise<void> [20]
 *   - deterministic(n: number) -> number [111]
 * @evidence src/lib/seed/index.ts:6-10, src/lib/seed/index.ts:12-18, src/lib/seed/index.ts:20-29, src/lib/seed/index.ts:31-72, src/lib/seed/index.ts:74-79, src/lib/seed/index.ts:80-93, src/lib/seed/index.ts:94-105, src/lib/seed/index.ts:111-114
 */
/**
 * Synthetic seed data — used by the "Seed with example data" empty-state
 * action. Generates ~30 days of plausible sessions across 2 instruments
 * and 4 pieces so newcomers see populated stats immediately.
 */
import { createInstrument } from "@/lib/instruments";
import { createPiece } from "@/lib/pieces";
import { createSession } from "@/lib/sessions";
import { addDays } from "@/lib/util/date";
import type { SessionIntent } from "@/lib/types";

const INTENTS: SessionIntent[] = [
  "warmup",
  "technique",
  "repertoire",
  "sight-reading",
  "improvisation",
];

export async function seedExampleData(): Promise<void> {
  const piano = await createInstrument({
    name: "Upright Piano",
    family: "keyboard",
    primary: true,
  });
  const guitar = await createInstrument({
    name: "Classical Guitar",
    family: "strings",
  });

  const pieces = await Promise.all([
    createPiece({
      title: "Prelude in C",
      composer: "J.S. Bach",
      instrumentId: piano.id,
      difficulty: 3,
      status: "polishing",
      key: "C",
      tempoTarget: 92,
      notes: "Smooth voicing on the broken chords.",
    }),
    createPiece({
      title: "Clair de Lune",
      composer: "Debussy",
      instrumentId: piano.id,
      difficulty: 4,
      status: "learning",
      key: "Db",
      tempoTarget: 60,
      notes: "Focus on dynamic shaping in mm. 27–35.",
    }),
    createPiece({
      title: "Lágrima",
      composer: "Tárrega",
      instrumentId: guitar.id,
      difficulty: 2,
      status: "maintenance",
      key: "E",
      tempoTarget: 78,
      notes: "Keep the rest-stroke melody clear.",
    }),
    createPiece({
      title: "Asturias",
      composer: "Albéniz",
      instrumentId: guitar.id,
      difficulty: 5,
      status: "learning",
      key: "E min",
      tempoTarget: 120,
      notes: "Build the tremolo passages slowly.",
    }),
  ]);

  // 30 days of sessions, rough alternation between instruments.
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const day = addDays(today, -i);
    // Skip ~20% of days to make streaks realistic
    if (deterministic(i) < 0.2) continue;
    const count = 1 + Math.floor(deterministic(i + 7) * 2.4);
    for (let s = 0; s < count; s++) {
      const useGuitar = deterministic(i * 10 + s) > 0.55;
      const instr = useGuitar ? guitar : piano;
      const pool = pieces.filter((p) => p.instrumentId === instr.id);
      const piece = pool[Math.floor(deterministic(i * 13 + s) * pool.length)];
      const intent =
        INTENTS[Math.floor(deterministic(i * 17 + s + 1) * INTENTS.length)] ??
        "repertoire";
      const hour = 8 + Math.floor(deterministic(i * 19 + s) * 12); // 8 - 20
      const minutes = 12 + Math.floor(deterministic(i * 23 + s) * 35); // 12 - 47
      const start = new Date(day);
      start.setHours(hour, Math.floor(deterministic(i * 29 + s) * 60), 0, 0);
      const end = new Date(start.getTime() + minutes * 60_000);
      await createSession({
        instrumentId: instr.id,
        pieceId: piece?.id ?? null,
        intent,
        tempo: piece?.tempoTarget ?? null,
        startedAt: start.toISOString(),
        endedAt: end.toISOString(),
        note:
          deterministic(i * 31 + s) > 0.7
            ? "Felt the tempo settle after the first run-through."
            : "",
      });
    }
  }
}

// Cheap deterministic pseudo-random in [0,1) so seed data is reproducible.
function deterministic(n: number): number {
  const x = Math.sin(n * 9999.7) * 43758.5453;
  return x - Math.floor(x);
}
