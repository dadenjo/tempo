/**
 * @file-summary
 * @capability tempo.goals
 * @hash sha256-8dda35e22b410faa057cb793c1934335fd9c6ac83b6f95360c5fe9216c303655
 * @generated 2026-05-26T21:17:23.156Z
 *
 * Defines CRUD operations for Goal objects persisted via an IndexedDB-like store (getDB) in the 'goals' object store, and a pure evaluateGoal function that derives progress from sessions. Supports three goal types: 'weekly-minutes' (sums session durations for the current week vs targetMinutes), 'piece-ready-by' (accumulates minutes logged against a pieceId with a hardcoded 600-minute = 100% heuristic and a dueDate), and 'instrument-frequency' (counts distinct days an instrument was practiced this week vs perWeek). Status is one of 'on-track' | 'behind' | 'done' | 'missed', computed by comparing percent against the current day's proportion of the week, with 'missed' only for overdue piece goals.
 *
 * @exports CreateGoalInput, listGoals, createGoal, updateGoal, deleteGoal, GoalProgress, evaluateGoal
 * @imports @/lib/persistence/db (getDB), @/lib/types (Goal, GoalType, Session), @/lib/util/id (newId, nowIso), @/lib/util/date (dayKey, diffDays), @/lib/stats (sessionsThisWeek)
 * @key-functions
 *   - listGoals() -> Promise<Goal[]> [22]
 *   - createGoal(input: CreateGoalInput) -> Promise<Goal> [28]
 *   - updateGoal(id: string, patch: Partial<Goal>) -> Promise<Goal | undefined> [46]
 *   - deleteGoal(id: string) -> Promise<void> [58]
 *   - evaluateGoal(goal: Goal, sessions: Session[], now?: Date) -> GoalProgress [70]
 *   - dayProportionOfWeek(now: Date) -> number [137]
 * @evidence src/lib/goals/index.ts:6-10, src/lib/goals/index.ts:12-20, src/lib/goals/index.ts:22-26, src/lib/goals/index.ts:28-44, src/lib/goals/index.ts:46-56, src/lib/goals/index.ts:58-61, src/lib/goals/index.ts:63-68, src/lib/goals/index.ts:75-89, src/lib/goals/index.ts:90-115, src/lib/goals/index.ts:102, src/lib/goals/index.ts:116-135, src/lib/goals/index.ts:137-141
 */
/**
 * @amber-capability tempo.goals
 * Goal definition, persistence, and progress evaluation. Goals are pure
 * objects; progress is derived from sessions on demand.
 */
import { getDB } from "@/lib/persistence/db";
import type { Goal, GoalType, Session } from "@/lib/types";
import { newId, nowIso } from "@/lib/util/id";
import { dayKey, diffDays } from "@/lib/util/date";
import { sessionsThisWeek } from "@/lib/stats";

export interface CreateGoalInput {
  type: GoalType;
  title: string;
  targetMinutes?: number;
  pieceId?: string;
  dueDate?: string;
  instrumentId?: string;
  perWeek?: number;
}

export async function listGoals(): Promise<Goal[]> {
  const db = await getDB();
  const all = await db.getAll("goals");
  return all.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function createGoal(input: CreateGoalInput): Promise<Goal> {
  const goal: Goal = {
    id: newId("gl"),
    type: input.type,
    title: input.title.trim(),
    targetMinutes: input.targetMinutes,
    pieceId: input.pieceId,
    dueDate: input.dueDate,
    instrumentId: input.instrumentId,
    perWeek: input.perWeek,
    createdAt: nowIso(),
    archivedAt: null,
  };
  const db = await getDB();
  await db.put("goals", goal);
  return goal;
}

export async function updateGoal(
  id: string,
  patch: Partial<Goal>,
): Promise<Goal | undefined> {
  const db = await getDB();
  const existing = await db.get("goals", id);
  if (!existing) return undefined;
  const next: Goal = { ...existing, ...patch, id: existing.id };
  await db.put("goals", next);
  return next;
}

export async function deleteGoal(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("goals", id);
}

export interface GoalProgress {
  goalId: string;
  percent: number;
  label: string;
  status: "on-track" | "behind" | "done" | "missed";
}

export function evaluateGoal(
  goal: Goal,
  sessions: Session[],
  now: Date = new Date(),
): GoalProgress {
  if (goal.type === "weekly-minutes") {
    const target = goal.targetMinutes ?? 0;
    const week = sessionsThisWeek(sessions, now);
    const done = Math.round(
      week.reduce((acc, s) => acc + s.durationSec, 0) / 60,
    );
    const percent = target === 0 ? 0 : Math.min(100, (done / target) * 100);
    return {
      goalId: goal.id,
      percent,
      label: `${done} / ${target} min this week`,
      status:
        percent >= 100 ? "done" : percent >= dayProportionOfWeek(now) * 100 ? "on-track" : "behind",
    };
  }
  if (goal.type === "piece-ready-by") {
    const pieceId = goal.pieceId;
    const dueDate = goal.dueDate;
    if (!pieceId || !dueDate) {
      return { goalId: goal.id, percent: 0, label: "Misconfigured", status: "behind" };
    }
    const totalMin = Math.round(
      sessions
        .filter((s) => s.pieceId === pieceId)
        .reduce((acc, s) => acc + s.durationSec, 0) / 60,
    );
    const daysLeft = diffDays(new Date(dueDate), now);
    const percent = Math.min(100, totalMin / 600 * 100); // 10h = 100% (heuristic)
    const status: GoalProgress["status"] =
      daysLeft < 0 && percent < 100 ? "missed" :
      percent >= 100 ? "done" :
      daysLeft <= 7 && percent < 70 ? "behind" : "on-track";
    return {
      goalId: goal.id,
      percent,
      label: daysLeft >= 0
        ? `${totalMin}m logged · ${daysLeft}d to go`
        : `${totalMin}m logged · overdue ${Math.abs(daysLeft)}d`,
      status,
    };
  }
  // instrument-frequency
  const instrumentId = goal.instrumentId;
  const perWeek = goal.perWeek ?? 0;
  if (!instrumentId || perWeek === 0) {
    return { goalId: goal.id, percent: 0, label: "Misconfigured", status: "behind" };
  }
  const week = sessionsThisWeek(sessions, now);
  const days = new Set(
    week.filter((s) => s.instrumentId === instrumentId).map((s) => dayKey(s.startedAt)),
  );
  const done = days.size;
  const percent = Math.min(100, (done / perWeek) * 100);
  return {
    goalId: goal.id,
    percent,
    label: `${done} / ${perWeek} days this week`,
    status:
      percent >= 100 ? "done" : percent >= dayProportionOfWeek(now) * 100 ? "on-track" : "behind",
  };
}

function dayProportionOfWeek(now: Date): number {
  const day = now.getDay();
  const mondayBased = day === 0 ? 7 : day;
  return mondayBased / 7;
}
