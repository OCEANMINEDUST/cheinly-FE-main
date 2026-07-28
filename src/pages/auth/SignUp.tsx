import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  User,
  Globe,
  Store,
  ShoppingBag,
  Phone,
  MapPin,
  IdCard,
} from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthCard } from "@/components/auth/AuthCard";
import { StepProgress } from "@/components/auth/StepProgress";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

const accountSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name").max(100),
    email: z.string().trim().email("Enter a valid email").max(255),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100)
      .regex(/[A-Z]/, "Include at least one uppercase letter")
      .regex(/[0-9]/, "Include at least one number"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

const sellerProfileSchema = z.object({
  businessName: z.string().trim().min(2, "Business name is required").max(120),
  address: z.string().trim().min(5, "Business address is required").max(200),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  country: z.string().trim().min(2, "Country is required").max(80),
  agree: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
});

const sellerIdentitySchema = z
  .object({
    idType: z.enum(["bvn", "nin"], { errorMap: () => ({ message: "Select an ID type" }) }),
    idNumber: z.string().trim().min(10, "Enter a valid 10-11 digit number").max(11),
  });

type Role = "seller" | "buyer" | null;

const SignUp = () => {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Modals
  const [phoneOtpOpen, setPhoneOtpOpen] = useState(false);
  const [verifySuccessOpen, setVerifySuccessOpen] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState(["", "", "", "", "", ""]);

  // Role
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  // Account
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // Seller profile
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");

  // Shared
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);

  // Seller identity
  const [idType, setIdType] = useState<"bvn" | "nin" | "">("");
  const [idNumber, setIdNumber] = useState("");

  const isSeller = selectedRole === "seller";
  const totalSteps = isSeller ? 5 : 4; // seller: role, account, profile, identity, done | buyer: role, account, profile, done

  const next = () => setStep((s) => Math.min(s + 1, totalSteps));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submitRole = () => {
    if (!selectedRole) return toast.error("Choose your role to continue");
    next();
  };

  const submitAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const r = accountSchema.safeParse({ fullName, email, password, confirm });
    if (!r.success) return toast.error(r.error.errors[0].message);
    next();
  };

  // Profile step → triggers phone OTP modal
  const submitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSeller) {
      const r = sellerProfileSchema.safeParse({ businessName, address, phone, country, agree });
      if (!r.success) return toast.error(r.error.errors[0].message);
    } else {
      const r = z
        .object({
          phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
          country: z.string().trim().min(2, "Country is required").max(80),
          agree: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
        })
        .safeParse({ phone, country, agree });
      if (!r.success) return toast.error(r.error.errors[0].message);
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPhoneOtp(["", "", "", "", "", ""]);
      setPhoneOtpOpen(true);
      toast.success(`Verification code sent to ${phone}`);
    }, 600);
  };

  const handlePhoneOtpChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const arr = [...phoneOtp];
    arr[i] = v;
    setPhoneOtp(arr);
    if (v && i < 5) document.getElementById(`pin-${i + 1}`)?.focus();
  };

  const verifyPhoneOtp = () => {
    if (phoneOtp.some((d) => !d)) return toast.error("Enter the 6-digit pin");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPhoneOtpOpen(false);
      setVerifySuccessOpen(true);
    }, 600);
  };

  const continueAfterVerify = () => {
    setVerifySuccessOpen(false);
    if (isSeller) {
      next(); // → identity verification
    } else {
      // Buyer: skip identity/banking, land straight on the welcome step
      setStep(4);
    }
  };

  const submitIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    const r = sellerIdentitySchema.safeParse({ idType, idNumber });
    if (!r.success) return toast.error(r.error.errors[0].message);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      next();
    }, 700);
  };

  const labels = isSeller
    ? ["Choose role", "Account", "Business profile", "Identity verification", "All set"]
    : ["Choose role", "Account", "Delivery details", "All set"];

  const isDoneStep = step === totalSteps;

  return (
    <AuthLayout step={{ current: step, total: totalSteps }}>
      <AuthCard
        title={
          step === 1
            ? "Choose your role"
            : step === 2
            ? `Create your ${isSeller ? "seller" : "buyer"} account`
            : step === 3
            ? isSeller
              ? "Tell us about your business"
              : "Where should we deliver?"
            : step === 4 && isSeller
            ? isSeller
              ? "Verify your identity"
              : ""
            : "Welcome to Cheinly"
        }
        subtitle={
          step === 1
            ? "Tell us how you'll use Cheinly. You can switch later."
            : step === 2
            ? isSeller
              ? "Join the network built for the modern enterprise."
              : "Shop verified sellers with escrow protection on every order."
            : step === 3
            ? isSeller
              ? "We'll tailor your storefront to your business."
              : "We'll use these details to route deliveries from our logistics partners."
            : step === 4 && isSeller
            ? isSeller
              ? "Verify your BVN or NIN to activate payouts."
              : ""
            : "Your account is ready. Sign in to enter your portal."
        }
        icon={isDoneStep ? CheckCircle2 : undefined}
      >
        {!isDoneStep && <StepProgress current={step} total={totalSteps - 1} label={labels[step - 1]} />}

        {/* STEP 1 — Role */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                {
                  id: "seller" as const,
                  icon: Store,
                  title: "Seller",
                  desc: "Run your storefront, manage products, and reach buyers.",
                  perks: ["Storefront builder", "Order management", "Payouts"],
                },
                {
                  id: "buyer" as const,
                  icon: ShoppingBag,
                  title: "Buyer",
                  desc: "Shop verified sellers with escrow-protected checkout.",
                  perks: ["Escrow protection", "Live delivery tracking", "Easy refunds"],
                },
              ]).map(({ id, icon: Icon, title, desc, perks }) => {
                const active = selectedRole === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedRole(id)}
                    className={`group relative text-left rounded-xl border bg-card p-5 transition-all ${
                      active
                        ? "border-gold shadow-glow ring-1 ring-gold/40"
                        : "border-border hover:border-gold/50"
                    }`}
                  >
                    {active && (
                      <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-gold" />
                    )}
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg mb-4 ${
                      active ? "bg-gold-gradient" : "bg-secondary"
                    }`}>
                      <Icon className={`h-6 w-6 ${active ? "text-gold-foreground" : "text-gold"}`} />
                    </div>
                    <h3 className="font-display text-xl text-foreground mb-1">{title}</h3>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{desc}</p>
                    <ul className="space-y-1">
                      {perks.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="h-1 w-1 rounded-full bg-gold" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            <Button type="button" onClick={submitRole} variant="hero" size="lg" className="w-full" disabled={!selectedRole}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-gold hover:underline">Sign in</Link>
            </p>
          </div>
        )}

        {/* STEP 2 — Account */}
        {step === 2 && (
          <form onSubmit={submitAccount} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ada Lovelace" className="pl-10 h-12 bg-input border-border" autoComplete="name" maxLength={100} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10 h-12 bg-input border-border" autoComplete="email" maxLength={255} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 pr-10 h-12 bg-input border-border" autoComplete="new-password" maxLength={100} />
                <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Toggle password visibility">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="confirm" type={showPwd ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" className="pl-10 h-12 bg-input border-border" autoComplete="new-password" maxLength={100} />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" size="lg" onClick={back} className="border-border">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button type="submit" variant="hero" size="lg" className="flex-1">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}

        {/* STEP 3 — Profile (role-aware) */}
        {step === 3 && isSeller && (
          <form onSubmit={submitProfile} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Acme Marketplace Ltd" className="pl-10 h-12 bg-input border-border" maxLength={120} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Business address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="12 Marina Road, Lagos" className="pl-10 h-12 bg-input border-border" maxLength={200} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 801 234 5678" className="pl-10 h-12 bg-input border-border" maxLength={20} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Nigeria" className="pl-10 h-12 bg-input border-border" maxLength={80} />
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-lg border border-border bg-secondary/40 p-3">
              <Checkbox checked={agree} onCheckedChange={(v) => setAgree(v === true)} className="mt-0.5" />
              <span className="text-xs text-muted-foreground leading-relaxed">
                I agree to the{" "}
                <Link to="/policies#terms" target="_blank" className="text-gold hover:underline">Terms of Service</Link>,{" "}
                <Link to="/policies#payment" target="_blank" className="text-gold hover:underline">Payment Policy</Link>,{" "}
                <Link to="/policies#merchant" target="_blank" className="text-gold hover:underline">Merchant Policy</Link>,{" "}
                <Link to="/policies#refund" target="_blank" className="text-gold hover:underline">Refund Policy</Link>, and{" "}
                <Link to="/policies#privacy" target="_blank" className="text-gold hover:underline">Privacy Policy</Link>.
              </span>
            </label>

            <div className="flex gap-3">
              <Button type="button" variant="outline" size="lg" onClick={back} className="border-border">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button type="submit" disabled={loading} variant="hero" size="lg" className="flex-1">
                {loading ? "Sending pin…" : (<>Send phone pin <Phone className="h-4 w-4" /></>)}
              </Button>
            </div>
          </form>
        )}

        {step === 3 && !isSeller && (
          <form onSubmit={submitProfile} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 801 234 5678" className="pl-10 h-12 bg-input border-border" maxLength={20} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country-buyer">Country</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="country-buyer" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Nigeria" className="pl-10 h-12 bg-input border-border" maxLength={80} />
              </div>
              <p className="text-xs text-muted-foreground">You can add specific delivery addresses at checkout.</p>
            </div>

            <label className="flex items-start gap-3 rounded-lg border border-border bg-secondary/40 p-3">
              <Checkbox checked={agree} onCheckedChange={(v) => setAgree(v === true)} className="mt-0.5" />
              <span className="text-xs text-muted-foreground leading-relaxed">
                I agree to the{" "}
                <Link to="/policies#terms" target="_blank" className="text-gold hover:underline">Terms of Service</Link>,{" "}
                <Link to="/policies#payment" target="_blank" className="text-gold hover:underline">Payment Policy</Link>,{" "}
                <Link to="/policies#merchant" target="_blank" className="text-gold hover:underline">Merchant Policy</Link>,{" "}
                <Link to="/policies#refund" target="_blank" className="text-gold hover:underline">Refund Policy</Link>, and{" "}
                <Link to="/policies#privacy" target="_blank" className="text-gold hover:underline">Privacy Policy</Link>.
              </span>
            </label>

            <div className="flex gap-3">
              <Button type="button" variant="outline" size="lg" onClick={back} className="border-border">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button type="submit" disabled={loading} variant="hero" size="lg" className="flex-1">
                {loading ? "Sending pin…" : (<>Send phone pin <Phone className="h-4 w-4" /></>)}
              </Button>
            </div>
          </form>
        )}

        {/* STEP 4 — Identity (seller only) */}
        {step === 4 && isSeller && (
          <form onSubmit={submitIdentity} className="space-y-5">
            <div className="space-y-2">
              <Label>ID type</Label>
              <Select value={idType} onValueChange={(v) => setIdType(v as "bvn" | "nin")}>
                <SelectTrigger className="h-12 bg-input border-border">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select BVN or NIN" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bvn">BVN — Bank Verification Number</SelectItem>
                  <SelectItem value="nin">NIN — National Identification Number</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">{idType === "bvn" ? "BVN" : idType === "nin" ? "NIN" : "ID number"}</Label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="idNumber" value={idNumber} onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, ""))} placeholder="Enter 10-11 digit number" className="pl-10 h-12 bg-input border-border" maxLength={11} inputMode="numeric" />
              </div>
              <p className="text-xs text-muted-foreground">
                Your ID is encrypted and used only to verify your identity.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-secondary/40 p-3 flex gap-3">
              <Shield className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                We partner with regulated KYC providers. Your data never leaves trusted infrastructure.
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" size="lg" onClick={back} className="border-border">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button type="submit" disabled={loading} variant="hero" size="lg" className="flex-1">
                {loading ? "Verifying…" : (<>Verify identity <CheckCircle2 className="h-4 w-4" /></>)}
              </Button>
            </div>
          </form>
        )}

        {/* Done step (5 for seller, 4 for buyer) */}
        {isDoneStep && (
          <div className="space-y-6 text-center">
            <div className="rounded-xl border border-border bg-secondary/40 p-5 text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-gold">Account ready</p>
              <p className="mt-2 text-foreground">{fullName || "—"}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
              {isSeller && businessName && (
                <p className="text-sm text-muted-foreground mt-1">{businessName}</p>
              )}
              {!isSeller && country && (
                <p className="text-sm text-muted-foreground mt-1">Delivering in {country}</p>
              )}
            </div>

            <Button variant="hero" size="lg" className="w-full" onClick={() => nav(isSeller ? "/auth/login" : "/buyer/dashboard")}>
              {isSeller ? "Enter the portal" : "Start browsing"} <ArrowRight className="h-4 w-4" />
            </Button>

            <p className="text-xs text-muted-foreground">
              Need help getting started?{" "}
              <Link to="#" className="text-gold hover:underline">Contact support</Link>
            </p>
          </div>
        )}
      </AuthCard>

      {/* Phone OTP modal */}
      <Dialog open={phoneOtpOpen} onOpenChange={setPhoneOtpOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <div className="mx-auto h-12 w-12 rounded-full bg-gold-gradient flex items-center justify-center mb-2">
              <Phone className="h-6 w-6 text-gold-foreground" />
            </div>
            <DialogTitle className="font-display text-2xl text-center">Verify your phone</DialogTitle>
            <DialogDescription className="text-center">
              Enter the 6-digit pin sent to <span className="text-foreground">{phone || "your phone"}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center gap-2 py-2">
            {phoneOtp.map((d, i) => (
              <input
                key={i}
                id={`pin-${i}`}
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handlePhoneOtpChange(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !phoneOtp[i] && i > 0) {
                    document.getElementById(`pin-${i - 1}`)?.focus();
                  }
                }}
                className="h-14 w-11 rounded-lg border border-border bg-input text-center font-display text-2xl text-gold focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ))}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Didn't get it?{" "}
            <button type="button" onClick={() => toast.success("New pin sent")} className="text-gold hover:underline">
              Resend pin
            </button>
          </div>

          <Button variant="hero" size="lg" className="w-full" onClick={verifyPhoneOtp} disabled={loading}>
            <Shield className="h-4 w-4" />
            {loading ? "Verifying…" : "Verify pin"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Verification success modal */}
      <Dialog open={verifySuccessOpen} onOpenChange={setVerifySuccessOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <div className="mx-auto h-14 w-14 rounded-full bg-gold-gradient flex items-center justify-center mb-2 shadow-glow">
              <CheckCircle2 className="h-7 w-7 text-gold-foreground" />
            </div>
            <DialogTitle className="font-display text-2xl text-center">Verification successful</DialogTitle>
            <DialogDescription className="text-center">
              Your phone number has been verified. Let's finish{" "}
              {isSeller ? "your identity check" : "your banking & logistics setup"}.
            </DialogDescription>
          </DialogHeader>

          <Button variant="hero" size="lg" className="w-full" onClick={continueAfterVerify}>
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogContent>
      </Dialog>
    </AuthLayout>
  );
};

export default SignUp;
