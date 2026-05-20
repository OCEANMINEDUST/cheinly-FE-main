import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";

export default function SupplierPerformance() {
  const stats = [
    ["Fulfillment Rate", "98%", "+2.3%"],
    ["On-Time Delivery", "94%", "+1.1%"],
    ["Dispute Rate", "1.4%", "-0.4%"],
    ["Average Rating", "4.8", "+0.2"],
  ];
  return (
    <SupplierShell>
      <Card className="p-5"><p className="text-sm text-muted-foreground">Supplier Grade</p><p className="font-display text-4xl">A+ Gold Status</p></Card>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map(([k,v,t]) => <Card key={k} className="p-4"><p className="text-xs text-muted-foreground">{k}</p><p className="text-2xl font-semibold">{v}</p><p className="text-xs text-success">{t}</p></Card>)}</div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]"><Card className="p-6 h-56"><p className="text-sm text-muted-foreground">Monthly Volume Chart</p></Card><Card className="p-4"><p className="font-semibold">Improving Your Grade</p><ul className="mt-2 text-sm space-y-1"><li>☑ Keep dispute rate below 2%</li><li>☑ Upload all fulfillment evidence</li><li>☐ Reach ₦8m monthly volume</li></ul></Card></div>
    </SupplierShell>
  );
}
