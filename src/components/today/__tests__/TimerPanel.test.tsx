import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { TimerPanel } from "@/components/today/TimerPanel";
import { freshDB } from "@/test/dbHelper";
import type { Instrument, Piece } from "@/lib/types";

vi.mock("@/lib/state/store", () => ({
  refresh: vi.fn().mockResolvedValue(undefined),
}));

const createSessionMock = vi.fn().mockResolvedValue(undefined);

vi.mock("@/lib/sessions", async (orig) => {
  const actual = await orig<typeof import("@/lib/sessions")>();
  return {
    ...actual,
    createSession: (...args: unknown[]) => createSessionMock(...args),
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

const guitar: Instrument = {
  ...piano,
  id: "i2",
  name: "Guitar",
  family: "strings",
  emoji: "🎸",
  primary: false,
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

describe("TimerPanel", () => {
  beforeEach(async () => {
    await freshDB();
    createSessionMock.mockClear();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the Start button enabled when an instrument is available", () => {
    render(<TimerPanel instruments={[piano]} pieces={[piece]} defaultInstrumentId="i1" />);
    const start = screen.getByRole("button", { name: /Start/i });
    expect(start).toBeEnabled();
  });

  it("disables Start when no instrument is selected", () => {
    render(<TimerPanel instruments={[]} pieces={[]} defaultInstrumentId={null} />);
    const start = screen.getByRole("button", { name: /Start/i });
    expect(start).toBeDisabled();
  });

  it("transitions idle → running → paused and shows Resume + Save + Discard", () => {
    render(<TimerPanel instruments={[piano]} pieces={[piece]} defaultInstrumentId="i1" />);
    fireEvent.click(screen.getByRole("button", { name: /Start/i }));
    expect(screen.getByRole("button", { name: /Pause/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Pause/i }));
    expect(screen.getByRole("button", { name: /Resume/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Discard/i })).toBeInTheDocument();
  });

  it("filters pieces to those matching the selected instrument or freeform", () => {
    const otherPiece: Piece = { ...piece, id: "p2", title: "Etude", instrumentId: "i2" };
    const freeform: Piece = { ...piece, id: "p3", title: "Scales", instrumentId: null };
    render(
      <TimerPanel
        instruments={[piano, guitar]}
        pieces={[piece, otherPiece, freeform]}
        defaultInstrumentId="i1"
      />,
    );
    // Piano-bound piece + null-instrument freeform appear; guitar-bound piece does not
    expect(screen.getByRole("option", { name: /Prelude/ })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Scales/ })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Etude/ })).toBeNull();
  });

  it("discards a session shorter than 5 seconds instead of saving", async () => {
    render(<TimerPanel instruments={[piano]} pieces={[piece]} defaultInstrumentId="i1" />);
    fireEvent.click(screen.getByRole("button", { name: /Start/i }));
    // immediately pause → 0 seconds elapsed
    fireEvent.click(screen.getByRole("button", { name: /Pause/i }));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Save/i }));
    });
    expect(createSessionMock).not.toHaveBeenCalled();
    // back to idle
    expect(screen.getByRole("button", { name: /Start/i })).toBeInTheDocument();
  });

  it("calls createSession after the timer accumulates ≥ 5 seconds", async () => {
    const baseNow = Date.UTC(2026, 2, 15, 10, 0, 0);
    vi.setSystemTime(baseNow);
    render(<TimerPanel instruments={[piano]} pieces={[piece]} defaultInstrumentId="i1" />);
    fireEvent.click(screen.getByRole("button", { name: /Start/i }));
    // advance 10 seconds of wall clock
    vi.setSystemTime(baseNow + 10_000);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Save/i }));
    });
    expect(createSessionMock).toHaveBeenCalledTimes(1);
    const arg = createSessionMock.mock.calls[0][0] as { instrumentId: string; intent: string };
    expect(arg.instrumentId).toBe("i1");
    expect(arg.intent).toBe("repertoire");
  });
});
