import { formatNaira, mockBuyer, mockProduct } from "@/lib/buyerMock";

export type BuyerOrderStatus = "awaiting-verification" | "processing" | "in-transit" | "completed" | "cancelled";
export type BuyerTimelineState = "complete" | "current" | "upcoming";

export interface BuyerOrderItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  quantity: number;
  discount?: number;
  image: string;
}

export interface BuyerOrder {
  id: string;
  shortRef: string;
  productId: string;
  sellerName: string;
  sellerLocation: string;
  status: BuyerOrderStatus;
  placedAt: string;
  deliveredAt?: string;
  estimatedDelivery: string;
  estimatedArrival: string;
  nextStop: string;
  shippingFee: number;
  discount: number;
  paymentMethod: string;
  deliveryConfirmationCode: string;
  escrowStatus: string;
  disputeReportId: string;
  disputeSummary: string;
  shippingAddress: {
    fullName: string;
    line1: string;
    line2: string;
    city: string;
    country: string;
  };
  courier: {
    name: string;
    rating: number;
    reviews: number;
    vehicleType: string;
    plateNumber: string;
    phone: string;
  };
  items: BuyerOrderItem[];
  deliveryStages: Array<{
    id: string;
    title: string;
    actor: string;
    image: string;
    note: string;
  }>;
  timeline: Array<{
    label: string;
    description: string;
    time: string;
    state: BuyerTimelineState;
  }>;
}

const baseAddress = {
  fullName: mockBuyer.name,
  line1: "15, Victoria Island Estate",
  line2: "Block C, Admiralty Way",
  city: "Lagos 101241",
  country: "Nigeria",
};

const sharedCourier = {
  name: "David Lawson",
  rating: 4.9,
  reviews: 12,
  vehicleType: "Honda CB125",
  plateNumber: "ABC 123",
  phone: "+234 810 220 1145",
};

const sharedItems: BuyerOrderItem[] = [
  {
    id: "item-sneaker",
    name: mockProduct.name,
    subtitle: "Size: 44 • Color: Phantom Black",
    price: mockProduct.price,
    quantity: 1,
    discount: 3500,
    image: mockProduct.image,
  },
  {
    id: "item-watch",
    name: "Titan Series Smart Watch",
    subtitle: "Strap: Graphite Silicone",
    price: 21000,
    quantity: 1,
    discount: 1500,
    image: mockProduct.image,
  },
];

const sharedDeliveryStages = [
  {
    id: "before-packaging",
    title: "Before Packaging",
    actor: "Seller",
    image: mockProduct.image,
    note: "Original seller capture before the item enters protective packaging.",
  },
  {
    id: "after-packaging",
    title: "After Packaging",
    actor: "Seller",
    image: mockProduct.image,
    note: "Sealed package photo showing tamper tape and dispatch label.",
  },
  {
    id: "upon-arrival",
    title: "Upon Arrival",
    actor: "Buyer",
    image: mockProduct.image,
    note: "Arrival snapshot taken before the buyer accepts handover from the rider.",
  },
  {
    id: "upon-opening",
    title: "Upon Opening",
    actor: "Buyer",
    image: mockProduct.image,
    note: "Opened package with item visible for final product verification.",
  },
] as const;

export const buyerOrders: BuyerOrder[] = [
  {
    id: "ORD-521-450",
    shortRef: "#ORD-521-450",
    productId: mockProduct.id,
    sellerName: mockProduct.seller.name,
    sellerLocation: mockProduct.seller.location,
    status: "in-transit",
    placedAt: "10:42 AM, 17/10/2024",
    estimatedDelivery: "Oct 24, 2024",
    estimatedArrival: "15 mins",
    nextStop: "5th Avenue Junction",
    shippingFee: 2500,
    discount: 0,
    paymentMethod: "Protected Balance",
    deliveryConfirmationCode: "521450",
    escrowStatus: "Funds held in escrow until buyer verifies delivery.",
    disputeReportId: "DSP-521450-01",
    disputeSummary: "Buyer reported a possible product mismatch during delivery review. Funds remain held pending dispute resolution.",
    shippingAddress: baseAddress,
    courier: sharedCourier,
    items: sharedItems,
    deliveryStages: [...sharedDeliveryStages],
    timeline: [
      { label: "Order Placed", description: "Your order has been successfully placed and is being processed.", time: "10:42 AM, 17/10/2024", state: "complete" },
      { label: "Payment Confirmed", description: `Transaction of ${formatNaira(mockProduct.price)} verified. Receipt sent to your email.`, time: "10:45 AM, 17/10/2024", state: "complete" },
      { label: "Dispatched", description: "Your package has left the central warehouse and is in transit.", time: "02:15 PM, 18/10/2024", state: "complete" },
      { label: "Out for Delivery", description: "The courier agent is scheduled to deliver today.", time: "Pending", state: "current" },
      { label: "Delivered", description: "Package successfully delivered and signed for.", time: "Pending", state: "upcoming" },
    ],
  },
  {
    id: "ORD-887-640",
    shortRef: "#ORD-887-640",
    productId: mockProduct.id,
    sellerName: "ChainLink 3000s",
    sellerLocation: "Lekki Phase 1, Lagos",
    status: "processing",
    placedAt: "08:21 PM, 12/08/2024",
    estimatedDelivery: "Today",
    estimatedArrival: "1 hr 20 mins",
    nextStop: "VI Sorting Hub",
    shippingFee: 1800,
    discount: 0,
    paymentMethod: "Bank Transfer",
    deliveryConfirmationCode: "887640",
    escrowStatus: "Funds held in escrow until dispatch and delivery verification are completed.",
    disputeReportId: "DSP-887640-02",
    disputeSummary: "Buyer flagged a packaging concern before dispatch completion. Rider payout should remain on hold until verified.",
    shippingAddress: baseAddress,
    courier: sharedCourier,
    items: [sharedItems[0]],
    deliveryStages: [...sharedDeliveryStages],
    timeline: [
      { label: "Order Placed", description: "Your order has been successfully placed and is awaiting handoff.", time: "08:21 PM, 12/08/2024", state: "complete" },
      { label: "Payment Confirmed", description: `Transaction of ${formatNaira(mockProduct.price)} verified and held in escrow.`, time: "08:26 PM, 12/08/2024", state: "complete" },
      { label: "Dispatched", description: "Seller is preparing your package for pickup.", time: "Pending", state: "current" },
      { label: "Out for Delivery", description: "A rider will be assigned after dispatch.", time: "Pending", state: "upcoming" },
      { label: "Delivered", description: "Package successfully delivered and signed for.", time: "Pending", state: "upcoming" },
    ],
  },
  {
    id: "ORD-527-456",
    shortRef: "#ORD-527-456",
    productId: mockProduct.id,
    sellerName: mockProduct.seller.name,
    sellerLocation: "Victoria Island, Lagos",
    status: "completed",
    placedAt: "October 24, 2023 • 2:32 PM",
    deliveredAt: "Oct 24, 2023 • 2:45 PM",
    estimatedDelivery: "Delivered",
    estimatedArrival: "Completed",
    nextStop: "Delivered",
    shippingFee: 2500,
    discount: 0,
    paymentMethod: "Escrow Balance",
    deliveryConfirmationCode: "527456",
    escrowStatus: "Funds were released after buyer confirmation.",
    disputeReportId: "DSP-527456-03",
    disputeSummary: "Buyer reported a delivery mismatch after receipt review. Escrow remains frozen while a resolution path is selected.",
    shippingAddress: baseAddress,
    courier: sharedCourier,
    items: sharedItems,
    deliveryStages: [...sharedDeliveryStages],
    timeline: [
      { label: "Order Placed", description: "Your order was successfully placed.", time: "02:32 PM, 24/10/2023", state: "complete" },
      { label: "Payment Confirmed", description: "Funds were secured and receipt generated.", time: "02:34 PM, 24/10/2023", state: "complete" },
      { label: "Dispatched", description: "The package left the seller's pickup hub.", time: "02:36 PM, 24/10/2023", state: "complete" },
      { label: "Out for Delivery", description: "Courier headed to the delivery address.", time: "02:41 PM, 24/10/2023", state: "complete" },
      { label: "Delivered", description: "Package successfully delivered and signed for.", time: "02:45 PM, 24/10/2023", state: "complete" },
    ],
  },
];

export const getBuyerOrderById = (orderId: string | null) =>
  buyerOrders.find((order) => order.id === orderId) ?? buyerOrders[0];

export const getOrderSubtotal = (order: BuyerOrder) =>
  order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const getOrderTotalDiscount = (order: BuyerOrder) =>
  order.items.reduce((sum, item) => sum + (item.discount ?? 0), 0) + order.discount;

export const getOrderItemTotal = (item: BuyerOrderItem) =>
  item.price * item.quantity - (item.discount ?? 0);

export const getOrderGrandTotal = (order: BuyerOrder) =>
  getOrderSubtotal(order) + order.shippingFee - getOrderTotalDiscount(order);

export const isOrderCancelable = (order: BuyerOrder) =>
  order.status === "awaiting-verification" || order.status === "processing";

export const cancelBuyerOrder = (orderId: string | null) => {
  const order = buyerOrders.find((entry) => entry.id === orderId);

  if (!order || !isOrderCancelable(order)) {
    return false;
  }

  order.status = "cancelled";
  order.estimatedDelivery = "Cancelled";
  order.estimatedArrival = "Cancelled";
  order.nextStop = "Order cancelled";
  order.timeline = [
    ...order.timeline.map((step) => ({
      ...step,
      state: (step.state === "complete" ? "complete" : "upcoming") as BuyerTimelineState,
      time: step.state === "complete" ? step.time : "Cancelled",
    })),
    {
      label: "Order Cancelled",
      description: "This order was cancelled before dispatch and the protected payment will be reversed.",
      time: "Just now",
      state: "current" as BuyerTimelineState,
    },
  ];

  return true;
};

export const confirmBuyerOrderDelivery = (orderId: string | null) => {
  const order = buyerOrders.find((entry) => entry.id === orderId);

  if (!order) {
    return false;
  }

  order.status = "completed";
  order.deliveredAt = "Just now";
  order.estimatedDelivery = "Delivered";
  order.estimatedArrival = "Completed";
  order.nextStop = "Funds released";
  order.escrowStatus = "Funds released to seller after buyer delivery confirmation.";
  order.timeline = order.timeline.map((step, index, steps) => {
    const isLastStep = index === steps.length - 1;

    return {
      ...step,
      state: "complete" as BuyerTimelineState,
      time: step.time === "Pending" ? (isLastStep ? "Just now" : "Completed") : step.time,
      description: isLastStep
        ? "Package delivered, verified, and payment released from escrow."
        : step.description,
    };
  });

  return true;
};

export const isDeliveryCodeValid = (order: BuyerOrder, code: string) =>
  order.deliveryConfirmationCode === code.trim();

export const buildDisputeSummary = (order: BuyerOrder, mismatchCount: number) => {
  if (mismatchCount > 0) {
    return `${mismatchCount} verification stage${mismatchCount > 1 ? "s were" : " was"} marked as mismatched. ${order.disputeSummary}`;
  }

  return order.disputeSummary;
};

export const orderStatusLabel: Record<BuyerOrderStatus, string> = {
  "awaiting-verification": "Awaiting Verification",
  processing: "Processing",
  "in-transit": "On the Way",
  completed: "Completed",
  cancelled: "Cancelled",
};