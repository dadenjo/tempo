---
capabilities:
  - id: tempo.today
    name: tempo.today
    description: >-
      The home dashboard where musicians start a timed practice session, watch the running clock, save completed
      sessions, and view their current streak — composed from src/app/page.tsx and the TimerPanel, TodaySessionList, and
      StreakBadge components.
    criticality: medium
    lifecycle: active
    file_path_patterns:
      - src/app/layout.tsx
      - src/app/page.tsx
      - src/components/today/StreakBadge.tsx
      - src/components/today/TimerPanel.tsx
      - src/components/today/TodaySessionList.tsx
    eyebrow: Daily Practice
    headline: Start, time, and log today's practice
    body: >-
      The Today view is the app's entry point and primary workflow: pick an instrument and piece, hit Start, and the
      timer runs until you save. The streak badge reinforces daily habit by making consecutive practice days visible at
      a glance.
    microcopy: Tap Start to begin a timed session; Save logs it instantly.
    value_statement: Reduces session-start friction to under five seconds so musicians spend time playing, not administering.
    key_concepts:
      - practice timer
      - session logging
      - daily streak
      - instrument pre-selection
      - idle/running/paused phases
    example_flow: >-
      User opens app → sees streak badge and today's total minutes → selects instrument and piece in TimerPanel →
      presses Start → pauses midway → resumes → presses Save → session appears in TodaySessionList
    visual_hint: Play/pause button with a running clock display, streak flame badge above it
    panel_anchors:
      - timer-panel
      - streak-badge
      - today-session-list
  - id: tempo.instruments
    name: tempo.instruments
    description: >-
      CRUD interface for the musician's instrument collection, exposing createInstrument, updateInstrument,
      deleteInstrument, and a primary-instrument designation that pre-populates the timer default in tempo.today.
    criticality: medium
    lifecycle: active
    file_path_patterns:
      - src/app/instruments/page.tsx
      - src/components/instruments/InstrumentForm.tsx
      - src/lib/instruments/index.ts
    eyebrow: Your Kit
    headline: Manage instruments and set your primary
    body: >-
      Musicians register each instrument they own and mark one as primary; the primary instrument pre-populates the
      TimerPanel so starting a session requires no repeated selection.
    microcopy: Mark one instrument as primary to make it your default session pick.
    value_statement: Eliminates per-session instrument selection by routing the primary instrument into every new timer automatically.
    key_concepts:
      - instrument registration
      - primary instrument
      - emoji selection
      - CRUD
      - getPrimaryInstrument
    example_flow: >-
      User taps + Add instrument → fills InstrumentForm (name, emoji) → saves → marks it primary → TimerPanel on Today
      now defaults to that instrument
    visual_hint: Instrument icon grid with a star/primary badge on the active row
    panel_anchors:
      - instrument-list
      - add-instrument
      - primary-badge
  - id: tempo.goals
    name: tempo.goals
    description: >-
      Goal creation and live evaluation for three goal types (weekly-minutes, instrument-frequency, piece-ready-by),
      with on-track/behind/missed status computed by evaluateGoal against the current session history.
    criticality: medium
    lifecycle: active
    file_path_patterns:
      - src/app/goals/page.tsx
      - src/components/goals/GoalForm.tsx
      - src/lib/goals/index.ts
    eyebrow: Intentions
    headline: Set goals and see if you're on track
    body: >-
      Goals give shape to a practice routine — a weekly-minutes target, an instrument-frequency commitment, or a
      piece-ready-by deadline. evaluateGoal computes live status from logged sessions so users immediately see
      behind/on-track/missed without manual calculation.
    microcopy: A handful of intentions that keep you honest.
    value_statement: >-
      Converts abstract practice ambitions into measurable commitments with real-time progress feedback drawn from local
      session history.
    key_concepts:
      - weekly-minutes
      - instrument-frequency
      - piece-ready-by
      - evaluateGoal
      - on-track/behind/missed status
    example_flow: >-
      User taps + Add goal → chooses weekly-minutes → sets 120 min target → saves → GoalsPage shows current week's
      logged minutes and an on-track or behind badge
    visual_hint: Progress bar row per goal with a colored status badge (green/amber/red)
    panel_anchors:
      - goal-list
      - add-goal
      - status-badge
  - id: tempo.pieces
    name: tempo.pieces
    description: >-
      Browse and inspect the music piece repertoire: a list view with active/polishing/shelved status badges and a
      detail page aggregating per-piece session history, total practice time, and a 60-day activity breakdown.
    criticality: medium
    lifecycle: active
    file_path_patterns:
      - src/app/library/page.tsx
      - src/app/library/[id]/page.tsx
      - src/lib/pieces/index.ts
    eyebrow: Repertoire
    headline: Browse your pieces and track time per title
    body: >-
      The library gives musicians a status-tagged roster of pieces (active, polishing, shelved) and a per-piece detail
      page that aggregates session history so they can see exactly how much time any single piece has received over the
      last 60 days.
    microcopy: See how much time you've given each piece.
    value_statement: Surfaces per-piece practice investment so musicians can identify neglected repertoire and rebalance their focus.
    key_concepts:
      - piece status
      - polishing
      - shelved
      - session aggregation
      - 60-day history
      - pieceRotation
      - filterPieces
    example_flow: >-
      User opens Library → sees pieces tagged active/polishing → clicks a piece → detail page shows total practised,
      session count, and 60-day breakdown
    visual_hint: Card grid with colored status badges; detail page shows a mini bar chart for the 60-day window
    panel_anchors:
      - piece-list
      - status-badge
      - piece-detail
      - session-history
  - id: tempo.sessions
    name: tempo.sessions
    description: >-
      Filterable, deletable log of all past practice sessions with search by date range, instrument, and intent, plus a
      running total of minutes and matching-session count.
    criticality: medium
    lifecycle: active
    file_path_patterns:
      - src/app/sessions/page.tsx
    eyebrow: Practice Log
    headline: Browse, filter, and correct your session history
    body: >-
      The sessions page is the historical ledger: every saved practice session appears here, searchable by date,
      instrument, and intent. Delete operations let users correct logging mistakes without touching other data.
    microcopy: Filter by instrument, intent, or date to find any session.
    value_statement: Provides full auditability of practice history so musicians can verify their logged effort and correct mistakes.
    key_concepts:
      - session log
      - filter by instrument
      - filter by intent
      - date range filter
      - deleteSession
      - total minutes
    example_flow: >-
      User opens Sessions → applies instrument filter → sees matching count and total minutes → finds an erroneous entry
      → deletes it → count updates
    visual_hint: Sortable list with filter chips above and a running total in the page header
    panel_anchors:
      - session-table
      - filter-bar
      - total-summary
  - id: tempo.stats
    name: tempo.stats
    description: >-
      Aggregated practice analytics rendered as a 365-day heatmap, instrument-split pie chart, intent-split bar chart,
      and time-of-day histogram, all computed client-side from session history via src/lib/stats.
    criticality: medium
    lifecycle: active
    file_path_patterns:
      - src/app/stats/page.tsx
      - src/components/stats/Charts.tsx
      - src/components/stats/Heatmap.tsx
      - src/lib/stats/index.ts
    eyebrow: Practice Analytics
    headline: See a year of practice in four charts
    body: >-
      Stats translates raw session records into four visualisations — a GitHub-style heatmap, instrument and intent
      splits, and a time-of-day histogram — helping musicians understand practice patterns at a glance without any
      server-side processing.
    microcopy: A picture of how your practice is going.
    value_statement: Converts local session data into actionable practice-pattern insights entirely in the browser.
    key_concepts:
      - 365-day heatmap
      - instrument split
      - intent split
      - time-of-day histogram
      - heatmapCells
      - levelForMinutes
      - pieceRotation
    example_flow: >-
      User opens Stats → sees 365-day heatmap with intensity levels → scrolls to instrument-split pie → checks
      intent-split bar chart and notices over-indexing on scales
    visual_hint: GitHub-style contribution heatmap above two smaller pie and bar charts
    panel_anchors:
      - heatmap
      - instrument-split
      - intent-split
      - time-of-day-chart
  - id: tempo.sync
    name: tempo.sync
    description: >-
      Data portability interface exposing JSON export, JSON import (with optional replace), and full data clear via
      src/lib/sync, surfaced to the user on the Settings page alongside a theme toggle.
    criticality: medium
    lifecycle: active
    file_path_patterns:
      - src/app/settings/page.tsx
      - src/components/shared/ui.tsx
      - src/lib/sync/index.ts
    eyebrow: Data & Settings
    headline: Export, import, and reset your practice data
    body: >-
      Settings is the user's data-ownership interface: export a full JSON backup, import a previous backup, clear all
      IndexedDB data, and switch colour theme. importData validates schema version before writing and optionally
      replaces existing records via resetDB.
    microcopy: Everything lives in this browser's IndexedDB — export to back up, import to restore.
    value_statement: Upholds the local-first contract by giving musicians portable, self-owned data backups and a safe reset path.
    key_concepts:
      - JSON export
      - JSON import
      - data clear
      - schema version negotiation
      - CURRENT_DATA_VERSION
      - theme toggle
    example_flow: >-
      User opens Settings → clicks Export → browser downloads tempo-backup.json → switches device → opens Settings on
      new browser → clicks Import → selects file → data restored; version mismatch causes rejection before any writes
    visual_hint: Download and upload buttons in a card, with a destructive Clear button separated below
    panel_anchors:
      - export-button
      - import-button
      - clear-data
      - theme-toggle
  - id: tempo.persistence
    name: tempo.persistence
    description: >-
      IndexedDB persistence layer exposing getDB (schema init + migrations) and resetDB (full store wipe), used by every
      domain module as the single access point for local storage.
    criticality: medium
    lifecycle: active
    file_path_patterns:
      - src/lib/persistence/index.ts
      - src/lib/persistence/db.ts
    eyebrow: Local Storage
    headline: Browser IndexedDB backing all practice data
    body: >-
      Persistence is the foundation of Tempo's local-first promise: every session, instrument, piece, and goal is stored
      in IndexedDB through getDB. All higher-level domain modules (sessions, instruments, pieces, goals, sync) call
      through this layer rather than opening the database themselves.
    microcopy: All data lives locally in your browser — no account required.
    value_statement: Enables fully offline, zero-latency data access while keeping all user data under the user's direct control.
    key_concepts:
      - IndexedDB
      - getDB
      - resetDB
      - schema migrations
      - local-first
      - data-format version
    example_flow: >-
      App boots → getDB opens IndexedDB and runs any pending migrations → state store hydrates → all domain modules read
      and write through the same DB handle instantly, with no network round-trip
    visual_hint: Database cylinder with an offline/local badge
    panel_anchors:
      - db-init
      - read-path
      - write-path
      - migration-chain
  - id: tempo.api
    name: tempo.api
    description: >-
      Static health-check endpoint at GET /api/health that returns the current data-format version, enabling PWA shells
      and CI smoke-test pipelines to verify a build is live and serving the expected schema version.
    criticality: medium
    lifecycle: active
    file_path_patterns:
      - src/app/api/health/route.ts
    eyebrow: Health Check
    headline: Versioned liveness endpoint for build verification
    body: >-
      A single force-static GET route returns the app's data-format version alongside a status string. Its consumers are
      CI smoke tests and PWA wrapper scripts that need to confirm a deployment is serving the expected build before
      marking it green.
    microcopy: Returns data-format version for smoke-testing deployments.
    value_statement: >-
      Provides a lightweight, zero-dependency liveness signal for deployment pipelines and PWA wrappers at negligible
      serving cost.
    key_concepts:
      - health endpoint
      - data-format version
      - force-static
      - PWA shell integration
      - CI smoke test
    example_flow: >-
      CI deploy completes → smoke test hits GET /api/health → receives { status, version } → asserts version matches
      expected value → marks deploy green
    visual_hint: Green pulse icon or checkmark badge
    panel_anchors:
      - health-route
---
