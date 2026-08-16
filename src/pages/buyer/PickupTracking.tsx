import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, MessageCircle, ShieldCheck, Copy, CheckCircle2, Bike, PackageCheck, Truck, Webhook, RefreshCw } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNaira } from "@/lib/buyerMock";
import { toast } from "sonner";
import {
  PickupStage,
  confirmHandover as confirmHandoverStore,
  getPickup,
  startPickup,
  subscribePickup,
} from "@/lib/pickupTracker";
import { ProviderId, getProvider } from "@/lib/logistics/providers";
import { useLogisticsApi } from "@/hooks/useLogisticsApi";
import { Loader2, Calendar, XCircle, Activity } from "lucide-react";

const stages: { id: PickupStage; label: string; desc: string }[] = [
  { id: "assigning", label: "Finding a rider", desc: "Matching the closest verified rider to your pickup." },
  { id: "enroute-pickup", label: "Rider en route to you", desc: "The rider is heading to the pickup address." },
  { id: "at-pickup", label: "Rider arrived — share your pickup code", desc: "Give the 6-digit code to the rider to lock chain-of-custody." },
  { id: "in-transit", label: "Package in transit", desc: "The rider is on the way to the drop-off address." },
  { id: "delivered", label: "Delivered", desc: "Recipient confirmed receipt. Escrow released to the rider." },
];

export default function BuyerPickupTracking() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const fee = Number(params.get("fee") || 2800);
  const pickup = params.get("pickup") || "3 Bode Thomas, Surulere, Lagos";
  const dropoff = params.get("dropoff") || "12 Admiralty Way, Lekki Phase 1";
  const providerId = (params.get("provider") || "kwik") as ProviderId;
  const requestId = params.get("requestId") || undefined;
  const syncMode = (params.get("sync") === "polling" ? "polling" : "callback") as "polling" | "callback";

  // Bootstrap: reuse any active pickup so navigating away and back preserves progress.
HEAD
  const [state, setState] = useState(
    () =>
      getPickup() ??
      startPickup({
        fee,
        pickup,
        dropoff,
        providerId,
        providerName: getProvider(providerId).name,
        requestId,
        syncMode,
        code: params.get("code") || undefined,
      }),
  );

  const [state, setState] = useState(() => getPickup() ?? startPickup({ fee, pickup, dropoff }));
  const { cancelPickup, reschedulePickup } = useLogisticsApi();


  useEffect(() => {
    const unsub = subscribePickup((next) => {
      if (next) setState(next);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (state.stage === "delivered") {
      toast.success("Package delivered — escrow released to the rider.");
    }
  }, [state.stage]);

  const stage = state.stage;
  const eta = state.etaMinutes;
  const code = state.code;
  const orderId = state.orderId;
  const stageIdx = stages.findIndex((s) => s.id === stage);
  const current = stages[stageIdx];

  const confirmHandover = () => {
    const next = confirmHandoverStore();
    if (next) setState(next);
    toast.success("Handover confirmed. Rider is en route to drop-off.");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    toast.message(`Code ${code} copied`);
  };

  const handleCancel = () => {
    cancelPickup.mutate({ orderId });
  };

  const handleReschedule = () => {
    const newTime = prompt("Enter new pickup time window (e.g. Tomorrow 14:00 - 16:00):", "Tomorrow 14:00 - 16:00");
    if (newTime) {
      reschedulePickup.mutate({ orderId, newTime });
    }
  };

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />
      <main className="flex-1 mx-auto w-full max-w-3xl px-5 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/buyer/dashboard")}>
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Dashboard
          </Button>
          <Badge variant="secondary" className="font-mono">{orderId}</Badge>
        </div>

        <Card className="shadow-card">
          <CardContent className="flex flex-wrap items-center gap-3 p-4 text-sm">
            <Truck className="h-4 w-4 text-primary" />
            <span className="font-medium">{state.providerName ?? getProvider(providerId).name}</span>
            {state.requestId && <Badge variant="outline" className="font-mono text-xs">{state.requestId}</Badge>}
            <Badge variant="secondary" className="ml-auto flex items-center gap-1.5 text-xs">
              {(state.syncMode ?? syncMode) === "callback" ? (
                <><Webhook className="h-3 w-3" /> Live provider callbacks</>
              ) : (
                <><RefreshCw className="h-3 w-3 animate-spin" /> Polling provider every few seconds</>
              )}
            </Badge>
          </CardContent>
        </Card>

        {/* Faux map */}
        <Card className="shadow-card overflow-hidden">
          <div className="relative h-56 bg-[radial-gradient(circle_at_20%_30%,#dbeafe,transparent_45%),radial-gradient(circle_at_80%_70%,#fce7f3,transparent_50%),linear-gradient(135deg,#f1f5f9,#e2e8f0)]">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 220" preserveAspectRatio="none">
              <path d="M40,180 C120,160 160,80 220,80 S340,140 380,60" stroke="#2563eb" strokeWidth="3" fill="none" strokeDasharray="6 6" />
              <circle cx="40" cy="180" r="6" fill="#16a34a" />
              <circle cx="380" cy="60" r="6" fill="#dc2626" />
            </svg>
            <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium shadow flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" /> Pickup
            </div>
            <div className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium shadow flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-red-600" /> Drop-off
            </div>
            <div className={`absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-lg transition-all duration-[1200ms] ${
              stage === "assigning" ? "left-[20%] top-[80%]" :
              stage === "enroute-pickup" ? "left-[15%] top-[75%]" :
              stage === "at-pickup" ? "left-[12%] top-[82%]" :
              stage === "in-transit" ? "left-[55%] top-[45%]" :
              "left-[95%] top-[27%]"
            }`}>
              <Bike className="h-4 w-4" />
            </div>
          </div>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Current status</p>
                <p className="mt-0.5 text-lg font-semibold">{current.label}</p>
                <p className="text-sm text-muted-foreground">{current.desc}</p>
              </div>
              {stage === "in-transit" && (
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">ETA</p>
                  <p className="text-2xl font-bold text-primary">{eta}m</p>
                </div>
              )}
            </div>
            
            {(stage === "assigning" || stage === "enroute-pickup") && (
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleReschedule} 
                  disabled={reschedulePickup.isPending || cancelPickup.isPending}
                >
                  {reschedulePickup.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calendar className="mr-2 h-4 w-4" />}
                  Reschedule Pickup
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleCancel}
                  disabled={reschedulePickup.isPending || cancelPickup.isPending}
                >
                  {cancelPickup.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                  Cancel Request
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rider card */}
        {stage !== "assigning" && (
          <Card className="shadow-card">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 grid place-items-center text-primary font-semibold">TA</div>
              <div className="flex-1">
                <p className="font-semibold">Tunde Adebayo</p>
                <p className="text-xs text-muted-foreground">Yamaha Crux · LSR-284-KJA · ★ 4.9 (1,204 trips)</p>
              </div>
              <Button size="icon" variant="outline" onClick={() => toast.message("Calling rider…")}><Phone className="h-4 w-4" /></Button>
              <Button size="icon" variant="outline" onClick={() => toast.message("Chat opened")}><MessageCircle className="h-4 w-4" /></Button>
            </CardContent>
          </Card>
        )}

        {/* Pickup code */}
        {stage === "at-pickup" && (
          <Card className="border-primary/40 bg-primary/5 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><ShieldCheck className="h-5 w-5 text-primary" /> Share this pickup code</CardTitle>
              <CardDescription>The rider must enter this exact code to accept the package. Never share it before they arrive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-background p-4">
                <span className="font-mono text-3xl font-bold tracking-[0.5em] text-primary">{code}</span>
                <Button variant="outline" size="sm" onClick={copyCode}><Copy className="mr-1.5 h-4 w-4" /> Copy</Button>
              </div>
              <Button onClick={confirmHandover} className="w-full bg-primary hover:bg-primary/90">
                <CheckCircle2 className="mr-2 h-4 w-4" /> Rider entered the code — hand over the package
              </Button>
            </CardContent>
          </Card>
        )}

        {stage === "delivered" && (
          <Card className="border-emerald-300 bg-emerald-50/70 shadow-card">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-600 text-white grid place-items-center"><PackageCheck className="h-5 w-5" /></div>
              <div className="flex-1">
                <p className="font-semibold text-emerald-900">Package delivered</p>
                <p className="text-sm text-emerald-800/80">Recipient confirmed receipt. {formatNaira(fee)} released to the rider from escrow.</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate("/buyer/dashboard")}>Done</Button>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Delivery timeline</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {stages.map((s, i) => {
              const done = i < stageIdx;
              const active = i === stageIdx;
              return (
                <div key={s.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full ${done ? "bg-emerald-500" : active ? "bg-primary animate-pulse" : "bg-muted"}`} />
                    {i < stages.length - 1 && <div className={`w-px flex-1 ${done ? "bg-emerald-300" : "bg-border"}`} />}
                  </div>
                  <div className="pb-3">
                    <p className={`text-sm font-medium ${active ? "text-foreground" : done ? "text-emerald-700" : "text-muted-foreground"}`}>{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Detailed Audit Trail */}
        <Card className="shadow-card border-primary/20 bg-muted/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> System Audit Trail
            </CardTitle>
            <CardDescription>Detailed logistics provider interactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-[100px_1fr] gap-2 items-start border-b pb-2">
                <span className="text-muted-foreground text-[10px]">10:00:12 AM</span>
                <div>
                  <Badge variant="outline" className="mb-1 text-[10px]">QUOTE_GENERATED</Badge>
                  <p>Logistics provider returned rate ₦{formatNaira(fee)} for {pickup} to {dropoff}</p>
                </div>
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-2 items-start border-b pb-2">
                <span className="text-muted-foreground text-[10px]">10:01:45 AM</span>
                <div>
                  <Badge variant="outline" className="mb-1 text-[10px]">PICKUP_REQUEST_CREATED</Badge>
                  <p>Order {orderId} broadcasted to external logistics API (Provider: GIG Logistics)</p>
                </div>
              </div>
              {stageIdx >= 1 && (
                <div className="grid grid-cols-[100px_1fr] gap-2 items-start border-b pb-2">
                  <span className="text-muted-foreground text-[10px]">10:03:10 AM</span>
                  <div>
                    <Badge variant="outline" className="mb-1 bg-emerald-100 text-emerald-800 text-[10px]">WEBHOOK_CALLBACK</Badge>
                    <p>Received status: RIDER_ACCEPTED. Rider Tunde Adebayo assigned.</p>
                  </div>
                </div>
              )}
              {stageIdx >= 2 && (
                <div className="grid grid-cols-[100px_1fr] gap-2 items-start border-b pb-2">
                  <span className="text-muted-foreground text-[10px]">10:15:33 AM</span>
                  <div>
                    <Badge variant="outline" className="mb-1 text-[10px]">POLLING_STATUS_TRANSITION</Badge>
                    <p>Status transitioned from EN_ROUTE to ARRIVED_AT_PICKUP via polling.</p>
                  </div>
                </div>
              )}
              {stageIdx >= 3 && (
                <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                  <span className="text-muted-foreground text-[10px]">10:18:22 AM</span>
                  <div>
                    <Badge variant="outline" className="mb-1 bg-emerald-100 text-emerald-800 text-[10px]">WEBHOOK_CALLBACK</Badge>
                    <p>Received status: IN_TRANSIT. Pickup code {code} verified by rider app.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-5 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Pickup</p>
              <p className="font-medium">{pickup}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Drop-off</p>
              <p className="font-medium">{dropoff}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Escrow held</p>
              <p className="font-semibold text-gold">{formatNaira(fee)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Order</p>
              <p className="font-mono">{orderId}</p>
            </div>
          </CardContent>
        </Card>
      </main>
      <BuyerFooter variant="dashboard" />
    </div>
  );
}