import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Home, Undo2 } from "lucide-react";
import { motion } from "framer-motion";
import { RiderShell } from "@/components/rider/RiderShell";
import { Button } from "@/components/ui/button";

const RiderReturnSuccess = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  return (
    <RiderShell>
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}>
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-12 w-12" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="text-xs uppercase tracking-[0.25em] text-success">Submitted</p>
          <h1 className="mt-2 font-display text-3xl text-foreground">Partial refund submitted</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Cheinly Support has been notified. You can now return the parcel to the seller.
          </p>
        </motion.div>
        <div className="flex w-full flex-col gap-3">
          {orderId ? (
            <Button className="h-12 rounded-xl" onClick={() => navigate(`/rider/order/${orderId}/return`)}>
              <Undo2 className="mr-2 h-4 w-4" /> Start return to seller
            </Button>
          ) : null}
          <Button variant="outline" className="h-12 rounded-xl" onClick={() => navigate("/rider/dashboard")}>
            <Home className="mr-2 h-4 w-4" /> Back to home
          </Button>
        </div>
      </div>
    </RiderShell>
  );
};

export default RiderReturnSuccess;