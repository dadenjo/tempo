import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Instrument, Piece, Session } from "@/lib/types";

// Mock the store so we can drive page state declaratively per test.
const storeState = {
  loaded: true,
  instruments: [] as Instrument[],
  pieces: [] as Piece[],
  sessions: [] as Session[],
  goals: [],
};

vi.mock("@/lib/state/store", () => ({
  useStore: () => storeState,
  refresh: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/seed", () => ({
  seedExampleData: vi.fn().mockResolvedValue(undefined),
}));

// Avoid pulling the whole sessions module's IDB side-effects for this render-only test.
vi.mock("@/lib/sessions", async (orig) => {
  const actual = await orig<typeof import("@/lib/sessions")>();
  return {
    ...actual,
    createSession: vi.fn().mockResolvedValue(undefined),
    deleteSession: vi.fn().mockResolvedValue(undefined),
  };
});

const piano: Instrument = {
  id: "i1",
  name: "Piano",
  family: "keyboard",
  emoji: "🎹",
  pickupDate: null,
  primary: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const makeSession = (overrides: Partial<Session> = {}): Session => {
  const today = new Date();
  today.setHours(10, 0, 0, 0);
  const end = new Date(today.getTime() + 30 * 60 * 1000);
  return {
    id: "s1",
    instrumentId: "i1",
    pieceId: null,
    intent: "repertoire",
    tempo: null,
    startedAt: today.toISOString(),
    endedAt: end.toISOString(),
    durationSec: 1800,
    note: "",
    ...overrides,
  };
};

async function loadPage() {
  // Force a fresh import for each test so memoised module state doesn't leak.
  const mod = await import("@/app/page");
  return mod.default;
}

describe("TodayPage", () => {
  beforeEach(() => {
    vi.resetModules();
    storeState.loaded = true;
    storeState.instruments = [];
    storeState.pieces = [];
    storeState.sessions = [];
  });

  it("renders the page skeleton while the store has not loaded yet", async () => {
    storeState.loaded = false;
    const Page = await loadPage();
    const { container } = render(<Page />);
    // skeleton has no text, just placeholder divs
    expect(container.textContent?.trim()).toBe("");
  });

  it("renders the empty-state welcome when there is no data", async () => {
    const Page = await loadPage();
    render(<Page />);
    expect(screen.getByText(/Welcome to Tempo/i)).toBeInTheDocument();
    expect(screen.getByText(/Seed with example data/i)).toBeInTheDocument();
    expect(screen.getByText(/Add instrument/i)).toBeInTheDocument();
  });

  it("renders the Today dashboard when instruments and sessions exist", async () => {
    storeState.instruments = [piano];
    storeState.sessions = [makeSession()];
    const Page = await loadPage();
    render(<Page />);
    expect(screen.getByRole("heading", { level: 1, name: "Today" })).toBeInTheDocument();
    expect(screen.getByText(/Practised today/i)).toBeInTheDocument();
    expect(screen.getByText(/Today's sessions/i)).toBeInTheDocument();
  });
});
