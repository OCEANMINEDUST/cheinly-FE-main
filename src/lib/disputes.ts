export type DisputeRole = "buyer" | "seller" | "supplier";
export type DisputeStatus = "Open" | "Awaiting response" | "Under review" | "Return dispatch" | "Evidence uploaded" | "Resolved";

export type DisputeRecord = {
  id: string;
  role: DisputeRole;
  transactionId: string;
  orderId: string;
  productName: string;
  counterparty: string;
  amount: number;
  openedAt: string;
  status: DisputeStatus;
  issue: string;
  nextStep: string;
  detailPath: string;
};

const disputes: DisputeRecord[] = [
  {
    id: "DSP-521450-01",
    role: "buyer",
    transactionId: "TXN-BUY-1041",
    orderId: "ORD-24081",
    productName: "Premium Men's Sneakers — Phantom Black",
    counterparty: "Global Sneakers Ltd.",
    amount: 45000,
    openedAt: "Today 10:02",
    status: "Open",
    issue: "Buyer reported product mismatch during delivery verification.",
    nextStep: "Choose refund, replacement, or negotiation path.",
    detailPath: "/buyer/dispute?orderId=ORD-24081&productId=PRD_83921&mode=guest&provider=cheinly",
  },
  {
    id: "DSP-887640-02",
    role: "buyer",
    transactionId: "TXN-BUY-1038",
    orderId: "ORD-24077",
    productName: "Velvet Wrap Dress — Emerald",
    counterparty: "Cheinly Atelier — Adunni Okoye",
    amount: 42500,
    openedAt: "Yesterday 15:44",
    status: "Awaiting response",
    issue: "Packaging concern before dispatch completion.",
    nextStep: "Await seller evidence and delivery response.",
    detailPath: "/buyer/dispute?orderId=ORD-24077&productId=PRD_77104&mode=guest&provider=cheinly",
  },
  {
    id: "DSP-SELL-2041",
    role: "seller",
    transactionId: "TXN-9A82F1",
    orderId: "ORD-2219",
    productName: "Velvet Wrap Dress — Emerald",
    counterparty: "Ifeoma A.",
    amount: 42500,
    openedAt: "Today 10:02",
    status: "Under review",
    issue: "Buyer says received colour differs from listing.",
    nextStep: "Upload product proof and respond before moderator review.",
    detailPath: "/seller/dispute?caseId=DSP-SELL-2041",
  },
  {
    id: "DSP-SELL-2034",
    role: "seller",
    transactionId: "TXN-9A82B0",
    orderId: "ORD-2194",
    productName: "Beaded Clutch — Gold Noir",
    counterparty: "Kemi R.",
    amount: 9500,
    openedAt: "Yesterday 09:18",
    status: "Resolved",
    issue: "Refund requested after return inspection.",
    nextStep: "Review closed refund notes.",
    detailPath: "/seller/dispute?caseId=DSP-SELL-2034",
  },
  {
    id: "DSP-SUP-1001",
    role: "supplier",
    transactionId: "SUP-TXN-1001",
    orderId: "SUP-1001",
    productName: "Imported Sneakers x500",
    counterparty: "Goodness A.",
    amount: 5200000,
    openedAt: "Today 08:30",
    status: "Return dispatch",
    issue: "Bulk order inspection found damaged cartons.",
    nextStep: "Accept return or submit counter-evidence.",
    detailPath: "/supplier/dispute-review?caseId=DSP-SUP-1001",
  },
  {
    id: "DSP-SUP-1002",
    role: "supplier",
    transactionId: "SUP-TXN-1002",
    orderId: "SUP-1002",
    productName: "Wireless Headphones x200",
    counterparty: "Aisha M.",
    amount: 3100000,
    openedAt: "2 days ago",
    status: "Evidence uploaded",
    issue: "Serial number mismatch in received batch.",
    nextStep: "Moderator review in progress.",
    detailPath: "/supplier/dispute-review?caseId=DSP-SUP-1002",
  },
];

export const getDisputesForRole = (role: DisputeRole) => disputes.filter((dispute) => dispute.role === role);

export const formatDisputeAmount = (amount: number) =>
  `₦${amount.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
