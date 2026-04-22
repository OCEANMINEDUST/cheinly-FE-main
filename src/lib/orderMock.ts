import { formatNaira, mockBuyer, mockProduct } from "@/lib/buyerMock";

export type BuyerOrderStatus = "awaiting-verification" | "processing" | "in-transit" | "completed";
export type BuyerTimelineState = "complete" | "current" | "upcoming";

export interface BuyerOrderItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  quantity: number;
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
    image: mockProduct.image,
  },
  {
    id: "item-watch",
    name: "Titan Series Smart Watch",
    subtitle: "Strap: Graphite Silicone",
    price: 21000,
    quantity: 1,
    image: mockProduct.image,
  },
];

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
    shippingAddress: baseAddress,
    courier: sharedCourier,
    items: sharedItems,
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
    shippingAddress: baseAddress,
    courier: sharedCourier,
    items: [sharedItems[0]],
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
    shippingAddress: baseAddress,
    courier: sharedCourier,
    items: sharedItems,
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

export const orderStatusLabel: Record<BuyerOrderStatus, string> = {
  "awaiting-verification": "Awaiting Verification",
  processing: "Processing",
  "in-transit": "On the Way",
  completed: "Completed",
};