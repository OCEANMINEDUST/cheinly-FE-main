export type OrderStatus = "delivered" | "in_transit" | "pending" | "returned";

export interface SellerOrder {
  id: string;
  product: string;
  variant: string;
  amount: number;
  status: OrderStatus;
  address: string;
  time: string;
  buyer: string;
  qty: number;
}

export interface SellerTxn {
  id: string;
  name: string;
  txnId: string;
  status: "settled" | "pending" | "refund";
  amount: number;
  time: string;
}

export const sellerProfile = {
  name: "Adunni Okoye",
  store: "Cheinly Atelier",
  protectedBalance: 482500,
  trueBalance: 1284200,
};

export const monthlyIncome = [
  { month: "Jan", income: 320000 },
  { month: "Feb", income: 410000 },
  { month: "Mar", income: 285000 },
  { month: "Apr", income: 520000 },
  { month: "May", income: 612000 },
  { month: "Jun", income: 478000 },
  { month: "Jul", income: 695000 },
  { month: "Aug", income: 540000 },
  { month: "Sep", income: 720000 },
  { month: "Oct", income: 612000 },
  { month: "Nov", income: 805000 },
  { month: "Dec", income: 412000 },
];

export const currentMonthIndex = 10; // November highlight

export const recentOrders: SellerOrder[] = [
  {
    id: "ORD-3082",
    product: "Velvet Wrap Dress",
    variant: "Emerald • M",
    amount: 42500,
    status: "delivered",
    address: "12 Bourdillon Rd, Ikoyi, Lagos",
    time: "12 min ago",
    buyer: "Ifeoma A.",
    qty: 1,
  },
  {
    id: "ORD-3081",
    product: "Linen Agbada Set",
    variant: "Cream • XL",
    amount: 86000,
    status: "in_transit",
    address: "4 Admiralty Way, Lekki Phase 1",
    time: "48 min ago",
    buyer: "Tunde B.",
    qty: 1,
  },
  {
    id: "ORD-3080",
    product: "Beaded Coral Necklace",
    variant: "One size",
    amount: 18500,
    status: "pending",
    address: "22 Glover Rd, Ikoyi",
    time: "1 hr ago",
    buyer: "Chiamaka N.",
    qty: 2,
  },
  {
    id: "ORD-3079",
    product: "Aso-Oke Headwrap",
    variant: "Royal Blue",
    amount: 12000,
    status: "delivered",
    address: "9 Awolowo Rd, Ikoyi",
    time: "3 hrs ago",
    buyer: "Bisi O.",
    qty: 1,
  },
  {
    id: "ORD-3078",
    product: "Adire Silk Scarf",
    variant: "Indigo",
    amount: 9500,
    status: "returned",
    address: "31 Ozumba Mbadiwe, V.I.",
    time: "Yesterday",
    buyer: "Kemi R.",
    qty: 1,
  },
];

export const recentTxns: SellerTxn[] = [
  { id: "1", name: "Ifeoma A.", txnId: "TXN-9A82F1", status: "settled", amount: 42500, time: "12 min" },
  { id: "2", name: "Tunde B.", txnId: "TXN-9A82E9", status: "pending", amount: 86000, time: "48 min" },
  { id: "3", name: "Chiamaka N.", txnId: "TXN-9A82D2", status: "pending", amount: 37000, time: "1 hr" },
  { id: "4", name: "Bisi O.", txnId: "TXN-9A82C8", status: "settled", amount: 12000, time: "3 hrs" },
  { id: "5", name: "Kemi R.", txnId: "TXN-9A82B0", status: "refund", amount: 9500, time: "Yesterday" },
];

export function naira(n: number) {
  return "₦" + n.toLocaleString("en-NG");
}

export function statusVariant(s: OrderStatus): { label: string; cls: string } {
  switch (s) {
    case "delivered":
      return { label: "Delivered", cls: "bg-success/15 text-success border-success/30" };
    case "in_transit":
      return { label: "In transit", cls: "bg-primary/15 text-primary border-primary/30" };
    case "pending":
      return { label: "Pending", cls: "bg-gold/15 text-gold border-gold/30" };
    case "returned":
      return { label: "Returned", cls: "bg-destructive/15 text-destructive border-destructive/30" };
  }
}

// ---------- Dispatch photo persistence ----------
export interface DispatchPhotos {
  before: string | null;
  after: string | null;
  savedAt?: string;
}

const DISPATCH_KEY = "seller:dispatchPhotos";

function readMap(): Record<string, DispatchPhotos> {
  try {
    return JSON.parse(localStorage.getItem(DISPATCH_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getDispatchPhotos(orderId: string): DispatchPhotos {
  const m = readMap();
  return m[orderId] || { before: null, after: null };
}

export function saveDispatchPhotos(orderId: string, photos: DispatchPhotos) {
  const m = readMap();
  m[orderId] = { ...photos, savedAt: new Date().toISOString() };
  localStorage.setItem(DISPATCH_KEY, JSON.stringify(m));
}