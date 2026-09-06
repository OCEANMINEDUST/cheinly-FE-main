// Server-side logistics provider adapters.
// Real credentials live in backend secrets (KWIK_API_KEY, GOKADA_API_KEY,
// SENDBOX_API_KEY). When a key is missing the adapter falls back to a
// deterministic simulated response so the flow stays demonstrable.

export type ProviderId = "kwik" | "gokada" | "sendbox";

export interface ProviderConfig {
  id: ProviderId;
  name: string;
  baseUrl: string;
  createPath: string;
  secretName: string;
  priceFactor: number;
  pickupEtaMinutes: number;
  supportsCallback: boolean;
}

export const PROVIDER_CONFIG: Record<ProviderId, ProviderConfig> = {
  kwik: {
    id: "kwik",
    name: "Kwik Delivery",
    baseUrl: "https://api.kwik.delivery/v1",
    createPath: "/tasks",
    secretName: "KWIK_API_KEY",
    priceFactor: 1,
    pickupEtaMinutes: 12,
    supportsCallback: true,
  },
  gokada: {
    id: "gokada",
    name: "Gokada Logistics",
    baseUrl: "https://api.gokada.ng/v2",
    createPath: "/deliveries",
    secretName: "GOKADA_API_KEY",
    priceFactor: 0.92,
    pickupEtaMinutes: 18,
    supportsCallback: false,
  },
  sendbox: {
    id: "sendbox",
    name: "Sendbox",
    baseUrl: "https://api.sendbox.co/shipping",
    createPath: "/shipments",
    secretName: "SENDBOX_API_KEY",
    priceFactor: 1.25,
    pickupEtaMinutes: 30,
    supportsCallback: true,
  },
};

export interface PickupInput {
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
  callbackUrl: string;
}

export interface PickupResult {
  providerId: ProviderId;
  providerName: string;
  requestId: string;
  trackingUrl: string;
  pickupCode: string;
  etaMinutes: number;
  syncMode: "callback" | "polling";
  live: boolean;
}

const sixDigits = () => Math.floor(100000 + Math.random() * 900000).toString();

export async function createPickup(
  providerId: ProviderId,
  input: PickupInput,
): Promise<PickupResult> {
  const cfg = PROVIDER_CONFIG[providerId];
  const apiKey = Deno.env.get(cfg.secretName);
  const syncMode = cfg.supportsCallback ? "callback" as const : "polling" as const;

  if (!apiKey) {
    return {
      providerId: cfg.id,
      providerName: cfg.name,
      requestId: `${cfg.id.toUpperCase()}-${sixDigits()}`,
      trackingUrl: `${cfg.baseUrl}/tracking/SIM-${sixDigits()}`,
      pickupCode: sixDigits(),
      etaMinutes: cfg.pickupEtaMinutes,
      syncMode,
      live: false,
    };
  }

  const response = await fetch(`${cfg.baseUrl}${cfg.createPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      reference: input.reference,
      pickup: { address: input.pickupAddress, name: input.senderName, phone: input.senderPhone },
      dropoff: { address: input.dropoffAddress, name: input.receiverName, phone: input.receiverPhone },
      package: { size: input.packageSize, declared_value: input.declaredValue },
      amount: input.fee,
      callback_url: input.callbackUrl,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`${cfg.name} pickup failed [${response.status}]: ${errorBody}`);
    throw new Error(`[${response.status}]: ${errorBody}`);
  }

  const data = await response.json().catch(() => ({}));
  const requestId =
    data.id ?? data.task_id ?? data.tracking_code ?? data.reference ?? `${cfg.id.toUpperCase()}-${sixDigits()}`;

  return {
    providerId: cfg.id,
    providerName: cfg.name,
    requestId: String(requestId),
    trackingUrl: data.tracking_url ?? `${cfg.baseUrl}/tracking/${requestId}`,
    pickupCode: String(data.pickup_code ?? data.otp ?? sixDigits()),
    etaMinutes: Number(data.eta_minutes ?? cfg.pickupEtaMinutes),
    syncMode,
    live: true,
  };
}

/** Normalise the many provider vocabularies into our order lifecycle. */
export function mapProviderStatus(raw: string): string | null {
  const s = raw.toLowerCase().replace(/[\s-]+/g, "_");
  if (["assigned", "rider_assigned", "accepted", "confirmed", "pickup_assigned"].includes(s))
    return "pickup_assigned";
  if (["enroute_pickup", "rider_dispatched", "dispatched", "on_the_way_to_pickup", "started"].includes(s))
    return "rider_dispatched";
  if (["picked_up", "in_transit", "on_the_way", "out_for_delivery", "enroute_dropoff"].includes(s))
    return "in_transit";
  if (["delivered", "completed", "dropped_off"].includes(s)) return "delivered";
  if (["cancelled", "canceled", "failed", "returned"].includes(s)) return "cancelled";
  return null;
}
