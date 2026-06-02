import { Link } from "react-router-dom";
import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlowStructurePanel } from "@/components/marketplace/FlowStructurePanel";

const orders = [
  { id: "SUP-1001", buyer: "Goodness", item: "Imported Sneakers x500", status: "pending fulfillment", amount: 5200000 },
  { id: "SUP-1002", buyer: "Aisha", item: "Leather Jackets x120", status: "awaiting pickup", amount: 1800000 },
];

export default function SupplierDashboard() {
  return (
    <SupplierShell>
      <FlowStructurePanel role="supplier" active="overview" />

      <h1 className="mt-8 font-display text-3xl">Supplier Dashboard</h1>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <Card className="p-5 text-white bg-[linear-gradient(135deg,hsl(210_85%_42%),hsl(220_70%_28%))]"><p className="text-xs">Protected Balance</p><p className="font-display text-3xl">₦5,200,000</p></Card>
        <Card className="p-5 text-white bg-[linear-gradient(135deg,hsl(160_60%_32%),hsl(165_62%_22%))]"><p className="text-xs">Earnings</p><p className="font-display text-3xl">₦1,850,000</p></Card>
        <Card className="p-5"><p className="text-xs text-muted-foreground">Pending Supplies</p><p className="font-display text-3xl">8</p></Card>
      </div>
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between"><h2 className="font-display text-2xl">New Supply Orders</h2><Button asChild size="sm"><Link to="/supplier/orders">View all</Link></Button></div>
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((o) => (
            <Card key={o.id} className="p-4">
              <div className="flex items-center justify-between"><div><p className="font-semibold">{o.item}</p><p className="text-sm text-muted-foreground">Buyer: {o.buyer}</p></div><Badge>{o.status}</Badge></div>
              <div className="mt-3 flex items-center justify-between"><span className="font-mono text-xs text-muted-foreground">{o.id}</span><span className="font-semibold">₦{o.amount.toLocaleString("en-NG")}</span></div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button asChild><Link to="/supplier/fulfillment">Start fulfillment</Link></Button>
                <Button asChild variant="outline"><Link to={`/supplier/invite/${o.id}`}>Invite</Link></Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </SupplierShell>
  );
}
