import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Camera, CheckCircle2, Clock, MessageSquare, Package, ShieldAlert, Timer } from "lucide-react";
import { SellerShell } from "@/components/seller/SellerShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { disputeOrder, disputeStages, naira } from "@/lib/sellerMock";
import { FlowStructurePanel } from "@/components/marketplace/FlowStructurePanel";

const timeline = [
  { icon: AlertTriangle, label: "Dispute opened", time: "Today 10:02", done: true, tone: "destructive" as const },
  { icon: Camera, label: "Evidence submitted", time: "Today 10:04", done: true, tone: "primary" as const },
  { icon: MessageSquare, label: "Awaiting your response", time: "Now", done: false, tone: "gold" as const },
  { icon: CheckCircle2, label: "Resolution", time: "Pending", done: false, tone: "muted" as const },
];

export default function SellerDispute() {
  return (
    <SellerShell>
      <FlowStructurePanel role="seller" active="disputes" compact />

      <div className="mb-4 mt-6 flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/seller/dashboard"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link>
        </Button>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Dispute Overview</h1>
        <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">
          Active
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          {/* Order details */}
          <Card>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div className="flex gap-4">
                <div className="grid h-16 w-16 place-items-center rounded-lg bg-muted">
                  <Package className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">{disputeOrder.product}</CardTitle>
                  <CardDescription>{disputeOrder.variant}</CardDescription>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Order {disputeOrder.id} • Paid {naira(disputeOrder.amount)} • Delivered {disputeOrder.paidOn}
                  </div>
                </div>
              </div>
              <Badge variant="outline">Buyer: {disputeOrder.buyer}</Badge>
            </CardHeader>
          </Card>

          {/* Issue summary */}
          <Alert className="border-destructive/30 bg-destructive/5 text-destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Issue summary</AlertTitle>
            <AlertDescription className="text-destructive/90">{disputeOrder.issue}</AlertDescription>
          </Alert>

          {/* Evidence */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">4-Stage Photo Evidence</CardTitle>
              <CardDescription>Captured automatically across the journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {disputeStages.map((s) => (
                  <div key={s.id} className="overflow-hidden rounded-xl border">
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-muted to-secondary">
                      <div className="absolute left-2 top-2">
                        <Badge variant="outline" className="bg-background/90">Stage {s.id}</Badge>
                      </div>
                      <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                        <Camera className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-medium">{s.label}</div>
                      <div className="text-xs text-muted-foreground">{s.caption}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resolution Center */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <Card className="border-gold/30">
            <CardHeader className="pb-3">
              <CardDescription>Resolution Center</CardDescription>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Timer className="h-5 w-5 text-gold" /> 47h 22m left
              </CardTitle>
              <CardDescription>Respond before the SLA expires</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/seller/negotiate"><MessageSquare className="mr-2 h-4 w-4" /> Chat with Buyer</Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive">
                <Link to="/seller/escalate"><ShieldAlert className="mr-2 h-4 w-4" /> Escalate to Admin</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Dispute timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative ml-3 space-y-4 border-l">
                {timeline.map((t) => {
                  const Icon = t.icon;
                  return (
                    <li key={t.label} className="ml-4">
                      <span className={
                        "absolute -left-[9px] grid h-4 w-4 place-items-center rounded-full " +
                        (t.done
                          ? t.tone === "destructive" ? "bg-destructive text-destructive-foreground"
                            : t.tone === "primary" ? "bg-primary text-primary-foreground"
                            : "bg-gold text-gold-foreground"
                          : "border bg-background")
                      }>
                        <Icon className="h-2.5 w-2.5" />
                      </span>
                      <div className="text-sm font-medium">{t.label}</div>
                      <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {t.time}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        </aside>
      </div>
    </SellerShell>
  );
}
