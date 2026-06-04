import { useMemo, useState } from "react";
import { CheckCircle2, Circle, Clock3, RotateCcw, ShieldAlert, XCircle } from "lucide-react";
import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import sneaker from "@/assets/sneaker.jpg";
import { FlowStructurePanel } from "@/components/marketplace/FlowStructurePanel";
import { cn } from "@/lib/utils";

type ReviewDecision = "review" | "return-accepted" | "claim-disputed";
type IndicatorState = "done" | "active" | "todo";

type DisputeCase = {
  id: string;
  order: string;
  buyer: string;
  item: string;
  priority: "High" | "Medium";
  reason: string;
  requestedAction: string;
  status: "Supplier review pending" | "Evidence uploaded" | "Return dispatch";
};

const disputeCases: DisputeCase[] = [
  {
    id: "DSP-SUP-1001",
    order: "ORD-SUP-1001",
    buyer: "Goodness",
    item: "Imported Sneakers x500",
    priority: "High",
    reason: "Buyer claims color and sole pattern mismatch from pre-packaging proof.",
    requestedAction: "Return authorization requested",
    status: "Supplier review pending",
  },
  {
    id: "DSP-SUP-1002",
    order: "ORD-SUP-1002",
    buyer: "Kemi Stores",
    item: "Leather Slides x240",
    priority: "Medium",
    reason: "Buyer uploaded evidence of damaged cartons and missing size labels.",
    requestedAction: "Replacement or partial refund requested",
    status: "Evidence uploaded",
  },
  {
    id: "DSP-SUP-1003",
    order: "ORD-SUP-1003",
    buyer: "Ade Wholesale",
    item: "Sports Jerseys x900",
    priority: "High",
    reason: "Buyer accepted return dispatch and needs supplier confirmation.",
    requestedAction: "Return pickup confirmation requested",
    status: "Return dispatch",
  },
];

const disputeTimeline = ["Buyer opened claim", "Evidence uploaded", "Supplier review pending", "Return dispatch", "Refund completed"];

const decisionCopy: Record<ReviewDecision, { label: string; badge: string; summary: string }> = {
  review: {
    label: "Review pending",
    badge: "Action Required",
    summary: "Review buyer evidence, compare it with supplier proof, then accept the return or dispute the claim.",
  },
  "return-accepted": {
    label: "Return accepted",
    badge: "Return Flow Started",
    summary: "The buyer will receive return instructions while escrow stays locked until inspection is complete.",
  },
  "claim-disputed": {
    label: "Claim disputed",
    badge: "Moderator Review",
    summary: "Your counter-evidence is queued for marketplace review before refund or release decisions are made.",
  },
};

const flowSteps: Record<Exclude<ReviewDecision, "review">, Array<{ title: string; detail: string; state: IndicatorState }>> = {
  "return-accepted": [
    { title: "Return accepted", detail: "Buyer receives return authorization and packaging instructions.", state: "done" },
    { title: "Return dispatch", detail: "Rider pickup is scheduled and tracked against the dispute order.", state: "active" },
    { title: "Supplier inspection", detail: "Inspect returned items and upload acceptance evidence.", state: "todo" },
    { title: "Refund completed", detail: "Escrow refund is released after inspection approval.", state: "todo" },
  ],
  "claim-disputed": [
    { title: "Counter evidence submitted", detail: "Supplier evidence and comments are attached to the claim.", state: "done" },
    { title: "Moderator review", detail: "Cheinly reviews both buyer and supplier evidence.", state: "active" },
    { title: "Decision issued", detail: "Funds are refunded, released, or split based on the final ruling.", state: "todo" },
  ],
};

const indicatorIcon = (state: IndicatorState) => {
  if (state === "done") return "🟢";
  if (state === "active") return "🟡";
  return "⚪";
};

const timelineFor = (decision: ReviewDecision): IndicatorState[] => {
  if (decision === "return-accepted") return ["done", "done", "done", "active", "todo"];
  if (decision === "claim-disputed") return ["done", "done", "active", "todo", "todo"];
  return ["done", "done", "active", "todo", "todo"];
};

export default function SupplierDisputeReview() {
  const [selectedId, setSelectedId] = useState(disputeCases[0].id);
  const [decision, setDecision] = useState<ReviewDecision>("review");
  const selectedDispute = useMemo(() => disputeCases.find((item) => item.id === selectedId) ?? disputeCases[0], [selectedId]);
  const timeline = timelineFor(decision);
  const currentDecision = decisionCopy[decision];

  const chooseDispute = (id: string) => {
    setSelectedId(id);
    setDecision("review");
  };

  return (
    <SupplierShell>
      <FlowStructurePanel role="supplier" active="disputes" compact />

      <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Mismatch Alert</p>
            <p className="text-sm text-destructive/80">{selectedDispute.id} requires supplier action.</p>
          </div>
          <Badge variant="outline" className="w-fit border-destructive text-destructive">{currentDecision.badge}</Badge>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[320px_1fr_340px]">
        <aside className="space-y-3">
          <div>
            <h1 className="font-display text-3xl">Dispute Review</h1>
            <p className="mt-1 text-sm text-muted-foreground">Select a dispute claim to review.</p>
          </div>
          {disputeCases.map((item) => (
            <button
              key={item.id}
              onClick={() => chooseDispute(item.id)}
              className={cn(
                "w-full rounded-xl border bg-card p-4 text-left transition-colors hover:bg-secondary/60",
                selectedId === item.id && "border-primary bg-primary/5",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{item.id}</p>
                <Badge variant={item.priority === "High" ? "destructive" : "outline"}>{item.priority}</Badge>
              </div>
              <p className="mt-2 text-sm">{item.item}</p>
              <p className="text-xs text-muted-foreground">{item.buyer} • {item.order}</p>
              <p className="mt-3 text-xs text-muted-foreground">{item.status}</p>
            </button>
          ))}
        </aside>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">Visual Evidence Comparison</h2>
                <p className="text-sm text-muted-foreground">Current status: <span className="font-semibold capitalize text-foreground">{currentDecision.label}</span></p>
              </div>
              <Badge variant="secondary">{selectedDispute.requestedAction}</Badge>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border p-3"><p className="text-sm font-medium">Supplier's Evidence</p><img src={sneaker} alt="Supplier evidence" className="mt-2 h-48 w-full rounded object-cover" /></div>
              <div className="rounded-lg border-2 border-destructive bg-slate-900 p-3 text-white"><p className="text-sm font-medium">Buyer's Evidence</p><img src={sneaker} alt="Buyer evidence" className="mt-2 h-48 w-full rounded object-cover opacity-80" /></div>
            </div>
            <div className="mt-4 rounded-lg border bg-secondary/30 p-3 text-sm">
              <p className="font-medium">Discrepancy Reported</p>
              <p className="mt-1 text-muted-foreground">{selectedDispute.reason}</p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button onClick={() => setDecision("return-accepted")} className="gap-2"><RotateCcw className="h-4 w-4" />Accept Return</Button>
              <Button variant="outline" className="gap-2 border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setDecision("claim-disputed")}><ShieldAlert className="h-4 w-4" />Dispute Claim</Button>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="font-semibold">Decision Flow</h2>
            <p className="mt-1 text-sm text-muted-foreground">{currentDecision.summary}</p>
            {decision === "review" ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4"><CheckCircle2 className="mb-2 h-5 w-5 text-emerald-600" /><p className="font-medium">Accept return</p><p className="mt-1 text-sm text-muted-foreground">Authorize return dispatch and keep escrow locked for inspection.</p></div>
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4"><XCircle className="mb-2 h-5 w-5 text-destructive" /><p className="font-medium">Dispute claim</p><p className="mt-1 text-sm text-muted-foreground">Submit counter-evidence for moderator review.</p></div>
              </div>
            ) : (
              <ol className="mt-4 space-y-3">
                {flowSteps[decision].map((step) => (
                  <li key={step.title} className="flex gap-3 rounded-xl border p-3">
                    <div className={cn("mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full", step.state === "done" && "bg-success/15 text-success", step.state === "active" && "bg-gold/20 text-gold", step.state === "todo" && "bg-muted text-muted-foreground")}>
                      {step.state === "done" ? <CheckCircle2 className="h-4 w-4" /> : step.state === "active" ? <Clock3 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    </div>
                    <div><p className="text-sm font-medium">{step.title}</p><p className="text-xs text-muted-foreground">{step.detail}</p></div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="p-4"><p className="font-semibold">Order Summary</p><p className="mt-2 text-sm">{selectedDispute.item}</p><p className="text-sm text-muted-foreground">Buyer: {selectedDispute.buyer} • {selectedDispute.order}</p></Card>
          <Card className="p-4">
            <p className="font-semibold">Dispute Timeline</p>
            <ol className="mt-3 space-y-3 text-sm">
              {disputeTimeline.map((step, index) => <li key={step} className="flex items-center gap-2"><span aria-hidden>{indicatorIcon(timeline[index])}</span><span>{step}</span></li>)}
            </ol>
          </Card>
        </aside>
      </div>
    </SupplierShell>
  );
}
