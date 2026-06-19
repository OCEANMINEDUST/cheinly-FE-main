import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, UserCircle } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getBuyerSession, rememberBuyer, buyerDashboardUrl } from "@/lib/buyerSession";
import { mockProduct } from "@/lib/buyerMock";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(1, "Password is required").max(100),
});

/**
 * Buyer sign-in. Mocked auth: Google OR email/password both create a
 * synchronized buyer session tied to this device so future visits skip login.
 */
const BuyerLogin = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") ?? "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState<"email" | "google" | null>(null);

  // If the device is already recognized, go straight to the dashboard.
  useEffect(() => {
    const s = getBuyerSession();
    if (s) nav(next || buyerDashboardUrl(s), { replace: true });
  }, [nav, next]);

  const finish = (name: string, mail: string) => {
    const session = rememberBuyer({ name, email: mail, productId: mockProduct.id });
    toast.success(`Welcome, ${name.split(" ")[0]} — this device is now synced.`);
    nav(next || buyerDashboardUrl(session), { replace: true });
  };

  const submitEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse({ email, password });
    if (!r.success) return toast.error(r.error.errors[0].message);
    setLoading("email");
    setTimeout(() => {
      const name = email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      finish(name || "Buyer", email);
    }, 700);
  };

  const signInWithGoogle = () => {
    setLoading("google");
    setTimeout(() => finish("Cheinly Buyer", "buyer@gmail.com"), 700);
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Buyer sign-in"
        subtitle="Sync your buyer account across devices"
      >
        <div className="mb-4 flex items-center gap-2 rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-gold" />
          <span>Signing in remembers this device — next visit takes you straight to your dashboard.</span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full bg-card border-border hover:bg-secondary"
          disabled={loading !== null}
          onClick={signInWithGoogle}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading === "google" ? "Signing in…" : "Continue with Google"}
        </Button>

        <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          or email
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submitEmail} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="b-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="b-email"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 pl-10"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="b-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="b-password"
                type={show ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 pl-10 pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Toggle password"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading !== null}>
            <UserCircle className="h-4 w-4" />
            {loading === "email" ? "Signing in…" : "Sign in to buyer dashboard"}
          </Button>
        </form>

        <div className="mt-5 space-y-2 text-center text-sm">
          <Link to="/auth/forgot-password" className="block text-primary hover:text-primary-glow">Forgot password?</Link>
          <p className="text-muted-foreground">
            New to Cheinly?{" "}
            <Link to="/auth/signup" className="text-gold hover:underline">Create an account</Link>
          </p>
          <p className="text-muted-foreground">
            Just looking?{" "}
            <Link to="/buyer/browse" className="text-gold hover:underline">Browse products</Link>
          </p>
          <div className="pt-4 border-t border-border/50">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              By signing in, you agree to the{" "}
              <Link to="/policies#terms" target="_blank" className="text-gold hover:underline">Terms of Service</Link>,{" "}
              <Link to="/policies#payment" target="_blank" className="text-gold hover:underline">Payment Policy</Link>,{" "}
              <Link to="/policies#merchant" target="_blank" className="text-gold hover:underline">Merchant Policy</Link>,{" "}
              <Link to="/policies#refund" target="_blank" className="text-gold hover:underline">Refund Policy</Link>, and{" "}
              <Link to="/policies#privacy" target="_blank" className="text-gold hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default BuyerLogin;