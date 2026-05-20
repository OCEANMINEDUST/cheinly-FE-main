import { Phone, MessageCircle, MapPin } from "lucide-react";
import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SupplierReturnTracking() {
  return (
    <SupplierShell>
      <h1 className="font-display text-3xl">Return Dispatch Tracking</h1>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
        <Card className="relative h-[28rem] overflow-hidden">
          <div className="absolute left-4 top-4 z-10 rounded-lg bg-background/90 p-3 text-sm shadow">Estimated Distance: <span className="font-semibold">1.4 km away</span></div>
          <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_30%_30%,hsl(var(--secondary)),transparent_50%),radial-gradient(circle_at_70%_60%,hsl(var(--primary)/0.25),transparent_55%)]">
            <div className="text-center text-sm text-muted-foreground"><MapPin className="mx-auto h-6 w-6" />Map placeholder: Your Store ↔ Rider live location</div>
          </div>
        </Card>
        <aside className="space-y-4">
          <Card className="p-4"><p className="text-xs text-muted-foreground">ETA</p><p className="font-display text-3xl">12 min</p></Card>
          <Card className="p-4"><p className="font-semibold">Rider Details</p><p className="mt-2 text-sm">Ahmed Musah</p><div className="mt-3 flex gap-2"><Button size="sm"><Phone className="mr-1 h-4 w-4" />Call</Button><Button size="sm" variant="outline"><MessageCircle className="mr-1 h-4 w-4" />Message</Button></div></Card>
          <Card className="p-4"><p className="font-semibold">Return Details</p><p className="mt-2 text-sm">Imported Sneakers x500</p><p className="text-xs text-muted-foreground">Pickup: 12 Marina, Lagos</p></Card>
        </aside>
      </div>
    </SupplierShell>
  );
}
