import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, MapPin, MessageCircle, Phone, Undo2 } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { RiderShell } from "@/components/rider/RiderShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getOrderById, updateReturnStatus } from "@/lib/riderMock";
import { toast } from "sonner";

const SLIDE_WIDTH = 320;
const KNOB = 56;

const RiderReturnActive = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = useMemo(() => getOrderById(orderId ?? null), [orderId]);
  const x = useMotionValue(0);
  const bgOpacity = useTransform(x, [0, SLIDE_WIDTH - KNOB], [0.15, 1]);
  const [arrived, setArrived] = useState(false);

  if (!order) {
    return (
      <RiderShell>
        <div className="flex min-h-screen items-center justify-center">
          <Button onClick={() => navigate("/rider/dashboard")}>Back to dashboard</Button>
        </div>
      </RiderShell>
    );
  }

  const handleEnd = () => {
    if (x.get() > SLIDE_WIDTH - KNOB - 24) {
      setArrived(true);
      updateReturnStatus(order.id, "completed");
      toast.success("Arrived at seller — return delivered.");
      setTimeout(() => navigate(`/rider/order/${order.id}/release-payment`, { replace: true }), 500);
    } else {
      x.set(0);
    }
  };

  return (
    <RiderShell
      topBar={
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.18em] text-gold">Return in progress</p>
            <p className="font-display text-lg leading-tight text-foreground">{order.shortRef}</p>
          </div>
        </div>
      }
    >
      <div className="relative h-[42vh] w-full overflow-hidden bg-muted">
        <svg viewBox="0 0 480 360" className="h-full w-full">
          <defs>
            <pattern id="r-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="480" height="360" fill="url(#r-grid)" />
          <motion.path
            d="M 60 320 Q 220 240 260 180 T 420 60"
            stroke="hsl(var(--gold))" strokeWidth="4" fill="none" strokeDasharray="8 8"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: "easeOut" }}
          />
          <circle cx="60" cy="320" r="9" fill="hsl(var(--primary))" />
          <circle cx="420" cy="60" r="9" fill="hsl(var(--gold))" />
        </svg>
        <div className="absolute inset-x-4 bottom-4 rounded-xl border border-border bg-background/95 px-3 py-2 text-xs text-muted-foreground backdrop-blur">
          Returning to <span className="text-foreground">{order.senderName}</span> • ~{order.distanceKm} km
        </div>
      </div>

      <div className="space-y-3 px-5 py-5">
        <Card>
          <CardContent className="space-y-3 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Return to sender</p>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{order.senderName}</p>
                <p className="text-xs text-muted-foreground">{order.originAddr}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.message(`Calling ${order.senderName}…`)}>
                <Phone className="mr-2 h-4 w-4" /> Call
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.message("Opening chat…")}>
                <MessageCircle className="mr-2 h-4 w-4" /> Chat
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="relative mx-auto h-14 w-full max-w-[320px] overflow-hidden rounded-full border border-border bg-card">
          <motion.div className="absolute inset-0 rounded-full bg-gold" style={{ opacity: bgOpacity }} />
          <div className="relative z-10 flex h-full items-center justify-center text-sm font-medium text-foreground">
            {arrived ? "Arrived ✓" : "Slide to mark arrived"}
          </div>
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: SLIDE_WIDTH - KNOB }}
            dragElastic={0.05}
            style={{ x }}
            onDragEnd={handleEnd}
            className="absolute left-1 top-1 z-20 flex h-12 w-12 cursor-grab items-center justify-center rounded-full bg-foreground text-background shadow-lg active:cursor-grabbing"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.div>
        </div>

        <Button variant="outline" className="h-11 w-full rounded-xl" onClick={() => navigate(`/rider/order/${order.id}/release-payment`)}>
          <Undo2 className="mr-2 h-4 w-4" /> Skip to payment release
        </Button>
      </div>
    </RiderShell>
  );
};

export default RiderReturnActive;