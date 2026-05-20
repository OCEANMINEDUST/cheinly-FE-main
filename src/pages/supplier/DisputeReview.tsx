import { useState } from "react";
import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import sneaker from "@/assets/sneaker.jpg";

const base = ["Buyer opened claim", "Evidence uploaded", "Supplier review pending", "Return dispatch", "Refund completed"];

export default function SupplierDisputeReview() {
  const [status, setStatus] = useState<"review" | "return-accepted" | "claim-disputed">("review");
  const timeline = base.map((step, i) => {
    if (status === "review") return i < 2 ? "done" : i === 2 ? "active" : "todo";
    if (status === "return-accepted") return i < 4 ? "done" : i === 4 ? "active" : "todo";
    return i < 3 ? "done" : i === 3 ? "active" : "todo";
  });

  return (
    <SupplierShell>
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
        <div className="flex items-center justify-between"><p className="font-semibold">Mismatch Alert</p><Badge variant="outline" className="border-destructive text-destructive">Action Required</Badge></div>
      </div>
      <div className="mt-3 text-sm">Current status: <span className="font-semibold capitalize">{status.replace("-", " ")}</span></div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <h1 className="font-display text-3xl">Dispute Review</h1>
          <Card className="p-4">
            <h2 className="font-semibold">Visual Evidence Comparison</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border p-3"><p className="text-sm font-medium">Supplier's Evidence</p><img src={sneaker} className="mt-2 h-48 w-full rounded object-cover" /></div>
              <div className="rounded-lg border-2 border-destructive bg-slate-900 p-3 text-white"><p className="text-sm font-medium">Buyer's Evidence</p><img src={sneaker} className="mt-2 h-48 w-full rounded object-cover opacity-80" /></div>
            </div>
            <div className="mt-4 rounded-lg border bg-secondary/30 p-3 text-sm">
              <p className="font-medium">Discrepancy Reported</p>
              <p className="mt-1 text-muted-foreground">Buyer claims color and sole pattern mismatch from pre-packaging proof. Requests return authorization.</p>
            </div>
            <div className="mt-5 flex gap-3"><Button onClick={() => setStatus("return-accepted")}>Accept Return</Button><Button variant="outline" className="border-destructive text-destructive" onClick={() => setStatus("claim-disputed")}>Dispute Claim</Button></div>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="p-4"><p className="font-semibold">Order Summary</p><p className="mt-2 text-sm">Imported Sneakers x500</p><p className="text-sm text-muted-foreground">Buyer: Goodness • ORD-SUP-1001</p></Card>
          <Card className="p-4"><p className="font-semibold">Dispute Timeline</p><ol className="mt-2 space-y-2 text-sm">{base.map((s,i)=><li key={s}>{timeline[i]==="done"?"🟢":timeline[i]==="active"?"🟡":"⚪"} {s}</li>)}</ol></Card>
        </aside>
      </div>
    </SupplierShell>
  );
}
