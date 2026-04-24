import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatNaira } from "@/lib/buyerMock";
import { partialRefundSuccess } from "@/lib/orderMock";
import { cn } from "@/lib/utils";

const BuyerRefundSuccess = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const baseQuery = useMemo(() => new URLSearchParams({ productId: params.get("productId") ?? "MD-9521X", orderId: params.get("orderId") ?? "ORD-12345", entry: "secure-checkout", mode: params.get("mode") ?? "guest", provider: params.get("provider") ?? "cheinly" }).toString(), [params]);
  const disputedAmount = Number(params.get("amount")) || partialRefundSuccess.disputedAmount;

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />

      <main className="mx-auto flex-1 w-full max-w-4xl px-5 py-8 lg:px-8 space-y-6">
        <button onClick={() => navigate(`/buyer/order?${baseQuery}`)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
          <ArrowLeft className="h-4 w-4" /> Back to order
        </button>

        <Card className="shadow-card">
          <CardContent className="space-y-6 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-4xl text-foreground">Partial Refund Request Submitted</h1>
              <p className="text-sm text-muted-foreground">Case <span className="font-medium text-foreground">{partialRefundSuccess.caseId}</span> • Filed {partialRefundSuccess.requestedOn} • Expected resolution: {partialRefundSuccess.expectedResolutionWindow}</p>
            </div>
            <div className="mx-auto max-w-sm rounded-lg border border-border bg-secondary/40 p-4 text-left text-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Disputed item</p>
              <p className="mt-1 font-semibold text-foreground">{partialRefundSuccess.itemName}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Disputed amount</p>
              <p className="mt-1 font-display text-3xl text-foreground">{formatNaira(disputedAmount)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="space-y-5 p-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Resolution timeline</p>
              <h2 className="mt-2 font-display text-2xl text-foreground">What happens next</h2>
            </div>
            <ol className="space-y-4">
              {partialRefundSuccess.timeline.map((step, index) => (
                <li key={step.id} className="flex gap-4">
                  <div className={cn("relative mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border", step.state === "complete" ? "border-success bg-success/15 text-success" : step.state === "current" ? "border-primary bg-primary/15 text-primary" : "border-border bg-secondary text-muted-foreground")}>
                    {step.state === "complete" ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    {index < partialRefundSuccess.timeline.length - 1 ? <span className="absolute left-1/2 top-full h-6 w-px -translate-x-1/2 bg-border" aria-hidden /> : null}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-foreground">{step.label}</p>
                      <p className="text-xs text-muted-foreground">{step.date}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Alert className="border-success/20 bg-success/5 [&>svg]:text-success">
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Secure Escrow Update</AlertTitle>
          <AlertDescription>
            {formatNaira(partialRefundSuccess.releasedAmount)} for verified items has been released to the seller. {formatNaira(disputedAmount)} remains locked until this dispute resolves.
          </AlertDescription>
        </Alert>

        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="outline" onClick={() => navigate(`/buyer/dispute?${baseQuery}`)} className="border-border bg-card hover:bg-secondary">View dispute center</Button>
          <Button onClick={() => navigate(`/buyer/order?${baseQuery}`)} className="bg-primary text-primary-foreground hover:bg-primary/90">Back to order</Button>
        </div>
      </main>

      <BuyerFooter variant="dashboard" />
    </div>
  );
};

export default BuyerRefundSuccess;