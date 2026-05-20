import { useState } from "react";
import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SupplierReturnInspection() {
  const [img, setImg] = useState<string | null>(null);
  return (
    <SupplierShell>
      <h1 className="font-display text-3xl">Final Return Inspection</h1>
      <Card className="mt-5 p-5 space-y-4">
        <p className="text-sm text-muted-foreground">Stage 5: Return Inspection</p>
        <div className="rounded-lg border p-4">
          <p className="font-medium">Upload return inspection photo</p>
          {img ? <img src={img} className="mt-3 h-40 w-full rounded object-cover" /> : <p className="mt-2 text-sm text-muted-foreground">Add evidence of returned item condition.</p>}
          <Input className="mt-3" type="file" accept="image/*" onChange={(e)=>{const f=e.target.files?.[0]; if(f) setImg(URL.createObjectURL(f));}} />
        </div>
        <div>
          <Label>4-digit Handover PIN</Label>
          <Input className="mt-2 max-w-xs" maxLength={4} placeholder="Enter rider-provided PIN" />
        </div>
        <Button>Confirm Receipt & Finalize Refund</Button>
      </Card>
    </SupplierShell>
  );
}
