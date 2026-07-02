import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Coins, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatNaira } from "@/lib/buyerMock";
import { riderPayoutCase } from "@/lib/orderMock";

const BuyerRiderPayout = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const baseQuery = useMemo(() => new URLSearchParams({ productId: params.get("productId") ?? "MD-9521X", orderId: params.get("orderId") ?? "ORD-521-450", entry: "secure-checkout", mode: params.get("mode") ?? "guest", provider: params.get("provider") ?? "cheinly" }).toString(), [params]);

  const total = riderPayoutCase.payoutAmount + riderPayoutCase.tips + riderPayoutCase.bonus;

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />

      <main className="mx-auto flex-1 w-full max-w-5xl px-5 py-8 lg:px-8 space-y-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <Card className="shadow-card">
          <CardContent className="space-y-6 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-4xl text-foreground">Delivery Sync Successful</h1>
              <p className="text-sm text-muted-foreground">Cheinly Rider • Delivery {riderPayoutCase.deliveryId} • Released {riderPayoutCase.releasedAt}</p>
            </div>
            <div className="mx-auto flex max-w-md items-center gap-4 rounded-lg border border-border bg-secondary/40 p-4 text-left">
              <Avatar className="h-12 w-12 bg-primary/10 text-primary"><AvatarFallback>{riderPayoutCase.riderInitials}</AvatarFallback></Avatar>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{riderPayoutCase.riderName}</p>
                <p className="text-xs text-muted-foreground">Delivered to {riderPayoutCase.customerName} • {riderPayoutCase.customerAddress}</p>
              </div>
              <Badge className="border border-success/30 bg-success/10 text-success">Synced</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="space-y-5 p-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Verification comparison</p>
              <h2 className="mt-2 font-display text-2xl text-foreground">Pickup vs delivery</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Pickup photo (merchant)</p>
                <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-secondary/30">
                  <img src={riderPayoutCase.pickupImage} alt="Pickup" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Delivery photo (customer door)</p>
                <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-secondary/30">
                  <img src={riderPayoutCase.deliveryImage} alt="Delivery" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="space-y-5 p-5">
            <div className="flex items-center gap-2 text-foreground font-semibold"><Wallet className="h-4 w-4 text-primary" /> Refunds summary</div>
            <div className="grid gap-3 md:grid-cols-3">
              <Stat label="Delivery fee" value={formatNaira(riderPayoutCase.payoutAmount)} icon={Coins} />
              <Stat label="Customer tip" value={formatNaira(riderPayoutCase.tips)} icon={Sparkles} />
              <Stat label="Performance bonus" value={formatNaira(riderPayoutCase.bonus)} icon={ShieldCheck} />
            </div>
            <div className="rounded-lg border border-success/20 bg-success/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-success">Credited to wallet</p>
              <p className="mt-1 font-display text-4xl text-foreground">{formatNaira(total)}</p>
            </div>
          </CardContent>
        </Card>

        <Alert className="border-success/20 bg-success/5 [&>svg]:text-success">
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Escrow verification complete</AlertTitle>
          <AlertDescription>Cheinly verified handoff photos against the customer's delivery confirmation and released payment.</AlertDescription>
        </Alert>

        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="outline" onClick={() => navigate(`/buyer/order?${baseQuery}`)} className="border-border bg-card hover:bg-secondary">View order</Button>
          <Button onClick={() => navigate(`/buyer/dashboard?${baseQuery}`)} className="bg-primary text-primary-foreground hover:bg-primary/90">Continue</Button>
        </div>
      </main>

      <BuyerFooter variant="dashboard" />
    </div>
  );
};

const Stat = ({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Coins }) => (
  <div className="rounded-lg border border-border bg-secondary/40 p-4">
    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"><Icon className="h-3.5 w-3.5 text-primary" /> {label}</div>
    <p className="mt-2 font-display text-2xl text-foreground">{value}</p>
  </div>
);

export default BuyerRiderPayout;