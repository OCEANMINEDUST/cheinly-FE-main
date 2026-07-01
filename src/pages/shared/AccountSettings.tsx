import { useState, type ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  Building2,
  Download,
  FileText,
  Globe2,
  HelpCircle,
  IdCard,
  KeyRound,
  Landmark,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquare,
  Moon,
  Phone,
  ShieldCheck,
  Smartphone,
  Trash2,
  Upload,
  User,
  UserCog,
  Users,
  PauseCircle,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type AccountSettingsProps = {
  role: "seller" | "supplier";
};

const roleCopy = {
  seller: {
    label: "Seller",
    businessName: "Cheinly Premium Store",
    fullName: "Amara Okafor",
    email: "amara@cheinly.store",
    phone: "+234 801 234 5678",
    address: "24 Admiralty Way, Lekki Phase 1, Lagos",
    website: "https://cheinly.store",
    bio: "Trusted seller of verified fashion, sneakers, and accessories with same-day dispatch in Lagos.",
    initials: "AO",
    dashboard: "/seller/dashboard",
  },
  supplier: {
    label: "Supplier",
    businessName: "Moniewise Supplies Ltd",
    fullName: "Tunde Balogun",
    email: "ops@moniewise-supplies.com",
    phone: "+234 809 765 4321",
    address: "12 Industrial Estate Road, Ikeja, Lagos",
    website: "https://moniewise-supplies.com",
    bio: "Bulk supplier handling inspected inventory, fulfillment support, and return verification for marketplace partners.",
    initials: "TB",
    dashboard: "/supplier/dashboard",
  },
};

const settingSections = [
  { id: "profile", label: "Profile Information", icon: User },
  { id: "kyc", label: "KYC & Verification", icon: BadgeCheck },
  { id: "security", label: "Security", icon: LockKeyhole },
  { id: "payments", label: "Payment & Banking", icon: Landmark },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "team", label: "Team & Access", icon: Users, comingSoon: true },
];

const notificationControls = [
  { label: "Order updates", icon: Mail },
  { label: "Dispute updates", icon: MessageSquare },
  { label: "Payment alerts", icon: Bell },
  { label: "Security alerts", icon: ShieldCheck },
  { label: "Promotional messages", icon: Globe2 },
];

const supportTopics = [
  "How to Fulfill an Order",
  "How to File a Dispute",
  "Return & Refund Process",
  "Uploading Evidence",
  "Dispute Resolution Overview",
];

function SectionTitle({ id, title, description }: { id: string; title: string; description: string }) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export default function AccountSettings({ role }: AccountSettingsProps) {
  const copy = roleCopy[role];
  const [action, setAction] = useState<null | "export" | "deactivate" | "close" | "delete">(null);
  const [confirmText, setConfirmText] = useState("");
  const [reason, setReason] = useState("");
  const [ack, setAck] = useState(false);

  const closeDialog = () => { setAction(null); setConfirmText(""); setReason(""); setAck(false); };

  const runAction = () => {
    if (action === "export") {
      toast.success("Data export requested. You'll receive a download link within 24 hours.");
    } else if (action === "deactivate") {
      toast.success("Account deactivated. Sign in anytime within 30 days to reactivate.");
    } else if (action === "close") {
      toast.success("Account closure scheduled. Outstanding balances will be settled first.");
    } else if (action === "delete") {
      toast.success("Deletion scheduled. You have 30 days to cancel from your email.");
    }
    closeDialog();
  };

  const actionCopy = {
    export: { title: "Export account data", desc: "We'll package your profile, orders, transactions, disputes, and messages into a downloadable ZIP.", cta: "Request export", tone: "default" as const, requireConfirm: false },
    deactivate: { title: "Deactivate account", desc: "Your storefront and listings will be hidden. In-flight orders continue. You can reactivate anytime by signing in.", cta: "Deactivate", tone: "default" as const, requireConfirm: false },
    close: { title: "Close account", desc: "Closing settles outstanding balances, releases escrow, and archives your workspace. This cannot be undone after 14 days.", cta: "Close account", tone: "destructive" as const, requireConfirm: true },
    delete: { title: "Permanently delete account", desc: "This removes all data, orders, transactions, disputes, KYC records, and payout accounts. Deletion completes after 30 days.", cta: "Delete account", tone: "destructive" as const, requireConfirm: true },
  } as const;
  const current = action ? actionCopy[action] : null;
  const confirmReady = !current?.requireConfirm || (confirmText.trim().toUpperCase() === (action === "delete" ? "DELETE" : "CLOSE") && ack);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="bg-[linear-gradient(135deg,hsl(var(--primary)/0.16),hsl(var(--secondary)/0.45))] p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 border-4 border-background shadow-sm">
                <AvatarFallback className="bg-gold-gradient text-lg font-semibold text-gold-foreground">{copy.initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{copy.label} account</Badge>
                  <Badge variant="outline" className="border-success/30 bg-success/10 text-success">Verified</Badge>
                </div>
                <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Account Settings</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Manage profile details, verification, security, payouts, notifications, preferences, help resources, legal policies, and account controls for your {copy.label.toLowerCase()} workspace.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline"><Link to={copy.dashboard}>Back to dashboard</Link></Button>
              <Button>Save all changes</Button>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-6">
          <Card>
            <CardHeader>
              <SectionTitle id="profile" title="Profile Information" description="Personal, business, contact, photo, and public profile details." />
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-4 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between md:col-span-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14"><AvatarFallback>{copy.initials}</AvatarFallback></Avatar>
                  <div>
                    <p className="font-medium">Profile photo</p>
                    <p className="text-xs text-muted-foreground">Upload a square JPG or PNG that represents your business.</p>
                  </div>
                </div>
                <Button variant="outline" className="gap-2"><Upload className="h-4 w-4" />Upload photo</Button>
              </div>
              <Field label="Full Name"><Input defaultValue={copy.fullName} /></Field>
              <Field label="Business Name"><Input defaultValue={copy.businessName} /></Field>
              <Field label="Email Address"><Input type="email" defaultValue={copy.email} /></Field>
              <Field label="Phone Number"><Input defaultValue={copy.phone} /></Field>
              <Field label="Address"><Input defaultValue={copy.address} /></Field>
              <Field label="Website"><Input defaultValue={copy.website} /></Field>
              <Field label="Social Links"><Input placeholder="Instagram, WhatsApp, LinkedIn, X" /></Field>
              <div className="md:col-span-2"><Field label="Bio/About"><Textarea defaultValue={copy.bio} className="min-h-24" /></Field></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <SectionTitle id="kyc" title="KYC & Verification" description="Identity, business, address verification, and current compliance status." />
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  { title: "Identity", status: "Approved", icon: IdCard },
                  { title: "Business", status: "Approved", icon: Building2 },
                  { title: "Address", status: "Pending", icon: MapPin },
                  { title: "Status", status: "In review", icon: ShieldCheck },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl border p-4">
                    <item.icon className="mb-3 h-5 w-5 text-primary" />
                    <p className="text-sm font-medium">{item.title}</p>
                    <Badge variant="outline" className={cn("mt-2", item.status === "Approved" && "border-success/30 bg-success/10 text-success")}>{item.status}</Badge>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Government ID Upload"><Input type="file" accept=".pdf,image/*" /></Field>
                <Field label="Selfie Verification"><Input type="file" accept="image/*" /></Field>
                <Field label="CAC Registration (Business)"><Input type="file" accept=".pdf,image/*" /></Field>
                <Field label="Utility Bill"><Input type="file" accept=".pdf,image/*" /></Field>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <SectionTitle id="security" title="Security" description="Password, two-factor authentication, sessions, devices, and account recovery." />
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Change Password"><Input type="password" placeholder="Enter new password" /></Field>
                <Field label="Account Recovery Email"><Input defaultValue={copy.email} /></Field>
                <Field label="Two-Factor Authentication"><Select defaultValue="authenticator"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="email">Email OTP</SelectItem><SelectItem value="sms">SMS OTP</SelectItem><SelectItem value="authenticator">Authenticator app</SelectItem></SelectContent></Select></Field>
                <Field label="Device Management"><Input readOnly value="3 active devices" /></Field>
              </div>
              <div className="rounded-xl border">
                {[
                  ["Chrome on MacBook Pro", "Lagos, Nigeria · Active now"],
                  ["Safari on iPhone", "Lagos, Nigeria · 2 hours ago"],
                  ["Edge on Windows", "Abuja, Nigeria · Yesterday"],
                ].map(([device, meta], index) => (
                  <div key={device} className={cn("flex items-center justify-between gap-3 p-4", index > 0 && "border-t")}>
                    <div className="flex items-center gap-3"><Smartphone className="h-4 w-4 text-muted-foreground" /><div><p className="text-sm font-medium">{device}</p><p className="text-xs text-muted-foreground">{meta}</p></div></div>
                    <Button variant="ghost" size="sm">Logout</Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="gap-2"><KeyRound className="h-4 w-4" />Logout all devices</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <SectionTitle id="payments" title="Payment & Banking" description="Bank accounts, cards, preferred payout method, and withdrawal settings." />
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-4">
                  <div className="flex items-center justify-between"><p className="font-medium">GTBank ••••8821</p><Badge>Default</Badge></div>
                  <p className="mt-1 text-xs text-muted-foreground">Preferred withdrawal account</p>
                  <div className="mt-4 flex gap-2"><Button size="sm" variant="outline">Edit bank details</Button><Button size="sm" variant="ghost">Remove</Button></div>
                </div>
                <div className="rounded-xl border border-dashed p-4">
                  <Landmark className="mb-3 h-5 w-5 text-primary" />
                  <p className="font-medium">Add bank account</p>
                  <p className="mt-1 text-xs text-muted-foreground">Connect another settlement account.</p>
                  <Button className="mt-4" size="sm">Add account</Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Cards"><Input readOnly value="Visa •••• 4242" /></Field>
                <Field label="Withdrawal Settings"><Select defaultValue="manual"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="manual">Manual withdrawals</SelectItem><SelectItem value="weekly">Weekly automatic payout</SelectItem><SelectItem value="monthly">Monthly automatic payout</SelectItem></SelectContent></Select></Field>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <SectionTitle id="notifications" title="Notifications" description="Email, SMS, push, and marketing preferences." />
            </CardHeader>
            <CardContent className="space-y-3">
              {notificationControls.map((control, index) => (
                <div key={control.label} className="flex items-center justify-between gap-3 rounded-xl border p-4">
                  <div className="flex items-center gap-3">
                    <control.icon className="h-4 w-4 text-muted-foreground" />
                    <div><p className="text-sm font-medium">{control.label}</p><p className="text-xs text-muted-foreground">Email, SMS, and push delivery can be adjusted per event.</p></div>
                  </div>
                  <Switch defaultChecked={index < 4} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div id="team" className="scroll-mt-24 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div><h2 className="font-display text-2xl font-semibold tracking-tight">Team & Access</h2><p className="mt-1 text-sm text-muted-foreground">Invite members, roles, permissions, and access control.</p></div>
                <Badge variant="outline">Coming soon</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-4">
              {["Owner", "Manager", "Support Agent", "Accountant"].map((roleName) => <div key={roleName} className="rounded-xl border bg-muted/30 p-4 text-sm font-medium">{roleName}</div>)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <SectionTitle id="preferences" title="Preferences" description="Language, currency, time zone, and theme options." />
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Field label="Language"><Select defaultValue="english"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="english">English</SelectItem></SelectContent></Select></Field>
              <Field label="Currency"><Select defaultValue="ngn"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ngn">NGN</SelectItem><SelectItem value="usd">USD</SelectItem><SelectItem value="gbp">GBP</SelectItem></SelectContent></Select></Field>
              <Field label="Time Zone"><Select defaultValue="lagos"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="lagos">Africa/Lagos (WAT)</SelectItem><SelectItem value="utc">UTC</SelectItem></SelectContent></Select></Field>
              <div className="flex items-center justify-between rounded-xl border p-4"><div className="flex items-center gap-3"><Moon className="h-4 w-4 text-muted-foreground" /><div><p className="text-sm font-medium">Light/Dark Mode</p><p className="text-xs text-muted-foreground">Use dark interface on this device.</p></div></div><Switch /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <SectionTitle id="support" title="Help & Support" description="Help centre, contact support, report a problem, FAQs, and dispute resources." />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Button asChild variant="outline" className="justify-start gap-2"><Link to="/help"><HelpCircle className="h-4 w-4" />Help Centre</Link></Button>
                <Button asChild variant="outline" className="justify-start gap-2"><Link to="/help/contact"><Phone className="h-4 w-4" />Contact Support</Link></Button>
                <Button asChild variant="outline" className="justify-start gap-2"><Link to="/help/agent"><MessageSquare className="h-4 w-4" />Report a Problem</Link></Button>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {supportTopics.map((topic) => <div key={topic} className="rounded-lg border p-3 text-sm">{topic}</div>)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <SectionTitle id="legal" title="Legal" description="Terms, privacy, escrow, refunds, and compliance documents." />
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {["Terms of Service", "Privacy Policy", "Escrow Policy", "Refund Policy", "Compliance Documents"].map((item) => <Button key={item} variant="outline" className="justify-start gap-2"><FileText className="h-4 w-4" />{item}</Button>)}
            </CardContent>
          </Card>

          <Card className="border-destructive/30">
            <CardHeader>
              <SectionTitle id="account" title="Account Management" description="Deactivate, close, export data, or delete account." />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <button onClick={() => setAction("export")} className="group flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition hover:border-primary hover:bg-primary/5">
                  <div className="flex items-center gap-2"><Download className="h-4 w-4 text-primary" /><span className="font-medium">Export data</span></div>
                  <p className="text-xs text-muted-foreground">Download a ZIP of your profile, orders, transactions, disputes, and messages.</p>
                </button>
                <button onClick={() => setAction("deactivate")} className="group flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition hover:border-amber-500 hover:bg-amber-50/40">
                  <div className="flex items-center gap-2"><PauseCircle className="h-4 w-4 text-amber-600" /><span className="font-medium">Deactivate account</span></div>
                  <p className="text-xs text-muted-foreground">Hide your storefront temporarily. Reactivate anytime by signing back in.</p>
                </button>
                <button onClick={() => setAction("close")} className="group flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition hover:border-orange-500 hover:bg-orange-50/40">
                  <div className="flex items-center gap-2"><XCircle className="h-4 w-4 text-orange-600" /><span className="font-medium">Close account</span></div>
                  <p className="text-xs text-muted-foreground">Settle balances, release escrow, and archive the workspace. 14-day cancel window.</p>
                </button>
                <button onClick={() => setAction("delete")} className="group flex flex-col items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-left transition hover:border-destructive hover:bg-destructive/10">
                  <div className="flex items-center gap-2"><Trash2 className="h-4 w-4 text-destructive" /><span className="font-medium text-destructive">Delete account</span></div>
                  <p className="text-xs text-muted-foreground">Permanent removal after a 30-day recovery window. This cannot be undone.</p>
                </button>
              </div>
              <Separator />
              <div className="flex items-start gap-2 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <p>Destructive account actions require identity confirmation. Any pending disputes or open escrow will be reviewed by support before completion.</p>
              </div>
            </CardContent>
          </Card>
      </div>

      <Dialog open={!!action} onOpenChange={(o) => { if (!o) closeDialog(); }}>
        <DialogContent className="sm:max-w-lg">
          {current && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {action === "export" && <Download className="h-5 w-5 text-primary" />}
                  {action === "deactivate" && <PauseCircle className="h-5 w-5 text-amber-600" />}
                  {action === "close" && <XCircle className="h-5 w-5 text-orange-600" />}
                  {action === "delete" && <Trash2 className="h-5 w-5 text-destructive" />}
                  {current.title}
                </DialogTitle>
                <DialogDescription>{current.desc}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {action === "export" && (
                  <ul className="space-y-2 text-sm">
                    {["Profile & KYC records", "Orders & transactions history", "Disputes & evidence", "Messages & notifications"].map((i) => (
                      <li key={i} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />{i}</li>
                    ))}
                  </ul>
                )}
                {(action === "deactivate" || action === "close" || action === "delete") && (
                  <Field label="Reason (optional, helps us improve)">
                    <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Tell us why…" className="min-h-20" />
                  </Field>
                )}
                {current.requireConfirm && (
                  <>
                    <Field label={`Type ${action === "delete" ? "DELETE" : "CLOSE"} to confirm`}>
                      <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder={action === "delete" ? "DELETE" : "CLOSE"} />
                    </Field>
                    <label className="flex items-start gap-2 text-sm">
                      <Checkbox checked={ack} onCheckedChange={(v) => setAck(!!v)} className="mt-0.5" />
                      <span className="text-muted-foreground">I understand this action affects my {copy.label.toLowerCase()} workspace, listings, and payouts, and I have withdrawn any available balance.</span>
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
    </div>
  );
}
