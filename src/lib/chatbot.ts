import type { Role } from "@/lib/notifications";

export type ChatbotRole = Extract<Role, "buyer" | "seller" | "supplier">;
export type ChatbotChannel = "whatsapp" | "telegram";

export type ChatbotAnalyticsEvent = {
  role: ChatbotRole;
  channel: ChatbotChannel;
  context: string;
  path: string;
  timestamp: string;
};

const WHATSAPP_PHONE = "2348000000000";
const TELEGRAM_BOT = "CheinlyBot";
const ANALYTICS_KEY = "cheinly-chatbot-analytics";

const rolePrompts: Record<ChatbotRole, string> = {
  buyer: "Hi Cheinly AI, I am a buyer and need help with my order, payment, delivery, refund, or dispute.",
  seller: "Hi Cheinly AI, I am a seller and need help with orders, KYC, payouts, disputes, or fulfillment.",
  supplier: "Hi Cheinly AI, I am a supplier and need help with bulk orders, fulfillment, returns, KYC, or payouts.",
};

export const chatbotRoleLabels: Record<ChatbotRole, string> = {
  buyer: "Buyer",
  seller: "Seller",
  supplier: "Supplier",
};

export const chatbotPagePath = (role: ChatbotRole) => `/${role}/ai-chatbot`;

export const getChatbotContext = (role: ChatbotRole, path: string) => {
  const normalized = path || `/${role}`;
  if (normalized.includes("dispute")) return "dispute-support";
  if (normalized.includes("transaction") || normalized.includes("payment") || normalized.includes("receipt")) return "payments-and-payouts";
  if (normalized.includes("order") || normalized.includes("fulfillment") || normalized.includes("dispatch")) return "orders-and-fulfillment";
  if (normalized.includes("return") || normalized.includes("refund")) return "returns-and-refunds";
  if (normalized.includes("settings") || normalized.includes("kyc") || normalized.includes("account")) return "account-settings-and-kyc";
  if (normalized.includes("help")) return "help-centre";
  return `${role}-dashboard`;
};

export const getChatbotDeepLink = ({
  role,
  channel,
  context,
  path,
}: {
  role: ChatbotRole;
  channel: ChatbotChannel;
  context: string;
  path: string;
}) => {
  if (channel === "telegram") {
    return `https://t.me/${TELEGRAM_BOT}?start=${encodeURIComponent(`${role}_${context}`)}`;
  }

  const message = `${rolePrompts[role]}\n\nRole: ${chatbotRoleLabels[role]}\nContext: ${context}\nPage: ${path}`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
};

export const trackChatbotClick = (event: Omit<ChatbotAnalyticsEvent, "timestamp">) => {
  const payload: ChatbotAnalyticsEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    const current = window.localStorage.getItem(ANALYTICS_KEY);
    const events = current ? (JSON.parse(current) as ChatbotAnalyticsEvent[]) : [];
    window.localStorage.setItem(ANALYTICS_KEY, JSON.stringify([...events, payload].slice(-100)));
    window.dispatchEvent(new CustomEvent("cheinly:chatbot-click", { detail: payload }));
  }

  console.info("cheinly.chatbot_click", payload);
  return payload;
};
