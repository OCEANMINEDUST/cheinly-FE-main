// Seller fulfillment settings: map products / order types to external rider APIs.
import { ProviderId, SyncMode } from "./providers";

export type MatchType = "product" | "category" | "weight" | "destination";

export interface FulfillmentRule {
  id: string;
  label: string;
  matchType: MatchType;
  matchValue: string;
  providerId: ProviderId;
  syncMode: SyncMode;
  enabled: boolean;
}

export interface FulfillmentSettings {
  defaultProvider: ProviderId;
  defaultSyncMode: SyncMode;
  callbackUrl: string;
  pollIntervalSeconds: number;
  customBaseUrl: string;
  autoDispatch: boolean;
  rules: FulfillmentRule[];
}

const KEY = "cheinly:seller:fulfillment";

export const defaultSettings = (): FulfillmentSettings => ({
  defaultProvider: "kwik",
  defaultSyncMode: "callback",
  callbackUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/api/logistics/callback`,
  pollIntervalSeconds: 30,
  customBaseUrl: "",
  autoDispatch: true,
  rules: [
    {
      id: "rule-1",
      label: "Sneakers & apparel (Lagos)",
      matchType: "category",
      matchValue: "Footwear",
      providerId: "kwik",
      syncMode: "callback",
      enabled: true,
    },
    {
      id: "rule-2",
      label: "Interstate orders",
      matchType: "destination",
      matchValue: "Outside Lagos",
      providerId: "sendbox",
      syncMode: "polling",
      enabled: true,
    },
  ],
});

export function loadSettings(): FulfillmentSettings {
  if (typeof window === "undefined") return defaultSettings();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultSettings();
    return { ...defaultSettings(), ...(JSON.parse(raw) as FulfillmentSettings) };
  } catch {
    return defaultSettings();
  }
}

export function saveSettings(settings: FulfillmentSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(settings));
}

export function makeRule(): FulfillmentRule {
  return {
    id: `rule-${Date.now()}`,
    label: "",
    matchType: "product",
    matchValue: "",
    providerId: "kwik",
    syncMode: "callback",
    enabled: true,
  };
}

/** Resolve which provider should handle a given order attribute. */
export function resolveProvider(
  settings: FulfillmentSettings,
  attrs: Partial<Record<MatchType, string>>,
): { providerId: ProviderId; syncMode: SyncMode; rule?: FulfillmentRule } {
  const rule = settings.rules.find(
    (r) =>
      r.enabled &&
      r.matchValue.trim() !== "" &&
      (attrs[r.matchType] ?? "").toLowerCase().includes(r.matchValue.toLowerCase()),
  );
  if (rule) return { providerId: rule.providerId, syncMode: rule.syncMode, rule };
  return { providerId: settings.defaultProvider, syncMode: settings.defaultSyncMode };
}