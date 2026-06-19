
import { useState } from "react";

import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";


export default function SupplierSettingsKyc() {

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function SupplierSettingsKyc() {
  const [nin, setNin] = useState("");
  const [bvn, setBvn] = useState("");
  const [doc1, setDoc1] = useState<File | null>(null);
  const [doc2, setDoc2] = useState<File | null>(null);
  const [status, setStatus] = useState<"none" | "pending" | "approved">("none");

  const submit = () => {
    if (!nin.trim() || !bvn.trim() || !doc1 || !doc2) return toast.error("Enter NIN/BVN and upload both supporting documents.");
    setStatus("pending");
    toast.success("KYC update request submitted for review.");
  };


  return (
    <SupplierShell>
      <h1 className="font-display text-3xl">Settings & KYC</h1>
      <div className="mt-5 space-y-4 max-w-3xl">
        <Card className="p-5 space-y-3"><p className="font-semibold">Personal Information</p><div><Label>Business Name</Label><Input value="Moniewise Supplies Ltd" readOnly /></div></Card>

        <Card className="p-5 space-y-3"><p className="font-semibold">Mandatory Verification</p><div><Label>NIN</Label><Input value="•••••••• 5678" readOnly /></div><div><Label>BVN</Label><Input value="•••••••• 3412" readOnly /></div></Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between"><p className="font-semibold">Mandatory Verification</p><Badge variant="outline">{status === "none" ? "No request" : status === "pending" ? "Pending review" : "Approved"}</Badge></div>
          <p className="text-xs text-muted-foreground">Current values remain masked until your submitted update is reviewed.</p>
          <div><Label>Current NIN</Label><Input value="•••••••• 5678" readOnly /></div>
          <div><Label>Current BVN</Label><Input value="•••••••• 3412" readOnly /></div>
          <div className="border-t pt-3" />
          <p className="text-sm font-medium">Request KYC Update</p>
          <div><Label>New NIN</Label><Input value={nin} onChange={(e) => setNin(e.target.value)} placeholder="Enter updated NIN" /></div>
          <div><Label>New BVN</Label><Input value={bvn} onChange={(e) => setBvn(e.target.value)} placeholder="Enter updated BVN" /></div>
          <div><Label>Upload ID Proof (PDF/JPG)</Label><Input type="file" accept=".pdf,image/*" onChange={(e) => setDoc1(e.target.files?.[0] ?? null)} /></div>
          <div><Label>Upload Supporting Bank Proof</Label><Input type="file" accept=".pdf,image/*" onChange={(e) => setDoc2(e.target.files?.[0] ?? null)} /></div>
          <Button onClick={submit}>Submit KYC Update Request</Button>
        </Card>

        <Card className="p-5 space-y-3"><p className="font-semibold">Payment & Payouts</p><div className="rounded-lg border bg-primary/5 p-3 text-sm">Primary Bank Account: GTBank ••••8821</div><div><Label>Other Linked Accounts</Label><Select><SelectTrigger><SelectValue placeholder="Select linked account" /></SelectTrigger><SelectContent><SelectItem value="uba">UBA ••••2710</SelectItem><SelectItem value="kuda">Kuda ••••9932</SelectItem></SelectContent></Select></div></Card>
        <Card className="p-5"><div className="flex items-center justify-between"><div><p className="font-semibold">Two-Factor Authentication</p><p className="text-xs text-muted-foreground">Extra security for payouts.</p></div><Switch /></div><button className="mt-4 text-sm text-destructive">Delete Account</button></Card>
      </div>
    </SupplierShell>
  );
}
