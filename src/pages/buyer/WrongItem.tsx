import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, MessageSquareMore, PackageX, RotateCcw, ShieldAlert, Undo2 } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { wrongItemCase } from "@/lib/orderMock";
import { toast } from "sonner";

const BuyerWrongItem = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const baseQuery = useMemo(() => new URLSearchParams({ productId: params.get("productId") ?? "MD-9521X", orderId: params.get("orderId") ?? "ORD-521-450", entry: "secure-checkout", mode: params.get("mode") ?? "guest", provider: params.get("provider") ?? "cheinly" }).toString(), [params]);

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />

      <main className="mx-auto flex-1 w-full max-w-6xl px-5 py-8 lg:px-8 space-y-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <Card className="overflow-hidden shadow-card">
          <div className="flex flex-wrap items-center gap-4 border-b border-destructive/20 bg-destructive/10 px-6 py-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive"><PackageX className="h-6 w-6" /></div>
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-[0.2em] text-destructive">System detected mismatch</p>
              <h1 className="mt-1 font-display text-3xl text-foreground">Wrong Package Delivered?</h1>
              <p className="text-sm text-muted-foreground">Case {wrongItemCase.caseId} • Detected {wrongItemCase.detectedAt}</p>
            </div>
            <Badge className="border border-destructive/30 bg-destructive/10 text-destructive">High Discrepancy</Badge>
          </div>

          <CardContent className="space-y-5 p-5">
            <div>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="text-muted-foreground">Visual mismatch confidence</span>
                <span className="font-medium text-destructive">{wrongItemCase.discrepancyScore}%</span>
              </div>
              <Progress value={wrongItemCase.discrepancyScore} className="mt-2" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Expected (seller package)</p>
                <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-secondary/30">
                  <img src={wrongItemCase.expectedImage} alt="Expected" className="h-full w-full object-cover" />
                </div>
                <p className="text-xs text-muted-foreground">{wrongItemCase.expectedItem}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-destructive">Received (rider handoff)</p>
                <div className="aspect-[4/3] overflow-hidden rounded-lg border border-destructive/30 bg-secondary/30">
                  <img src={wrongItemCase.receivedImage} alt="Received" className="h-full w-full object-cover" />
                </div>
                <p className="text-xs text-muted-foreground">Visual signature does not match the expected parcel.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert className="border-gold/30 bg-gold/10 text-foreground [&>svg]:text-gold">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Escrow stays frozen</AlertTitle>
          <AlertDescription>No funds will be released to the seller or rider until the correct item is confirmed at handoff.</AlertDescription>
        </Alert>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-primary/30 shadow-card">
            <CardContent className="space-y-3 p-5">
              <Badge className="border border-primary/30 bg-primary/10 text-primary">Recommended</Badge>
              <h2 className="font-display text-2xl text-foreground">Request Redelivery</h2>
              <p className="text-sm text-muted-foreground">The rider returns to the dispatch hub, picks up the correct parcel, and brings it to your address.</p>
              <Button onClick={() => { toast.success("Redelivery requested. Tracking the rider now."); navigate(`/buyer/redelivery?${baseQuery}`); }} className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"><RotateCcw className="h-4 w-4" /> Request Redelivery</Button>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="space-y-3 p-5">
              <Badge className="border border-border bg-secondary text-muted-foreground">Alternative</Badge>
              <h2 className="font-display text-2xl text-foreground">Request Full Refund</h2>
              <p className="text-sm text-muted-foreground">Cancel the order and release the protected balance back to your Cheinly wallet within 24 hours.</p>
              <Button variant="outline" onClick={() => { toast.success("Full refund initiated."); navigate(`/buyer/dispute?${baseQuery}&source=wrong-item`); }} className="w-full gap-2 border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10"><Undo2 className="h-4 w-4" /> Request Full Refund</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-primary/10 text-primary"><AvatarFallback>{wrongItemCase.riderInitials}</AvatarFallback></Avatar>
              <div>
                <p className="font-semibold text-foreground">{wrongItemCase.riderName} <span className="text-xs font-normal text-muted-foreground">(Courier)</span></p>
                <p className="text-xs text-success">● Online now</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto gap-2 border-border bg-card hover:bg-secondary"><MessageSquareMore className="h-4 w-4" /> Reply</Button>
            </div>
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 text-sm text-foreground">
              <p className="text-xs text-muted-foreground">{wrongItemCase.riderName} • {wrongItemCase.detectedAt}</p>
              <p className="mt-2 leading-relaxed">{wrongItemCase.riderMessage}</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-gold" />
          <p>If this happens repeatedly with the same rider or seller, escalate so Cheinly's trust team can investigate the route.</p>
        </div>
      </main>

      <BuyerFooter variant="dashboard" />
    </div>
  );
};

export default BuyerWrongItem;