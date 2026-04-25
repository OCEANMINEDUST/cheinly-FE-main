import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Bike, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { RiderShell } from "@/components/rider/RiderShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveRider, getRider, updateRider } from "@/lib/riderMock";
import { toast } from "sonner";

const RiderSignup = () => {
  const navigate = useNavigate();
  const existing = getRider();
  const [form, setForm] = useState({
    name: existing.name,
    email: existing.email,
    phone: existing.phone,
    vehicle: existing.vehicle,
    plate: existing.plate,
  });

  const submit = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.vehicle.trim() || !form.plate.trim()) {
      toast.error("Fill in every field to continue.");
      return;
    }
    const next = updateRider({ ...form, status: "new" });
    saveRider(next);
    toast.success("Account created — let's verify your documents.");
    navigate("/rider/onboarding");
  };

  return (
    <RiderShell>
      <div className="bg-gradient-to-br from-primary/15 via-background to-gold/10 px-6 pb-8 pt-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
          <Bike className="h-6 w-6" />
        </div>
        <h1 className="mt-5 font-display text-3xl text-foreground">Sign up as a rider</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Earn on your schedule. Quick verification, instant payouts to your Cheinly wallet.
        </p>
      </div>
      <div className="space-y-5 px-5 py-6">
        <Field label="Full name" icon={User}>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="James Wilson" />
        </Field>
        <Field label="Email" icon={Mail}>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="rider@cheinly.app" />
        </Field>
        <Field label="Phone number" icon={Phone}>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+234 ..." />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Vehicle" icon={Bike}>
            <Input value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} placeholder="Honda CB125" />
          </Field>
          <Field label="Plate" icon={ShieldCheck}>
            <Input value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} placeholder="LAG-482-XR" />
          </Field>
        </div>
        <Button onClick={submit} className="h-12 w-full rounded-xl text-base">
          Continue to documents <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to the Cheinly Rider terms & privacy policy.
        </p>
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

export default RiderSignup;