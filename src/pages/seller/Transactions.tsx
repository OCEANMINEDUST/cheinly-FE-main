import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Lock, Wallet } from "lucide-react";
import { SellerShell } from "@/components/seller/SellerShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { naira, recentTxns, sellerProfile } from "@/lib/sellerMock";

type Filter = "all" | "settled" | "pending" | "refund";

export default function SellerTransactions() {
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(
    () => (filter === "all" ? recentTxns : recentTxns.filter((t) => t.status === filter)),
    [filter],
  );

  const protectedTotal = recentTxns.filter((t) => t.status === "pending").reduce((s, t) => s + t.amount, 0);
  const trueTotal = recentTxns.filter((t) => t.status === "settled").reduce((s, t) => s + t.amount, 0);
  const refundTotal = recentTxns.filter((t) => t.status === "refund").reduce((s, t) => s + t.amount, 0);

  return (
    <SellerShell>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground">Movement between Protected and True balances.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Protected activity</CardDescription>
            <CardTitle className="text-2xl">{naira(protectedTotal)}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Pending escrow: {naira(sellerProfile.protectedBalance)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5" /> True balance activity</CardDescription>
            <CardTitle className="text-2xl">{naira(trueTotal)}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Available: {naira(sellerProfile.trueBalance)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5 text-destructive"><ArrowDownRight className="h-3.5 w-3.5" /> Refunds</CardDescription>
            <CardTitle className="text-2xl">−{naira(refundTotal)}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">Across {recentTxns.filter((t) => t.status === "refund").length} transaction(s)</CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">All transactions</CardTitle>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="settled">Settled</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="refund">Refunds</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Time</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Txn ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-6 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((t) => (
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
                  <TableCell className="pr-6 text-right">
                    <span
                      className={
                        "inline-flex items-center gap-1 font-medium " +
                        (t.status === "refund" ? "text-destructive" : t.status === "settled" ? "text-success" : "")
                      }
                    >
                      {t.status === "refund" ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                      {t.status === "refund" ? "−" : ""}{naira(t.amount)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                    No transactions in this view.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </SellerShell>
  );
}