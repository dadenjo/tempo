# Capabilities

## tempo.goals
**Track weekly minutes, piece readiness, and instrument frequency**

Defines a Goal model with CRUD operations against an IndexedDB-like 'goals' store, plus a pure evaluateGoal function that derives progress from a session list. Supports three goal types: weekly-minutes (sums durations in the current week against targetMinutes), piece-ready-by (accumulates minutes logged for a pieceId using a hardcoded 600-minute = 100% heuristic with a dueDate), and instrument-frequency (counts distinct practice days this week vs perWeek). Status is computed as 'on-track' | 'behind' | 'done' | 'missed' by comparing percent against the current day's proportion of the week.

Key concepts:
- weekly-minutes
- piece-ready-by
- instrument-frequency
- GoalProgress
- dayProportionOfWeek
- status: on-track/behind/done/missed

## tempo.instruments
**CRUD for user instruments with a single-primary invariant**

Manages Instrument records in an IndexedDB 'instruments' object store via getDB(), exposing list/get/create/update/delete operations. Enforces that at most one instrument is flagged primary by clearing the flag on others within a readwrite transaction when a new primary is set. listInstruments sorts primary-first then by name, and getPrimaryInstrument falls back to the first instrument when none is flagged. A defaultEmojiFor map provides emojis for six InstrumentFamily values.

Key concepts:
- Instrument
- InstrumentFamily
- primary flag
- IndexedDB object store
- defaultEmojiFor

## tempo.persistence
**IndexedDB-backed persistence for instruments, pieces, sessions, and goals**

Wraps the `idb` library to open a `tempo` IndexedDB database (version 1) with five object stores—instruments, pieces, sessions, goals, and meta—plus indexes on pieces (by-instrument) and sessions (by-instrument, by-piece, by-startedAt) [src/lib/persistence/db.ts:7-21]. Exposes `getDB` for lazy singleton access (throws when `indexedDB` is undefined), `resetDB` to clear all stores, and `_resetDbCacheForTests` for test isolation [src/lib/persistence/db.ts:25-71]. A client-side store loads these collections into memory, sorts them (instruments by primary-flag then name; pieces by title; sessions/goals by date descending), and publishes changes through a `useSyncExternalStore` React hook [src/lib/state/store.ts:35-81]. A seed helper populates the database with 2 instruments, 4 pieces, and ~30 days of synthetic sessions using a deterministic Math.sin-based PRNG for an empty-state demo [src/lib/seed/index.ts:20-114].

Key concepts:
- IndexedDB
- object stores
- indexes
- singleton DB connection
- in-memory store with pub/sub
- seed data

## tempo.pieces
**Manage practice pieces and surface neglected repertoire**

Provides CRUD operations over a 'pieces' store in IndexedDB, including default values on creation (difficulty=3, status='learning', composer=''). Offers filterPieces for status, instrumentId, and case-insensitive title/composer query matching, and pieceRotation which aggregates session durations per piece, computes days since last practice, and flags pieces as neglected when never practiced or last practiced 14+ days ago (excluding 'shelved' pieces).

Key concepts:
- Piece CRUD
- Filtering
- Rotation analysis
- Neglected threshold (14 days)
- Shelved status

## tempo.sessions
**Practice session records with day totals and streaks**

Manages practice session records in an IndexedDB store via getDB, exposing CRUD operations that compute durationSec from startedAt/endedAt timestamps. Aggregate helpers compute per-day totals in seconds or minutes, and a streak helper derives current and longest streaks where a day counts only if it contains at least 60 seconds of logged time. Behavior is covered by a Vitest suite that exercises CRUD, duration recomputation on update, day filtering, and edge cases for streaks including gaps and leading from yesterday.

Key concepts:
- session
- durationSec
- totalSecondsForDay
- totalMinutesForDay
- streakFromSessions
- 60-second day threshold

## tempo.stats
**Pure functions that turn session logs into charts**

The stats module aggregates `Session` arrays into heatmap cells, hour-of-day histograms, instrument/intent duration splits, total minutes, and an ISO-week filter (src/lib/stats/index.ts:16-88). Minute totals are bucketed into discrete levels 0–4 at 0/10/20/45/120-minute thresholds for heatmap rendering (src/lib/stats/index.ts:32-38). All functions are side-effect free and covered by Vitest unit tests asserting bucket thresholds, 24-hour histogram length, week filtering from Monday 00:00, and duration summing (src/lib/stats/__tests__/stats.test.ts:18-107).

Key concepts:
- heatmap cells
- level bucketing
- time-of-day histogram
- instrument split
- intent split
- ISO week (Monday-based)
- durationSec → minutes

## tempo.sync
**Export and import the full IndexedDB app state as JSON**

The sync module reads every record from the instruments, pieces, sessions, and goals object stores and packages them into a versioned AppData object with a timestamp (src/lib/sync/index.ts:12-28). It can serialize that object to pretty-printed JSON, validate and parse incoming JSON, and import records back into IndexedDB in a single readwrite transaction, optionally replacing existing data first via resetDB (src/lib/sync/index.ts:30-85). Imports whose version exceeds CURRENT_DATA_VERSION (1) or whose shape is invalid are rejected (src/lib/sync/index.ts:10, 40-53). A clearAllData helper wraps resetDB for full wipes (src/lib/sync/index.ts:87-89).

Key concepts:
- AppData
- CURRENT_DATA_VERSION
- exportData
- importData
- parseAppData
- serializeData
- clearAllData
- replace mode

## tempo.platform
**Shared domain types and utility helpers for the music practice app**

This capability provides the foundational TypeScript domain model and small utility helpers used across the app. It defines shared types for instruments, pieces, sessions, goals, and an aggregate AppData container (src/lib/types/index.ts:8-118), and exports utility functions for generating short base36 IDs (src/lib/util/id.ts:5-17) and for formatting/manipulating dates including day keys, week starts, day ranges, durations, and clock strings (src/lib/util/date.ts:7-66). A Next.js config file is present but empty (next.config.ts:3-7).

Key concepts:
- Instrument
- Piece
- Session
- Goal
- AppData
- day key (YYYY-MM-DD)
- base36 id
