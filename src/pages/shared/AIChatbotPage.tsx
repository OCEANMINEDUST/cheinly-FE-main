import { Bot, ExternalLink, MessageCircle, Send, ShieldCheck, Sparkles } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  chatbotRoleLabels,
  getChatbotContext,
  getChatbotDeepLink,
  trackChatbotClick,
  type ChatbotChannel,
  type ChatbotRole,
} from "@/lib/chatbot";
import { cn } from "@/lib/utils";

const roleUseCases: Record<ChatbotRole, string[]> = {
  buyer: ["Track an order or confirm delivery", "Understand escrow payment and receipts", "Start a refund, return, or dispute", "Get help uploading evidence"],
  seller: ["Create, dispatch, and manage orders", "Check KYC, account settings, and login security", "Review payouts, bank details, and withdrawal settings", "Respond to disputes with evidence"],
  supplier: ["Manage bulk fulfillment and supply orders", "Handle return tracking and inspection decisions", "Check tier progress, payout status, and KYC", "Find market lookup guidance and escalation help"],
};

export default function AIChatbotPage({ role }: { role: ChatbotRole }) {
  const location = useLocation();
  const path = `${location.pathname}${location.search}${location.hash}`;
  const context = getChatbotContext(role, location.pathname);
  const channels: Array<{ channel: ChatbotChannel; label: string; description: string; icon: typeof MessageCircle; className?: string; enabled: boolean }> = [
    { channel: "whatsapp", label: "Open WhatsApp", description: "Best for quick help and order-context support.", icon: MessageCircle, className: "bg-emerald-600 text-white hover:bg-emerald-700", enabled: true },
    { channel: "telegram", label: "Open Telegram", description: "Available for seller and supplier operations teams.", icon: Send, enabled: role === "seller" || role === "supplier" },
  ];

  const track = (channel: ChatbotChannel) => trackChatbotClick({ role, channel, context, path });

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="bg-[linear-gradient(135deg,hsl(var(--primary)/0.14),hsl(var(--secondary)/0.45))] p-6 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{chatbotRoleLabels[role]} AI chatbot</Badge>
                <Badge variant="outline" className="gap-1"><ShieldCheck className="h-3 w-3" />Context attached</Badge>
              </div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Cheinly AI Assistant</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Start a role-aware conversation with Cheinly AI. Your selected channel opens with the {chatbotRoleLabels[role].toLowerCase()} role and current chat context already included.
              </p>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary"><Bot className="h-8 w-8" /></div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader>
            <CardTitle>Choose a chat channel</CardTitle>
            <CardDescription>Clicks are tracked by role and channel for support analytics.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {channels.filter((item) => item.enabled).map((item) => (
              <a
                key={item.channel}
                href={getChatbotDeepLink({ role, channel: item.channel, context, path })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track(item.channel)}
                className={cn("rounded-xl border p-5 transition-colors hover:bg-muted/50", item.className && "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700")}
              >
                <div className="mb-4 flex items-center justify-between">
                  <item.icon className="h-6 w-6" />
                  <ExternalLink className="h-4 w-4 opacity-70" />
                </div>
                <p className="font-semibold">{item.label}</p>
                <p className={cn("mt-1 text-sm text-muted-foreground", item.className && "text-white/80")}>{item.description}</p>
              </a>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />How to use it</CardTitle>
            <CardDescription>Current context: {context}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {roleUseCases[role].map((item) => <div key={item} className="rounded-lg border bg-muted/30 p-3 text-sm">{item}</div>)}
            <Button asChild variant="outline" className="w-full justify-start gap-2">
              <a href={getChatbotDeepLink({ role, channel: "whatsapp", context, path })} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp")}>
                <MessageCircle className="h-4 w-4" />One-click WhatsApp entry
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
