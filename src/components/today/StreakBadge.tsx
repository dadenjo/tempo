"use client";

export function StreakBadge({ current, longest }: { current: number; longest: number }) {
  return (
    <div className="card p-5 flex items-center gap-5">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
        style={{
          background: "color-mix(in oklab, var(--accent) 18%, transparent)",
          color: "var(--accent)",
        }}
        aria-hidden
      >
        🔥
      </div>
      <div>
        <div className="text-3xl font-semibold leading-none">{current}</div>
        <div className="text-sm text-[color:var(--muted)] mt-1">
          day streak · longest <span className="text-[color:var(--text)]">{longest}</span>
        </div>
      </div>
    </div>
  );
}
