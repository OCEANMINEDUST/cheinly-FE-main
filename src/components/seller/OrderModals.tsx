import { useState, ReactNode } from "react";
import { Check, Phone, Star, Truck, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { naira } from "@/lib/sellerMock";

const orderItems = [
  { name: "Velvet Wrap Dress", variant: "Emerald • M", qty: 1, price: 32500 },
  { name: "Beaded Coral Necklace", variant: "One size", qty: 1, price: 8500 },
  { name: "Silk Hair Scarf", variant: "Indigo", qty: 1, price: 1500 },
];
const total = orderItems.reduce((s, i) => s + i.price * i.qty, 0);

export function ReviewAcceptDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Review & accept order</DialogTitle>
          <DialogDescription>Order ORD-3082 from Ifeoma A.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {orderItems.map((it) => (
            <div key={it.name} className="flex items-center justify-between rounded-lg border bg-secondary/40 p-3">
              <div>
                <div className="text-sm font-medium">{it.name}</div>
                <div className="text-xs text-muted-foreground">{it.variant} × {it.qty}</div>
              </div>
              <div className="text-sm font-medium">{naira(it.price)}</div>
            </div>
          ))}
        </div>
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Total Protected Amount</div>
              <div className="text-2xl font-semibold">{naira(total)}</div>
            </div>
            <div className="rounded-md bg-primary/15 px-2 py-1 text-xs font-medium text-primary">In escrow</div>
          </CardContent>
        </Card>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
            <X className="mr-1 h-4 w-4" /> Decline order
          </Button>
          <Button className="flex-1" onClick={() => setOpen(false)}>
            <Check className="mr-1 h-4 w-4" /> Accept order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const code = "584271";

function CodeBoxes({ value }: { value: string }) {
  return (
    <div className="flex justify-center gap-2">
      {value.split("").map((d, i) => (
        <div
          key={i}
          className="grid h-14 w-12 place-items-center rounded-lg border-2 border-primary/30 bg-primary/5 text-2xl font-semibold text-primary"
        >
          {d}
        </div>
      ))}
    </div>
  );
}

export function DispatchScheduledDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Dispatch scheduled</DialogTitle>
          <DialogDescription>Share this handover code only with the assigned rider.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-center text-xs uppercase tracking-wider text-muted-foreground">Handover Code</p>
          <CodeBoxes value={code} />
        </div>
        <Separator />
        <div className="space-y-2">
          <Button className="w-full"><Truck className="mr-2 h-4 w-4" /> Request Cheinly Rider</Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline">DHL</Button>
            <Button variant="outline">GIG Logistics</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function RiderArrivedDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rider has arrived</DialogTitle>
          <DialogDescription>Verify identity before handing over the package.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 rounded-lg border bg-secondary/40 p-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-gold-gradient text-gold-foreground">TB</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium">Tunde Balogun</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-gold text-gold" /> 4.9 • 312 deliveries
            </div>
          </div>
          <Button variant="outline" size="icon"><Phone className="h-4 w-4" /></Button>
        </div>
        <div className="space-y-2">
          <p className="text-center text-xs uppercase tracking-wider text-muted-foreground">Handover Code</p>
          <CodeBoxes value={code} />
        </div>
        <DialogFooter>
          <Button className="w-full"><Check className="mr-2 h-4 w-4" /> Confirm handover</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}