import { ChangeEvent, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera, Lock, MessageCircle, Phone, ShieldCheck, WifiOff, X } from "lucide-react";
import { motion } from "framer-motion";
import { RiderShell } from "@/components/rider/RiderShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { formatNaira, getDeliveryProof, getOfflineMode, getOrderById, pushHistory, saveDeliveryProof, updateOrder } from "@/lib/riderMock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const RiderDropoff = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = useMemo(() => getOrderById(orderId ?? null), [orderId]);
  const [pin, setPin] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [proof, setProof] = useState<string | undefined>(orderId ? getDeliveryProof(orderId) : undefined);
  const offline = getOfflineMode();
  const fileRef = useRef<HTMLInputElement>(null);

  if (!order) {
    return (
      <RiderShell>
        <div className="flex min-h-screen items-center justify-center">
          <Button onClick={() => navigate("/rider/dashboard")}>Back to dashboard</Button>
        </div>
      </RiderShell>
    );
  }

  const handleProof = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setProof(url);
      saveDeliveryProof(order.id, url);
      toast.success("Proof photo attached.");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const complete = () => {
    if (!proof) {
      toast.error("Capture a delivery proof photo first.");
      return;
    }
    if (pin.length !== 4) {
      toast.error("Enter the 4-digit delivery code.");
      return;
    }
    if (pin !== order.deliveryPin) {
      toast.error("That code doesn't match. Ask the recipient to confirm.");
      setPin("");
      return;
    }
    setSubmitting(true);
    updateOrder(order.id, { status: "delivered" });
    pushHistory({ id: order.id, shortRef: order.shortRef, destination: order.destinationLandmark, payout: order.price, completedAt: "Just now" });
    if (offline) toast.message("Saved offline — will sync when reconnected.");
    setTimeout(() => navigate(`/rider/order/${order.id}/complete`, { replace: true }), 400);
  };

  return (
    <RiderShell
      topBar={
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.18em] text-gold">Drop-off</p>
            <p className="font-display text-lg leading-tight text-foreground">{order.shortRef}</p>
          </div>
        </div>
      }
    >
      <div className="space-y-4 px-5 py-5">
        {offline ? (
          <div className="flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-xs text-foreground">
            <WifiOff className="h-4 w-4 text-gold" /> Offline mode — drop-off will sync when you reconnect.
          </div>
        ) : null}
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Recipient</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-base font-medium text-foreground">{order.recipientName}</p>
                <p className="truncate text-xs text-muted-foreground">{order.recipientPhone}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">{order.destinationAddr}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={() => toast.message(`Calling ${order.recipientName}…`)}>
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={() => toast.message("Opening chat…")}>
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Step 1 — Proof photo</p>
                <p className="text-sm font-medium text-foreground">Capture handover image</p>
              </div>
              {proof ? (
                <button onClick={() => { setProof(undefined); }} className="text-xs text-muted-foreground underline-offset-2 hover:underline">
                  Replace
                </button>
              ) : null}
            </div>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="sr-only" onChange={handleProof} />
            {proof ? (
              <div className="relative overflow-hidden rounded-xl border border-border">
                <img src={proof} alt="Delivery proof" className="aspect-[16/10] w-full object-cover" />
                <button
                  onClick={() => setProof(undefined)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground shadow"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-secondary/40",
                )}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Camera className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-foreground">Tap to capture proof</p>
                <p className="text-xs">Photo of parcel with recipient</p>
              </button>
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="space-y-4 p-5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-xl text-foreground">Step 2 — Enter delivery code</p>
              <p className="mt-1 text-xs text-muted-foreground">Ask the recipient for their 4-digit Cheinly code to release the package.</p>
            </div>
            <div className="flex justify-center">
              <InputOTP maxLength={4} value={pin} onChange={setPin}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
                  <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
                  <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
                  <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <p className="text-[11px] text-muted-foreground">Demo code: <span className="font-mono font-medium text-foreground">{order.deliveryPin}</span></p>
          </CardContent>
        </Card>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button onClick={complete} disabled={submitting} className="h-12 w-full rounded-xl text-base">
            <ShieldCheck className="mr-2 h-4 w-4" /> Complete delivery • {formatNaira(order.price)}
          </Button>
        </motion.div>
      </div>
    </RiderShell>
  );
};

export default RiderDropoff;