import { useMemo, useState } from "react";
import { Phone, MessageCircle } from "lucide-react";
import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const store = { x: 80, y: 220 };
const checkpoints = [{ x: 420, y: 60 }, { x: 330, y: 110 }, { x: 250, y: 150 }, { x: 170, y: 190 }, { x: 100, y: 215 }];

export default function SupplierReturnTracking() {
  const [idx, setIdx] = useState(0);
  const rider = checkpoints[idx];
  const distanceKm = useMemo(() => (Math.hypot(rider.x - store.x, rider.y - store.y) / 100).toFixed(1), [rider]);
  const etaMin = useMemo(() => Math.max(2, Math.round(Number(distanceKm) * 8)), [distanceKm]);

  return (
    <SupplierShell>
      <h1 className="font-display text-3xl">Return Dispatch Tracking</h1>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
        <Card className="relative h-[28rem] overflow-hidden p-2">
          <div className="absolute left-4 top-4 z-10 rounded-lg bg-background/90 p-3 text-sm shadow">Estimated Distance: <span className="font-semibold">{distanceKm} km away</span></div>
          <svg viewBox="0 0 500 280" className="h-full w-full rounded bg-slate-100">
            <polyline points={checkpoints.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#94a3b8" strokeWidth="4" strokeDasharray="8 6" />
            <circle cx={store.x} cy={store.y} r="10" fill="#0f766e" /><text x={store.x + 14} y={store.y + 4} fontSize="12">Your Store</text>
            <circle cx={rider.x} cy={rider.y} r="10" fill="#2563eb" /><text x={rider.x + 14} y={rider.y + 4} fontSize="12">Rider</text>
          </svg>
        </Card>
        <aside className="space-y-4">
          <Card className="p-4"><p className="text-xs text-muted-foreground">ETA</p><p className="font-display text-3xl">{etaMin} min</p><Button className="mt-3" size="sm" onClick={() => setIdx((i) => Math.min(i + 1, checkpoints.length - 1))}>Refresh dispatch status</Button></Card>
          <Card className="p-4"><p className="font-semibold">Rider Details</p><p className="mt-2 text-sm">Ahmed Musah</p><div className="mt-3 flex gap-2"><Button size="sm"><Phone className="mr-1 h-4 w-4" />Call</Button><Button size="sm" variant="outline"><MessageCircle className="mr-1 h-4 w-4" />Message</Button></div></Card>
          <Card className="p-4"><p className="font-semibold">Return Details</p><p className="mt-2 text-sm">Imported Sneakers x500</p><p className="text-xs text-muted-foreground">Pickup: 12 Marina, Lagos</p></Card>
        </aside>
      </div>
    </SupplierShell>
  );
}
