import { Link } from "react-router-dom";
import { ArrowRight, Clock3, Scale } from "lucide-react";
import { FlowStructurePanel } from "@/components/marketplace/FlowStructurePanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatDisputeAmount, getDisputesForRole, type DisputeRecord, type DisputeRole } from "@/lib/disputes";

const roleLabels: Record<DisputeRole, string> = {
  buyer: "Buyer",
  seller: "Seller",
  supplier: "Supplier",
};

const statusClass = (status: DisputeRecord["status"]) =>
  cn(
    status === "Open" && "border-destructive/30 bg-destructive/10 text-destructive",
    status === "Awaiting response" && "border-gold/30 bg-gold/10 text-gold",
    status === "Under review" && "border-primary/30 bg-primary/10 text-primary",
    status === "Return dispatch" && "border-blue-500/30 bg-blue-500/10 text-blue-600",
    status === "Evidence uploaded" && "border-violet-500/30 bg-violet-500/10 text-violet-600",
    status === "Resolved" && "border-success/30 bg-success/10 text-success",
  );

export function DisputesList({ role }: { role: DisputeRole }) {
  const disputes = getDisputesForRole(role);
  const openCount = disputes.filter((dispute) => dispute.status !== "Resolved").length;

  return (
    <div className="space-y-6">
      <FlowStructurePanel role={role} active="disputes" compact />

      <section className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Scale className="h-4 w-4" /> {roleLabels[role]} dispute center
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Disputes</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              All dispute cases raised from transactions, with their current status and the next workflow step.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center sm:min-w-64">
            <Card>
              <CardHeader className="p-4 pb-1"><CardDescription>Total cases</CardDescription></CardHeader>
              <CardContent className="p-4 pt-0 text-2xl font-semibold">{disputes.length}</CardContent>
            </Card>
            <Card>
              <CardHeader className="p-4 pb-1"><CardDescription>Action needed</CardDescription></CardHeader>
              <CardContent className="p-4 pt-0 text-2xl font-semibold">{openCount}</CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Disputes from transactions</CardTitle>
          <CardDescription>Select a case to continue the buyer, seller, or supplier dispute flow.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Dispute</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead className="hidden lg:table-cell">Issue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Amount</TableHead>
                <TableHead className="pr-6 text-right">Flow</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes.map((dispute) => (
                <TableRow key={dispute.id}>
                  <TableCell className="pl-6">
                    <div className="font-medium">{dispute.id}</div>
                    <div className="text-xs text-muted-foreground">{dispute.productName} • {dispute.counterparty}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-xs">{dispute.transactionId}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="h-3 w-3" />{dispute.openedAt}</div>
                  </TableCell>
                  <TableCell className="hidden max-w-sm lg:table-cell">
                    <p className="text-sm">{dispute.issue}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Next: {dispute.nextStep}</p>
                  </TableCell>
                  <TableCell><Badge variant="outline" className={statusClass(dispute.status)}>{dispute.status}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell">{formatDisputeAmount(dispute.amount)}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link to={dispute.detailPath}>Continue <ArrowRight className="ml-1 h-3 w-3" /></Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
