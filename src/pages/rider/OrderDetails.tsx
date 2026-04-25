import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, Navigation, Package, Phone } from "lucide-react";
import { RiderShell } from "@/components/rider/RiderShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { formatNaira, getOrderById, updateOrder } from "@/lib/riderMock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const RiderOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = useMemo(() => getOrderById(orderId ?? null), [orderId]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!order) {
    return (
      <RiderShell>
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="text-sm text-muted-foreground">Order not found.</p>
          <Button onClick={() => navigate("/rider/dashboard")}>Back to dashboard</Button>
        </div>
      </RiderShell>
    );
  }

  const isAvailable = order.status === "available";

  const accept = () => {
    updateOrder(order.id, { status: "accepted" });
    setConfirmOpen(false);
    toast.success(`Accepted ${order.shortRef} — head to pickup`);
    navigate(`/rider/order/${order.id}/enroute`);
  };

  const continueWorkflow = () => {
    if (order.status === "accepted") navigate(`/rider/order/${order.id}/enroute`);
    else if (order.status === "picked_up") navigate(`/rider/order/${order.id}/dropoff`);
    else navigate("/rider/dashboard");
  };

  return (
    <RiderShell
      topBar={
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Delivery {order.shortRef}</p>
            <p className="font-display text-lg leading-tight text-foreground">Order details</p>
          </div>
          <Badge className={cn(
            "capitalize",
            order.status === "available" && "bg-primary/10 text-primary hover:bg-primary/15",
            order.status === "accepted" && "bg-gold/10 text-gold hover:bg-gold/15",
            order.status === "picked_up" && "bg-success/15 text-success hover:bg-success/20",
          )}>
            {order.status.replace("_", " ")}
          </Badge>
        </div>
      }
    >
      <div className="space-y-4 px-5 py-5 pb-32">
        {/* Earnings header */}
        <Card className="border-0 bg-gradient-to-br from-primary/15 via-card to-gold/10 shadow-card">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">You earn</p>
              <p className="mt-1 font-display text-3xl text-foreground">{formatNaira(order.price)}</p>
              <p className="text-xs text-muted-foreground">{order.distanceKm} km • ~{order.durationMin} min</p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>Paid via</p>
              <p className="font-medium text-foreground">{order.payoutMethod}</p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardContent className="space-y-1 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Route</p>
            <Stop dot="bg-primary" badge="Pickup" addr={order.originAddr} subtitle={order.originLandmark} />
            <div className="ml-[7px] my-1 h-8 w-px border-l-2 border-dashed border-border" />
            <Stop dot="bg-gold" badge="Drop-off" addr={order.destinationAddr} subtitle={order.destinationLandmark} />
          </CardContent>
        </Card>

        {/* Item */}
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-foreground">
              <Package className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{order.itemSummary}</p>
              <p className="text-xs text-muted-foreground">{order.itemWeight} • {order.notes}</p>
            </div>
          </CardContent>
        </Card>

        {/* Sender */}
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Sender</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{order.senderName}</p>
                <p className="truncate text-xs text-muted-foreground">{order.senderPhone}</p>
              </div>
              <div className="flex gap-2">
                <ContactButton icon={Phone} label="Call" onClick={() => toast.message(`Calling ${order.senderName}…`)} />
                <ContactButton icon={MessageCircle} label="Chat" onClick={() => toast.message("Opening chat…")} />
              </div>
            </div>
            <Separator className="my-3" />
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Recipient</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{order.recipientName}</p>
                <p className="truncate text-xs text-muted-foreground">{order.recipientPhone}</p>
              </div>
              <div className="flex gap-2">
                <ContactButton icon={Phone} label="Call" onClick={() => toast.message(`Calling ${order.recipientName}…`)} />
                <ContactButton icon={MessageCircle} label="Chat" onClick={() => toast.message("Opening chat…")} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[480px] border-t border-border bg-background/95 p-4 backdrop-blur">
        {isAvailable ? (
          <Button onClick={() => setConfirmOpen(true)} className="h-12 w-full rounded-xl text-base">
            <Navigation className="mr-2 h-4 w-4" /> Accept delivery
          </Button>
        ) : (
          <Button onClick={continueWorkflow} className="h-12 w-full rounded-xl text-base">
            Continue delivery
          </Button>
        )}
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept this delivery?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll be navigated to the pickup at <span className="font-medium text-foreground">{order.originLandmark}</span>. Make sure you can complete this trip now.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Not now</AlertDialogCancel>
            <AlertDialogAction onClick={accept}>Yes, accept</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RiderShell>
  );
};

const Stop = ({ dot, badge, addr, subtitle }: { dot: string; badge: string; addr: string; subtitle: string }) => (
  <div className="flex items-start gap-3 py-1">
    <div className={cn("mt-1.5 h-3 w-3 shrink-0 rounded-full ring-4 ring-background", dot)} />
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{badge}</p>
      <p className="text-sm font-medium text-foreground">{addr}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  </div>
);

const ContactButton = ({ icon: Icon, label, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void }) => (
  <button onClick={onClick} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20" aria-label={label}>
    <Icon className="h-4 w-4" />
  </button>
);

export default RiderOrderDetails;