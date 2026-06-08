import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Camera, CheckCircle2, ImagePlus, RefreshCcw, ShieldCheck, Trash2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SellerShell } from "@/components/seller/SellerShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ReviewAcceptDialog, DispatchScheduledDialog, RiderArrivedDialog } from "@/components/seller/OrderModals";
import { toast } from "sonner";
import { PackagingItemsList, PackagingItem, makeEmptyItem } from "@/components/shared/PackagingItemsList";
import {
  getActiveOrderId,
  getDispatchPhotos,
  getOrderById,
  saveDispatchPhotos,
  setActiveOrderId,
} from "@/lib/sellerMock";

function UploadZone({
  label,
  index,
  value,
  onChange,
}: {
  label: string;
  index: number;
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  function readFile(f: File) {
    const r = new FileReader();
    r.onload = () => onChange(r.result as string);
    r.readAsDataURL(f);
  }

  return (
    <div className="space-y-2">
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) readFile(f);
      }}
      className={
        "group relative grid min-h-[220px] cursor-pointer place-items-center rounded-xl border-2 border-dashed bg-secondary/30 p-6 text-center transition-colors " +
        (drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")
      }
      onClick={() => ref.current?.click()}
    >
      <input
        ref={ref}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) readFile(f);
          if (ref.current) ref.current.value = "";
        }}
      />
      {value ? (
        <>
          <img src={value} alt={label} className="absolute inset-0 h-full w-full rounded-xl object-cover" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="relative z-10 mt-auto flex w-full items-center justify-between text-white">
            <span className="inline-flex items-center gap-1 text-sm">
              <CheckCircle2 className="h-4 w-4 text-success" /> Uploaded
            </span>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
            {index === 1 ? <ImagePlus className="h-6 w-6" /> : <Camera className="h-6 w-6" />}
          </div>
          <div>
            <div className="text-sm font-semibold">{label}</div>
            <div className="text-xs text-muted-foreground">Drag & drop or click to upload (JPG, PNG • max 8MB)</div>
          </div>
        </div>
      )}
    </div>
      {value && (
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => ref.current?.click()}
          >
            <RefreshCcw className="mr-1.5 h-3.5 w-3.5" /> Retake
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="flex-1 text-destructive hover:text-destructive"
            onClick={() => onChange(null)}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Remove
          </Button>
        </div>
      )}
    </div>
  );
}

export default function SellerDispatch() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const orderId = useMemo(() => params.get("orderId") || getActiveOrderId(), [params]);
  const order = getOrderById(orderId);
  const [before, setBefore] = useState<string | null>(null);
  const [after, setAfter] = useState<string | null>(null);
  const [packItems, setPackItems] = useState<PackagingItem[]>([makeEmptyItem()]);

  useEffect(() => {
    setActiveOrderId(orderId);
    const p = getDispatchPhotos(orderId);
    setBefore(p.before);
    setAfter(p.after);
  }, [orderId]);

  useEffect(() => {
    saveDispatchPhotos(orderId, { before, after });
  }, [before, after, orderId]);

  const ready = before && after;
  const itemsValid =
    packItems.length > 0 &&
    packItems.every((i) => i.name.trim().length > 0 && i.photos.length > 0);
  const canConfirm = !!ready && itemsValid;

  return (
    <SellerShell>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Prepare for dispatch</h1>
        <p className="text-sm text-muted-foreground">
          Order {orderId}{order ? ` • ${order.buyer}` : ""}
        </p>
      </div>

      <Alert className="border-primary/30 bg-primary/5 text-foreground">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <AlertTitle>Protected Payment Requirement</AlertTitle>
        <AlertDescription>
          Upload clear photos of the item <strong>before</strong> and <strong>after</strong> packaging. These are
          attached to the escrow record and protect you in case of disputes. Without them, payment cannot be released.
        </AlertDescription>
      </Alert>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">1. Photo of item before packaging</CardTitle>
          </CardHeader>
          <CardContent>
            <UploadZone label="Before packaging" index={1} value={before} onChange={setBefore} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">2. Photo of item after packaging</CardTitle>
          </CardHeader>
          <CardContent>
            <UploadZone label="After packaging" index={2} value={after} onChange={setAfter} />
          </CardContent>
        </Card>
      </div>

      {!ready && (
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-4 w-4" /> Both photos are required to confirm packaging.
        </div>
      )}

      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">3. Packaging contents</CardTitle>
        </CardHeader>
        <CardContent>
          <PackagingItemsList items={packItems} onChange={setPackItems} />
          {!itemsValid && (
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-4 w-4" /> Each item needs a name and at least one photo.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <ReviewAcceptDialog>
            <Button variant="outline" size="sm">Review & accept</Button>
          </ReviewAcceptDialog>
          <DispatchScheduledDialog>
            <Button variant="outline" size="sm">Dispatch scheduled</Button>
          </DispatchScheduledDialog>
          <RiderArrivedDialog>
            <Button variant="outline" size="sm">Rider arrived</Button>
          </RiderArrivedDialog>
        </div>
        <Button
          size="lg"
          disabled={!canConfirm}
          onClick={() => {
            toast.success("Packaging confirmed — escrow protection active");
            nav(`/seller/tracking?orderId=${orderId}`);
          }}
        >
          Confirm packaging
        </Button>
      </div>
    </SellerShell>
  );
}