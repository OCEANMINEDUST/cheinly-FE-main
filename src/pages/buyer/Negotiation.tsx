import { FormEvent, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MessageSquareMore, Paperclip, Send, ShieldAlert, Sparkles } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formatNaira } from "@/lib/buyerMock";
import { negotiationCase } from "@/lib/orderMock";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const BuyerNegotiation = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const baseQuery = useMemo(() => new URLSearchParams({ productId: params.get("productId") ?? "MD-9521X", orderId: params.get("orderId") ?? "ORD-521-450", entry: "secure-checkout", mode: params.get("mode") ?? "guest", provider: params.get("provider") ?? "cheinly" }).toString(), [params]);

  const [messages, setMessages] = useState(negotiationCase.messages);
  const [draft, setDraft] = useState("");
  const [counterOpen, setCounterOpen] = useState(false);
  const [counterAmount, setCounterAmount] = useState(String(negotiationCase.sellerOffer + 5500));
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    const next = { id: `m-${Date.now()}`, sender: "buyer" as const, name: "You", body: draft.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages((current) => [...current, next]);
    setDraft("");
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }));
  };

  const accept = () => {
    toast.success(`Counter-offer of ${formatNaira(negotiationCase.sellerOffer)} accepted. Releasing partial refund.`);
    navigate(`/buyer/refund-success?${baseQuery}&caseId=${negotiationCase.id}`);
  };

  const submitCounter = () => {
    const amount = Number(counterAmount.replace(/[^0-9]/g, ""));
    if (!amount) {
      toast.error("Enter a valid counter amount.");
      return;
    }
    setMessages((current) => [...current, { id: `m-${Date.now()}`, sender: "buyer", name: "You", body: `New counter-offer: ${formatNaira(amount)}`, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setCounterOpen(false);
    toast.success("Counter-offer sent to seller.");
  };

  const escalate = () => {
    toast.message("Negotiation escalated to dispute review.");
    navigate(`/buyer/dispute?${baseQuery}&source=negotiation`);
  };

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />

      <main className="mx-auto flex-1 w-full max-w-7xl px-5 py-8 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-4xl text-foreground">Negotiation Phase</h1>
              <Badge className="border border-gold/30 bg-gold/10 text-gold">Dispute #{negotiationCase.id}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Resolve this dispute directly with the seller. Escrow stays locked until both sides agree or escalate.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card className="shadow-card">
            <CardContent className="space-y-5 p-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Disputed item</p>
                <h2 className="mt-2 font-display text-2xl text-foreground">{negotiationCase.itemName}</h2>
                <p className="text-sm text-muted-foreground">{negotiationCase.itemVariant}</p>
              </div>
              <div className="overflow-hidden rounded-lg border border-border bg-secondary/30">
                <img src={negotiationCase.itemImage} alt={negotiationCase.itemName} className="aspect-[4/3] w-full object-cover" />
              </div>
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm">
                <p className="font-medium text-foreground">Buyer's reason</p>
                <p className="mt-1 text-muted-foreground">{negotiationCase.buyerReason}</p>
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  {negotiationCase.buyerEvidence.map((evidence) => <li key={evidence}>• {evidence}</li>)}
                </ul>
              </div>
              <div className="rounded-lg border border-gold/30 bg-gold/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Seller counter-offer</p>
                    <p className="mt-1 font-display text-3xl text-foreground">{formatNaira(negotiationCase.sellerOffer)}</p>
                    <p className="text-xs text-muted-foreground">Original item value: {formatNaira(negotiationCase.originalPrice)}</p>
                  </div>
                  <Sparkles className="h-5 w-5 text-gold" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col shadow-card">
            <CardContent className="flex flex-1 flex-col gap-4 p-5">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <Avatar className="h-10 w-10 bg-primary/10 text-primary"><AvatarFallback>{negotiationCase.sellerInitials}</AvatarFallback></Avatar>
                <div>
                  <p className="font-semibold text-foreground">{negotiationCase.sellerName} <span className="text-xs font-normal text-muted-foreground">(Seller)</span></p>
                  <p className="text-xs text-success">● Online now</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto gap-2 border-border bg-card hover:bg-secondary"><MessageSquareMore className="h-4 w-4" /> View profile</Button>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto rounded-lg border border-border bg-secondary/20 p-4 max-h-[420px]">
                {messages.map((message) => (
                  <div key={message.id} className={cn("flex flex-col gap-1", message.sender === "buyer" ? "items-end" : "items-start")}>
                    <div className={cn("max-w-[78%] rounded-2xl px-4 py-2 text-sm leading-relaxed", message.sender === "buyer" ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border")}>
                      {message.body}
                    </div>
                    <span className="text-[11px] text-muted-foreground">{message.name} • {message.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={sendMessage} className="flex items-center gap-2">
                <Button type="button" variant="outline" size="icon" className="border-border bg-card hover:bg-secondary" aria-label="Attach"><Paperclip className="h-4 w-4" /></Button>
                <Input value={draft} onChange={(event) => setDraft(event.target.value.slice(0, 400))} placeholder="Type a message…" className="h-11" />
                <Button type="submit" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"><Send className="h-4 w-4" /> Send</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex items-start gap-3 text-sm">
              <ShieldAlert className="mt-0.5 h-4 w-4 text-gold" />
              <p className="text-muted-foreground">If you can't reach an agreement, escalate to dispute review and a Cheinly mediator will step in within 24 hours.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={escalate} className="border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10">Decline & Escalate</Button>
              <Button variant="outline" onClick={() => setCounterOpen(true)} className="border-border bg-card hover:bg-secondary">Make New Offer</Button>
              <Button onClick={accept} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">Accept {formatNaira(negotiationCase.sellerOffer)}</Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BuyerFooter variant="dashboard" />

      <Dialog open={counterOpen} onOpenChange={setCounterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make a counter-offer</DialogTitle>
            <DialogDescription>Suggest an amount the seller should refund. They have 24 hours to respond.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="counter">Amount (₦)</Label>
            <Input id="counter" inputMode="numeric" value={counterAmount} onChange={(event) => setCounterAmount(event.target.value.replace(/[^0-9]/g, ""))} className="h-12 text-base" />
            <p className="text-xs text-muted-foreground">Item value: {formatNaira(negotiationCase.originalPrice)} • Seller offer: {formatNaira(negotiationCase.sellerOffer)}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCounterOpen(false)}>Cancel</Button>
            <Button onClick={submitCounter} className="bg-primary text-primary-foreground hover:bg-primary/90">Send offer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuyerNegotiation;