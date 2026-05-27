"use client";

/**
 * @amber-capability tempo.today
 */

import { useMemo, useState } from "react";
import { useStore, refresh } from "@/lib/state/store";
import { dayKey, todayKey, formatDuration } from "@/lib/util/date";
import { streakFromSessions, totalSecondsForDay } from "@/lib/sessions";
import { StreakBadge } from "@/components/today/StreakBadge";
import { TimerPanel } from "@/components/today/TimerPanel";
import { TodaySessionList } from "@/components/today/TodaySessionList";
import { Button, EmptyState } from "@/components/shared/ui";
import { seedExampleData } from "@/lib/seed";

export default function TodayPage() {
  const { loaded, instruments, pieces, sessions } = useStore();
  const [seeding, setSeeding] = useState(false);

  const today = todayKey();
  const todaySessions = useMemo(
    () => sessions.filter((s) => dayKey(s.startedAt) === today),
    [sessions, today],
  );
  const todayTotalSec = totalSecondsForDay(sessions, today);
  const streak = streakFromSessions(sessions);
  const primary = instruments.find((i) => i.primary) ?? instruments[0];

  if (!loaded) return <PageSkeleton />;

  const empty = instruments.length === 0 && pieces.length === 0 && sessions.length === 0;
  if (empty) {
    return (
      <div className="relative aurora">
        <header className="relative z-10 mb-8">
          <h1 className="text-4xl font-semibold tracking-tight">Welcome to Tempo</h1>
          <p className="text-[color:var(--muted)] mt-2 max-w-xl">
            A quiet, local-first practice tracker. Add an instrument and a piece to get started, or seed the app with example data to feel it out.
          </p>
        </header>
        <div className="grid sm:grid-cols-2 gap-4 relative z-10">
          <EmptyState
            title="Get hands-on quickly"
            description="Loads 30 days of synthetic practice across two instruments and four pieces so every screen has something to show."
            action={
              <Button
                variant="primary"
                onClick={async () => {
                  setSeeding(true);
                  await seedExampleData();
                  await refresh();
                  setSeeding(false);
                }}
                disabled={seeding}
              >
                {seeding ? "Seeding…" : "Seed with example data"}
              </Button>
            }
          />
          <EmptyState
            title="Start from scratch"
            description="Add your first instrument, then a few pieces from your repertoire, and use the Today timer to log practice as you go."
            action={
              <a href="/instruments" className="btn btn-ghost">Add instrument →</a>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative aurora">
      <header className="flex flex-wrap items-end justify-between gap-4 relative z-10">
        <div>
          <div className="text-xs uppercase tracking-wider text-[color:var(--muted)] mb-1">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Today</h1>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-[color:var(--muted)] mb-1">Practised today</div>
          <div className="text-2xl font-semibold tabular-nums">{formatDuration(todayTotalSec)}</div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_18rem] gap-5 relative z-10">
        <TimerPanel
          instruments={instruments}
          pieces={pieces}
          defaultInstrumentId={primary?.id ?? null}
        />
        <StreakBadge current={streak.current} longest={streak.longest} />
      </div>

      <section className="relative z-10">
        <h2 className="text-sm uppercase tracking-wider text-[color:var(--muted)] mb-3">Today's sessions</h2>
        <TodaySessionList sessions={todaySessions} instruments={instruments} pieces={pieces} />
      </section>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-40 rounded-md" style={{ background: "var(--bg-card)" }} />
      <div className="h-64 rounded-2xl" style={{ background: "var(--bg-card)" }} />
    </div>
  );
}
