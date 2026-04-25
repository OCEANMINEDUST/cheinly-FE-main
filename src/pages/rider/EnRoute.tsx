import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronsRight, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { RiderShell } from "@/components/rider/RiderShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getOrderById, updateOrder } from "@/lib/riderMock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const RiderEnRoute = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = useMemo(() => getOrderById(orderId ?? null), [orderId]);

  if (!order) {
    return (
      <RiderShell>
        <div className="flex min-h-screen items-center justify-center">
          <Button onClick={() => navigate("/rider/dashboard")}>Back to dashboard</Button>
        </div>
      </RiderShell>
    );
  }

  const handleArrived = () => {
    updateOrder(order.id, { status: "picked_up" });
    toast.success("Pickup confirmed — head to drop-off");
    navigate(`/rider/order/${order.id}/dropoff`);
  };

  const isPickup = order.status === "accepted";
  const target = isPickup ? order : { ...order };
  const stopLabel = isPickup ? "Pickup" : "Drop-off";
  const stopAddr = isPickup ? order.originAddr : order.destinationAddr;
  const stopLandmark = isPickup ? order.originLandmark : order.destinationLandmark;
  const stopContact = isPickup ? { name: order.senderName, phone: order.senderPhone } : { name: order.recipientName, phone: order.recipientPhone };

  return (
    <RiderShell
      topBar={
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.18em] text-primary">En route</p>
            <p className="font-display text-lg leading-tight text-foreground">{stopLabel} • {target.shortRef}</p>
          </div>
        </div>
      }
    >
      <div className="space-y-4 px-5 py-5">
        {/* Map placeholder */}
        <div className="relative h-64 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/15 via-secondary to-gold/10">
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }} />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 256" preserveAspectRatio="none">
            <path d="M40 220 Q 120 180, 180 140 T 360 40" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeDasharray="6 4" />
          </svg>
          <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
            <span className="h-2 w-2 rounded-full bg-primary" /> You
          </div>
          <div className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
            <MapPin className="h-3 w-3 text-gold" /> {stopLabel}
          </div>
          <motion.div
            className="absolute"
            initial={{ left: "10%", top: "82%" }}
            animate={{ left: ["10%", "45%", "78%"], top: ["82%", "55%", "18%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
              <Navigation className="h-4 w-4" />
            </div>
          </motion.div>
        </div>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{stopLabel} address</p>
            <p className="mt-1 text-sm font-medium text-foreground">{stopAddr}</p>
            <p className="text-xs text-muted-foreground">{stopLandmark}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{isPickup ? "Sender" : "Recipient"}</p>
              <p className="truncate text-sm font-medium text-foreground">{stopContact.name}</p>
              <p className="truncate text-xs text-muted-foreground">{stopContact.phone}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={() => toast.message(`Calling ${stopContact.name}…`)}>
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={() => toast.message("Opening chat…")}>
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {isPickup ? (
          <SlideToConfirm label="Slide to arrive at pickup" onConfirm={handleArrived} />
        ) : (
          <Button onClick={() => navigate(`/rider/order/${order.id}/dropoff`)} className="h-12 w-full rounded-xl text-base">
            Continue to drop-off
          </Button>
        )}
      </div>
    </RiderShell>
  );
};

const SlideToConfirm = ({ label, onConfirm }: { label: string; onConfirm: () => void }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [confirmed, setConfirmed] = useState(false);
  const [maxX, setMaxX] = useState(280);
  const opacity = useTransform(x, [0, maxX * 0.6], [1, 0]);

  const onLayout = (el: HTMLDivElement | null) => {
    if (el && el.offsetWidth) setMaxX(el.offsetWidth - 56);
  };

  return (
    <div
      ref={(el) => {
        trackRef.current = el;
        onLayout(el);
      }}
      className="relative h-14 w-full overflow-hidden rounded-2xl border border-primary/30 bg-primary/10"
    >
      <motion.span
        style={{ opacity }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-medium uppercase tracking-[0.2em] text-primary"
      >
        {confirmed ? "Confirmed" : label}
      </motion.span>
      <motion.div
        drag={confirmed ? false : "x"}
        dragConstraints={{ left: 0, right: maxX }}
        dragElastic={0}
        dragMomentum={false}
        style={{ x }}
        onDragEnd={() => {
          if (x.get() > maxX * 0.85) {
            animate(x, maxX, { duration: 0.2 });
            setConfirmed(true);
            setTimeout(onConfirm, 300);
          } else {
            animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
          }
        }}
        className={cn(
          "absolute left-1 top-1 flex h-12 w-12 cursor-grab items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow active:cursor-grabbing",
          confirmed && "cursor-default",
        )}
      >
        <ChevronsRight className="h-5 w-5" />
      </motion.div>
    </div>
  );
};

export default RiderEnRoute;