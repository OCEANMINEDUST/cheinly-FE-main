import { SupplierShell } from "@/components/supplier/SupplierShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function SupplierSettingsKyc() {
  return (
    <SupplierShell>
      <h1 className="font-display text-3xl">Settings & KYC</h1>
      <div className="mt-5 space-y-4 max-w-3xl">
        <Card className="p-5 space-y-3"><p className="font-semibold">Personal Information</p><div><Label>Business Name</Label><Input value="Moniewise Supplies Ltd" readOnly /></div></Card>
        <Card className="p-5 space-y-3"><p className="font-semibold">Mandatory Verification</p><div><Label>NIN</Label><Input value="•••••••• 5678" readOnly /></div><div><Label>BVN</Label><Input value="•••••••• 3412" readOnly /></div></Card>
        <Card className="p-5 space-y-3"><p className="font-semibold">Payment & Payouts</p><div className="rounded-lg border bg-primary/5 p-3 text-sm">Primary Bank Account: GTBank ••••8821</div><div><Label>Other Linked Accounts</Label><Select><SelectTrigger><SelectValue placeholder="Select linked account" /></SelectTrigger><SelectContent><SelectItem value="uba">UBA ••••2710</SelectItem><SelectItem value="kuda">Kuda ••••9932</SelectItem></SelectContent></Select></div></Card>
        <Card className="p-5"><div className="flex items-center justify-between"><div><p className="font-semibold">Two-Factor Authentication</p><p className="text-xs text-muted-foreground">Extra security for payouts.</p></div><Switch /></div><button className="mt-4 text-sm text-destructive">Delete Account</button></Card>
      </div>
    </SupplierShell>
  );
}
