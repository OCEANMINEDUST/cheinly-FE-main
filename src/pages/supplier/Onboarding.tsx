import { useState } from "react";
import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function SupplierOnboarding() {
  const [step, setStep] = useState(1);
  return (
    <SupplierShell>
      <Card className="mx-auto max-w-2xl p-6">
        <p className="text-sm text-muted-foreground">Step {step} of 2</p>
        <Progress value={step === 1 ? 50 : 100} className="mt-2" />
        <h1 className="mt-4 font-display text-3xl">Supplier Business Profile Setup</h1>
        <div className="mt-5 space-y-4">
          <div><Label>Business Name</Label><Input placeholder="Moniewise Supplies Ltd" /></div>
          <div><Label>RC Number</Label><Input placeholder="RC-123456" /></div>
          <div><Label>Business Address</Label><Input placeholder="12 Marina, Lagos" /></div>
          <div><Label>Mandatory KYC (NIN or BVN)</Label><Input placeholder="•••••••••••" type="password" /></div>
          <div><Label>Phone Number</Label><Input placeholder="+234..." /></div>
          <div><Label>Email Address</Label><Input placeholder="ops@supplier.com" type="email" /></div>
        </div>
        <Button className="mt-6 w-full" onClick={() => setStep(2)}>Complete Business Onboarding</Button>
      </Card>
    </SupplierShell>
  );
}
