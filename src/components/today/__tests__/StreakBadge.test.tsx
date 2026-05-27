import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StreakBadge } from "@/components/today/StreakBadge";

describe("StreakBadge", () => {
  it("renders the current streak number", () => {
    render(<StreakBadge current={7} longest={12} />);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("renders the longest streak number", () => {
    render(<StreakBadge current={3} longest={21} />);
    expect(screen.getByText("21")).toBeInTheDocument();
  });

  it("renders zero values when streak is empty", () => {
    const { container } = render(<StreakBadge current={0} longest={0} />);
    // current is the large number; longest is the inline span — both should appear
    expect(container.textContent).toMatch(/0/);
    expect(container.textContent).toContain("day streak");
    expect(container.textContent).toContain("longest");
  });
});
