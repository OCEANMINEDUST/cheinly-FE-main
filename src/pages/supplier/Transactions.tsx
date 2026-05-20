import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SupplierTransactions() {
  return (
    <SupplierShell>
      <h1 className="font-display text-3xl">Transaction Details</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="p-5">
          <h2 className="font-semibold">Transaction Timeline</h2>
          <ol className="mt-4 space-y-3 text-sm">
            <li>🟢 Order Confirmed</li>
            <li>🟢 Funds Protected</li>
            <li>🟡 Delivery Verified</li>
            <li>⚪ Earnings Released</li>
          </ol>
        </Card>
        <div className="space-y-4">
          <Card className="p-4"><h3 className="font-semibold">Buyer Information</h3><p className="text-sm mt-2">Goodness A. • Verified Buyer</p></Card>
          <Card className="p-4"><h3 className="font-semibold">Purchased Items</h3><p className="text-sm mt-2">Imported Sneakers x500</p><Badge className="mt-2">Pending</Badge></Card>
          <Card className="p-4 bg-slate-900 text-white"><p className="text-xs text-white/70">Financial Summary</p><div className="mt-2 text-sm">Gross: ₦5,200,000</div><div className="text-sm">Service Fee: ₦78,000</div><div className="mt-3 font-display text-3xl text-emerald-400">₦5,122,000</div></Card>
        </div>
      </div>
    </SupplierShell>
  );
}
