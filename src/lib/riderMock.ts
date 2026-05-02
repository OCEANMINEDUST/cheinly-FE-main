export type RiderStatus = "new" | "pending" | "approved" | "online" | "offline";
export type OrderStatus = "available" | "accepted" | "picked_up" | "delivered";

export interface RiderProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  plate: string;
  status: RiderStatus;
  currentLocation: string;
  joinedAt: string;
  earningsWeek: number;
  rating: number;
  trips: number;
}

export interface RiderDocuments {
  licenseFrontUrl?: string;
  licenseBackUrl?: string;
  registrationUrl?: string;
  submittedAt?: string;
}

export interface RiderOrder {
  id: string;
  shortRef: string;
  originAddr: string;
  originLandmark: string;
  destinationAddr: string;
  destinationLandmark: string;
  distanceKm: number;
  durationMin: number;
  price: number;
  payoutMethod: string;
  status: OrderStatus;
  itemSummary: string;
  itemWeight: string;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  deliveryPin: string;
  notes: string;
  postedAt: string;
}

const STORAGE_KEYS = {
  rider: "rider:profile",
  docs: "rider:documents",
  orders: "rider:orders",
  history: "rider:history",
  offline: "rider:offline",
  proofs: "rider:proofs",
  returns: "rider:returns",
  bank: "rider:bank",
} as const;

const defaultRider: RiderProfile = {
  id: "RDR-50213",
  name: "James Wilson",
  email: "james.w@cheinly.app",
  phone: "+234 810 220 1145",
  vehicle: "Honda CB125",
  plate: "LAG-482-XR",
  status: "new",
  currentLocation: "Victoria Island, Lagos",
  joinedAt: "Apr 24, 2025",
  earningsWeek: 84500,
  rating: 4.92,
  trips: 218,
};

const seedOrders: RiderOrder[] = [
  {
    id: "ORD-9821",
    shortRef: "#9821",
    originAddr: "12 Adeola Odeku St, Victoria Island",
    originLandmark: "Cheinly Hub — VI",
    destinationAddr: "8 Admiralty Way, Lekki Phase 1",
    destinationLandmark: "Palms Mall gate",
    distanceKm: 6.4,
    durationMin: 22,
    price: 3800,
    payoutMethod: "Cheinly Wallet",
    status: "available",
    itemSummary: "Sealed parcel — clothing",
    itemWeight: "1.2 kg",
    senderName: "Alex Smith",
    senderPhone: "+234 802 145 9921",
    recipientName: "Goodness Tobi",
    recipientPhone: "+234 813 902 2310",
    deliveryPin: "4821",
    notes: "Hand to recipient only. Verify PIN at drop-off.",
    postedAt: "2 mins ago",
  },
  {
    id: "ORD-9822",
    shortRef: "#9822",
    originAddr: "21 Karimu Kotun, Victoria Island",
    originLandmark: "ChainLink Boutique",
    destinationAddr: "5 Bourdillon Rd, Ikoyi",
    destinationLandmark: "Falomo Roundabout",
    distanceKm: 4.1,
    durationMin: 16,
    price: 2600,
    payoutMethod: "Cheinly Wallet",
    status: "available",
    itemSummary: "Small electronics box",
    itemWeight: "0.6 kg",
    senderName: "Tola Bakare",
    senderPhone: "+234 706 220 1109",
    recipientName: "Bisi Adeyemi",
    recipientPhone: "+234 802 776 4451",
    deliveryPin: "9305",
    notes: "Fragile — keep upright.",
    postedAt: "8 mins ago",
  },
  {
    id: "ORD-9823",
    shortRef: "#9823",
    originAddr: "44 Ajose Adeogun, Victoria Island",
    originLandmark: "Civic Centre",
    destinationAddr: "27 Glover Rd, Ikoyi",
    destinationLandmark: "Glover Court Suites",
    distanceKm: 5.8,
    durationMin: 19,
    price: 3200,
    payoutMethod: "Cheinly Wallet",
    status: "available",
    itemSummary: "Documents envelope",
    itemWeight: "0.3 kg",
    senderName: "Kunle O.",
    senderPhone: "+234 805 991 4421",
    recipientName: "Funmi A.",
    recipientPhone: "+234 814 002 9981",
    deliveryPin: "7710",
    notes: "Drop with security if recipient unavailable — but request PIN first.",
    postedAt: "11 mins ago",
  },
];

const isBrowser = () => typeof window !== "undefined";

const read = <T,>(key: string, fallback: T): T => {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getRider = (): RiderProfile => read(STORAGE_KEYS.rider, defaultRider);
export const saveRider = (rider: RiderProfile) => write(STORAGE_KEYS.rider, rider);
export const updateRider = (patch: Partial<RiderProfile>): RiderProfile => {
  const next = { ...getRider(), ...patch };
  saveRider(next);
  return next;
};

export const getDocuments = (): RiderDocuments => read(STORAGE_KEYS.docs, {});
export const saveDocuments = (docs: RiderDocuments) => write(STORAGE_KEYS.docs, docs);

export const getOrders = (): RiderOrder[] => read(STORAGE_KEYS.orders, seedOrders);
export const saveOrders = (orders: RiderOrder[]) => write(STORAGE_KEYS.orders, orders);
export const getOrderById = (id: string | null): RiderOrder | undefined =>
  getOrders().find((order) => order.id === id);
export const updateOrder = (id: string, patch: Partial<RiderOrder>): RiderOrder | undefined => {
  const orders = getOrders();
  const index = orders.findIndex((order) => order.id === id);
  if (index === -1) return undefined;
  orders[index] = { ...orders[index], ...patch };
  saveOrders(orders);
  return orders[index];
};

export interface RiderHistoryEntry {
  id: string;
  shortRef: string;
  destination: string;
  payout: number;
  completedAt: string;
}

export const getHistory = (): RiderHistoryEntry[] =>
  read(STORAGE_KEYS.history, [
    { id: "ORD-9712", shortRef: "#9712", destination: "Lekki Phase 1", payout: 3500, completedAt: "Yesterday • 6:42 PM" },
    { id: "ORD-9698", shortRef: "#9698", destination: "Ikoyi", payout: 2800, completedAt: "Yesterday • 3:10 PM" },
    { id: "ORD-9653", shortRef: "#9653", destination: "Ajah", payout: 4200, completedAt: "Apr 22 • 11:08 AM" },
  ]);
export const pushHistory = (entry: RiderHistoryEntry) => {
  const history = getHistory();
  write(STORAGE_KEYS.history, [entry, ...history]);
};

export const formatNaira = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);

export const isOnboardingComplete = (docs: RiderDocuments) =>
  Boolean(docs.licenseFrontUrl && docs.licenseBackUrl && docs.registrationUrl);

export const isRiderActive = (rider: RiderProfile) =>
  rider.status === "approved" || rider.status === "online" || rider.status === "offline";

export const acceptedOrders = () => getOrders().filter((order) => order.status === "accepted" || order.status === "picked_up");
export const availableOrders = () => getOrders().filter((order) => order.status === "available");
export const deliveredCount = () => getHistory().length;

export const resetRiderDemo = () => {
  if (!isBrowser()) return;
  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
};

// Offline mode
export const getOfflineMode = (): boolean => read<boolean>(STORAGE_KEYS.offline, false);
export const setOfflineMode = (value: boolean) => write(STORAGE_KEYS.offline, value);

// Per-order delivery proof photos
export const getDeliveryProof = (orderId: string): string | undefined => {
  const all = read<Record<string, string>>(STORAGE_KEYS.proofs, {});
  return all[orderId];
};
export const saveDeliveryProof = (orderId: string, dataUrl: string) => {
  const all = read<Record<string, string>>(STORAGE_KEYS.proofs, {});
  all[orderId] = dataUrl;
  write(STORAGE_KEYS.proofs, all);
};

// Return requests
export type ReturnReason =
  | "wrong_item"
  | "damaged_item"
  | "missing_items"
  | "recipient_unavailable"
  | "address_issue";

export interface ReturnRequest {
  id: string;
  orderId: string;
  reason: ReturnReason;
  notes: string;
  imageUrl?: string;
  status: "submitted" | "in_return" | "completed";
  createdAt: string;
}

export const getReturns = (): ReturnRequest[] => read<ReturnRequest[]>(STORAGE_KEYS.returns, []);
export const getReturnByOrder = (orderId: string): ReturnRequest | undefined =>
  getReturns().find((r) => r.orderId === orderId);
export const saveReturnRequest = (req: ReturnRequest) => {
  const all = getReturns();
  const idx = all.findIndex((r) => r.orderId === req.orderId);
  if (idx >= 0) all[idx] = req;
  else all.unshift(req);
  write(STORAGE_KEYS.returns, all);
};
export const updateReturnStatus = (orderId: string, status: ReturnRequest["status"]) => {
  const existing = getReturnByOrder(orderId);
  if (!existing) return;
  saveReturnRequest({ ...existing, status });
};

// Bank details
export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}
const defaultBank: BankDetails = {
  bankName: "Guaranty Trust Bank",
  accountNumber: "0123456789",
  accountName: "James Wilson",
};
export const getBank = (): BankDetails => read<BankDetails>(STORAGE_KEYS.bank, defaultBank);
export const saveBank = (bank: BankDetails) => write(STORAGE_KEYS.bank, bank);

export { STORAGE_KEYS as RIDER_STORAGE_KEYS };