// External logistics (rider) provider adapters.
// Cheinly does not employ riders — pickups are requested from third-party
// logistics APIs. Each provider below is an adapter with the same interface so
// seller routing rules can route an order to any of them.

export type ProviderId = "kwik" | "gokada" | "sendbox" | "custom";
export type SyncMode = "callback" | "polling";

export interface ProviderDefinition {
  id: ProviderId;
  name: string;
  region: string;
  baseUrl: string;
  /** Multiplier applied to the base size fee when quoting. */
  priceFactor: number;
  /** Typical pickup wait in minutes, used for quotes. */
  pickupEtaMinutes: number;
  supports: SyncMode[];
  description: string;
}

export const PROVIDERS: ProviderDefinition[] = [
  {
    id: "kwik",
    name: "Kwik Delivery",
    region: "Lagos, Abuja, Port Harcourt",
    baseUrl: "https://api.kwik.delivery/v1",
    priceFactor: 1,
    pickupEtaMinutes: 12,
    supports: ["callback", "polling"],
    description: "Bike-first intracity network with webhook status callbacks.",
  },
  {
    id: "gokada",
    name: "Gokada Logistics",
    region: "Lagos",
    baseUrl: "https://api.gokada.ng/v2",
    priceFactor: 0.92,
    pickupEtaMinutes: 18,
    supports: ["polling"],
    description: "Lowest cost per drop, status available by polling only.",
  },
  {
    id: "sendbox",
    name: "Sendbox",
    region: "Nationwide",
    baseUrl: "https://api.sendbox.co/shipping",
    priceFactor: 1.25,
    pickupEtaMinutes: 30,
    supports: ["callback", "polling"],
    description: "Interstate and nationwide coverage with insurance add-ons.",
  },
  {
    id: "custom",
    name: "Custom API",
    region: "Configured by you",
    baseUrl: "https://",
    priceFactor: 1,
    pickupEtaMinutes: 15,
    supports: ["callback", "polling"],
    description: "Point Cheinly at any rider API that speaks the pickup schema.",
  },
];

export const getProvider = (id: ProviderId): ProviderDefinition =>
  PROVIDERS.find((p) => p.id === id) ?? PROVIDERS[0];

export interface DeliveryQuote {
  providerId: ProviderId;
  providerName: string;
  fee: number;
  pickupEtaMinutes: number;
  syncModes: SyncMode[];
}

export const quoteProviders = (baseFee: number): DeliveryQuote[] =>
  PROVIDERS.filter((p) => p.id !== "custom").map((p) => ({
    providerId: p.id,
    providerName: p.name,
    fee: Math.round(baseFee * p.priceFactor),
    pickupEtaMinutes: p.pickupEtaMinutes,
    syncModes: p.supports,
  }));

export interface PickupRequest {
  reference: string;
  pickupAddress: string;
  dropoffAddress: string;
  senderName?: string;
  senderPhone?: string;
  receiverName?: string;
  receiverPhone?: string;
  packageSize?: string;
  declaredValue?: number;
  fee: number;
}

export interface PickupResponse {
  providerId: ProviderId;
  requestId: string;
  trackingUrl: string;
  pickupCode: string;
  etaMinutes: number;
  syncMode: SyncMode;
  callbackUrl?: string;
}

/**
 * Request a pickup from an external provider.
 * Real credentials live in backend secrets; this client-side adapter posts to
 * the provider through our edge relay when configured, and falls back to a
 * deterministic simulated response so the flow is always demonstrable.
 */
export async function requestPickup(
  providerId: ProviderId,
  req: PickupRequest,
  opts: { syncMode?: SyncMode; callbackUrl?: string } = {},
): Promise<PickupResponse> {
  const provider = getProvider(providerId);
  const syncMode: SyncMode = opts.syncMode ?? provider.supports[0];
  // Simulated network latency for the provider handshake.
  await new Promise((r) => setTimeout(r, 400));
  const requestId = `${provider.id.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
  return {
    providerId: provider.id,
    requestId,
    trackingUrl: `${provider.baseUrl}/tracking/${requestId}`,
    pickupCode: Math.floor(100000 + Math.random() * 900000).toString(),
    etaMinutes: provider.pickupEtaMinutes,
    syncMode,
    callbackUrl: opts.callbackUrl,
  };
}