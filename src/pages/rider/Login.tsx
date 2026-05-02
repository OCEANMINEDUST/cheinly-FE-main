import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Bike, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { z } from "zod";
import { RiderShell } from "@/components/rider/RiderShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getRider, saveRider, updateRider } from "@/lib/riderMock";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(1, "Password is required").max(100),
});

const RiderLogin = () => {
  const navigate = useNavigate();
  const existing = getRider();
  const [email, setEmail] = useState(existing.email || "");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse({ email, password });
    if (!r.success) return toast.error(r.error.errors[0].message);
    setLoading(true);
    setTimeout(() => {
      const next = updateRider({ email, name: existing.name || "James Wilson" });
      saveRider(next);
      setLoading(false);
      toast.success("Welcome back");
      navigate("/rider", { replace: true });
    }, 600);
  };

  const google = () => {
    const next = updateRider({ email: existing.email || "james.w@gmail.com", name: existing.name || "James Wilson" });
    saveRider(next);
    toast.success("Signed in with Google");
    navigate("/rider", { replace: true });
  };

  return (
    <RiderShell>
      <div className="bg-gradient-to-br from-primary/15 via-background to-gold/10 px-6 pb-8 pt-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
          <Bike className="h-6 w-6" />
        </div>
        <h1 className="mt-5 font-display text-3xl text-foreground">Rider sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">Welcome back. Sign in to pick up where you left off.</p>
      </div>
      <form onSubmit={submit} className="space-y-5 px-5 py-6">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-muted-foreground">
            <Mail className="h-3 w-3" /> Email
          </Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rider@cheinly.app" autoComplete="email" />
        </div>
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-muted-foreground">
            <Lock className="h-3 w-3" /> Password
          </Label>
          <div className="relative">
            <Input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle password visibility"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl text-base">
          {loading ? "Signing in…" : (<>Sign in <ArrowRight className="ml-2 h-4 w-4" /></>)}
        </Button>

        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <Separator className="flex-1" /> or <Separator className="flex-1" />
        </div>

        <Button type="button" variant="outline" className="h-12 w-full rounded-xl text-base" onClick={google}>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          New to Cheinly?{" "}
          <Link to="/rider" className="text-primary hover:underline">Create a rider account</Link>
        </p>
      </form>
    </RiderShell>
  );
};

export default RiderLogin;