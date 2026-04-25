import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { RiderShell } from "@/components/rider/RiderShell";
import { Button } from "@/components/ui/button";
import { getRider, updateRider } from "@/lib/riderMock";
import { toast } from "sonner";

const RiderApproval = () => {
  const navigate = useNavigate();
  const rider = getRider();

  useEffect(() => {
    if (rider.status === "approved" || rider.status === "online" || rider.status === "offline") {
      navigate("/rider/dashboard", { replace: true });
    }
  }, [rider.status, navigate]);

  const simulateApprove = () => {
    updateRider({ status: "approved" });
    toast.success("You're approved — welcome aboard!");
    navigate("/rider/dashboard", { replace: true });
  };

  return (
    <RiderShell>
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/15 text-primary"
        >
          <Clock className="h-10 w-10" />
        </motion.div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Application received</p>
          <h1 className="mt-2 font-display text-3xl text-foreground">Waiting for account approval</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
            Our team is verifying your documents. You'll get a notification once your rider account is approved — usually within a few hours.
          </p>
        </div>
        <div className="grid w-full gap-3 rounded-xl border border-border bg-muted/40 p-4 text-left">
          <Row icon={ShieldCheck} label="Documents submitted" value="Awaiting review" />
          <Row icon={Sparkles} label="Rider ID" value={rider.id} />
        </div>
        <Button variant="outline" className="w-full" onClick={simulateApprove}>
          Simulate approval (demo)
        </Button>
      </div>
    </RiderShell>
  );
};

const Row = ({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-4 w-4" /> {label}
    </div>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);

export default RiderApproval;