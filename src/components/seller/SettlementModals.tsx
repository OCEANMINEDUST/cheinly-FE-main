import { ReactNode } from "react";
import { CheckCircle2, ShieldCheck, Wallet, RotateCcw, Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { naira } from "@/lib/sellerMock";

export function OrderCompletedDialog({ children }: { children: ReactNode }) {
  const subtotal = 42500;
  const fee = Math.round(subtotal * 0.05);
  const earnings = subtotal - fee;
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <DialogTitle className="text-center">Order completed</DialogTitle>
          <DialogDescription className="text-center">
            Buyer confirmed delivery. Funds have been released from escrow.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Buyer's proof of delivery</div>
          <div className="grid h-40 w-full place-items-center rounded-lg border bg-secondary/40 text-muted-foreground">
            <div className="flex flex-col items-center gap-1 text-xs">
              <ImageIcon className="h-6 w-6" />
              Proof photo from buyer
            </div>
          </div>
        </div>
        <Alert className="border-success/30 bg-success/10">
          <ShieldCheck className="h-4 w-4 text-success" />
          <AlertTitle className="text-success">Payment Released</AlertTitle>
          <AlertDescription>Settlement moved to your True Balance.</AlertDescription>
        </Alert>
        <div className="space-y-1.5 rounded-lg border p-3 text-sm">
          <Row label="Subtotal" value={naira(subtotal)} />
          <Row label="Cheinly service fee (5%)" value={"− " + naira(fee)} muted />
          <Separator className="my-1" />
          <Row label="Total earnings" value={naira(earnings)} bold />
        </div>
        <DialogFooter>
          <Button className="w-full">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ReturnVerifiedDialog({ children }: { children: ReactNode }) {
  const returnAmount = 42500;
  const shipping = 3500;
  const refund = returnAmount - shipping;
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary">
            <RotateCcw className="h-7 w-7" />
          </div>
          <DialogTitle className="text-center">Return verified</DialogTitle>
          <DialogDescription className="text-center">
            Item passed inspection. Review the refund summary before finalizing.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5 rounded-lg border p-3 text-sm">
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Refund summary</div>
          <Row label="Return amount" value={naira(returnAmount)} />
          <Row label="Shipping fees deduction" value={"− " + naira(shipping)} destructive />
          <Separator className="my-1" />
          <Row label="Total refund to buyer" value={naira(refund)} bold />
        </div>
        <Alert className="border-primary/30 bg-primary/5">
          <Wallet className="h-4 w-4 text-primary" />
          <AlertTitle>Release to True Balance</AlertTitle>
          <AlertDescription>
            Shipping fees ({naira(shipping)}) will be credited to your True Balance once the refund is finalized.
          </AlertDescription>
        </Alert>
        <DialogFooter>
          <Button className="w-full">Finalize refund</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  value,
  bold,
  muted,
  destructive,
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
  destructive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-muted-foreground" : ""}>{label}</span>
      <span
        className={
          (bold ? "font-semibold " : "") +
          (destructive ? "text-destructive" : muted ? "text-muted-foreground" : "")
        }
      >
        {value}
      </span>
    </div>
  );
}