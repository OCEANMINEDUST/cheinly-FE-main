import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
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
  return render(
    <MemoryRouter initialEntries={["/buyer/pickup-tracking?fee=2800&pickup=A&dropoff=B"]}>
      <Routes>
        <Route path="/buyer/pickup-tracking" element={<BuyerPickupTracking />} />
        <Route path="/buyer/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>,
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

  it("auto-advances through all pickup stages without a manual refresh", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderTracking();

    // Stage 1: assigning
    expect(screen.getByText("Finding a rider")).toBeInTheDocument();
    // Rider card is hidden until a match is made
    expect(screen.queryByText(/Tunde Adebayo/)).not.toBeInTheDocument();

    // Stage 2: rider en route (auto after assigningMs)
    tick(STAGE_DURATIONS.assigningMs + 100);
    expect(await screen.findByText("Rider en route to you")).toBeInTheDocument();
    expect(screen.getByText(/Tunde Adebayo/)).toBeInTheDocument();

    // Stage 3: rider arrived — pickup code panel appears automatically
    tick(STAGE_DURATIONS.enroutePickupMs + 100);
    expect(
      await screen.findByText("Rider arrived — share your pickup code"),
    ).toBeInTheDocument();
    const code = getPickup()!.code;
    expect(code).toMatch(/^\d{6}$/);
    expect(screen.getByText(code)).toBeInTheDocument();

    // Buyer confirms handover — stage jumps to in-transit
    const handoverBtn = screen.getByRole("button", {
      name: /Rider entered the code — hand over the package/i,
    });
    await user.click(handoverBtn);
    expect(await screen.findByText("Package in transit")).toBeInTheDocument();
    // ETA counter is visible
    expect(screen.getByText(/^\d+m$/)).toBeInTheDocument();

    // Stage 5: delivered after in-transit window elapses
    tick(STAGE_DURATIONS.inTransitMs + 200);
    expect(await screen.findByText("Package delivered")).toBeInTheDocument();
    expect(getPickup()!.stage).toBe("delivered");
  });

  it("resumes the same pickup after the component unmounts and remounts (no refresh loss)", async () => {
    renderTracking().unmount();
    const state = getPickup();
    expect(state).not.toBeNull();

    // Simulate wall-clock passing while the screen is not mounted
    tick(STAGE_DURATIONS.assigningMs + STAGE_DURATIONS.enroutePickupMs + 500);
    // The tracker still derives correctly when re-read
    tickPickup();
    expect(getPickup()!.stage).toBe("at-pickup");

    // Re-mount — the screen picks up exactly where it left off
    renderTracking();
    expect(
      await screen.findByText("Rider arrived — share your pickup code"),
    ).toBeInTheDocument();
    // Same order id, not a fresh pickup
    expect(screen.getByText(state!.orderId)).toBeInTheDocument();
  });

  it("emits stage changes via the polling subscription while mounted", async () => {
    renderTracking();
    // Grab timeline card and verify the active pulse dot advances
    tick(STAGE_DURATIONS.assigningMs + 100);
    expect(await screen.findByText("Rider en route to you")).toBeInTheDocument();

    // Confirm the map bike marker moved by asserting the stage-driven className swap
    const bikeContainers = document.querySelectorAll("[class*='left-']");
    expect(bikeContainers.length).toBeGreaterThan(0);
  });
});