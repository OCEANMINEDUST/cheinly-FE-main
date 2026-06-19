import { Link } from "react-router-dom";
import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Progress } from "@/components/ui/progress";
import { Star, Trophy, BadgeCheck, Package, TrendingUp, ShieldAlert, Truck, FileCheck, ShieldCheck, Plus, AlertTriangle } from "lucide-react";
import { SellerStorefrontPanel } from "@/components/shared/SellerStorefrontPanel";


const orders = [
  { id: "SUP-1001", buyer: "Goodness", item: "Imported Sneakers x500", status: "pending fulfillment", amount: 5200000 },
  { id: "SUP-1002", buyer: "Aisha", item: "Leather Jackets x120", status: "awaiting pickup", amount: 1800000 },
];

export default function SupplierDashboard() {
  return (
    <SupplierShell>
      <h1 className="font-display text-3xl">Supplier Dashboard</h1>


      <section className="mt-6">
        <SellerStorefrontPanel username="globalsneakers" />
      </section>

      {/* Performance Summary */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Performance Summary</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Performance Score", value: "88", suffix: "/100", icon: TrendingUp },
            { label: "Success Rate", value: "96.2%", icon: BadgeCheck },
            { label: "Completion Rate", value: "94.5%", icon: FileCheck },
            { label: "Customer Rating", value: "4.7", suffix: " ★", icon: Star },
          ].map((m) => (
            <Card key={m.label} className="p-4">
              <p className="flex items-center gap-2 text-xs text-muted-foreground"><m.icon className="h-4 w-4" /> {m.label}</p>
              <p className="mt-1 font-display text-2xl">{m.value}<span className="text-sm font-normal text-muted-foreground">{m.suffix ?? ""}</span></p>
            </Card>
          ))}
        </div>
      </section>

      {/* Tier Progress + Account Status */}
      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <p className="flex items-center gap-2 text-xs text-muted-foreground"><Trophy className="h-4 w-4 text-gold" /> Tier Progress</p>
          <p className="mt-1 font-display text-xl">Gold Supplier</p>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Bronze · Silver · <span className="font-medium text-gold">Gold</span> · Platinum</span>
            <span className="font-medium">68% to Platinum</span>
          </div>
          <Progress value={68} className="mt-2" />
          <p className="mt-2 text-xs text-muted-foreground">Benefits: lower processing fees, instant payouts, priority support.</p>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 text-success" /> Account Status</p>
          <p className="mt-1 font-display text-xl">Verified</p>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div><p className="text-xs text-muted-foreground">KYC</p><Badge variant="outline" className="mt-1 bg-success/15 text-success border-success/30">Approved</Badge></div>
            <div><p className="text-xs text-muted-foreground">Profile</p><p className="mt-1 font-semibold">92%</p></div>
            <div><p className="text-xs text-muted-foreground">Verification</p><Badge variant="outline" className="mt-1 bg-success/15 text-success border-success/30">Verified</Badge></div>
          </div>
        </Card>
      </section>

      {/* Business Metrics */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Business Metrics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Orders", value: "842", icon: Package },
            { label: "Active Orders", value: "21", icon: Truck },
            { label: "Total Revenue", value: "₦24,180,000", icon: TrendingUp },
            { label: "Open Disputes", value: "1", icon: ShieldAlert },
          ].map((m) => (
            <Card key={m.label} className="p-4">
              <p className="flex items-center gap-2 text-xs text-muted-foreground"><m.icon className="h-4 w-4" /> {m.label}</p>
              <p className="mt-1 font-display text-2xl">{m.value}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button asChild variant="outline" className="h-auto justify-start gap-2 py-3"><Link to="/supplier/fulfillment"><Plus className="h-4 w-4" /> Create Order</Link></Button>
          <Button asChild variant="outline" className="h-auto justify-start gap-2 py-3"><Link to="/supplier/return-tracking"><Truck className="h-4 w-4" /> Track Return</Link></Button>
          <Button asChild variant="outline" className="h-auto justify-start gap-2 py-3"><Link to="/supplier/dispute-review"><AlertTriangle className="h-4 w-4" /> Raise Dispute</Link></Button>
          <Button asChild variant="outline" className="h-auto justify-start gap-2 py-3"><Link to="/supplier/settings-kyc"><BadgeCheck className="h-4 w-4" /> Complete KYC</Link></Button>
        </div>
      </section>


      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <Card className="p-5 text-white bg-[linear-gradient(135deg,hsl(210_85%_42%),hsl(220_70%_28%))]"><p className="text-xs">Protected Balance</p><p className="font-display text-3xl">₦5,200,000</p></Card>
        <Card className="p-5 text-white bg-[linear-gradient(135deg,hsl(160_60%_32%),hsl(165_62%_22%))]"><p className="text-xs">Earnings</p><p className="font-display text-3xl">₦1,850,000</p></Card>
        <Card className="p-5"><p className="text-xs text-muted-foreground">Pending Supplies</p><p className="font-display text-3xl">8</p></Card>
      </div>
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between"><h2 className="font-display text-2xl">New Supply Orders</h2><Button asChild size="sm"><Link to="/supplier/orders">View all</Link></Button></div>
        <div className="grid gap-4 md:grid-cols-2">

          {orders.map((o) => <Card key={o.id} className="p-4"><div className="flex items-center justify-between"><div><p className="font-semibold">{o.item}</p><p className="text-sm text-muted-foreground">Buyer: {o.buyer}</p></div><Badge>{o.status}</Badge></div><div className="mt-3 flex items-center justify-between"><span className="font-mono text-xs text-muted-foreground">{o.id}</span><span className="font-semibold">₦{o.amount.toLocaleString("en-NG")}</span></div><Button asChild className="mt-3 w-full"><Link to="/supplier/fulfillment">Start fulfillment</Link></Button></Card>)}

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
