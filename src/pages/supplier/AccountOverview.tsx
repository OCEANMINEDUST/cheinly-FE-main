import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function SupplierAccountOverview() {
  return (
    <SupplierShell>
      <h1 className="font-display text-3xl">Account Overview</h1>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Card className="p-5"><p className="font-semibold">Moniewise Supplies Ltd</p><p className="text-sm text-muted-foreground">Grade A+ Supplier</p><p className="mt-2 text-sm">Lagos, Nigeria</p></Card>
        <Card className="p-5"><p className="text-sm font-medium">Weekly Volume Goal</p><Progress value={72} className="mt-3" /><p className="mt-2 text-xs text-muted-foreground">72% to unlock processing discounts</p></Card>
      </div>
    </SupplierShell>
  );
}
