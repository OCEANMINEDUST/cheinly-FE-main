import { useState } from "react";
import { ArrowUpRight, Lock, Wallet, ShieldCheck, Plus, AlertTriangle, Scale, Star, Trophy, BadgeCheck, Package, TrendingUp, ShieldAlert, Truck, FileCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SellerShell } from "@/components/seller/SellerShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  currentMonthIndex,
  monthlyIncome,
  naira,
  recentOrders,
  recentTxns,
  sellerProfile,
  statusVariant,
} from "@/lib/sellerMock";

export default function SellerDashboard() {
  const nav = useNavigate();
  const [fundOpen, setFundOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [amount, setAmount] = useState("");

  return (
    <SellerShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Welcome back, Adunni</h1>
          <p className="text-sm text-muted-foreground">Here's how {sellerProfile.store} is performing today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/seller/orders">View all orders<ArrowUpRight className="ml-1 h-4 w-4" /></Link>
          </Button>
          <Button size="sm" className="bg-gold-gradient text-gold-foreground hover:opacity-90" onClick={() => setSendOpen(true)}>
            <Plus className="mr-1 h-4 w-4" /> Send a Package
          </Button>
        </div>
      </div>

      {/* Performance Summary */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Performance Summary</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Performance Score", value: "92", suffix: "/100", icon: TrendingUp },
            { label: "Success Rate", value: "97.4%", icon: BadgeCheck },
            { label: "Completion Rate", value: "95.1%", icon: FileCheck },
            { label: "Customer Rating", value: "4.8", suffix: " ★", icon: Star },
          ].map((m) => (
            <Card key={m.label}>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2"><m.icon className="h-4 w-4" /> {m.label}</CardDescription>
                <CardTitle className="text-2xl font-semibold">{m.value}<span className="text-sm font-normal text-muted-foreground">{m.suffix ?? ""}</span></CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Tier Progress + Account Status */}
      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2"><Trophy className="h-4 w-4 text-gold" /> Tier Progress</CardDescription>
            <CardTitle className="text-xl">Gold Seller</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Bronze · Silver · <span className="font-medium text-gold">Gold</span> · Platinum</span>
              <span className="font-medium">72% to Platinum</span>
            </div>
            <Progress value={72} />
            <p className="text-xs text-muted-foreground">Benefits: lower escrow fees, priority dispatch, featured listings.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-success" /> Account Status</CardDescription>
            <CardTitle className="text-xl">Verified</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3 text-center">
            <div><p className="text-xs text-muted-foreground">KYC</p><Badge variant="outline" className="mt-1 bg-success/15 text-success border-success/30">Approved</Badge></div>
            <div><p className="text-xs text-muted-foreground">Profile</p><p className="mt-1 font-semibold">85%</p></div>
            <div><p className="text-xs text-muted-foreground">Verification</p><Badge variant="outline" className="mt-1 bg-success/15 text-success border-success/30">Verified</Badge></div>
          </CardContent>
        </Card>
      </section>

      {/* Business Metrics */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Business Metrics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Orders", value: "1,284", icon: Package },
            { label: "Active Orders", value: "37", icon: Truck },
            { label: "Total Revenue", value: naira(8420500), icon: TrendingUp },
            { label: "Open Disputes", value: "2", icon: ShieldAlert },
          ].map((m) => (
            <Card key={m.label}>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2"><m.icon className="h-4 w-4" /> {m.label}</CardDescription>
                <CardTitle className="text-2xl font-semibold">{m.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="h-auto justify-start gap-2 py-3" onClick={() => setSendOpen(true)}><Plus className="h-4 w-4" /> Create Order</Button>
          <Button asChild variant="outline" className="h-auto justify-start gap-2 py-3"><Link to="/seller/orders"><Truck className="h-4 w-4" /> Track Return</Link></Button>
          <Button asChild variant="outline" className="h-auto justify-start gap-2 py-3"><Link to="/seller/dispute"><AlertTriangle className="h-4 w-4" /> Raise Dispute</Link></Button>
          <Button asChild variant="outline" className="h-auto justify-start gap-2 py-3"><Link to="/seller/settings#kyc"><BadgeCheck className="h-4 w-4" /> Complete KYC</Link></Button>
        </div>
      </section>

      {/* Balance cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="relative overflow-hidden border-0 text-white shadow-card">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(210_85%_42%),hsl(220_70%_28%))]" />
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <CardHeader className="relative z-10 pb-2">
            <CardDescription className="flex items-center gap-2 text-white/75">
              <ShieldCheck className="h-4 w-4" /> Protected Balance
            </CardDescription>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              {naira(sellerProfile.protectedBalance)}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 flex items-center justify-between text-sm text-white/80">
            <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Held in escrow</span>
            <Button size="sm" variant="secondary" className="bg-white/15 text-white hover:bg-white/25" onClick={() => setFundOpen(true)}>
              <Plus className="mr-1 h-3.5 w-3.5" /> Fund Wallet
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 text-white shadow-card">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(215_28%_17%),hsl(222_47%_11%))]" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
          <CardHeader className="relative z-10 pb-2">
            <CardDescription className="flex items-center gap-2 text-white/70">
              <Wallet className="h-4 w-4" /> True Balance
            </CardDescription>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              {naira(sellerProfile.trueBalance)}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 flex items-center justify-between">
            <span className="text-sm text-white/70">Available to withdraw</span>
            <Button size="sm" className="bg-gold-gradient text-gold-foreground hover:opacity-90">
              Withdraw funds
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-lg">Sellers Progress Report</CardTitle>
            <CardDescription>Monthly income for the last 12 months</CardDescription>
          </div>
          <Badge variant="outline" className="border-gold/40 text-gold">2025</Badge>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyIncome} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => "₦" + (v / 1000).toFixed(0) + "k"}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v: number) => [naira(v), "Income"]}
              />
              <Bar dataKey="income" radius={[6, 6, 0, 0]}>
                {monthlyIncome.map((_, i) => (
                  <Cell key={i} fill={i === currentMonthIndex ? "hsl(28 90% 55%)" : "hsl(var(--primary) / 0.35)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tables */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Recent Orders</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/seller/orders">See all</Link></Button>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Address</TableHead>
                  <TableHead className="text-right pr-6">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((o) => {
                  const v = statusVariant(o.status);
                  return (
                    <TableRow key={o.id}>
                      <TableCell className="pl-6">
                        <div className="font-medium">{o.product}</div>
                        <div className="text-xs text-muted-foreground">{o.variant} • {naira(o.amount)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={v.cls}>{v.label}</Badge>
                      </TableCell>
                      <TableCell className="hidden max-w-[180px] truncate text-sm text-muted-foreground md:table-cell">
                        {o.address}
                      </TableCell>
                      <TableCell className="pr-6 text-right text-xs text-muted-foreground">{o.time}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Recent Transactions</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/seller/transactions">See all</Link></Button>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Time</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Txn ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTxns.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="pl-6 text-xs text-muted-foreground">{t.time}</TableCell>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">{t.txnId}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          t.status === "settled"
                            ? "bg-success/15 text-success border-success/30"
                            : t.status === "pending"
                            ? "bg-gold/15 text-gold border-gold/30"
                            : "bg-destructive/15 text-destructive border-destructive/30"
                        }
                      >
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right font-medium">
                      {t.status === "refund" ? "−" : ""}{naira(t.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Resolution shortcuts */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card className="group cursor-pointer transition hover:shadow-card" onClick={() => nav("/seller/dispute")}>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-destructive/15 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Open dispute</CardTitle>
              <CardDescription>Review buyer evidence & respond</CardDescription>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5" />
          </CardHeader>
        </Card>
        <Card className="group cursor-pointer transition hover:shadow-card" onClick={() => nav("/seller/negotiate")}>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Negotiate refund</CardTitle>
              <CardDescription>Counter-offer or escalate</CardDescription>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5" />
          </CardHeader>
        </Card>
      </div>

      {/* Fund Wallet modal */}
      <Dialog open={fundOpen} onOpenChange={setFundOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fund Protected Balance</DialogTitle>
            <DialogDescription>Top up your escrow float used to settle disputes faster.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input id="amount" inputMode="numeric" placeholder="50,000" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9,]/g, ""))} />
            <div className="flex gap-2">
              {[10000, 50000, 100000].map((v) => (
                <Button key={v} variant="outline" size="sm" onClick={() => setAmount(v.toLocaleString())}>+{naira(v)}</Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setFundOpen(false)}>Cancel</Button>
            <Button
              className="bg-gold-gradient text-gold-foreground hover:opacity-90"
              onClick={() => {
                setFundOpen(false);
                toast({ title: "Wallet funded", description: `${amount ? "₦" + amount : "Amount"} added to Protected Balance.` });
                setAmount("");
              }}
            >
              Confirm deposit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Package modal */}
      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send a Package</DialogTitle>
            <DialogDescription>Start a new dispatch — we'll match a verified rider in minutes.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="recipient">Recipient name</Label>
              <Input id="recipient" placeholder="e.g. Ifeoma A." />
            </div>
            <div>
              <Label htmlFor="addr">Drop-off address</Label>
              <Input id="addr" placeholder="12 Bourdillon Rd, Ikoyi" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSendOpen(false)}>Cancel</Button>
            <Button onClick={() => { setSendOpen(false); nav("/seller/dispatch"); }}>
              Continue to dispatch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SellerShell>
  );
}