import { ChangeEvent, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, CheckCircle2, CircleAlert, ImagePlus, Search, ShieldCheck, Upload, ZoomIn } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatNaira } from "@/lib/buyerMock";
import { confirmBuyerOrderDelivery, getBuyerOrderById, getOrderGrandTotal, isDeliveryCodeValid } from "@/lib/orderMock";
import { toast } from "sonner";

const BuyerDeliveryConfirmation = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const order = useMemo(() => getBuyerOrderById(params.get("orderId")), [params]);
  const productId = params.get("productId") ?? order.productId;
  const mode = params.get("mode") ?? "guest";
  const provider = params.get("provider") ?? "cheinly";
  const [confirmationCode, setConfirmationCode] = useState("");
  const [deliveryMatchConfirmed, setDeliveryMatchConfirmed] = useState(false);
  const [uploadedProof, setUploadedProof] = useState<string | null>(null);
  const [mismatchDetected, setMismatchDetected] = useState(false);
  const [activeImage, setActiveImage] = useState<{ image: string; title: string; description: string } | null>(null);

  const baseQuery = new URLSearchParams({ productId, orderId: order.id, entry: "secure-checkout", mode, provider }).toString();
  const amountHeld = getOrderGrandTotal(order);
  const canRelease = isDeliveryCodeValid(order, confirmationCode) && deliveryMatchConfirmed && !mismatchDetected;

  const handleProofUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const nextUrl = URL.createObjectURL(file);
    setUploadedProof(nextUrl);

    const mismatchHint = /(damaged|broken|wrong|mismatch|different)/i.test(file.name);
    setMismatchDetected(mismatchHint);
    toast.success("Delivery proof added for comparison.");
  };

  const handleConfirm = () => {
    if (!isDeliveryCodeValid(order, confirmationCode)) {
      toast.error("Enter the correct delivery confirmation code.");
      return;
    }

    if (!deliveryMatchConfirmed) {
      toast.error("Inspect the item and confirm it matches before releasing funds.");
      return;
    }

    if (mismatchDetected) {
      toast.error("Potential mismatch detected. Please open a dispute instead.");
      return;
    }

    confirmBuyerOrderDelivery(order.id);
    toast.success("Payment released to seller after delivery confirmation.");
    navigate(`/buyer/receipt?${baseQuery}`);
  };

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />

      <main className="mx-auto flex-1 w-full max-w-7xl px-5 py-8 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <button onClick={() => navigate(`/buyer/order?${baseQuery}`)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
              <ArrowLeft className="h-4 w-4" /> Back to Order Details
            </button>
            <div className="space-y-1">
              <h1 className="font-display text-4xl text-foreground">Delivery Confirmation</h1>
              <p className="text-sm text-muted-foreground">Verify the delivered item before releasing {formatNaira(amountHeld)} from escrow.</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm shadow-card">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Order</p>
            <p className="mt-1 font-semibold text-foreground">{order.shortRef}</p>
          </div>
        </div>

        {mismatchDetected ? (
          <Alert variant="destructive" className="border-destructive/30 bg-destructive/10 text-foreground [&>svg]:text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Mismatch warning</AlertTitle>
            <AlertDescription>
              The delivered item may not match the original shipment photo. We recommend opening a dispute so escrow remains locked.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-success/20 bg-success/5 [&>svg]:text-success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Escrow is still protected</AlertTitle>
            <AlertDescription>
              Funds will only be released after the delivery code is verified and you confirm the item condition.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <Card className="shadow-card">
              <CardContent className="space-y-5 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Visual verification</p>
                    <h2 className="mt-2 font-display text-2xl text-foreground">Compare shipment vs delivery</h2>
                  </div>
                  <div className="rounded-md bg-secondary px-3 py-2 text-xs text-muted-foreground">Side-by-side review</div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <PhotoPanel
                    title="Seller shipment photo"
                    description="Captured before dispatch"
                    image={order.deliveryStages[0]?.image ?? order.items[0]?.image}
                    alt={`${order.items[0]?.name} before shipment`}
                    footer="Reference image locked by seller"
                    onZoom={(image) => setActiveImage({ image, title: "Seller shipment photo", description: "Original reference photo captured before the parcel left the seller." })}
                  />

                  <PhotoPanel
                    title="Buyer delivery proof"
                    description="Upload what you received"
                    image={uploadedProof}
                    alt="Buyer uploaded delivery proof"
                    footer={uploadedProof ? "Delivery proof ready for review" : "Upload a clear photo of the received item"}
                    onZoom={(image) => setActiveImage({ image, title: "Buyer delivery proof", description: "Inspect the uploaded delivery evidence before you confirm fund release." })}
                    emptyState={
                      <label className="flex h-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-secondary/20 p-6 text-center transition-colors hover:border-primary/40 hover:bg-secondary/35">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <ImagePlus className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Upload delivery proof</p>
                          <p className="mt-1 text-sm text-muted-foreground">PNG, JPG, or WEBP accepted</p>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground">
                          <Upload className="h-4 w-4" /> Choose image
                        </span>
                        <input type="file" accept="image/*" className="sr-only" onChange={handleProofUpload} />
                      </label>
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="space-y-5 p-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Delivery release checks</p>
                  <h2 className="mt-2 font-display text-2xl text-foreground">Complete required verification</h2>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="delivery-code">Delivery confirmation code</Label>
                    <Input
                      id="delivery-code"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter rider code"
                      value={confirmationCode}
                      onChange={(event) => setConfirmationCode(event.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                      className="h-12 text-base"
                    />
                    <p className="text-xs text-muted-foreground">The code must match the handoff code provided by the rider.</p>
                  </div>

                  <div className="rounded-lg border border-border bg-secondary/30 p-4 text-sm">
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <ShieldCheck className="h-4 w-4 text-primary" /> Release conditions
                    </div>
                    <ul className="mt-3 space-y-2 text-muted-foreground">
                      <li>• Delivery code is correct</li>
                      <li>• Buyer confirms item matches description</li>
                      <li>• No mismatch warning is active</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                  <Checkbox id="match-confirmation" checked={deliveryMatchConfirmed} onCheckedChange={(checked) => setDeliveryMatchConfirmed(Boolean(checked))} className="mt-1" />
                  <div className="space-y-1">
                    <Label htmlFor="match-confirmation" className="text-sm text-foreground">I have inspected the item and it matches the description</Label>
                    <p className="text-xs text-muted-foreground">Only confirm if the received item, packaging condition, and contents are correct.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card className="shadow-card">
              <CardContent className="space-y-4 p-5 text-sm">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Escrow release</p>
                  <h2 className="mt-2 font-display text-2xl text-foreground">Decision panel</h2>
                </div>
                <div className="rounded-lg border border-border bg-secondary/40 p-4 space-y-2">
                  <InfoRow label="Protected amount" value={formatNaira(amountHeld)} />
                  <InfoRow label="Order status" value={order.status === "completed" ? "Verified" : "Awaiting confirmation"} />
                  <InfoRow label="Escrow state" value={order.escrowStatus} stacked />
                </div>
                <div className="space-y-3">
                  <Button onClick={handleConfirm} className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <CheckCircle2 className="h-4 w-4" /> Confirm & Release Payment
                  </Button>
                  <Button variant="outline" onClick={() => navigate(`/buyer/dispute?${baseQuery}&source=delivery-confirmation`)} className="w-full gap-2 border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <CircleAlert className="h-4 w-4" /> Dispute Order
                  </Button>
                  <Button variant="outline" onClick={() => navigate(`/buyer/authentication?${baseQuery}`)} className="w-full border-border bg-card hover:bg-secondary">
                    Review 4-stage authentication
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <BuyerFooter variant="dashboard" />

      <Dialog open={Boolean(activeImage)} onOpenChange={(open) => !open && setActiveImage(null)}>
        <DialogContent className="max-w-5xl overflow-hidden p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="flex items-center gap-2"><Search className="h-4 w-4 text-primary" /> {activeImage?.title}</DialogTitle>
            <DialogDescription>{activeImage?.description}</DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6">
            {activeImage ? (
              <div className="overflow-hidden rounded-lg border border-border bg-secondary/20">
                <img src={activeImage.image} alt={activeImage.title} className="max-h-[75vh] w-full object-contain" />
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const PhotoPanel = ({
  title,
  description,
  image,
  alt,
  footer,
  emptyState,
  onZoom,
}: {
  title: string;
  description: string;
  image: string | null | undefined;
  alt: string;
  footer: string;
  emptyState?: React.ReactNode;
  onZoom?: (image: string) => void;
}) => (
  <div className="space-y-3 rounded-lg border border-border bg-card p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {image && onZoom ? (
        <button
          type="button"
          onClick={() => onZoom(image)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          aria-label={`Zoom ${title}`}
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      ) : null}
    </div>
    <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-secondary/30">
      {image ? <img src={image} alt={alt} className="h-full w-full object-cover" loading="lazy" /> : emptyState}
    </div>
    <p className="text-xs text-muted-foreground">{footer}</p>
  </div>
);

const InfoRow = ({ label, value, stacked = false }: { label: string; value: string; stacked?: boolean }) => (
  <div className={stacked ? "space-y-1" : "flex items-start justify-between gap-3"}>
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground text-right">{value}</span>
  </div>
);

export default BuyerDeliveryConfirmation;