"use client";

/**
 * @amber-capability tempo.goals
 * @amber-doc Goal creation and live evaluation for three goal types (weekly-minutes, instrument-frequency, piece-ready-by), with on-track/behind/missed status computed by evaluateGoal against the current session history.
 */

import { useMemo, useState } from "react";
import { useStore, refresh } from "@/lib/state/store";
import { Button, EmptyState } from "@/components/shared/ui";
import { GoalForm } from "@/components/goals/GoalForm";
import { deleteGoal, evaluateGoal } from "@/lib/goals";

export default function GoalsPage() {
  const { goals, sessions, instruments, pieces } = useStore();
  const [open, setOpen] = useState(false);

  const evaluated = useMemo(
    () => goals.filter((g) => !g.archivedAt).map((g) => ({ goal: g, progress: evaluateGoal(g, sessions) })),
    [goals, sessions],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Goals</h1>
          <p className="text-sm text-[color:var(--muted)] mt-1">A handful of intentions that keep you honest.</p>
        </div>
        <Button variant="primary" onClick={() => setOpen(true)}>+ Add goal</Button>
      </div>

      {evaluated.length === 0 ? (
        <EmptyState
          title="No goals yet"
          description="Set a weekly minutes target, work toward getting a piece performance-ready, or commit to picking up an instrument N times a week."
          action={<Button variant="primary" onClick={() => setOpen(true)}>Add goal</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {evaluated.map(({ goal, progress }) => (
            <div key={goal.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold">{goal.title}</div>
                  <div className="text-xs text-[color:var(--muted)] mt-0.5">{progress.label}</div>
                </div>
                <span
                  className="badge"
                  style={{
                    background:
                      progress.status === "done" ? "color-mix(in oklab, var(--accent) 22%, transparent)"
                      : progress.status === "behind" ? "color-mix(in oklab, var(--rose) 18%, transparent)"
                      : progress.status === "missed" ? "color-mix(in oklab, var(--rose) 22%, transparent)"
                      : "color-mix(in oklab, var(--accent) 14%, transparent)",
                    color:
                      progress.status === "behind" || progress.status === "missed"
                        ? "var(--rose)" : "var(--accent)",
                    borderColor: "transparent",
                  }}
                >
                  {progress.status}
                </span>
              </div>
              <div className="mt-4">
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "color-mix(in oklab, var(--muted) 16%, transparent)" }}>
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.min(100, progress.percent)}%`,
                      background: progress.status === "behind" || progress.status === "missed"
                        ? "var(--rose)"
                        : "linear-gradient(90deg, var(--accent), var(--accent-strong))",
                      transition: "width 350ms ease",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-[color:var(--muted)]">
                  <span>{Math.round(progress.percent)}%</span>
                  <button
                    onClick={async () => {
                      if (confirm("Delete this goal?")) {
                        await deleteGoal(goal.id);
                        await refresh();
                      }
                    }}
                    className="hover:text-[color:var(--rose)]"
                  >
                    delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <GoalForm open={open} onClose={() => setOpen(false)} instruments={instruments} pieces={pieces} />
    </div>
  );
}
