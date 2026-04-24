import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, FileWarning, Lock, ShieldCheck } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatNaira } from "@/lib/buyerMock";
import { partialRefundCase, type ItemVerificationStatus } from "@/lib/orderMock";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusStyles: Record<ItemVerificationStatus, string> = {
  verified: "border-success/30 bg-success/10 text-success",
  disputed: "border-destructive/30 bg-destructive/10 text-destructive",
  pending: "border-border bg-secondary/40 text-muted-foreground",
};

const statusLabel: Record<ItemVerificationStatus, string> = {
  verified: "Verified",
  disputed: "Disputed",
  pending: "Pending",
};

const BuyerPartialRefund = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const baseQuery = useMemo(() => new URLSearchParams({ productId: params.get("productId") ?? "MD-9521X", orderId: params.get("orderId") ?? partialRefundCase.orderId, entry: "secure-checkout", mode: params.get("mode") ?? "guest", provider: params.get("provider") ?? "cheinly" }).toString(), [params]);

  const disputed = partialRefundCase.items.find((item) => item.id === partialRefundCase.disputedItemId)!;

  const [refund, setRefund] = useState(partialRefundCase.suggestedRefund);
  const [reason, setReason] = useState("Headphones arrived in glossy black instead of brushed silver, with visible scuffs and missing factory seal.");

  const handleSubmit = () => {
    if (refund <= 0 || refund > partialRefundCase.maxRefund) {
      toast.error(`Enter an amount between ₦1 and ${formatNaira(partialRefundCase.maxRefund)}.`);
      return;
    }
    if (reason.trim().length < 20) {
      toast.error("Add at least 20 characters explaining the refund reason.");
      return;
    }
    toast.success("Partial refund request submitted.");
    navigate(`/buyer/refund-success?${baseQuery}&amount=${refund}`);
  };

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />

      <main className="mx-auto flex-1 w-full max-w-7xl px-5 py-8 lg:px-8 space-y-6">
        <div className="space-y-2">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="font-display text-4xl text-foreground">Request Partial Refund</h1>
          <p className="text-sm text-muted-foreground">Order {partialRefundCase.orderId} • Refunding only the disputed line item leaves verified items released to seller.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <Card className="shadow-card">
              <CardContent className="space-y-4 p-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Order items</p>
                  <h2 className="mt-2 font-display text-2xl text-foreground">Item status</h2>
                </div>
                <div className="space-y-3">
                  {partialRefundCase.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
                      <img src={item.image} alt={item.name} className="h-14 w-14 rounded-md object-cover ring-1 ring-border" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.variant}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={cn("border", statusStyles[item.status])}>{statusLabel[item.status]}</Badge>
                        <p className="mt-1 text-sm font-medium text-foreground">{formatNaira(item.value)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="space-y-4 p-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Discrepancy comparison</p>
                  <h2 className="mt-2 font-display text-2xl text-foreground">Advertised vs received</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3 rounded-lg border border-border bg-card p-4">
                    <p className="font-medium text-foreground">Advertised</p>
                    <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-secondary/30">
                      <img src={partialRefundCase.advertisedImage} alt="Advertised" className="h-full w-full object-cover" />
                    </div>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {partialRefundCase.advertisedNotes.map((note) => <li key={note}>• {note}</li>)}
                    </ul>
                  </div>
                  <div className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="font-medium text-foreground">Received</p>
                    <div className="aspect-[4/3] overflow-hidden rounded-lg border border-destructive/20 bg-secondary/30">
                      <img src={partialRefundCase.receivedImage} alt="Received" className="h-full w-full object-cover" />
                    </div>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {partialRefundCase.receivedNotes.map((note) => <li key={note}>• {note}</li>)}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card className="shadow-card">
              <CardContent className="space-y-5 p-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Refund request</p>
                  <h2 className="mt-2 font-display text-2xl text-foreground">{disputed.name}</h2>
                  <p className="text-sm text-muted-foreground">Item value held in escrow: {formatNaira(disputed.value)}</p>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="amount">Refund amount</Label>
                  <Input id="amount" inputMode="numeric" value={String(refund)} onChange={(event) => setRefund(Number(event.target.value.replace(/[^0-9]/g, "")) || 0)} className="h-12 text-lg" />
                  <Slider value={[refund]} min={0} max={partialRefundCase.maxRefund} step={500} onValueChange={(value) => setRefund(value[0] ?? 0)} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min ₦0</span>
                    <span>Max {formatNaira(partialRefundCase.maxRefund)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for partial refund</Label>
                  <Textarea id="reason" value={reason} onChange={(event) => setReason(event.target.value.slice(0, 500))} className="min-h-[120px] resize-none" />
                </div>
                <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm">
                  <Row label="You'd refund" value={formatNaira(refund)} highlight />
                  <Row label="Seller would keep" value={formatNaira(disputed.value - refund)} />
                  <Row label="Verified items release" value={formatNaira(partialRefundCase.items.filter((item) => item.status === "verified").reduce((sum, item) => sum + item.value, 0))} />
                </div>
                <Button onClick={handleSubmit} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Submit Partial Refund Request</Button>
              </CardContent>
            </Card>

            <Alert className="border-gold/30 bg-gold/10 text-foreground [&>svg]:text-gold">
              <Lock className="h-4 w-4" />
              <AlertTitle>Escrow stays locked on disputed item</AlertTitle>
              <AlertDescription>Verified items are released to the seller immediately. The disputed amount remains held until both parties accept the outcome.</AlertDescription>
            </Alert>
          </aside>
        </div>
      </main>

      <BuyerFooter variant="dashboard" />
    </div>
  );
};

const Row = ({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-muted-foreground">{label}</span>
    <span className={cn("font-medium", highlight ? "text-foreground text-base" : "text-foreground")}>{value}</span>
  </div>
);

export default BuyerPartialRefund;