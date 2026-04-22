import { Clock3, MapPin, MessageSquare, Navigation, Phone, Plus, Minus, LocateFixed, Truck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BuyerOrder } from "@/lib/orderMock";

interface LiveTrackingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: BuyerOrder | null;
  onViewDetails: () => void;
}

export const LiveTrackingDialog = ({ open, onOpenChange, order, onViewDetails }: LiveTrackingDialogProps) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl overflow-hidden border-0 p-0 shadow-card">
        <DialogHeader className="border-b border-border bg-card px-6 py-4 text-left">
          <DialogTitle className="font-display text-2xl text-foreground">Live Order Tracking</DialogTitle>
          <p className="text-xs text-muted-foreground">Order ID: {order.shortRef}</p>
        </DialogHeader>

        <div className="grid lg:grid-cols-[1fr_280px]">
          <div className="relative min-h-[420px] overflow-hidden bg-secondary/60">
            <div className="absolute inset-10 rounded-[28px] border border-dashed border-primary/40" />
            <div className="absolute left-[12%] top-[68%] flex h-8 w-8 items-center justify-center rounded-full bg-card shadow-card ring-1 ring-border">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="absolute left-[34%] top-[48%] flex h-12 w-12 items-center justify-center rounded-full bg-card shadow-card ring-1 ring-primary/30">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div className="absolute left-[58%] top-[28%] flex h-8 w-8 items-center justify-center rounded-full bg-card shadow-card ring-1 ring-border">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="absolute left-[15%] top-[71%] h-px w-[23%] origin-left -rotate-[18deg] border-t-2 border-dashed border-primary/70" />
            <div className="absolute left-[39%] top-[49%] h-px w-[24%] origin-left -rotate-[28deg] border-t-2 border-dashed border-primary/70" />
            <div className="absolute bottom-5 right-5 flex flex-col gap-2">
              {[Plus, Minus, LocateFixed].map((Icon, index) => (
                <button key={index} className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground shadow-card transition-colors hover:bg-secondary">
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-card p-5">
            <Card className="shadow-card">
              <CardContent className="space-y-4 p-4">
                <div>
                  <p className="font-semibold text-foreground">{order.courier.name}</p>
                  <p className="text-sm text-muted-foreground">⭐ {order.courier.rating} ({order.courier.reviews} reviews)</p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/50 p-3 text-sm">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Vehicle</p>
                  <p className="mt-1 font-medium text-foreground">{order.courier.vehicleType} • {order.courier.plateNumber}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <MessageSquare className="h-4 w-4" /> Message
                  </Button>
                  <Button variant="outline" className="gap-2 border-border bg-card hover:bg-secondary">
                    <Phone className="h-4 w-4" /> Call
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-border bg-secondary/50 p-3">
                <p className="flex items-center gap-2 text-muted-foreground"><Clock3 className="h-4 w-4 text-success" /> Estimated Arrival</p>
                <p className="mt-2 text-2xl font-display text-foreground">{order.estimatedArrival}</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/50 p-3">
                <p className="flex items-center gap-2 text-muted-foreground"><Navigation className="h-4 w-4 text-primary" /> Next Stop</p>
                <p className="mt-2 font-semibold text-foreground">{order.nextStop}</p>
              </div>
            </div>

            <Button variant="outline" onClick={onViewDetails} className="w-full border-border bg-card hover:bg-secondary">
              View Order Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};