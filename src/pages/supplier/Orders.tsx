import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";

export default function SupplierOrders() {
  return (
    <SupplierShell>
      <h1 className="font-display text-3xl">Order Tracking</h1>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Card className="p-4"><h2 className="font-semibold">New Supply Orders</h2><p className="text-sm text-muted-foreground mt-2">SUP-1001 • 500 units • Pending Fulfillment</p></Card>
        <Card className="p-4"><h2 className="font-semibold">Returning Orders</h2><p className="text-sm text-muted-foreground mt-2">RET-401 • Size mismatch review</p></Card>
      </div>
    </SupplierShell>
  );
}
