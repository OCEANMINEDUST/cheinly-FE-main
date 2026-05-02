import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Lock, ShieldCheck, Wallet } from "lucide-react";
import { RiderShell } from "@/components/rider/RiderShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatNaira, getOrderById, updateOrder } from "@/lib/riderMock";
import { toast } from "sonner";

const RiderReleasePayment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = useMemo(() => getOrderById(orderId ?? null), [orderId]);
  const [released, setReleased] = useState(false);

  if (!order) {
    return (
      <RiderShell>
        <div className="flex min-h-screen items-center justify-center">
          <Button onClick={() => navigate("/rider/dashboard")}>Back to dashboard</Button>
        </div>
      </RiderShell>
    );
  }

  const release = () => {
    updateOrder(order.id, { status: "delivered" });
    setReleased(true);
    toast.success("Payment released to seller.");
    setTimeout(() => navigate(`/rider/order/${order.id}/complete`, { replace: true }), 600);
  };

  return (
    <RiderShell
      topBar={
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">Escrow review</p>
            <p className="font-display text-lg leading-tight text-foreground">{order.shortRef}</p>
          </div>
        </div>
      }
    >
      <div className="space-y-4 px-5 py-5">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card to-gold/10">
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-gold/40 bg-gold/10 text-gold">
                <Lock className="mr-1 h-3 w-3" /> Held in escrow
              </Badge>
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Amount to release</p>
              <p className="mt-1 font-display text-3xl text-foreground">{formatNaira(order.price)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Recipient: {order.senderName} (seller)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-2 p-4 text-sm">
            <Row label="Order" value={order.shortRef} />
            <Row label="Item" value={order.itemSummary} />
            <Row label="Pickup" value={order.originLandmark} />
            <Row label="Verification" value={released ? "Released" : "Pending confirmation"} />
          </CardContent>
        </Card>

        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-start gap-3 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-destructive" />
            <p className="text-xs text-foreground">
              Only release when you've physically returned the parcel and the seller has confirmed receipt. This action cannot be undone.
            </p>
          </CardContent>
        </Card>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="h-12 w-full rounded-xl text-base" disabled={released}>
              <Wallet className="mr-2 h-4 w-4" /> Release payment
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Release payment to seller?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to release {formatNaira(order.price)} to {order.senderName}? The funds will leave escrow immediately and this action cannot be reversed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, cancel</AlertDialogCancel>
              <AlertDialogAction onClick={release} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Yes, release payment
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </RiderShell>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-3 py-1">
    <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
    <span className="text-right text-sm font-medium text-foreground">{value}</span>
  </div>
);

export default RiderReleasePayment;