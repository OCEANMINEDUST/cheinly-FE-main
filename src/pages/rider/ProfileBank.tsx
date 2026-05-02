import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Hash, ShieldCheck, User } from "lucide-react";
import { z } from "zod";
import { RiderShell } from "@/components/rider/RiderShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { getBank, saveBank } from "@/lib/riderMock";
import { toast } from "sonner";

const schema = z.object({
  bankName: z.string().trim().min(2, "Bank name is required").max(80),
  accountNumber: z.string().trim().regex(/^\d{8,12}$/, "Account number must be 8–12 digits"),
  accountName: z.string().trim().min(2, "Account name is required").max(100),
});

const RiderProfileBank = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(getBank());

  const save = () => {
    const r = schema.safeParse(form);
    if (!r.success) return toast.error(r.error.errors[0].message);
    saveBank(r.data as ReturnType<typeof getBank>);
    toast.success("Bank details updated.");
    navigate("/rider/profile");
  };

  return (
    <RiderShell
      topBar={
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Payouts</p>
            <p className="font-display text-lg leading-tight text-foreground">Bank details</p>
          </div>
        </div>
      }
    >
      <div className="space-y-5 px-5 py-5">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-start gap-3 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
            <p className="text-xs text-foreground">
              We use these details to send weekly payouts. Your information is encrypted end-to-end.
            </p>
          </CardContent>
        </Card>

        <Field label="Bank name" icon={Building2}>
          <Input value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} placeholder="Guaranty Trust Bank" />
        </Field>
        <Field label="Account number" icon={Hash}>
          <Input
            inputMode="numeric"
            maxLength={12}
            value={form.accountNumber}
            onChange={(e) => setForm({ ...form, accountNumber: e.target.value.replace(/\D/g, "") })}
            placeholder="0123456789"
          />
        </Field>
        <Field label="Account name" icon={User}>
          <Input value={form.accountName} onChange={(e) => setForm({ ...form, accountName: e.target.value })} placeholder="James Wilson" />
        </Field>

        <Button onClick={save} className="h-12 w-full rounded-xl text-base">Save bank details</Button>
      </div>
    </RiderShell>
  );
};

const Field = ({ label, icon: Icon, children }: { label: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-muted-foreground">
      <Icon className="h-3 w-3" /> {label}
    </Label>
    {children}
  </div>
);

export default RiderProfileBank;