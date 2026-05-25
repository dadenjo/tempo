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
