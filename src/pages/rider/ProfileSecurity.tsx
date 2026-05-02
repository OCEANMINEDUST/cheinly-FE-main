import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock } from "lucide-react";
import { z } from "zod";
import { RiderShell } from "@/components/rider/RiderShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";

const passwordSchema = z.object({
  current: z.string().min(1, "Current password is required"),
  next: z.string().min(8, "Use at least 8 characters").max(100),
  confirm: z.string(),
}).refine((v) => v.next === v.confirm, { message: "Passwords don't match", path: ["confirm"] });

const RiderProfileSecurity = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const type = params.get("type") === "pin" ? "pin" : "password";

  return (
    <RiderShell
      topBar={
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Security</p>
            <p className="font-display text-lg leading-tight text-foreground">{type === "pin" ? "Change PIN" : "Change password"}</p>
          </div>
        </div>
      }
    >
      {type === "pin" ? <PinForm onDone={() => navigate("/rider/profile")} /> : <PasswordForm onDone={() => navigate("/rider/profile")} />}
    </RiderShell>
  );
};

const PasswordForm = ({ onDone }: { onDone: () => void }) => {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState(false);

  const save = () => {
    const r = passwordSchema.safeParse(form);
    if (!r.success) return toast.error(r.error.errors[0].message);
    toast.success("Password updated.");
    onDone();
  };

  return (
    <div className="space-y-5 px-5 py-5">
      {(["current", "next", "confirm"] as const).map((key) => (
        <div key={key} className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-muted-foreground">
            <Lock className="h-3 w-3" />
            {key === "current" ? "Current password" : key === "next" ? "New password" : "Confirm new password"}
          </Label>
          <div className="relative">
            <Input
              type={show ? "text" : "password"}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle visibility"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      ))}
      <Button onClick={save} className="h-12 w-full rounded-xl text-base">Update password</Button>
    </div>
  );
};

const PinForm = ({ onDone }: { onDone: () => void }) => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const save = () => {
    if (current.length !== 4) return toast.error("Enter your current 4-digit PIN.");
    if (next.length !== 4) return toast.error("New PIN must be 4 digits.");
    if (next !== confirm) return toast.error("New PINs don't match.");
    toast.success("PIN updated.");
    onDone();
  };

  return (
    <div className="space-y-6 px-5 py-5">
      <PinBlock label="Current PIN" value={current} onChange={setCurrent} icon={KeyRound} />
      <PinBlock label="New PIN" value={next} onChange={setNext} icon={KeyRound} />
      <PinBlock label="Confirm new PIN" value={confirm} onChange={setConfirm} icon={KeyRound} />
      <Button onClick={save} className="h-12 w-full rounded-xl text-base">Update PIN</Button>
    </div>
  );
};

const PinBlock = ({ label, value, onChange, icon: Icon }: { label: string; value: string; onChange: (v: string) => void; icon: React.ComponentType<{ className?: string }> }) => (
  <div className="space-y-2">
    <Label className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-muted-foreground">
      <Icon className="h-3 w-3" /> {label}
    </Label>
    <InputOTP maxLength={4} value={value} onChange={onChange}>
      <InputOTPGroup>
        <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
        <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
        <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
        <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
      </InputOTPGroup>
    </InputOTP>
  </div>
);

export default RiderProfileSecurity;