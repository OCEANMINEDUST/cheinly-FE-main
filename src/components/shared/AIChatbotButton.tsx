import { Bot, ExternalLink, MessageCircle, Send, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getAccountRole } from "@/lib/accountRole";
import {
  chatbotPagePath,
  chatbotRoleLabels,
  getChatbotContext,
  getChatbotDeepLink,
  trackChatbotClick,
  type ChatbotChannel,
  type ChatbotRole,
} from "@/lib/chatbot";
import type { Role } from "@/lib/notifications";
import { cn } from "@/lib/utils";

const roleTips: Record<ChatbotRole, string[]> = {
  buyer: ["Ask about order status, delivery, refunds, and disputes.", "Paste your order reference so the assistant can route you faster.", "WhatsApp support is available from every buyer screen."],
  seller: ["Ask about dispatch, payouts, KYC, disputes, and account settings.", "Share an order or transaction reference for contextual help.", "Use WhatsApp or Telegram from seller screens."],
  supplier: ["Ask about fulfillment, return inspection, tier progress, and payouts.", "Include supply order IDs or return IDs for faster guidance.", "Use WhatsApp or Telegram from supplier screens."],
};

const isChatbotRole = (role: Role): role is ChatbotRole => role === "buyer" || role === "seller" || role === "supplier";

const canShowForRole = (role: ChatbotRole) => {
  if (role === "buyer") return true;
  return getAccountRole() === role;
};

export function AIChatbotButton({ role, compact = false, className }: { role: Role; compact?: boolean; className?: string }) {
  const location = useLocation();

  if (!isChatbotRole(role) || !canShowForRole(role)) return null;

  const context = getChatbotContext(role, location.pathname);
  const path = `${location.pathname}${location.search}${location.hash}`;
  const channels: Array<{ channel: ChatbotChannel; label: string; icon: typeof MessageCircle; enabled: boolean; className?: string }> = [
    { channel: "whatsapp", label: "Start on WhatsApp", icon: MessageCircle, enabled: true, className: "bg-emerald-600 text-white hover:bg-emerald-700" },
    { channel: "telegram", label: "Start on Telegram", icon: Send, enabled: role === "seller" || role === "supplier" },
  ];

  const clickChannel = (channel: ChatbotChannel) => {
    trackChatbotClick({ role, channel, context, path });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={compact ? "outline" : "ghost"}
          size={compact ? "sm" : "icon"}
          className={cn(compact && "gap-2", className)}
          aria-label={`${chatbotRoleLabels[role]} AI chatbot`}
        >
          <Bot className="h-[18px] w-[18px]" />
          {compact && <span>AI Chat</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Sparkles className="h-5 w-5" /></div>
            <Badge variant="secondary">{chatbotRoleLabels[role]} assistant</Badge>
          </div>
          <DialogTitle>Use Cheinly AI to get unstuck faster</DialogTitle>
          <DialogDescription>
            Open the chatbot with your role and current page context already attached, so the assistant can help with the right workflow immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 rounded-xl border bg-muted/30 p-4 text-sm">
          <p className="font-medium">Current chat context: <span className="text-primary">{context}</span></p>
          <ul className="space-y-2 text-muted-foreground">
            {roleTips[role].map((tip) => <li key={tip} className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{tip}</li>)}
          </ul>
        </div>

        <div className="grid gap-2">
          {channels.filter((item) => item.enabled).map((item) => (
            <Button key={item.channel} asChild className={cn("justify-start gap-2", item.className)} variant={item.className ? "default" : "outline"}>
              <a href={getChatbotDeepLink({ role, channel: item.channel, context, path })} target="_blank" rel="noopener noreferrer" onClick={() => clickChannel(item.channel)}>
                <item.icon className="h-4 w-4" />
                {item.label}
                <ExternalLink className="ml-auto h-3.5 w-3.5" />
              </a>
            </Button>
          ))}
        </div>

        <DialogFooter className="sm:justify-start">
          <Button asChild variant="link" className="px-0">
            <Link to={chatbotPagePath(role)}>Open the full chatbot guide</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
