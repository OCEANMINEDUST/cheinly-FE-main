import { Home, CreditCard, Package, Scale, type LucideIcon } from "lucide-react";

export type MarketplaceRole = "buyer" | "seller" | "supplier";
export type FlowKey = "overview" | "transactions" | "orders" | "disputes";

export type FlowSection = {
  title: string;
  items: string[];
};

export type FlowDefinition = {
  key: FlowKey;
  icon: LucideIcon;
  label: string;
  description: string;
  sections: FlowSection[];
};

export const flowNav = (role: MarketplaceRole) => {
  const base = `/${role}`;
  const links = [
    { to: `${base}/dashboard`, label: "Overview", icon: Home },
    { to: `${base}/transactions`, label: "Transactions", icon: CreditCard },
    { to: `${base}/orders`, label: "Orders", icon: Package },
    { to: `${base}/disputes`, label: "Disputes", icon: Scale },
  ];

  return links;
};

export const marketplaceFlows: FlowDefinition[] = [
  {
    key: "overview",
    icon: Home,
    label: "Overview",
    description: "Command center for account health, performance, tier progress, metrics, and urgent actions.",
    sections: [
      { title: "Performance Summary", items: ["Performance Score", "Success Rate", "Completion Rate", "Customer Rating"] },
      { title: "Tier Progress", items: ["Current Tier", "Progress to Next Tier", "Tier Benefits"] },
      { title: "Account Status", items: ["KYC Status", "Profile Completion", "Verification Status"] },
      { title: "Business Metrics", items: ["Total Orders", "Active Orders", "Total Revenue", "Open Disputes"] },
      { title: "Quick Actions", items: ["Create Order", "Track Return", "Raise Dispute", "Complete KYC"] },
    ],
  },
  {
    key: "transactions",
    icon: CreditCard,
    label: "Transactions",
    description: "Everything related to money, balances, payout movement, refunds, and marketplace fees.",
    sections: [
      { title: "Wallet", items: ["Available Balance", "Pending Balance", "Withdrawable Balance"] },
      { title: "Transaction History", items: ["Credits", "Debits", "Escrow Releases", "Refunds"] },
      { title: "Payouts", items: ["Withdrawal Requests", "Withdrawal History", "Bank Account"] },
      { title: "Refunds", items: ["Refund Requests", "Approved Refunds", "Rejected Refunds"] },
      { title: "Fees", items: ["Escrow Charges", "Transaction Charges"] },
    ],
  },
  {
    key: "orders",
    icon: Package,
    label: "Orders",
    description: "Everything related to order fulfillment, returns, logistics, delivery, and fulfillment analytics.",
    sections: [
      { title: "Active Orders", items: ["Pending Orders", "Processing Orders", "Shipped Orders"] },
      { title: "Completed Orders", items: ["Delivered Orders", "Closed Orders"] },
      { title: "Return Management", items: ["Return Tracking", "Return Inspection", "Return Approval"] },
      { title: "Fulfillment", items: ["Shipping Status", "Delivery Confirmation", "Logistics Information"] },
      { title: "Order Analytics", items: ["Fulfillment Rate", "Delivery Success Rate"] },
    ],
  },
  {
    key: "disputes",
    icon: Scale,
    label: "Disputes",
    description: "Everything related to conflicts, evidence, moderator review, resolution timelines, and dispute analytics.",
    sections: [
      { title: "Open Disputes", items: ["Awaiting Response", "Under Investigation"] },
      { title: "Dispute Review", items: ["Evidence Review", "Moderator Actions", "Resolution Timeline"] },
      { title: "Evidence Center", items: ["Upload Evidence", "View Submitted Evidence"] },
      { title: "Resolved Disputes", items: ["Won Cases", "Lost Cases", "Settled Cases"] },
      { title: "Dispute Analytics", items: ["Dispute Rate", "Resolution Rate"] },
    ],
  },
];

export const flowByKey = Object.fromEntries(marketplaceFlows.map((flow) => [flow.key, flow])) as Record<FlowKey, FlowDefinition>;

export const roleLabels: Record<MarketplaceRole, string> = {
  buyer: "Buyer",
  seller: "Seller",
  supplier: "Supplier",
};
