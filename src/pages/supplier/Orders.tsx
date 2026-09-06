import { Link } from "react-router-dom";
import { SupplierShell } from "@/components/supplier/SupplierShell";
import { FlowStructurePanel } from "@/components/marketplace/FlowStructurePanel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const rows = [
  { id: "SUP-1001", item: "Imported Sneakers x500", buyer: "Goodness", status: "pending dispatch", amount: 5200000 },
  { id: "SUP-1002", item: "Leather Jackets x120", buyer: "Aisha", status: "awaiting pickup", amount: 1800000 },
  { id: "RET-401", item: "Size mismatch review", buyer: "Chinedu", status: "return", amount: 240000 },
];

export default function SupplierOrders() {
  return (
    <SupplierShell>
      <FlowStructurePanel role="supplier" active="orders" compact />

      <h1 className="font-display text-3xl">Order Tracking</h1>
      <Card className="mt-5 p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.id}</TableCell>
                <TableCell>{r.item}</TableCell>
                <TableCell>{r.buyer}</TableCell>
                <TableCell><Badge variant="secondary">{r.status}</Badge></TableCell>
                <TableCell className="text-right">₦{r.amount.toLocaleString("en-NG")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild size="sm" variant="outline"><Link to={`/supplier/invite/${r.id}`}>Invite</Link></Button>
                    <Button asChild size="sm"><Link to="/supplier/orders">Process</Link></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </SupplierShell>
  );
}
