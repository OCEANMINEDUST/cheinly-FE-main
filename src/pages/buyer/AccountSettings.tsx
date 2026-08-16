import { useState } from "react";
import {
  Bell,
  CreditCard,
  Database,
  Download,
  FileText,
  Globe2,
  HelpCircle,
  KeyRound,
  LockKeyhole,
  Mail,
  MessageSquare,
  Moon,
  Phone,
  ShieldCheck,
  Smartphone,
  Trash2,
  Upload,
  User,
  PauseCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { forgetBuyer } from "@/lib/buyerSession";
import { useNavigate } from "react-router-dom";

const notificationOptions = [
  "Order updates",
  "Delivery updates",
  "Promotions",
  "Price drop alerts",
  "Restock alerts",
];

const legalLinks = ["Terms of Service", "Privacy Policy", "Refund Policy", "Cookie Policy"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function SettingsSection({
  id,
  title,
  description,
  icon: Icon,
  children,
}: {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <Card id={id} className="scroll-mt-24">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold/10 text-gold"><Icon className="h-5 w-5" /></div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function BuyerAccountSettings() {
  const navigate = useNavigate();
  const [action, setAction] = useState<null | "export" | "deactivate" | "close" | "delete">(null);
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [ack, setAck] = useState(false);

  const closeDialog = () => { setAction(null); setReason(""); setConfirmText(""); setAck(false); };

  const actionCopy = {
    export: { title: "Export account data", desc: "We'll bundle your profile, orders, transactions, disputes and messages into a downloadable ZIP within 24 hours.", cta: "Request export", tone: "default" as const, requireConfirm: false, keyword: "" },
    deactivate: { title: "Deactivate account", desc: "Your dashboard will be paused and notifications muted. In-flight orders continue safely. Sign in anytime within 30 days to reactivate.", cta: "Deactivate", tone: "default" as const, requireConfirm: false, keyword: "" },
    close: { title: "Close account", desc: "Closing settles outstanding balances, releases any escrow you're holding, and archives your history. Reopening after 14 days requires support.", cta: "Close account", tone: "destructive" as const, requireConfirm: true, keyword: "CLOSE" },
    delete: { title: "Permanently delete account", desc: "This removes all buyer data — profile, orders, transactions, disputes, payment methods and device memory. Deletion finalises after 30 days.", cta: "Delete account", tone: "destructive" as const, requireConfirm: true, keyword: "DELETE" },
  } as const;
  const current = action ? actionCopy[action] : null;
  const confirmReady = !current?.requireConfirm || (confirmText.trim().toUpperCase() === current.keyword && ack);

  const runAction = () => {
    if (action === "export") {
      toast.success("Data export requested. You'll receive a secure download link by email within 24 hours.");
    } else if (action === "deactivate") {
      toast.success("Account deactivated. Sign in anytime within 30 days to reactivate.");
    } else if (action === "close") {
      toast.success("Closure scheduled. Outstanding balances will be settled first — you'll receive a confirmation email.");
    } else if (action === "delete") {
      toast.success("Deletion scheduled. You have 30 days to cancel from your email before it becomes permanent.");
      forgetBuyer();
      setTimeout(() => navigate("/"), 800);
    }
    closeDialog();
  };

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />
      <main className="mx-auto flex-1 w-full max-w-6xl space-y-6 px-5 py-8 lg:px-8">
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Account</p>
              <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Buyer Settings</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Manage your buyer profile, security, payment methods, notifications, preferences, help resources, legal policies, and account controls.
              </p>
            </div>
            <Button>Save changes</Button>
          </div>
        </section>

        <div className="grid gap-6">
          <div className="space-y-6">
            <SettingsSection id="profile" title="Profile Information" description="Your personal buyer details and profile photo." icon={User}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between gap-4 rounded-xl border p-4 md:col-span-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14"><AvatarFallback>G</AvatarFallback></Avatar>
                    <div><p className="font-medium">Profile photo</p><p className="text-xs text-muted-foreground">Upload a clear image for support and delivery verification.</p></div>
                  </div>
                  <Button variant="outline" className="gap-2"><Upload className="h-4 w-4" />Upload</Button>
                </div>
                <Field label="Name"><Input defaultValue="Goodness A." /></Field>
                <Field label="Email"><Input type="email" defaultValue="goodness@example.com" /></Field>
                <Field label="Phone number"><Input defaultValue="+234 801 222 3344" /></Field>
              </div>
            </SettingsSection>

            <SettingsSection id="security" title="Security" description="Password, two-factor authentication, login activity, and device management." icon={LockKeyhole}>
              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="outline" className="justify-start gap-2"><KeyRound className="h-4 w-4" />Change password</Button>
                <div className="flex items-center justify-between rounded-xl border p-4"><div className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-medium">Two-factor authentication</span></div><Switch /></div>
                <Card className="md:col-span-2">
                  <CardHeader><CardTitle className="text-base">Login activity & device management</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {["Chrome on MacBook · Lagos · Active now", "Safari on iPhone · Lagos · 2 hours ago"].map((item) => (
                      <div key={item} className="flex items-center justify-between rounded-lg border p-3 text-sm"><span className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-muted-foreground" />{item}</span><Button variant="ghost" size="sm">Remove</Button></div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </SettingsSection>

            <SettingsSection id="payments" title="Payment Methods" description="Saved cards, bank accounts, wallet, and default payment method." icon={CreditCard}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Saved cards"><Input readOnly value="Visa •••• 4242" /></Field>
                <Field label="Bank accounts"><Input readOnly value="GTBank •••• 0198" /></Field>
                <Field label="Wallet (if applicable)"><Input readOnly value="Protected Balance wallet enabled" /></Field>
                <Field label="Default payment method"><Select defaultValue="card"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="card">Visa •••• 4242</SelectItem><SelectItem value="bank">GTBank •••• 0198</SelectItem><SelectItem value="wallet">Wallet</SelectItem></SelectContent></Select></Field>
              </div>
            </SettingsSection>

            <SettingsSection id="notifications" title="Notifications" description="Choose which buyer alerts you want to receive." icon={Bell}>
              <div className="grid gap-3 md:grid-cols-2">
                {notificationOptions.map((option, index) => (
                  <div key={option} className="flex items-center justify-between rounded-xl border p-4"><span className="flex items-center gap-2 text-sm font-medium"><Mail className="h-4 w-4 text-muted-foreground" />{option}</span><Switch defaultChecked={index < 2} /></div>
                ))}
              </div>
            </SettingsSection>

            <SettingsSection id="preferences" title="Preferences" description="Language, currency, theme, and communication preferences." icon={Globe2}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Language"><Select defaultValue="english"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="english">English</SelectItem></SelectContent></Select></Field>
                <Field label="Currency"><Select defaultValue="ngn"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ngn">NGN</SelectItem><SelectItem value="usd">USD</SelectItem></SelectContent></Select></Field>
                <div className="flex items-center justify-between rounded-xl border p-4"><span className="flex items-center gap-2 text-sm font-medium"><Moon className="h-4 w-4 text-muted-foreground" />Theme (light/dark)</span><Switch /></div>
                <Field label="Communication preferences"><Select defaultValue="email-sms"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="email-sms">Email and SMS</SelectItem><SelectItem value="email">Email only</SelectItem><SelectItem value="push">Push only</SelectItem></SelectContent></Select></Field>
              </div>
            </SettingsSection>

            <SettingsSection id="support" title="Help & Support" description="Contact support, FAQs, and issue reporting." icon={HelpCircle}>
              <div className="grid gap-3 md:grid-cols-3">
                <Button asChild variant="outline" className="justify-start gap-2"><Link to="/help/contact"><Phone className="h-4 w-4" />Contact support</Link></Button>
                <Button asChild variant="outline" className="justify-start gap-2"><Link to="/buyer/help"><HelpCircle className="h-4 w-4" />FAQs</Link></Button>
                <Button asChild variant="outline" className="justify-start gap-2"><Link to="/buyer/report-issue"><MessageSquare className="h-4 w-4" />Report an issue</Link></Button>
              </div>
            </SettingsSection>

            <SettingsSection id="legal" title="Legal" description="Buyer policies and required legal documents." icon={FileText}>
              <div className="grid gap-3 md:grid-cols-2">
                {legalLinks.map((item) => <Button key={item} variant="outline" className="justify-start gap-2"><FileText className="h-4 w-4" />{item}</Button>)}
              </div>
            </SettingsSection>

            <SettingsSection id="account" title="Account Management" description="Deactivate, delete, or download your account data." icon={Database}>
              <div className="grid gap-3 md:grid-cols-2">
                <button onClick={() => setAction("export")} className="group flex items-start gap-3 rounded-xl border p-4 text-left hover:border-primary/40 hover:bg-secondary/40 transition">
                  <Download className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Download my data</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Get a portable copy of everything on file.</p>
                  </div>
                </button>
                <button onClick={() => setAction("deactivate")} className="group flex items-start gap-3 rounded-xl border p-4 text-left hover:border-primary/40 hover:bg-secondary/40 transition">
                  <PauseCircle className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Deactivate account</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Pause your account temporarily — reversible.</p>
                  </div>
                </button>
                <button onClick={() => setAction("close")} className="group flex items-start gap-3 rounded-xl border p-4 text-left hover:border-destructive/40 hover:bg-destructive/5 transition">
                  <XCircle className="h-5 w-5 shrink-0 text-destructive" />
                  <div>
                    <p className="font-medium">Close account</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Settle balances and archive your workspace.</p>
                  </div>
                </button>
                <button onClick={() => setAction("delete")} className="group flex items-start gap-3 rounded-xl border p-4 text-left hover:border-destructive/40 hover:bg-destructive/5 transition">
                  <Trash2 className="h-5 w-5 shrink-0 text-destructive" />
                  <div>
                    <p className="font-medium">Delete permanently</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Remove every record after a 30-day recovery window.</p>
                  </div>
                </button>
              </div>
              <Separator className="my-4" />
              <p className="text-xs text-muted-foreground">KYC & Verification is hidden for buyers until wallet withdrawals, BNPL, credit facilities, or high-value transactions require it.</p>
            </SettingsSection>
          </div>
        </div>
      </main>

      <Dialog open={!!action} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="max-w-md">
          {current && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {current.tone === "destructive" && <AlertTriangle className="h-4 w-4 text-destructive" />}
                  {current.title}
                </DialogTitle>
                <DialogDescription>{current.desc}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Reason (optional)</Label>
                  <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Tell us what's happening — we read every note." rows={3} />
                </div>
                {current.requireConfirm && (
                  <>
                    <div className="space-y-2">
                      <Label>Type <span className="font-mono font-semibold">{current.keyword}</span> to confirm</Label>
                      <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder={current.keyword} />
                    </div>
                    <label className="flex cursor-pointer items-start gap-2 rounded-lg border bg-secondary/40 p-3 text-xs text-muted-foreground">
                      <Checkbox checked={ack} onCheckedChange={(v) => setAck(v === true)} className="mt-0.5" />
                      <span>I understand this action is irreversible after the recovery window and that any outstanding escrow will be released or refunded first.</span>
                    </label>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button variant={current.tone === "destructive" ? "destructive" : "default"} disabled={!confirmReady} onClick={runAction}>{current.cta}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BuyerFooter variant="dashboard" />
    </div>
  );
}
