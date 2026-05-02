import { ChangeEvent, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Camera, ChevronRight, PackageX, Truck, UserX, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { RiderShell } from "@/components/rider/RiderShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getOrderById, saveReturnRequest, type ReturnReason } from "@/lib/riderMock";
import { toast } from "sonner";

const ISSUES: { value: ReturnReason; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "wrong_item", label: "Wrong item delivered", description: "Parcel doesn't match the order", icon: PackageX },
  { value: "damaged_item", label: "Damaged item", description: "Item arrived broken or tampered", icon: AlertTriangle },
  { value: "missing_items", label: "Missing items", description: "Some items are not in the parcel", icon: PackageX },
  { value: "recipient_unavailable", label: "Recipient unavailable", description: "No one to receive the package", icon: UserX },
  { value: "address_issue", label: "Wrong / unreachable address", description: "Cannot locate the destination", icon: Truck },
];

const schema = z.object({
  reason: z.enum(["wrong_item", "damaged_item", "missing_items", "recipient_unavailable", "address_issue"]),
  notes: z.string().trim().min(10, "Add at least 10 characters of context").max(500, "Keep notes under 500 characters"),
  imageUrl: z.string().min(1, "Attach a photo of the issue"),
});

const RiderReportIssue = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = useMemo(() => getOrderById(orderId ?? null), [orderId]);
  const [open, setOpen] = useState(true);
  const [reason, setReason] = useState<ReturnReason | "">("");
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  if (!order) {
    return (
      <RiderShell>
        <div className="flex min-h-screen items-center justify-center">
          <Button onClick={() => navigate("/rider/dashboard")}>Back to dashboard</Button>
        </div>
      </RiderShell>
    );
  }

  const pick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const submit = () => {
    const r = schema.safeParse({ reason, notes, imageUrl });
    if (!r.success) return toast.error(r.error.errors[0].message);
    saveReturnRequest({
      id: `RET-${Date.now()}`,
      orderId: order.id,
      reason: r.data.reason,
      notes: r.data.notes,
      imageUrl: r.data.imageUrl,
      status: "submitted",
      createdAt: new Date().toISOString(),
    });
    navigate(`/rider/order/${order.id}/return-success`, { replace: true });
  };

  const selected = ISSUES.find((i) => i.value === reason);

  return (
    <RiderShell
      topBar={
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.18em] text-destructive">Report issue</p>
            <p className="font-display text-lg leading-tight text-foreground">{order.shortRef}</p>
          </div>
        </div>
      }
    >
      <div className="space-y-4 px-5 py-5">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Order</p>
            <p className="mt-1 text-sm font-medium text-foreground">{order.itemSummary}</p>
            <p className="text-xs text-muted-foreground">To {order.recipientName} • {order.destinationAddr}</p>
          </CardContent>
        </Card>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="w-full rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-destructive/40">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Issue type</p>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  {selected ? selected.label : "Tap to select an issue"}
                </p>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl p-0">
            <SheetHeader className="px-5 pt-5">
              <SheetTitle className="font-display text-xl">What went wrong?</SheetTitle>
            </SheetHeader>
            <div className="space-y-1 px-3 py-3">
              {ISSUES.map((issue) => (
                <button
                  key={issue.value}
                  onClick={() => { setReason(issue.value); setOpen(false); }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted",
                    reason === issue.value && "bg-destructive/5",
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    reason === issue.value ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground",
                  )}>
                    <issue.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{issue.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{issue.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <AnimatePresence>
          {reason ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Reason for return</Label>
                <Select value={reason} onValueChange={(v) => setReason(v as ReturnReason)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ISSUES.map((i) => (
                      <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Additional notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value.slice(0, 500))}
                  placeholder="Describe what you observed at drop-off…"
                  rows={4}
                />
                <p className="text-right text-[10px] text-muted-foreground">{notes.length}/500</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Photo proof</Label>
                <input ref={fileRef} type="file" accept="image/*" capture="environment" className="sr-only" onChange={pick} />
                {imageUrl ? (
                  <div className="relative overflow-hidden rounded-xl border border-border">
                    <img src={imageUrl} alt="Issue proof" className="aspect-[16/10] w-full object-cover" />
                    <button onClick={() => setImageUrl(undefined)} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 shadow">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-secondary/40"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                      <Camera className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-foreground">Tap to upload photo</p>
                    <p className="text-xs">Photo of the issue (max 10 MB)</p>
                  </button>
                )}
              </div>

              <Button onClick={submit} variant="destructive" className="h-12 w-full rounded-xl text-base">
                Submit issue report
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </RiderShell>
  );
};

export default RiderReportIssue;