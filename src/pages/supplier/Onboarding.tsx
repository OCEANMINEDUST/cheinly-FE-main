import { useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function SupplierOnboarding() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showKyc, setShowKyc] = useState(false);
  const progress = useMemo(() => (step / 3) * 100, [step]);

  return (
    <SupplierShell>
      <Card className="mx-auto max-w-2xl p-6">
        <p className="text-sm text-muted-foreground">Step {step} of 3</p>
        <Progress value={progress} className="mt-2" />
        <h1 className="mt-4 font-display text-3xl">Supplier Business Profile Setup</h1>

        {step === 1 && (
          <div className="mt-5 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Business Information</h2>
            <div><Label>Business Name</Label><Input placeholder="Moniewise Supplies Ltd" /></div>
            <div><Label>RC Number</Label><Input placeholder="RC-123456" /></div>
            <div><Label>Business Address</Label><Input placeholder="12 Marina, Lagos" /></div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-5 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Mandatory KYC</h2>
            <div><Label>NIN or BVN</Label><div className="relative"><Input placeholder="Enter NIN or BVN" type={showKyc ? "text" : "password"} className="pr-10" /><button type="button" onClick={() => setShowKyc((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showKyc ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-5 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Contact Details</h2>
            <div><Label>Phone Number</Label><Input placeholder="+234..." /></div>
            <div><Label>Email Address</Label><Input placeholder="ops@supplier.com" type="email" /></div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button variant="outline" disabled={step === 1} onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)} className="flex-1">Back</Button>
          {step < 3 ? (
            <Button onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)} className="flex-1">Continue</Button>
          ) : (
            <Button className="flex-1">Complete Business Onboarding</Button>
          )}
        </div>
      </Card>
    </SupplierShell>
  );
}
