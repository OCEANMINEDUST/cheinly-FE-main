import { ArrowUpRight, Lock, Wallet, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SellerShell } from "@/components/seller/SellerShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  return (
    <SellerShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Welcome back, Adunni</h1>
          <p className="text-sm text-muted-foreground">Here's how {sellerProfile.store} is performing today.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/seller/orders">View all orders<ArrowUpRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </div>

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
            <span>14 active orders</span>
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
    </SellerShell>
  );
}