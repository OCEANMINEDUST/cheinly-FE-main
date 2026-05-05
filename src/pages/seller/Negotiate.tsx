import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Paperclip, Send, ShieldAlert, Smile, X } from "lucide-react";
import { SellerShell } from "@/components/seller/SellerShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ChatMessage, disputeOrder, initialChat, naira } from "@/lib/sellerMock";
import { toast } from "@/hooks/use-toast";

type Mode = "accept" | "counter" | "decline";

export default function SellerNegotiate() {
  const [mode, setMode] = useState<Mode>("counter");
  const [amount, setAmount] = useState("2,500");
  const [reason, setReason] = useState("Tear is minor — offering ₦2,500 as goodwill credit while keeping item.");
  const [messages, setMessages] = useState<ChatMessage[]>(initialChat);
  const [draft, setDraft] = useState("");

  const buyerRequest = 4500;

  function nowTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function send(text: string, system?: ChatMessage["tone"]) {
    setMessages((m) => [
      ...m,
      system
        ? { id: crypto.randomUUID(), from: "system", text, time: nowTime(), tone: system }
        : { id: crypto.randomUUID(), from: "seller", text, time: nowTime() },
    ]);
  }

  function handleSubmit() {
    if (mode === "accept") {
      send(`Accepted refund of ${naira(buyerRequest)}`, "success");
      toast({ title: "Refund accepted", description: `${naira(buyerRequest)} returned to buyer.` });
    } else if (mode === "counter") {
      const n = Number(amount.replace(/[^0-9]/g, "")) || 0;
      send(`Offer Sent: ${naira(n)} — ${reason}`, "success");
      toast({ title: "Counter-offer sent", description: `Buyer was offered ${naira(n)}.` });
    } else {
      send("Refund declined and dispute escalated to admin.", "warn");
      toast({ title: "Escalated", description: "Admin team will review within 24h." });
    }
  }

  return (
    <SellerShell>
      <div className="mb-4 flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/seller/dispute"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link>
        </Button>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Negotiate Refund</h1>
        <Badge variant="outline">Order {disputeOrder.id}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Offer */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{disputeOrder.product}</CardTitle>
              <CardDescription>{disputeOrder.variant} • {naira(disputeOrder.amount)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-muted/40 p-4 text-sm">
                <div className="font-medium">Buyer's reasoning</div>
                <p className="mt-1 text-muted-foreground">{disputeOrder.issue}</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Buyer's request</div>
                  <div className="text-lg font-semibold text-destructive">{naira(buyerRequest)}</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">Remaining order funds</div>
                  <div className="text-lg font-semibold">{naira(disputeOrder.amount - buyerRequest)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your response</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <ResponseCard active={mode === "accept"} onClick={() => setMode("accept")}
                  tone="primary" title="Accept Refund" desc="Refund full amount instantly" />
                <ResponseCard active={mode === "counter"} onClick={() => setMode("counter")}
                  tone="success" title="Counter-Offer" desc="Propose a new refund value" />
                <ResponseCard active={mode === "decline"} onClick={() => setMode("decline")}
                  tone="destructive" title="Decline & Escalate" desc="Send to admin mediation" />
              </div>

              {mode === "counter" && (
                <div className="space-y-3 rounded-xl border border-success/30 bg-success/5 p-4">
                  <div>
                    <Label htmlFor="ramount">Refund amount (₦)</Label>
                    <Input id="ramount" inputMode="numeric" value={amount}
                      onChange={(e) => setAmount(e.target.value.replace(/[^0-9,]/g, ""))} />
                  </div>
                  <div>
                    <Label htmlFor="rreason">Reason for buyer</Label>
                    <Textarea id="rreason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                  <Link to="/seller/escalate">Escalate instead</Link>
                </Button>
                <Button onClick={handleSubmit}>
                  {mode === "accept" ? "Approve refund" : mode === "counter" ? "Send Counter" : "Confirm decline"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat */}
        <Card className="flex h-[640px] flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar><AvatarFallback>{disputeOrder.buyer.split(" ").map(s => s[0]).join("")}</AvatarFallback></Avatar>
                <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-background bg-success" />
              </div>
              <div>
                <CardTitle className="text-base">{disputeOrder.buyer}</CardTitle>
                <CardDescription>Online • Buyer</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-3 p-4">
            {messages.map((m) => m.from === "system" ? (
              <SystemBubble key={m.id} m={m} />
            ) : (
              <ChatBubble key={m.id} m={m} />
            ))}
          </CardContent>
          <div className="flex items-center gap-2 border-t p-3">
            <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><Smile className="h-4 w-4" /></Button>
            <Input placeholder="Type a message…" value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && draft.trim()) { send(draft); setDraft(""); } }} />
            <Button size="icon" onClick={() => { if (draft.trim()) { send(draft); setDraft(""); } }}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </SellerShell>
  );
}

function ResponseCard({
  active, onClick, tone, title, desc,
}: { active: boolean; onClick: () => void; tone: "primary" | "success" | "destructive"; title: string; desc: string }) {
  const ring = tone === "success" ? "ring-success border-success/40 bg-success/5"
    : tone === "destructive" ? "ring-destructive border-destructive/40 bg-destructive/5"
    : "ring-primary border-primary/40 bg-primary/5";
  return (
    <button onClick={onClick} className={cn(
      "rounded-xl border p-3 text-left transition",
      active ? `ring-2 ${ring}` : "hover:border-foreground/20",
    )}>
      <div className="flex items-center gap-2 text-sm font-semibold">
        {active && <Check className="h-4 w-4" />} {title}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
    </button>
  );
}

function ChatBubble({ m }: { m: ChatMessage }) {
  const mine = m.from === "seller";
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div className={cn(
        "max-w-[80%] rounded-2xl px-3 py-2 text-sm",
        mine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm",
      )}>
        <p>{m.text}</p>
        <div className={cn("mt-1 text-[10px]", mine ? "text-primary-foreground/70" : "text-muted-foreground")}>{m.time}</div>
      </div>
    </div>
  );
}

function SystemBubble({ m }: { m: ChatMessage }) {
  const tone = m.tone === "success" ? "border-success/30 bg-success/10 text-success"
    : m.tone === "warn" ? "border-gold/30 bg-gold/10 text-gold"
    : "border-primary/30 bg-primary/10 text-primary";
  return (
    <div className="flex justify-center">
      <div className={cn("rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-wide", tone)}>
        {m.text} • {m.time}
      </div>
    </div>
  );
}
