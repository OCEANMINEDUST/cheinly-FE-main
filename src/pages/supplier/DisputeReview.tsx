import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import sneaker from "@/assets/sneaker.jpg";

export default function SupplierDisputeReview() {
  return (
    <SupplierShell>
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
        <div className="flex items-center justify-between"><p className="font-semibold">Mismatch Alert</p><Badge variant="outline" className="border-destructive text-destructive">Action Required</Badge></div>
      </div>
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
            <div className="mt-5 flex gap-3"><Button>Accept Return</Button><Button variant="outline" className="border-destructive text-destructive">Dispute Claim</Button></div>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card className="p-4"><p className="font-semibold">Order Summary</p><p className="mt-2 text-sm">Imported Sneakers x500</p><p className="text-sm text-muted-foreground">Buyer: Goodness • ORD-SUP-1001</p></Card>
          <Card className="p-4"><p className="font-semibold">Dispute Timeline</p><ol className="mt-2 space-y-2 text-sm"><li>🟢 Buyer opened claim</li><li>🟢 Evidence uploaded</li><li>🟡 Supplier review pending</li><li>⚪ Return dispatch</li></ol></Card>
        </aside>
      </div>
    </SupplierShell>
  );
}
