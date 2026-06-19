import { Bell, Wallet, ShoppingBag, History, AlertTriangle, type LucideIcon } from "lucide-react";

export type Role = "seller" | "buyer" | "rider" | "supplier";

export type AppNotification = {
  id: number;
  kind: "payout" | "payment" | "order" | "alert";
  title: string;
  body: string;
  time: string;
  cta: string;
  to: string;
};

export const notificationsFor = (role: Role): AppNotification[] => {
  if (role === "buyer") {
    return [
      { id: 1, kind: "order", title: "Order out for delivery", body: "Premium Sneakers — ETA 14:30", time: "5m", cta: "Track order", to: "/buyer/order" },
      { id: 2, kind: "payment", title: "Payment held in escrow", body: "₦45,000 secured until delivery", time: "1h", cta: "View receipt", to: "/buyer/receipt" },
      { id: 3, kind: "alert", title: "Confirm delivery", body: "Inspect items before releasing funds", time: "2h", cta: "Open", to: "/buyer/confirm-delivery" },
    ];
  }
  if (role === "rider") {
    return [
      { id: 1, kind: "order", title: "New trip available", body: "Ikoyi → Lekki • ₦2,800", time: "Now", cta: "View", to: "/rider/dashboard" },
      { id: 2, kind: "payout", title: "Weekly payout sent", body: "₦42,000 to GTBank ****8821", time: "1d", cta: "History", to: "/rider/history" },
      { id: 3, kind: "alert", title: "Document expires soon", body: "Renew vehicle registration", time: "3d", cta: "Profile", to: "/rider/profile" },
    ];
  }
  if (role === "supplier") {
    return [
      { id: 1, kind: "order", title: "New supply order SUP-1001", body: "Imported Sneakers x500 • pending fulfillment", time: "4m", cta: "Start fulfillment", to: "/supplier/fulfillment" },
      { id: 2, kind: "payment", title: "Escrow funded", body: "₦5,200,000 protected for SUP-1001", time: "1h", cta: "View transactions", to: "/supplier/transactions" },
      { id: 3, kind: "alert", title: "Return inspection due", body: "RET-401 awaiting QA decision", time: "3h", cta: "Inspect", to: "/supplier/return-inspection" },
    ];
  }
  return [
    { id: 1, kind: "payout", title: "Payout successful", body: "₦128,000 moved to True Balance", time: "1h", cta: "View History", to: "/seller/transactions" },
    { id: 2, kind: "payment", title: "Payment received", body: "Buyer paid ₦42,500 into escrow", time: "14m", cta: "View Wallet", to: "/seller/dashboard" },
    { id: 3, kind: "order", title: "New order #ORD-3082", body: "Velvet Wrap Dress • Emerald M", time: "2m", cta: "View Order", to: "/seller/orders" },
  ];
};

export const iconFor = (k: AppNotification["kind"]): LucideIcon =>
  k === "payout" ? History : k === "payment" ? Wallet : k === "order" ? ShoppingBag : AlertTriangle;

export const BellIcon = Bell;