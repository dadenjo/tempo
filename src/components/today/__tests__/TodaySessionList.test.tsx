import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TodaySessionList } from "@/components/today/TodaySessionList";
import { freshDB } from "@/test/dbHelper";
import type { Instrument, Piece, Session } from "@/lib/types";

vi.mock("@/lib/state/store", () => ({
  refresh: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/sessions", async (orig) => {
  const actual = await orig<typeof import("@/lib/sessions")>();
  return {
    ...actual,
    deleteSession: vi.fn().mockResolvedValue(undefined),
  };
});

const instrument: Instrument = {
  id: "i1",
  name: "Piano",
  family: "keyboard",
  emoji: "🎹",
  pickupDate: null,
  primary: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const piece: Piece = {
  id: "p1",
  title: "Prelude",
  composer: "Bach",
  instrumentId: "i1",
  difficulty: 3,
  status: "learning",
  key: "C",
  tempoTarget: null,
  notes: "",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const makeSession = (overrides: Partial<Session> = {}): Session => ({
  id: "s1",
  instrumentId: "i1",
  pieceId: "p1",
  intent: "repertoire",
  tempo: 90,
  startedAt: "2026-03-15T10:00:00.000Z",
  endedAt: "2026-03-15T10:30:00.000Z",
  durationSec: 1800,
  note: "felt great",
  ...overrides,
});

describe("TodaySessionList", () => {
  beforeEach(async () => {
    await freshDB();
    vi.clearAllMocks();
  });

  it("renders the empty state when there are no sessions", () => {
    render(<TodaySessionList sessions={[]} instruments={[]} pieces={[]} />);
    expect(screen.getByText(/No sessions yet today/i)).toBeInTheDocument();
  });

  it("renders a session row with piece title, instrument, tempo, and note", () => {
    render(
      <TodaySessionList
        sessions={[makeSession()]}
        instruments={[instrument]}
        pieces={[piece]}
      />,
    );
    expect(screen.getByText("Prelude")).toBeInTheDocument();
    expect(screen.getByText(/Piano/)).toBeInTheDocument();
    expect(screen.getByText(/90 BPM/)).toBeInTheDocument();
    expect(screen.getByText(/felt great/)).toBeInTheDocument();
  });

  it("renders 'Freeform' when no piece is linked and omits BPM when null", () => {
    render(
      <TodaySessionList
        sessions={[makeSession({ pieceId: null, tempo: null, note: "" })]}
        instruments={[instrument]}
        pieces={[]}
      />,
    );
    expect(screen.getByText(/Freeform/)).toBeInTheDocument();
    expect(screen.queryByText(/BPM/)).toBeNull();
  });

  it("falls back to the music emoji when the instrument is missing", () => {
    render(
      <TodaySessionList
        sessions={[makeSession({ instrumentId: "missing" })]}
        instruments={[]}
        pieces={[piece]}
      />,
    );
    // dash placeholder appears when instrument cannot be found
    expect(screen.getByText(/—/)).toBeInTheDocument();
  });

  it("calls deleteSession and refresh when the delete button is clicked", async () => {
    const { deleteSession } = await import("@/lib/sessions");
    const { refresh } = await import("@/lib/state/store");
    render(
      <TodaySessionList
        sessions={[makeSession()]}
        instruments={[instrument]}
        pieces={[piece]}
      />,
    );
    fireEvent.click(screen.getByText(/delete/i));
    await waitFor(() => {
      expect(deleteSession).toHaveBeenCalledWith("s1");
      expect(refresh).toHaveBeenCalled();
    });
  });
});
