import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";

export default function SupplierTierProgress() {
  const tiers = ["Bronze", "Silver", "Gold", "Diamond"];
  const active = "Gold";
  return (
    <SupplierShell>
      <h1 className="font-display text-3xl">Tier Progress</h1>
      <Card className="mt-5 p-5">
        <div className="grid grid-cols-4 gap-2">{tiers.map((t, i) => <div key={t} className="text-center"><div className={`mx-auto h-8 w-8 rounded-full grid place-items-center text-xs ${t===active?"bg-primary text-primary-foreground":"bg-secondary text-muted-foreground"}`}>{i+1}</div><p className="mt-1 text-xs">{t}</p></div>)}</div>
      </Card>
      <div className="mt-4 grid gap-4 md:grid-cols-2"><Card className="p-4"><p className="font-semibold">Next Tier Benefit</p><p className="text-sm mt-2">Lower processing fees</p></Card><Card className="p-4"><p className="font-semibold">Next Tier Benefit</p><p className="text-sm mt-2">Instant payouts</p></Card></div>
    </SupplierShell>
  );
}
