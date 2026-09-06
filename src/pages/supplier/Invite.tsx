import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, ShieldCheck, PackageCheck, Wallet, Clock3 } from "lucide-react";
import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const inviteSeed: Record<string, { item: string; units: number; amount: number; eta: string; buyer: string }> = {
  "SUP-1001": { item: "Imported Sneakers", units: 500, amount: 5200000, eta: "2 days", buyer: "Goodness" },
};

export default function SupplierInvite() {
  const { orderId = "SUP-1001" } = useParams();
  const nav = useNavigate();
  const data = inviteSeed[orderId] ?? inviteSeed["SUP-1001"];

  return (
    <SupplierShell>
      <section className="rounded-2xl bg-[linear-gradient(135deg,hsl(210_85%_42%),hsl(220_70%_28%))] p-8 text-white shadow-card">
        <Badge variant="secondary" className="mb-3">Pending Supplier Invite</Badge>
        <h1 className="font-display text-4xl">Deliver a high-priority pending order</h1>
        <p className="mt-2 max-w-2xl text-white/85">Accept this invitation to deliver {data.units} units for buyer {data.buyer}. Funds are already protected in escrow and released after successful fulfillment evidence.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Card className="border-white/20 bg-white/10 p-4 text-white"><p className="text-xs text-white/75">Order Units</p><p className="mt-1 text-2xl font-semibold">{data.units}</p></Card>
          <Card className="border-white/20 bg-white/10 p-4 text-white"><p className="text-xs text-white/75">Total Amount</p><p className="mt-1 text-2xl font-semibold">₦{data.amount.toLocaleString("en-NG")}</p></Card>
          <Card className="border-white/20 bg-white/10 p-4 text-white"><p className="text-xs text-white/75">Target Timeline</p><p className="mt-1 text-2xl font-semibold">{data.eta}</p></Card>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button className="bg-white text-slate-900 hover:bg-white/90" onClick={() => nav("/supplier/onboarding")}>Accept & Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
          <Button asChild variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10"><Link to="/supplier/dashboard">Maybe later</Link></Button>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <Card className="p-4"><ShieldCheck className="h-4 w-4 text-primary" /><p className="mt-2 text-sm font-medium">Escrow Protected</p></Card>
        <Card className="p-4"><PackageCheck className="h-4 w-4 text-primary" /><p className="mt-2 text-sm font-medium">Evidence-led Delivery</p></Card>
        <Card className="p-4"><Wallet className="h-4 w-4 text-primary" /><p className="mt-2 text-sm font-medium">Earnings on Verification</p></Card>
        <Card className="p-4"><Clock3 className="h-4 w-4 text-primary" /><p className="mt-2 text-sm font-medium">Fast Supplier Activation</p></Card>
      </section>
    </SupplierShell>
  );
}
