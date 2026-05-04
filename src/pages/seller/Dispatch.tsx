import { useEffect, useRef, useState } from "react";
import { AlertCircle, Camera, CheckCircle2, ImagePlus, ShieldCheck, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SellerShell } from "@/components/seller/SellerShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ReviewAcceptDialog, DispatchScheduledDialog, RiderArrivedDialog } from "@/components/seller/OrderModals";
import { toast } from "sonner";
import { getDispatchPhotos, saveDispatchPhotos } from "@/lib/sellerMock";

const ACTIVE_ORDER_ID = "ORD-3082";

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
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
            >
              <Trash2 className="mr-1 h-3 w-3" /> Replace
            </Button>
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
  );
}

export default function SellerDispatch() {
  const [before, setBefore] = useState<string | null>(null);
  const [after, setAfter] = useState<string | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    const p = getDispatchPhotos(ACTIVE_ORDER_ID);
    setBefore(p.before);
    setAfter(p.after);
  }, []);

  useEffect(() => {
    saveDispatchPhotos(ACTIVE_ORDER_ID, { before, after });
  }, [before, after]);

  const ready = before && after;

  return (
    <SellerShell>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Prepare for dispatch</h1>
        <p className="text-sm text-muted-foreground">Order ORD-3082 • Ifeoma A.</p>
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
          disabled={!ready}
          onClick={() => {
            toast.success("Packaging confirmed — escrow protection active");
            nav("/seller/tracking");
          }}
        >
          Confirm packaging
        </Button>
      </div>
    </SellerShell>
  );
}