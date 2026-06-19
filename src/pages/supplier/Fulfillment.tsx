import { useState } from "react";
import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { PackagingItemsList, PackagingItem, makeEmptyItem } from "@/components/shared/PackagingItemsList";


function UploadCard({ title }: { title: string }) {
  const [preview, setPreview] = useState<string | null>(null);
  return <Card className="p-4"><p className="font-medium">{title}</p>{preview ? <img src={preview} className="mt-3 h-28 w-full object-cover rounded" /> : <p className="text-sm text-muted-foreground mt-2">Upload image evidence</p>}<Input className="mt-3" type="file" accept="image/*" onChange={(e)=>{const f=e.target.files?.[0]; if(f) setPreview(URL.createObjectURL(f));}} /></Card>;
}

export default function SupplierFulfillment() {

  const [packItems, setPackItems] = useState<PackagingItem[]>([makeEmptyItem()]);

  return (
    <SupplierShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="font-display text-3xl">Order Fulfillment</h1>
          <p className="text-sm text-muted-foreground">Pending Fulfillment • Imported Sneakers x500 units</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <UploadCard title="1. Inventory Before Packaging" />
            <UploadCard title="2. Packaged Goods" />
            <Card className="p-4"><p className="font-medium">3. Rider Handover</p><p className="mt-2 text-sm text-muted-foreground">Confirm physical handoff to logistics rider.</p></Card>
            <Card className="p-4"><p className="font-medium">4. Delivery Confirmation</p><p className="mt-2 text-sm text-muted-foreground">Final proof and completion trigger.</p></Card>
          </div>

          <Card className="mt-5 p-5">
            <p className="font-medium">Packaging contents</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Manually list every SKU in this shipment and attach photos. For multi-unit packs, add a photo per unit or batch.
            </p>
            <div className="mt-4">
              <PackagingItemsList items={packItems} onChange={setPackItems} title="Items in this shipment" description="" />
            </div>
          </Card>

        </div>
        <aside className="space-y-4">
          <Card className="p-4"><p className="text-xs text-muted-foreground">Protected Balance</p><p className="font-display text-3xl">₦5,200,000</p></Card>
          <Card className="p-4"><p className="font-semibold">Rider Details</p><p className="mt-2 text-sm">Ahmed Musah</p><p className="text-xs text-muted-foreground">Bike • LP-220-KJA</p><Label className="mt-3 block">Handover PIN</Label><Input maxLength={4} placeholder="4-digit pin" /></Card>
        </aside>
      </div>
    </SupplierShell>
  );
}
