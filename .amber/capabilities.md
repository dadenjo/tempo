---
capabilities:
  - id: tempo.goals
    name: tempo.goals
    description: >-
      Tracks practice goals that musicians set for themselves, including targets for time spent, repertoire mastery, or
      skill development. Enables users to define aspirations and measure progress toward them.
    criticality: medium
    lifecycle: active
    file_path_patterns:
      - src/lib/goals/
    eyebrow: PRACTICE GOALS
    headline: Turn aspirations into measurable practice targets
    body: >-
      Define what success looks like for your practice—whether it's hours per week, mastering a concerto, or building a
      new technique. Goals provide the scaffolding that gives every session a sense of direction and progress.
    microcopy: Set targets that motivate
    value_statement: Define and track personal practice ambitions with measurable progress signals.
    key_concepts:
      - target setting
      - progress tracking
      - milestone completion
      - repertoire goals
      - time-based targets
    example_flow: >-
      A violinist sets a goal of 10 hours of scales practice this month; the app tracks contributing sessions and
      surfaces a progress bar.
    visual_hint: progress-rings
  - id: tempo.instruments
    name: tempo.instruments
    description: >-
      Manages the catalog of musical instruments a user practices. Allows associating sessions and pieces with specific
      instruments for organized tracking across a multi-instrument practice routine.
    criticality: medium
    lifecycle: active
    file_path_patterns:
      - src/lib/instruments/
    eyebrow: INSTRUMENT CATALOG
    headline: Organise practice across every instrument you play
    body: >-
      Maintain a personal catalog of instruments and route every session, piece, and statistic to the right one.
      Multi-instrumentalists get clean separation while still seeing the bigger picture.
    microcopy: One profile per instrument
    value_statement: Manage a multi-instrument practice routine with clear per-instrument tracking.
    key_concepts:
      - instrument profiles
      - session association
      - piece tagging
      - multi-instrument support
    example_flow: A pianist adds both grand piano and harpsichord, tagging each session so weekly stats break down by instrument.
    visual_hint: card-grid
  - id: tempo.persistence
    name: tempo.persistence
    description: >-
      Handles durable local storage of user practice data so that sessions, pieces, goals, and stats survive across app
      reloads. Provides the storage substrate underlying all domain modules.
    criticality: medium
    lifecycle: active
    file_path_patterns:
      - src/lib/persistence/
      - src/lib/state/
      - src/lib/seed/
    eyebrow: LOCAL STORAGE
    headline: Durable storage that keeps practice data safe
    body: >-
      Every session, goal, and piece is written to durable local storage so nothing is lost between visits. This
      foundational layer underlies all domain modules and guarantees data survives reloads, restarts, and offline use.
    microcopy: Your data, always there
    value_statement: Persist all practice data locally so it survives across app reloads and offline use.
    key_concepts:
      - local storage
      - data durability
      - offline-first
      - storage substrate
    example_flow: A user logs a session offline on a flight; the data is saved locally and remains intact when the app reopens.
    visual_hint: layered-stack
  - id: tempo.pieces
    name: tempo.pieces
    description: >-
      Manages the user's repertoire of musical pieces being learned or maintained. Tracks metadata about each piece and
      links them to practice sessions and progress.
    criticality: medium
    lifecycle: active
    file_path_patterns:
      - src/lib/pieces/
    eyebrow: REPERTOIRE
    headline: Manage the music you're learning and maintaining
    body: >-
      Catalog every piece in your active repertoire with metadata like composer, difficulty, and status. Link pieces to
      sessions to see exactly how much time each work has received.
    microcopy: Your living repertoire
    value_statement: Organise the pieces you're studying and link them to practice activity.
    key_concepts:
      - repertoire catalog
      - piece metadata
      - session linking
      - learning status
    example_flow: >-
      A guitarist adds Bach's Lute Suite No. 1, marks it as in-progress, and sees cumulative practice time grow with
      each linked session.
    visual_hint: list-with-detail
  - id: tempo.sessions
    name: tempo.sessions
    description: >-
      Records individual practice sessions, capturing what was practiced, for how long, and on which instrument or
      piece. Forms the core activity log of the application.
    criticality: medium
    lifecycle: active
    file_path_patterns:
      - src/lib/sessions/
    eyebrow: PRACTICE LOG
    headline: Capture every practice session as it happens
    body: >-
      Sessions are the heartbeat of Tempo—each one records duration, instrument, pieces worked on, and notes. Together
      they form the activity log that powers goals, stats, and your sense of progress.
    microcopy: The core practice log
    value_statement: Record practice activity in structured sessions that fuel every other feature.
    key_concepts:
      - session logging
      - duration tracking
      - instrument association
      - piece linking
      - practice notes
    example_flow: >-
      A user starts a 45-minute session on violin, tags two pieces, and saves notes about a tricky passage for next
      time.
    visual_hint: timeline
  - id: tempo.stats
    name: tempo.stats
    description: >-
      Aggregates session and goal data into meaningful statistics and visualisations about practice habits over time.
      Helps users understand trends, consistency, and accomplishments.
    criticality: medium
    lifecycle: active
    file_path_patterns:
      - src/lib/stats/
    eyebrow: INSIGHTS
    headline: See your practice patterns and progress at a glance
    body: >-
      Stats roll up sessions and goals into charts, streaks, and summaries that reveal how you're really practising.
      Spot trends, celebrate consistency, and identify the instruments or pieces getting too little attention.
    microcopy: Patterns in your practice
    value_statement: Reveal practice trends, consistency, and accomplishments through aggregated visualisations.
    key_concepts:
      - aggregations
      - trends
      - streaks
      - visualisations
      - habit analysis
    example_flow: A weekly dashboard shows total hours, a streak counter, and a breakdown of time spent per piece.
    visual_hint: charts-dashboard
  - id: tempo.sync
    name: tempo.sync
    description: >-
      Synchronises practice data between the local device and remote storage or across devices. Ensures users have a
      consistent view of their practice history wherever they log in.
    criticality: medium
    lifecycle: active
    file_path_patterns:
      - src/lib/sync/
    eyebrow: CROSS-DEVICE SYNC
    headline: Keep practice data consistent on every device
    body: >-
      Sync reconciles local practice data with remote storage so you can log on your phone after a lesson and review on
      your laptop at home. Conflicts are resolved cleanly so your history stays trustworthy.
    microcopy: Practice anywhere, seen everywhere
    value_statement: Synchronise practice data across devices so history is consistent everywhere you log in.
    key_concepts:
      - remote sync
      - cross-device
      - conflict resolution
      - data consistency
    example_flow: >-
      A student logs a session on their tablet during a lesson; minutes later it appears in stats on their home
      computer.
    visual_hint: device-mesh
  - id: tempo.platform
    name: tempo.platform
    description: >-
      Shared foundational scaffolding including type definitions, utilities, and Next.js application configuration that
      supports all domain capabilities.
    criticality: medium
    lifecycle: active
    file_path_patterns:
      - src/lib/types/
      - src/lib/util/
      - next.config.ts
      - package.json
      - tsconfig.json
    eyebrow: FOUNDATION
    headline: Shared scaffolding that every capability depends on
    body: >-
      Platform houses the type definitions, utilities, and Next.js configuration that hold the application together.
      It's the common ground every domain capability builds on top of.
    microcopy: The shared foundation
    value_statement: Provide the shared types, utilities, and app configuration that underpin every capability.
    key_concepts:
      - type definitions
      - shared utilities
      - Next.js configuration
      - scaffolding
    example_flow: A new feature reuses platform-defined types and utility helpers instead of reinventing them per module.
    visual_hint: foundation-block
---
