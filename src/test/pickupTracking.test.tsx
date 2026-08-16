import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BuyerPickupTracking from "@/pages/buyer/PickupTracking";
import {
  STAGE_DURATIONS,
  clearPickup,
  deriveStage,
  getPickup,
  startPickup,
  tickPickup,
} from "@/lib/pickupTracker";

function renderTracking() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
    <MemoryRouter initialEntries={["/buyer/pickup-tracking?fee=2800&pickup=A&dropoff=B"]}>
      <Routes>
        <Route path="/buyer/pickup-tracking" element={<BuyerPickupTracking />} />
        <Route path="/buyer/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
    </QueryClientProvider>,
  );
}

// Advance both the mocked wall clock (Date.now) and pending timers together
// so the polling subscription re-derives the stage.
function tick(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe("pickup tracker — pure state machine", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("derives stages purely from elapsed time before handover", () => {
    const state = startPickup({ fee: 2800, pickup: "A", dropoff: "B", now: 0 });
    expect(deriveStage(state, 0).stage).toBe("assigning");
    expect(deriveStage(state, STAGE_DURATIONS.assigningMs).stage).toBe("enroute-pickup");
    expect(
      deriveStage(state, STAGE_DURATIONS.assigningMs + STAGE_DURATIONS.enroutePickupMs).stage,
    ).toBe("at-pickup");
    // Stays at at-pickup until handover, even far into the future.
    expect(deriveStage(state, 60_000).stage).toBe("at-pickup");
  });

  it("progresses to delivered after handover once in-transit duration elapses", () => {
    const state = startPickup({ fee: 2800, pickup: "A", dropoff: "B", now: 0 });
    const handedOver = { ...state, handoverAt: 10_000 };
    expect(deriveStage(handedOver, 10_000).stage).toBe("in-transit");
    expect(deriveStage(handedOver, 10_000 + STAGE_DURATIONS.inTransitMs).stage).toBe("delivered");
  });
});

describe("BuyerPickupTracking — end-to-end lifecycle", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ shouldAdvanceTime: false });
    vi.setSystemTime(new Date("2026-07-18T10:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    clearPickup();
  });

  it("auto-advances through all pickup stages without a manual refresh", () => {
    renderTracking();

    // Stage 1: assigning — label appears in status card + timeline
    expect(screen.getAllByText("Finding a rider").length).toBeGreaterThan(0);
    // Rider card is hidden until a match is made
    expect(screen.queryByText(/Tunde Adebayo/)).not.toBeInTheDocument();

    // Stage 2: rider en route
    tick(STAGE_DURATIONS.assigningMs + 100);
    expect(screen.getAllByText("Rider en route to you").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Tunde Adebayo/).length).toBeGreaterThan(0);

    // Stage 3: rider arrived — pickup code panel appears automatically
    tick(STAGE_DURATIONS.enroutePickupMs + 100);
    expect(
      screen.getAllByText("Rider arrived — share your pickup code").length,
    ).toBeGreaterThan(0);
    const code = getPickup()!.code;
    expect(code).toMatch(/^\d{6}$/);
    expect(screen.getByText(code)).toBeInTheDocument();

    // Buyer confirms handover — stage jumps to in-transit
    const handoverBtn = screen.getByRole("button", {
      name: /Rider entered the code — hand over the package/i,
    });
    act(() => {
      fireEvent.click(handoverBtn);
    });
    expect(screen.getAllByText("Package in transit").length).toBeGreaterThan(0);
    expect(screen.getByText(/^\d+m$/)).toBeInTheDocument();

    // Stage 5: delivered after in-transit window elapses
    tick(STAGE_DURATIONS.inTransitMs + 1000);
    expect(getPickup()!.stage).toBe("delivered");
    expect(screen.getAllByText("Package delivered").length).toBeGreaterThan(0);
  });

  it("resumes the same pickup after the component unmounts and remounts (no refresh loss)", () => {
    renderTracking().unmount();
    const state = getPickup();
    expect(state).not.toBeNull();

    // Simulate wall-clock passing while the screen is not mounted
    tick(STAGE_DURATIONS.assigningMs + STAGE_DURATIONS.enroutePickupMs + 500);
    tickPickup();
    expect(getPickup()!.stage).toBe("at-pickup");

    // Re-mount — the screen picks up exactly where it left off
    renderTracking();
    expect(
      screen.getAllByText("Rider arrived — share your pickup code").length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(state!.orderId).length).toBeGreaterThan(0);
  });

  it("moves the map bike marker as stages advance", () => {
    const { container } = renderTracking();
    const initial = container.querySelector("[class*='left-[20%]']");
    expect(initial).not.toBeNull();

    tick(STAGE_DURATIONS.assigningMs + 100);
    const moved = container.querySelector("[class*='left-[15%]']");
    expect(moved).not.toBeNull();
  });
});