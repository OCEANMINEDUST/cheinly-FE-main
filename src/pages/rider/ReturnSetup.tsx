import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, MessageCircle, Package, Phone, ShieldAlert, Undo2 } from "lucide-react";
import { RiderShell } from "@/components/rider/RiderShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOrderById, getReturnByOrder, updateReturnStatus } from "@/lib/riderMock";
import { toast } from "sonner";

const RiderReturnSetup = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = useMemo(() => getOrderById(orderId ?? null), [orderId]);
  const ret = orderId ? getReturnByOrder(orderId) : undefined;

  if (!order) {
    return (
      <RiderShell>
        <div className="flex min-h-screen items-center justify-center">
          <Button onClick={() => navigate("/rider/dashboard")}>Back to dashboard</Button>
        </div>
      </RiderShell>
    );
  }

  const start = () => {
    updateReturnStatus(order.id, "in_return");
    toast.success("Return started — heading back to seller.");
    navigate(`/rider/order/${order.id}/return-active`);
  };

  return (
    <RiderShell
      topBar={
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.18em] text-gold">Return trip</p>
            <p className="font-display text-lg leading-tight text-foreground">{order.shortRef}</p>
          </div>
        </div>
      }
    >
      <div className="space-y-4 px-5 py-5 pb-28">
        <Card className="border-gold/30 bg-gold/5">
          <CardContent className="flex items-start gap-3 p-4">
            <ShieldAlert className="mt-0.5 h-5 w-5 text-gold" />
            <div>
              <p className="text-sm font-medium text-foreground">Escrow frozen</p>
              <p className="text-xs text-muted-foreground">Funds stay in escrow until the parcel is back with the seller.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Parcel</p>
              <Badge variant="outline" className="border-destructive/40 bg-destructive/10 text-destructive">
                {ret?.reason.replace("_", " ") ?? "Return"}
              </Badge>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Package className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{order.itemSummary}</p>
                <p className="text-xs text-muted-foreground">{order.itemWeight}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Seller return address</p>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{order.senderName}</p>
                <p className="text-xs text-muted-foreground">{order.originAddr}</p>
                <p className="text-[11px] text-muted-foreground">{order.originLandmark}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.message(`Calling ${order.senderName}…`)}>
                <Phone className="mr-2 h-4 w-4" /> Call seller
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.message("Opening chat…")}>
                <MessageCircle className="mr-2 h-4 w-4" /> Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="sticky bottom-0 border-t border-border bg-background/95 px-5 py-3 backdrop-blur">
        <Button onClick={start} className="h-12 w-full rounded-xl text-base">
          <Undo2 className="mr-2 h-4 w-4" /> Start return
        </Button>
      </div>
    </RiderShell>
  );
};

export default RiderReturnSetup;