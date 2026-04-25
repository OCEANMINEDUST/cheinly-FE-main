import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { RiderShell } from "@/components/rider/RiderShell";
import { Button } from "@/components/ui/button";
import { formatNaira, getOrderById } from "@/lib/riderMock";

const RiderDeliveryComplete = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = useMemo(() => getOrderById(orderId ?? null), [orderId]);

  return (
    <RiderShell>
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}>
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-12 w-12" />
          </div>
        </motion.div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-success">Delivered</p>
          <h1 className="mt-2 font-display text-3xl text-foreground">Trip completed</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Funds released from escrow and added to your Cheinly wallet.
          </p>
        </div>
        {order ? (
          <div className="w-full rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-gold/10 p-5 text-left">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Payout</p>
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-1 font-display text-3xl text-foreground">{formatNaira(order.price)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{order.shortRef} • {order.destinationLandmark}</p>
          </div>
        ) : null}
        <div className="flex w-full gap-3">
          <Button variant="outline" className="h-12 flex-1 rounded-xl" onClick={() => navigate("/rider/history")}>View history</Button>
          <Button className="h-12 flex-1 rounded-xl" onClick={() => navigate("/rider/dashboard")}>Find next order</Button>
        </div>
      </div>
    </RiderShell>
  );
};

export default RiderDeliveryComplete;