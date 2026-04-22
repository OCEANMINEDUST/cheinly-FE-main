import { CheckCircle2, Circle, Dot, PackageCheck, Truck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BuyerOrder } from "@/lib/orderMock";

interface OrderProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: BuyerOrder | null;
  onTrack: () => void;
  onViewDetails: () => void;
}

export const OrderProgressDialog = ({ open, onOpenChange, order, onTrack, onViewDetails }: OrderProgressDialogProps) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-0 bg-card p-0 shadow-card">
        <DialogHeader className="border-b border-border px-6 py-5 text-left">
          <DialogTitle className="flex items-center gap-2 font-display text-2xl text-foreground">
            <PackageCheck className="h-5 w-5 text-primary" /> Order Progress Log
          </DialogTitle>
          <DialogDescription className="flex items-center justify-between pt-3 text-xs">
            <span className="font-mono text-gold">{order.shortRef}</span>
            <span className="text-muted-foreground">Estimated delivery {order.estimatedDelivery}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          {order.timeline.map((step, index) => {
            const isDone = step.state === "complete";
            const isCurrent = step.state === "current";

            return (
              <div key={step.label} className="relative flex gap-3 pl-1">
                {index < order.timeline.length - 1 && (
                  <span className="absolute left-[10px] top-6 h-[calc(100%-6px)] w-px bg-border" aria-hidden />
                )}
                <span
                  className={cn(
                    "relative z-10 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border bg-card",
                    isDone && "border-success bg-success text-success-foreground",
                    isCurrent && "border-primary bg-primary text-primary-foreground",
                    !isDone && !isCurrent && "border-border text-muted-foreground",
                  )}
                >
                  {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : isCurrent ? <Dot className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
                </span>
                <div className="min-w-0 flex-1 pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{step.label}</p>
                      <p className="mt-1 text-sm leading-snug text-muted-foreground">{step.description}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{step.time}</span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex gap-3 pt-2">
            <Button onClick={onTrack} className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Truck className="h-4 w-4" /> View Live Tracking Map
            </Button>
            <Button variant="outline" onClick={onViewDetails} className="border-border bg-card hover:bg-secondary">
              Order Details
            </Button>
          </div>
          <p className="text-center text-[11px] text-muted-foreground">Updates may take up to 30 mins to reflect.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};