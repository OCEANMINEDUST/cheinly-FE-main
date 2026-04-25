import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, MapPin, Navigation, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { RiderShell } from "@/components/rider/RiderShell";
import { RiderTopBar } from "@/components/rider/RiderTopBar";
import { RiderBottomNav } from "@/components/rider/RiderBottomNav";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { availableOrders, acceptedOrders, deliveredCount, formatNaira, getRider, updateRider } from "@/lib/riderMock";
import { cn } from "@/lib/utils";

const RiderDashboard = () => {
  const navigate = useNavigate();
  const [rider, setRider] = useState(getRider());
  const isOnline = rider.status === "online";

  const orders = useMemo(() => availableOrders(), []);
  const summary = useMemo(() => ({
    delivered: deliveredCount(),
    pending: acceptedOrders().filter((o) => o.status === "accepted").length,
    ongoing: acceptedOrders().filter((o) => o.status === "picked_up").length,
  }), []);

  const toggleOnline = (next: boolean) => {
    const updated = updateRider({ status: next ? "online" : "offline" });
    setRider(updated);
  };

  return (
    <RiderShell
      topBar={<RiderTopBar title={`Hey, ${rider.name.split(" ")[0]}`} subtitle={rider.currentLocation} />}
      bottomNav={<RiderBottomNav />}
    >
      {/* Online/offline hero */}
      <section className={cn("px-5 pb-5 pt-4 transition-colors", isOnline ? "bg-gradient-to-br from-primary/15 via-background to-gold/10" : "bg-muted/40")}>
        <Card className={cn("border-0 shadow-card transition-colors", isOnline ? "bg-card" : "bg-card")}>
          <CardContent className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Status</p>
              <p className="mt-1 font-display text-2xl text-foreground">{isOnline ? "You're online" : "You're offline"}</p>
              <p className="text-xs text-muted-foreground">
                {isOnline ? "Receiving new delivery requests" : "Switch on to start receiving orders"}
              </p>
            </div>
            <Switch checked={isOnline} onCheckedChange={toggleOnline} className="scale-125" />
          </CardContent>
        </Card>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <SummaryTile label="Delivered" value={summary.delivered} accent="text-success" />
          <SummaryTile label="Pending" value={summary.pending} accent="text-gold" />
          <SummaryTile label="Ongoing" value={summary.ongoing} accent="text-primary" />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <MiniStat icon={TrendingUp} label="This week" value={formatNaira(rider.earningsWeek)} />
          <MiniStat icon={Star} label="Rating" value={`${rider.rating} • ${rider.trips} trips`} />
        </div>
      </section>

      {/* Available orders */}
      <section className="px-5 py-5">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl text-foreground">Available orders</h2>
            <p className="text-xs text-muted-foreground">{isOnline ? `${orders.length} nearby` : "Go online to view requests"}</p>
          </div>
          {isOnline ? <Badge className="bg-primary/10 text-primary hover:bg-primary/15">Live</Badge> : null}
        </div>

        {!isOnline ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-center">
            <Navigation className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">You're offline</p>
            <p className="mt-1 text-xs text-muted-foreground">Toggle the switch above to start seeing nearby orders.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, index) => (
              <motion.button
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/rider/order/${order.id}`)}
                className="w-full rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/40 hover:bg-secondary/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{order.shortRef}</span>
                      <span>•</span>
                      <span>{order.distanceKm} km • {order.durationMin} min</span>
                    </div>
                    <RoutePoint label="Pickup" addr={order.originAddr} dot="bg-primary" />
                    <div className="ml-[7px] h-3 w-px bg-border" />
                    <RoutePoint label="Drop-off" addr={order.destinationAddr} dot="bg-gold" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-display text-xl text-foreground">{formatNaira(order.price)}</p>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{order.itemSummary} • {order.itemWeight}</span>
                  <span>{order.postedAt}</span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </section>
    </RiderShell>
  );
};

const SummaryTile = ({ label, value, accent }: { label: string; value: number; accent: string }) => (
  <div className="rounded-xl border border-border bg-card p-3 text-center">
    <p className={cn("font-display text-2xl", accent)}>{value}</p>
    <p className="mt-0.5 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
  </div>
);

const MiniStat = ({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) => (
  <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
      <p className="truncate text-sm font-medium text-foreground">{value}</p>
    </div>
  </div>
);

const RoutePoint = ({ label, addr, dot }: { label: string; addr: string; dot: string }) => (
  <div className="mt-2 flex items-start gap-2">
    <div className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", dot)} />
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
      <p className="truncate text-sm text-foreground">{addr}</p>
    </div>
  </div>
);

export default RiderDashboard;