import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bike, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { z } from "zod";
import { RiderShell } from "@/components/rider/RiderShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getRider, updateRider } from "@/lib/riderMock";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Phone is too short").max(30),
  vehicle: z.string().trim().min(2).max(60),
  plate: z.string().trim().min(3).max(20),
});

const RiderProfilePersonal = () => {
  const navigate = useNavigate();
  const rider = getRider();
  const [form, setForm] = useState({ name: rider.name, email: rider.email, phone: rider.phone, vehicle: rider.vehicle, plate: rider.plate });

  const save = () => {
    const r = schema.safeParse(form);
    if (!r.success) return toast.error(r.error.errors[0].message);
    updateRider(r.data);
    toast.success("Profile updated.");
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
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Account</p>
            <p className="font-display text-lg leading-tight text-foreground">Personal information</p>
          </div>
        </div>
      }
    >
      <div className="space-y-5 px-5 py-5">
        <Field label="Full name" icon={User}>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Email" icon={Mail}>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Phone" icon={Phone}>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Vehicle" icon={Bike}>
            <Input value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} />
          </Field>
          <Field label="Plate" icon={ShieldCheck}>
            <Input value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} />
          </Field>
        </div>
        <Button onClick={save} className="h-12 w-full rounded-xl text-base">Save changes</Button>
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

export default RiderProfilePersonal;