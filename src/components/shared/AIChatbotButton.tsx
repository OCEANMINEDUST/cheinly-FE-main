import { MessageCircle, Send } from "lucide-react";
import { useLocation } from "react-router-dom";
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

const isChatbotRole = (role: Role): role is ChatbotRole => role === "buyer" || role === "seller" || role === "supplier";

const canShowForRole = (role: ChatbotRole) => {
  if (role === "buyer") return true;
  return getAccountRole() === role;
};

const channelStyles: Record<ChatbotChannel, string> = {
  whatsapp: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 hover:text-emerald-800",
  telegram: "border-sky-500/40 bg-sky-500/10 text-sky-700 hover:bg-sky-500/20 hover:text-sky-800",
};

export function AIChatbotButton({ role, compact = false, className }: { role: Role; compact?: boolean; className?: string }) {
  const location = useLocation();

  if (!isChatbotRole(role) || !canShowForRole(role)) return null;

  const context = getChatbotContext(role, location.pathname);
  const path = `${location.pathname}${location.search}${location.hash}`;
  const channels: Array<{ channel: ChatbotChannel; label: string; icon: typeof MessageCircle; enabled: boolean }> = [
    { channel: "whatsapp", label: "WhatsApp", icon: MessageCircle, enabled: true },
    { channel: "telegram", label: "Telegram", icon: Send, enabled: role === "seller" || role === "supplier" },
  ];

  const clickChannel = (channel: ChatbotChannel) => {
    trackChatbotClick({ role, channel, context, path });
  };

  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`${chatbotRoleLabels[role]} chatbot invite links`}>
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
            title={`Invite/open ${chatbotRoleLabels[role]} AI chatbot on ${item.label}`}
            aria-label={`Invite/open ${chatbotRoleLabels[role]} AI chatbot on ${item.label}`}
            onClick={() => clickChannel(item.channel)}
          >
            <item.icon className="h-[18px] w-[18px]" />
            {compact && <span>{item.label}</span>}
          </a>
        </Button>
      ))}
    </div>
  );
}
