import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, CheckCircle2, Search, ShieldAlert, ZoomIn } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { buildDisputeSummary, getBuyerOrderById, isDeliveryCodeValid } from "@/lib/orderMock";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type StageDecision = "match" | "mismatch";

const getStageDecisionStorageKey = (orderId: string) => `buyer-authentication-stage-decisions:${orderId}`;

const BuyerAuthentication = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const order = useMemo(() => getBuyerOrderById(params.get("orderId")), [params]);
  const productId = params.get("productId") ?? order.productId;
  const mode = params.get("mode") ?? "guest";
  const provider = params.get("provider") ?? "cheinly";
  const baseQuery = new URLSearchParams({ productId, orderId: order.id, entry: "secure-checkout", mode, provider }).toString();
  const [confirmationCode, setConfirmationCode] = useState("");
  const [activeImage, setActiveImage] = useState<{ image: string; title: string } | null>(null);
  const [stageDecisions, setStageDecisions] = useState<Partial<Record<string, StageDecision>>>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    const saved = window.localStorage.getItem(getStageDecisionStorageKey(order.id));

    if (!saved) {
      return {};
    }

    try {
      return JSON.parse(saved) as Partial<Record<string, StageDecision>>;
    } catch {
      window.localStorage.removeItem(getStageDecisionStorageKey(order.id));
      return {};
    }
  });

  useEffect(() => {
    window.localStorage.setItem(getStageDecisionStorageKey(order.id), JSON.stringify(stageDecisions));
  }, [order.id, stageDecisions]);

  const reviewedCount = order.deliveryStages.filter((stage) => stageDecisions[stage.id]).length;
  const mismatchCount = Object.values(stageDecisions).filter((value) => value === "mismatch").length;
  const hasMismatch = mismatchCount > 0;
  const allStagesReviewed = reviewedCount === order.deliveryStages.length;
  const canHold = isDeliveryCodeValid(order, confirmationCode) && allStagesReviewed && hasMismatch;

  const handleEscalate = () => {
    if (!isDeliveryCodeValid(order, confirmationCode)) {
      toast.error("Enter the correct delivery code to lock rider payment.");
      return;
    }

    if (!allStagesReviewed) {
      toast.error("Review all four stages before escalating this order.");
      return;
    }

    toast.success("Rider payment placed on hold and issue flagged.");
    navigate(`/buyer/dispute?${baseQuery}&summary=${encodeURIComponent(buildDisputeSummary(order, mismatchCount))}`);
  };

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />

      <main className="mx-auto flex-1 w-full max-w-7xl px-5 py-8 lg:px-8 space-y-6">
        <div className="space-y-2">
          <button onClick={() => navigate(`/buyer/confirm-delivery?${baseQuery}`)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> Back to delivery confirmation
          </button>
          <h1 className="font-display text-4xl text-foreground">4-Stage Delivery Authentication</h1>
          <p className="text-sm text-muted-foreground">Review the full product lifecycle before escrow funds or rider payout can be released.</p>
        </div>

        {hasMismatch ? (
          <Alert variant="destructive" className="border-destructive/30 bg-destructive/10 text-foreground [&>svg]:text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Mismatch identified</AlertTitle>
            <AlertDescription>
              {mismatchCount} of {order.deliveryStages.length} stages were flagged as inconsistent. Escalate the dispute and keep escrow locked until the issue is resolved.
            </AlertDescription>
          </Alert>
        ) : allStagesReviewed ? (
          <Alert className="border-success/20 bg-success/5 [&>svg]:text-success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>All four stages match</AlertTitle>
            <AlertDescription>
              The packaging and delivery lifecycle looks consistent. You can return to delivery confirmation to release funds safely.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-success/20 bg-success/5 [&>svg]:text-success">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Authentication review in progress</AlertTitle>
            <AlertDescription>
              Mark each stage as a match or mismatch. Escrow remains locked until all four stages are reviewed.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {order.deliveryStages.map((stage) => {
                const decision = stageDecisions[stage.id];

                return (
                  <Card key={stage.id} className="shadow-card">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{stage.actor}</p>
                          <h2 className="mt-2 font-display text-2xl text-foreground">{stage.title}</h2>
                        </div>
                        <button onClick={() => setActiveImage({ image: stage.image, title: stage.title })} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground" aria-label={`Zoom ${stage.title}`}>
                          <ZoomIn className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-secondary/20">
                        <img src={stage.image} alt={`${stage.title} product evidence`} className="h-full w-full object-cover" loading="lazy" />
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{stage.note}</p>
                        <p className="text-xs text-muted-foreground">
                          {decision
                            ? decision === "match"
                              ? "Marked as visually consistent with the expected product state."
                              : "Flagged as inconsistent and included in mismatch detection."
                            : "Select Match or Mismatch to complete this verification stage."}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {(["match", "mismatch"] as StageDecision[]).map((option) => (
                          <button
                            key={option}
                            onClick={() => setStageDecisions((current) => ({ ...current, [stage.id]: option }))}
                            className={cn(
                              "rounded-md border px-4 py-3 text-sm font-medium transition-colors",
                              decision === option
                                ? option === "match"
                                  ? "border-success/40 bg-success/10 text-success"
                                  : "border-destructive/40 bg-destructive/10 text-destructive"
                                : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
                            )}
                          >
                            {option === "match" ? "Match" : "Mismatch"}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <aside className="space-y-6">
            <Card className="shadow-card">
              <CardContent className="space-y-5 p-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Verification controls</p>
                  <h2 className="mt-2 font-display text-2xl text-foreground">Authentication summary</h2>
                </div>

                <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm space-y-3">
                  <SummaryRow label="Stages reviewed" value={`${reviewedCount}/${order.deliveryStages.length}`} tone={!allStagesReviewed ? "warning" : undefined} />
                  <SummaryRow label="Matches" value={String(reviewedCount - mismatchCount)} />
                  <SummaryRow label="Mismatches" value={String(mismatchCount)} tone={hasMismatch ? "danger" : undefined} />
                  <SummaryRow label="Escrow" value="Locked until verification completes" stacked />
                </div>

                <div className="rounded-lg border border-border bg-card p-4 text-sm space-y-3">
                  <SummaryRow label="Seller stages" value={String(order.deliveryStages.slice(0, 2).filter((stage) => stageDecisions[stage.id] === "match").length)} />
                  <SummaryRow label="Buyer stages" value={String(order.deliveryStages.slice(2).filter((stage) => stageDecisions[stage.id] === "match").length)} />
                  <SummaryRow
                    label="System status"
                    value={hasMismatch ? "Inconsistency detected" : allStagesReviewed ? "Lifecycle aligned" : "Awaiting review"}
                    stacked
                    tone={hasMismatch ? "danger" : allStagesReviewed ? undefined : "warning"}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="authentication-code" className="text-sm font-medium text-foreground">Delivery confirmation code</label>
                  <Input
                    id="authentication-code"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter rider code"
                    value={confirmationCode}
                    onChange={(event) => setConfirmationCode(event.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-3">
                  <Button onClick={handleEscalate} disabled={!canHold} className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
                    <ShieldAlert className="h-4 w-4" /> Hold Rider Payment & Report Issue
                  </Button>
                  <Button variant="outline" onClick={() => navigate(`/buyer/confirm-delivery?${baseQuery}`)} className="w-full border-border bg-card hover:bg-secondary">
                    Return to delivery confirmation
                  </Button>
                  <Button variant="outline" onClick={() => navigate(`/buyer/dispute?${baseQuery}`)} className="w-full border-border bg-card hover:bg-secondary">
                    Escalate Dispute
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <BuyerFooter variant="dashboard" />

      <Dialog open={Boolean(activeImage)} onOpenChange={(open) => !open && setActiveImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="flex items-center gap-2"><Search className="h-4 w-4 text-primary" /> {activeImage?.title}</DialogTitle>
            <DialogDescription>Zoomed verification evidence for detailed inspection.</DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6">
            {activeImage ? <img src={activeImage.image} alt={activeImage.title} className="max-h-[70vh] w-full rounded-lg object-contain" /> : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const SummaryRow = ({ label, value, stacked = false, tone }: { label: string; value: string; stacked?: boolean; tone?: "danger" | "warning" }) => (
  <div className={stacked ? "space-y-1" : "flex items-start justify-between gap-3"}>
    <span className="text-muted-foreground">{label}</span>
    <span className={cn("font-medium text-right text-foreground", tone === "danger" && "text-destructive", tone === "warning" && "text-primary")}>{value}</span>
  </div>
);

export default BuyerAuthentication;