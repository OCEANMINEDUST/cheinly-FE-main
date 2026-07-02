import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, MessageCircle, ShieldCheck, Copy, CheckCircle2, Bike, PackageCheck } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNaira } from "@/lib/buyerMock";
import { toast } from "sonner";

type Stage = "assigning" | "enroute-pickup" | "at-pickup" | "in-transit" | "delivered";

const stages: { id: Stage; label: string; desc: string }[] = [
  { id: "assigning", label: "Finding a rider", desc: "Matching the closest verified rider to your pickup." },
  { id: "enroute-pickup", label: "Rider en route to you", desc: "The rider is heading to the pickup address." },
  { id: "at-pickup", label: "Rider arrived — share your pickup code", desc: "Give the 6-digit code to the rider to lock chain-of-custody." },
  { id: "in-transit", label: "Package in transit", desc: "The rider is on the way to the drop-off address." },
  { id: "delivered", label: "Delivered", desc: "Recipient confirmed receipt. Escrow released to the rider." },
];

function genCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function BuyerPickupTracking() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const fee = Number(params.get("fee") || 2800);
  const pickup = params.get("pickup") || "3 Bode Thomas, Surulere, Lagos";
  const dropoff = params.get("dropoff") || "12 Admiralty Way, Lekki Phase 1";

  const [stage, setStage] = useState<Stage>("assigning");
  const [eta, setEta] = useState(9);
  const code = useMemo(genCode, []);
  const orderId = useMemo(() => `PKG-${Math.floor(10000 + Math.random() * 90000)}`, []);

  useEffect(() => {
    const seq: Stage[] = ["assigning", "enroute-pickup", "at-pickup"];
    const delays = [1400, 3800];
    const timers: number[] = [];
    delays.forEach((d, i) => {
      timers.push(window.setTimeout(() => setStage(seq[i + 1]), d));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (stage === "in-transit") {
      const t = window.setInterval(() => setEta((v) => (v > 1 ? v - 1 : v)), 1200);
      const done = window.setTimeout(() => setStage("delivered"), 8000);
      return () => { clearInterval(t); clearTimeout(done); };
    }
  }, [stage]);

  const stageIdx = stages.findIndex((s) => s.id === stage);
  const current = stages[stageIdx];

  const confirmHandover = () => {
    toast.success("Handover confirmed. Rider is en route to drop-off.");
    setStage("in-transit");
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    toast.message(`Code ${code} copied`);
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