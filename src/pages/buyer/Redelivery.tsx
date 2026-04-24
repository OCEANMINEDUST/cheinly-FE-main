import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock, Lock, MapPin, MessageSquareMore, Navigation, PhoneCall, ShieldAlert } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { redeliveryCase } from "@/lib/orderMock";
import { cn } from "@/lib/utils";

const BuyerRedelivery = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const baseQuery = useMemo(() => new URLSearchParams({ productId: params.get("productId") ?? "MD-9521X", orderId: params.get("orderId") ?? "ORD-521-450", entry: "secure-checkout", mode: params.get("mode") ?? "guest", provider: params.get("provider") ?? "cheinly" }).toString(), [params]);

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />

      <main className="mx-auto flex-1 w-full max-w-7xl px-5 py-8 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-4xl text-foreground">Redelivery Tracking</h1>
              <Badge className="border border-gold/30 bg-gold/10 text-gold">{redeliveryCase.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Case {redeliveryCase.caseId} • Live updates from your courier as the correct parcel is en route.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="overflow-hidden shadow-card">
            <div className="relative aspect-[16/9] w-full">
              {/* Stylized map */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 25% 20%, hsl(var(--primary) / 0.18), transparent 55%), radial-gradient(circle at 75% 75%, hsl(var(--gold) / 0.18), transparent 55%), linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--muted)) 100%)",
                }}
                aria-hidden
              />
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 320" preserveAspectRatio="none" aria-hidden>
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.6" />
                  </pattern>
                </defs>
                <rect width="600" height="320" fill="url(#grid)" />
                <path d="M70 250 C 180 220, 240 180, 320 160 S 470 90, 540 70" stroke="hsl(var(--primary))" strokeWidth="4" strokeDasharray="8 6" fill="none" />
                <circle cx="70" cy="250" r="8" fill="hsl(var(--gold))" />
                <circle cx="540" cy="70" r="10" fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth="3" />
              </svg>
              <div className="absolute left-5 top-5 rounded-lg border border-border bg-card/90 px-3 py-2 text-xs shadow-card backdrop-blur">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Rider</p>
                <p className="font-semibold text-foreground">{redeliveryCase.riderName}</p>
              </div>
              <div className="absolute right-5 top-5 rounded-lg border border-border bg-card/90 px-3 py-2 text-xs shadow-card backdrop-blur">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">ETA</p>
                <p className="font-semibold text-foreground">{redeliveryCase.etaMinutes[0]} – {redeliveryCase.etaMinutes[1]} mins</p>
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card/90 px-4 py-3 text-sm shadow-card backdrop-blur">
                <div className="flex items-center gap-2 text-foreground">
                  <Navigation className="h-4 w-4 text-primary" /> {redeliveryCase.distanceMiles} miles to <span className="font-semibold">{redeliveryCase.nextStop}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" /> Live updating
                </div>
              </div>
            </div>

            <CardContent className="space-y-4 p-5">
              <div className="flex flex-wrap items-center gap-3">
                <Avatar className="h-12 w-12 bg-primary/10 text-primary"><AvatarFallback>{redeliveryCase.riderInitials}</AvatarFallback></Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{redeliveryCase.riderName}</p>
                  <p className="text-xs text-muted-foreground">Heading to {redeliveryCase.nextStop} • {redeliveryCase.distanceMiles} miles away</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2 border-border bg-card hover:bg-secondary"><PhoneCall className="h-4 w-4" /> Call</Button>
                <Button variant="outline" size="sm" className="gap-2 border-border bg-card hover:bg-secondary"><MessageSquareMore className="h-4 w-4" /> Chat</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Alert className="border-gold/30 bg-gold/10 text-foreground [&>svg]:text-gold">
              <Lock className="h-4 w-4" />
              <AlertTitle>Escrow security: Frozen</AlertTitle>
              <AlertDescription>{redeliveryCase.escrowState}</AlertDescription>
            </Alert>

            <Card className="shadow-card">
              <CardContent className="space-y-5 p-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Route progress</p>
                  <h2 className="mt-2 font-display text-2xl text-foreground">Where things stand</h2>
                </div>
                <ol className="space-y-4">
                  {redeliveryCase.routeWaypoints.map((point, index) => (
                    <li key={point.label} className="flex gap-3">
                      <div className={cn("relative mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border", point.state === "complete" ? "border-success bg-success/15 text-success" : point.state === "current" ? "border-primary bg-primary/15 text-primary" : "border-border bg-secondary text-muted-foreground")}>
                        {point.state === "complete" ? <CheckCircle2 className="h-4 w-4" /> : <MapPin className="h-3.5 w-3.5" />}
                        {index < redeliveryCase.routeWaypoints.length - 1 ? <span className="absolute left-1/2 top-full h-5 w-px -translate-x-1/2 bg-border" aria-hidden /> : null}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{point.label}</p>
                        <p className="text-xs text-muted-foreground">{point.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><ShieldAlert className="h-4 w-4 text-gold" /> Need to change course?</div>
                <p className="text-xs text-muted-foreground">If circumstances change while the rider is en route, you can switch to a full refund or escalate the case to dispute review.</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => navigate(`/buyer/dispute?${baseQuery}&source=redelivery`)} className="border-border bg-card hover:bg-secondary">Escalate dispute</Button>
                  <Button onClick={() => navigate(`/buyer/confirm-delivery?${baseQuery}`)} className="bg-primary text-primary-foreground hover:bg-primary/90">I've received it</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <BuyerFooter variant="dashboard" />
    </div>
  );
};

export default BuyerRedelivery;