import { ChangeEvent, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Camera, CheckCircle2, ImagePlus, Lock, ShieldCheck, Truck } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { returnDispatchCase } from "@/lib/orderMock";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PackagingItemsList, PackagingItem, makeEmptyItem } from "@/components/shared/PackagingItemsList";

const BuyerReturnDispatch = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const baseQuery = useMemo(() => new URLSearchParams({ productId: params.get("productId") ?? "MD-9521X", orderId: params.get("orderId") ?? "ORD-12345", entry: "secure-checkout", mode: params.get("mode") ?? "guest", provider: params.get("provider") ?? "cheinly" }).toString(), [params]);

  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [capture, setCapture] = useState<string | null>(null);
  const [returnItems, setReturnItems] = useState<PackagingItem[]>([makeEmptyItem()]);

  const handleVerify = () => {
    if (code !== returnDispatchCase.pickupCode) {
      toast.error("Pickup code doesn't match. Confirm the 6-digit code with the buyer.");
      return;
    }
    setVerified(true);
    toast.success("Pickup code verified. You can now capture the return item.");
  };

  const handleCapture = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCapture(URL.createObjectURL(file));
    toast.success("Return item captured for inspection.");
  };

  const handleSubmit = () => {
    if (!verified) {
      toast.error("Verify the pickup code first.");
      return;
    }
    if (!capture) {
      toast.error("Capture the return item before continuing.");
      return;
    }
    const itemsValid =
      returnItems.length > 0 &&
      returnItems.every((i) => i.name.trim().length > 0 && i.photos.length > 0);
    if (!itemsValid) {
      toast.error("List each returned item and add at least one photo per item.");
      return;
    }
    toast.success("Return dispatch authenticated. Heading to the seller.");
    navigate(`/buyer/rider-payout?${baseQuery}`);
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
              <h1 className="font-display text-4xl text-foreground">Return Dispatch Authentication</h1>
              <Badge className="border border-gold/30 bg-gold/10 text-gold">Case {returnDispatchCase.caseId}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Rider portal • Verify identity, then capture the return item against the original listing before pickup is approved.</p>
          </div>
          <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm shadow-card">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Pickup window</p>
            <p className="mt-1 font-semibold text-foreground">{returnDispatchCase.pickupWindow}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-card">
            <CardContent className="space-y-5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary"><ShieldCheck className="h-5 w-5" /></div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Step 1</p>
                  <h2 className="font-display text-2xl text-foreground">Identity verification portal</h2>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm">
                <Row label="Buyer" value={returnDispatchCase.buyerName} />
                <Row label="Pickup address" value={returnDispatchCase.buyerAddress} stacked />
                <Row label="Item" value={`${returnDispatchCase.itemName} • ${returnDispatchCase.itemVariant}`} stacked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickup-code">6-digit pickup code</Label>
                <Input id="pickup-code" inputMode="numeric" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/[^0-9]/g, "").slice(0, 6))} placeholder="••••••" className="h-14 text-center text-2xl tracking-[0.5em]" />
                <p className="text-xs text-muted-foreground">The buyer will share this code at pickup. Hint for testing: <span className="font-medium text-foreground">{returnDispatchCase.pickupCode}</span>.</p>
              </div>
              <Button onClick={handleVerify} className={cn("w-full", verified ? "bg-success text-success-foreground hover:bg-success/90" : "bg-primary text-primary-foreground hover:bg-primary/90")} disabled={verified}>
                {verified ? (<><CheckCircle2 className="mr-2 h-4 w-4" /> Identity verified</>) : "Verify pickup code"}
              </Button>
            </CardContent>
          </Card>

          <Card className={cn("shadow-card transition-opacity", !verified && "opacity-70")}>
            <CardContent className="space-y-5 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-md", verified ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground")}><Camera className="h-5 w-5" /></div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Step 2</p>
                    <h2 className="font-display text-2xl text-foreground">Item inspection & capture</h2>
                  </div>
                </div>
                {!verified ? <Lock className="h-5 w-5 text-muted-foreground" /> : null}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Original listing</p>
                  <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border bg-secondary/30">
                    <img src={returnDispatchCase.listingImage} alt="Listing reference" className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Return capture</p>
                  <div className="aspect-[4/3] overflow-hidden rounded-lg border border-dashed border-border bg-secondary/20">
                    {capture ? <img src={capture} alt="Return capture" className="h-full w-full object-cover" /> : (
                      <label className={cn("flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-sm", verified ? "cursor-pointer text-muted-foreground hover:text-foreground" : "cursor-not-allowed text-muted-foreground")}>
                        <ImagePlus className="h-6 w-6" />
                        <p>Tap to capture the returned item</p>
                        <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={handleCapture} disabled={!verified} />
                      </label>
                    )}
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm">
                <p className="font-medium text-foreground">Expected contents</p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  {returnDispatchCase.expectedItems.map((expected) => <li key={expected}>• {expected}</li>)}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className={cn("shadow-card", !verified && "opacity-70")}>
          <CardContent className="space-y-4 p-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Step 3</p>
              <h2 className="font-display text-2xl text-foreground">Returned items checklist</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                List every item being returned with photos. If you're returning more than one piece, add a photo for each.
              </p>
            </div>
            <PackagingItemsList items={returnItems} onChange={setReturnItems} title="Items being returned" description="" />
          </CardContent>
        </Card>

        <Alert className="border-gold/30 bg-gold/10 text-foreground [&>svg]:text-gold">
          <Lock className="h-4 w-4" />
          <AlertTitle>Escrow stays locked during return transit</AlertTitle>
          <AlertDescription>Funds remain frozen until the seller verifies the returned item back at the dispatch hub.</AlertDescription>
        </Alert>

        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="outline" onClick={() => navigate(-1)} className="border-border bg-card hover:bg-secondary">Abort pickup</Button>
          <Button onClick={handleSubmit} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"><Truck className="h-4 w-4" /> Confirm return dispatch</Button>
        </div>
      </main>

      <BuyerFooter variant="dashboard" />
    </div>
  );
};

const Row = ({ label, value, stacked = false }: { label: string; value: string; stacked?: boolean }) => (
  <div className={cn("py-1", stacked ? "space-y-1" : "flex items-start justify-between gap-3")}>
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground text-right">{value}</span>
  </div>
);

export default BuyerReturnDispatch;