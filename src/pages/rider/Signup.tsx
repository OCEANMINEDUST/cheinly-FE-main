import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Bike, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
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

  const continueWithGoogle = () => {
    const next = updateRider({
      name: existing.name || "James Wilson",
      email: existing.email || "james.w@gmail.com",
      phone: existing.phone,
      vehicle: existing.vehicle,
      plate: existing.plate,
      status: "new",
    });
    saveRider(next);
    toast.success("Signed in with Google — let's verify your documents.");
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

        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <Separator className="flex-1" /> or <Separator className="flex-1" />
        </div>

        <Button type="button" variant="outline" className="h-12 w-full rounded-xl text-base" onClick={continueWithGoogle}>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already a rider?{" "}
          <Link to="/rider/login" className="text-primary hover:underline">Sign in</Link>
        </p>

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