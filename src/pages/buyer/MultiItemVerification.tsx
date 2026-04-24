import { ChangeEvent, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, CheckCircle2, FileWarning, ImagePlus, RotateCcw, ShieldCheck, Upload, ZoomIn } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatNaira } from "@/lib/buyerMock";
import { multiItemVerification, type ItemVerificationStatus, type MultiItemVerificationEntry } from "@/lib/orderMock";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ItemState = {
  proof: string | null;
  decision: ItemVerificationStatus;
};

const initialState: Record<string, ItemState> = multiItemVerification.reduce((acc, item) => {
  acc[item.id] = { proof: null, decision: "pending" };
  return acc;
}, {} as Record<string, ItemState>);

const decisionStyles: Record<ItemVerificationStatus, string> = {
  pending: "border-border bg-secondary/40 text-muted-foreground",
  verified: "border-success/30 bg-success/10 text-success",
  disputed: "border-destructive/30 bg-destructive/10 text-destructive",
};

const decisionLabels: Record<ItemVerificationStatus, string> = {
  pending: "Awaiting Review",
  verified: "Match Confirmed",
  disputed: "Mismatch Flagged",
};

const BuyerMultiItemVerification = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [items, setItems] = useState<Record<string, ItemState>>(initialState);
  const [zoom, setZoom] = useState<{ image: string; title: string; description: string } | null>(null);

  const orderId = params.get("orderId") ?? "ORD-521-450";
  const productId = params.get("productId") ?? "MD-9521X";
  const baseQuery = useMemo(() => new URLSearchParams({ productId, orderId, entry: "secure-checkout", mode: params.get("mode") ?? "guest", provider: params.get("provider") ?? "cheinly" }).toString(), [orderId, productId, params]);

  const totalDisputed = useMemo(() => multiItemVerification.reduce((sum, item) => (items[item.id]?.decision === "disputed" ? sum + item.unitPrice * item.quantity : sum), 0), [items]);
  const reviewed = Object.values(items).filter((entry) => entry.decision !== "pending").length;
  const mismatchCount = Object.values(items).filter((entry) => entry.decision === "disputed").length;
  const allReviewed = reviewed === multiItemVerification.length;

  const handleProof = (id: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setItems((current) => ({ ...current, [id]: { ...current[id], proof: url } }));
    toast.success("Proof photo added.");
  };

  const setDecision = (id: string, decision: ItemVerificationStatus) => {
    setItems((current) => ({ ...current, [id]: { ...current[id], decision } }));
  };

  const reportItem = (item: MultiItemVerificationEntry) => {
    setDecision(item.id, "disputed");
    navigate(`/buyer/report-issue?${baseQuery}&itemId=${item.id}`);
  };

  const requestRefund = (item: MultiItemVerificationEntry) => {
    setDecision(item.id, "disputed");
    navigate(`/buyer/refund-partial?${baseQuery}&itemId=${item.id}`);
  };

  const handleSubmit = () => {
    if (!allReviewed) {
      toast.error("Mark every item as Match or Mismatch before continuing.");
      return;
    }
    if (mismatchCount > 0) {
      toast.message("Mismatch detected — opening dispute workflow.");
      navigate(`/buyer/dispute?${baseQuery}&source=multi-item`);
      return;
    }
    toast.success("All items verified — escrow ready for release.");
    navigate(`/buyer/confirm-delivery?${baseQuery}`);
  };

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />

      <main className="mx-auto flex-1 w-full max-w-7xl px-5 py-8 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <button onClick={() => navigate(`/buyer/confirm-delivery?${baseQuery}`)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
              <ArrowLeft className="h-4 w-4" /> Back to delivery confirmation
            </button>
            <h1 className="font-display text-4xl text-foreground">Multi-item Delivery Verification</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">Compare each item's initial listing photo against the proof you received. Flag any mismatch so escrow stays locked on the affected items.</p>
          </div>
          <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm shadow-card">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Reviewed</p>
            <p className="mt-1 font-semibold text-foreground">{reviewed} / {multiItemVerification.length} items</p>
          </div>
        </div>

        {mismatchCount > 0 ? (
          <Alert variant="destructive" className="border-destructive/30 bg-destructive/10 text-foreground [&>svg]:text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{mismatchCount} item{mismatchCount > 1 ? "s" : ""} flagged</AlertTitle>
            <AlertDescription>{formatNaira(totalDisputed)} will remain locked in escrow on the disputed items until resolution.</AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-success/20 bg-success/5 [&>svg]:text-success">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Escrow stays protected</AlertTitle>
            <AlertDescription>Funds release only after every item is reviewed. Mark each as Match or Mismatch.</AlertDescription>
          </Alert>
        )}

        <div className="space-y-5">
          {multiItemVerification.map((item) => {
            const state = items[item.id];
            return (
              <Card key={item.id} className="shadow-card">
                <CardContent className="space-y-5 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-2xl text-foreground">{item.name}</h2>
                        <Badge className={cn("border", decisionStyles[state.decision])}>{decisionLabels[state.decision]}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.variant} • {formatNaira(item.unitPrice)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" onClick={() => setDecision(item.id, "verified")} className={cn("gap-2 border-success/30 bg-success/5 text-success hover:bg-success/10", state.decision === "verified" && "ring-2 ring-success/40")}> <CheckCircle2 className="h-4 w-4" /> Match</Button>
                      <Button variant="outline" onClick={() => setDecision(item.id, "disputed")} className={cn("gap-2 border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10", state.decision === "disputed" && "ring-2 ring-destructive/40")}> <AlertTriangle className="h-4 w-4" /> Mismatch</Button>
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <Panel title="Initial Listing" caption="Seller reference photo" image={item.listingImage} alt={`${item.name} listing`} onZoom={(image) => setZoom({ image, title: `${item.name} — listing`, description: "Original seller listing reference." })} />
                    <Panel
                      title="Your Proof"
                      caption={state.proof ? "Uploaded delivery proof" : "Upload what you received"}
                      image={state.proof}
                      alt={`${item.name} proof`}
                      onZoom={(image) => setZoom({ image, title: `${item.name} — proof`, description: "Inspect the delivery proof you uploaded." })}
                      emptyState={
                        <label className="flex h-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-secondary/20 p-6 text-center transition-colors hover:border-primary/40 hover:bg-secondary/35">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><ImagePlus className="h-5 w-5" /></div>
                          <div>
                            <p className="font-medium text-foreground">Upload proof photo</p>
                            <p className="mt-1 text-sm text-muted-foreground">PNG, JPG or WEBP up to 10MB</p>
                          </div>
                          <span className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"><Upload className="h-4 w-4" /> Choose image</span>
                          <input type="file" accept="image/*" className="sr-only" onChange={handleProof(item.id)} />
                        </label>
                      }
                    />
                  </div>

                  {state.decision === "disputed" ? (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-foreground">
                      <div className="flex items-start gap-3">
                        <FileWarning className="mt-0.5 h-4 w-4 text-destructive" />
                        <div className="space-y-1">
                          <p className="font-medium">Mismatch noted</p>
                          <p className="text-muted-foreground">{item.mismatchReason}</p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground">Item value held in escrow: <span className="font-medium text-foreground">{formatNaira(item.unitPrice * item.quantity)}</span></p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" onClick={() => reportItem(item)} className="gap-2 border-border bg-card hover:bg-secondary"><FileWarning className="h-4 w-4" /> Report Issue</Button>
                      <Button variant="outline" onClick={() => requestRefund(item)} className="gap-2 border-gold/30 bg-gold/10 text-foreground hover:bg-gold/20"><RotateCcw className="h-4 w-4" /> Request Refund</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="shadow-card">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Verification summary</p>
              <p className="mt-1 text-sm text-foreground">{reviewed} of {multiItemVerification.length} items reviewed • {mismatchCount} flagged • {formatNaira(totalDisputed)} held</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => navigate(`/buyer/dispute?${baseQuery}&source=multi-item`)} className="gap-2 border-border bg-card hover:bg-secondary">Open Dispute Center</Button>
              <Button onClick={handleSubmit} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">Continue Verification</Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <BuyerFooter variant="dashboard" />

      <Dialog open={Boolean(zoom)} onOpenChange={(open) => !open && setZoom(null)}>
        <DialogContent className="max-w-4xl overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="flex items-center gap-2"><ZoomIn className="h-4 w-4 text-primary" /> {zoom?.title}</DialogTitle>
            <DialogDescription>{zoom?.description}</DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6">
            {zoom ? <div className="overflow-hidden rounded-lg border border-border bg-secondary/20"><img src={zoom.image} alt={zoom.title} className="max-h-[75vh] w-full object-contain" /></div> : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Panel = ({ title, caption, image, alt, onZoom, emptyState }: { title: string; caption: string; image: string | null | undefined; alt: string; onZoom: (image: string) => void; emptyState?: React.ReactNode }) => (
  <div className="space-y-3 rounded-lg border border-border bg-card p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{caption}</p>
      </div>
      {image ? (
        <button type="button" onClick={() => onZoom(image)} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground" aria-label={`Zoom ${title}`}>
          <ZoomIn className="h-4 w-4" />
        </button>
      ) : null}
    </div>
    <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-secondary/30">
      {image ? <img src={image} alt={alt} className="h-full w-full object-cover" loading="lazy" /> : emptyState}
    </div>
  </div>
);

export default BuyerMultiItemVerification;