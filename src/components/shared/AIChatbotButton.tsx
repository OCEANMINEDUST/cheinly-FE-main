import { useLocation } from "react-router-dom";
import { WhatsAppIcon, TelegramIcon } from "@/components/icons/BrandIcons";
import { Button } from "@/components/ui/button";
import { getAccountRole } from "@/lib/accountRole";
import {
  chatbotRoleLabels,
  getChatbotContext,
  getChatbotDeepLink,
  trackChatbotClick,
  type ChatbotChannel,
  type ChatbotRole,
} from "@/lib/chatbot";
import type { Role } from "@/lib/notifications";
import { cn } from "@/lib/utils";

const isChatbotRole = (role: Role): role is ChatbotRole =>
  role === "buyer" || role === "seller" || role === "supplier";

const canShowForRole = (role: ChatbotRole) => {
  if (role === "buyer") return true;
  return getAccountRole() === role;
};

const channelStyles: Record<ChatbotChannel, string> = {
  whatsapp: "border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20",
  telegram: "border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20",
};

export function AIChatbotButton({ role, compact = false, className }: { role: Role; compact?: boolean; className?: string }) {
  const location = useLocation();

  if (!isChatbotRole(role) || !canShowForRole(role)) return null;

  const context = getChatbotContext(role, location.pathname);
  const path = `${location.pathname}${location.search}${location.hash}`;

  const channels: Array<{ channel: ChatbotChannel; label: string; Icon: typeof WhatsAppIcon; enabled: boolean }> = [
    { channel: "whatsapp", label: "WhatsApp", Icon: WhatsAppIcon, enabled: true },
    { channel: "telegram", label: "Telegram", Icon: TelegramIcon, enabled: role === "seller" || role === "supplier" },
  ];

  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`${chatbotRoleLabels[role]} chatbot links`}>
      {channels.filter((item) => item.enabled).map((item) => (
        <Button
          key={item.channel}
          asChild
          variant="outline"
          size={compact ? "sm" : "icon"}
          className={cn(channelStyles[item.channel], compact && "gap-2")}
        >
          <a
            href={getChatbotDeepLink({ role, channel: item.channel, context, path })}
            target="_blank"
            rel="noopener noreferrer"
            title={`Open ${chatbotRoleLabels[role]} AI chatbot on ${item.label}`}
            onClick={() => trackChatbotClick({ role, channel: item.channel, context, path })}
          >
            <item.Icon size={18} />
            {compact && <span>{item.label}</span>}
          </a>
        </Button>
      ))}
    </div>
  );
}
