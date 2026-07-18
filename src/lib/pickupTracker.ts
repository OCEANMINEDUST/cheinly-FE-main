// Persistent pickup tracker for buyer send-package flow.
// Advances stages based on wall-clock elapsed time so state survives
// navigation and page refreshes, and broadcasts changes across tabs.

export type PickupStage =
  | "assigning"
  | "enroute-pickup"
  | "at-pickup"
  | "in-transit"
  | "delivered";

export interface PickupState {
  orderId: string;
  code: string;
  fee: number;
  pickup: string;
  dropoff: string;
  startedAt: number;
  handoverAt: number | null; // set when buyer confirms handover
  stage: PickupStage;
  etaMinutes: number;
}

// Real-time durations (ms) between auto-advanced stages.
export const STAGE_DURATIONS = {
  assigningMs: 2000,
  enroutePickupMs: 4000,
  inTransitMs: 8000,
  etaTickMs: 1200,
} as const;

const STORAGE_KEY = "cheinly:buyer:pickup";
const CHANGE_EVENT = "cheinly:pickup:change";

const hasStorage = () => typeof window !== "undefined" && !!window.localStorage;

function read(): PickupState | null {
  if (!hasStorage()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PickupState) : null;
  } catch {
    return null;
  }
}

function write(state: PickupState | null) {
  if (!hasStorage()) return;
  if (state) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  else window.localStorage.removeItem(STORAGE_KEY);
  try {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {
    /* jsdom sometimes lacks CustomEvent in older envs */
  }
}

function randomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function randomOrderId() {
  return `PKG-${Math.floor(10000 + Math.random() * 90000)}`;
}

export function startPickup(input: {
  fee: number;
  pickup: string;
  dropoff: string;
  now?: number;
}): PickupState {
  const state: PickupState = {
    orderId: randomOrderId(),
    code: randomCode(),
    fee: input.fee,
    pickup: input.pickup,
    dropoff: input.dropoff,
    startedAt: input.now ?? Date.now(),
    handoverAt: null,
    stage: "assigning",
    etaMinutes: 9,
  };
  write(state);
  return state;
}

// Pure derivation of the current stage from elapsed time.
export function deriveStage(state: PickupState, now: number): {
  stage: PickupStage;
  etaMinutes: number;
} {
  const { assigningMs, enroutePickupMs, inTransitMs, etaTickMs } = STAGE_DURATIONS;
  const preHandoverElapsed = now - state.startedAt;

  if (state.handoverAt == null) {
    if (preHandoverElapsed < assigningMs) return { stage: "assigning", etaMinutes: state.etaMinutes };
    if (preHandoverElapsed < assigningMs + enroutePickupMs)
      return { stage: "enroute-pickup", etaMinutes: state.etaMinutes };
    // Wait indefinitely at pickup until the buyer confirms handover.
    return { stage: "at-pickup", etaMinutes: state.etaMinutes };
  }

  const postHandoverElapsed = now - state.handoverAt;
  if (postHandoverElapsed >= inTransitMs) {
    return { stage: "delivered", etaMinutes: 0 };
  }
  const remainingMs = Math.max(0, inTransitMs - postHandoverElapsed);
  const etaMinutes = Math.max(1, Math.ceil(remainingMs / etaTickMs));
  return { stage: "in-transit", etaMinutes };
}

// Apply the derived stage back into storage; returns the fresh state.
export function tickPickup(now: number = Date.now()): PickupState | null {
  const state = read();
  if (!state) return null;
  const { stage, etaMinutes } = deriveStage(state, now);
  if (state.stage !== stage || state.etaMinutes !== etaMinutes) {
    const next = { ...state, stage, etaMinutes };
    write(next);
    return next;
  }
  return state;
}

export function getPickup(): PickupState | null {
  return read();
}

export function confirmHandover(now: number = Date.now()): PickupState | null {
  const state = read();
  if (!state || state.handoverAt != null) return state;
  const next: PickupState = { ...state, handoverAt: now, stage: "in-transit", etaMinutes: 8 };
  write(next);
  return next;
}

export function clearPickup() {
  write(null);
}

// React-style subscription: interval poll + storage events for cross-tab sync.
export function subscribePickup(
  listener: (state: PickupState | null) => void,
  pollMs = 500,
): () => void {
  let cancelled = false;
  const emit = () => {
    if (cancelled) return;
    listener(tickPickup());
  };
  emit();
  const interval = window.setInterval(emit, pollMs);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) emit();
  };
  const onChange = () => emit();
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange as EventListener);
  return () => {
    cancelled = true;
    window.clearInterval(interval);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange as EventListener);
  };
}