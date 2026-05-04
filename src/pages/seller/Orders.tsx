import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { ArrowUpRight, Camera, CheckCircle2, Filter, ImageOff, Package, Search, Truck } from "lucide-react";
import { SellerShell } from "@/components/seller/SellerShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatus, getPhotoStatus, naira, recentOrders, setActiveOrderId, statusVariant } from "@/lib/sellerMock";

function PhotoBadge({ orderId }: { orderId: string }) {
  const s = getPhotoStatus(orderId);
  if (s === "complete") {
    return (
      <Badge variant="outline" className="bg-success/15 text-success border-success/30 gap-1">
        <CheckCircle2 className="h-3 w-3" /> Photos
      </Badge>
    );
  }
  if (s === "partial") {
    return (
      <Badge variant="outline" className="bg-gold/15 text-gold border-gold/30 gap-1">
        <Camera className="h-3 w-3" /> 1 of 2
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-muted text-muted-foreground gap-1">
      <ImageOff className="h-3 w-3" /> No photos
    </Badge>
  );
}

export default function SellerOrders() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");

  const rows = useMemo(() => {
    return recentOrders.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (q && !(`${o.id} ${o.product} ${o.buyer}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [q, status]);

  const totals = useMemo(() => {
    const by = (s: OrderStatus) => recentOrders.filter((o) => o.status === s).length;
    return {
      all: recentOrders.length,
      pending: by("pending"),
      in_transit: by("in_transit"),
      delivered: by("delivered"),
      returned: by("returned"),
    };
  }, []);

  return (
    <SellerShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">Manage and dispatch orders from your store.</p>
        </div>
        <Button asChild>
          <Link to="/seller/dispatch"><Truck className="mr-2 h-4 w-4" /> Open dispatch flow</Link>
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        {([
          ["all", "Total"],
          ["pending", "Pending"],
          ["in_transit", "In transit"],
          ["delivered", "Delivered"],
          ["returned", "Returned"],
        ] as const).map(([k, label]) => (
          <Card key={k} className="cursor-pointer transition hover:border-primary/40" onClick={() => setStatus(k as any)}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">{label}</CardDescription>
              <CardTitle className="text-2xl">{(totals as any)[k]}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search order, product, buyer"
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_transit">In transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Order</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead className="hidden md:table-cell">Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="pr-6 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((o) => {
                const v = statusVariant(o.status);
                return (
                  <TableRow key={o.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-md bg-secondary text-muted-foreground">
                          <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{o.product}</div>
                          <div className="text-xs text-muted-foreground">{o.id} • {o.variant}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{o.buyer}</TableCell>
                    <TableCell className="hidden max-w-[200px] truncate text-sm text-muted-foreground md:table-cell">
                      {o.address}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline" className={v.cls}>{v.label}</Badge>
                        <PhotoBadge orderId={o.id} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{naira(o.amount)}</TableCell>
                    <TableCell className="pr-6 text-right">
                      {o.status === "pending" ? (
                        <Button asChild size="sm" onClick={() => setActiveOrderId(o.id)}>
                          <Link to={`/seller/dispatch?orderId=${o.id}`}>Dispatch <ArrowUpRight className="ml-1 h-3 w-3" /></Link>
                        </Button>
                      ) : o.status === "in_transit" ? (
                        <Button asChild variant="outline" size="sm" onClick={() => setActiveOrderId(o.id)}>
                          <Link to={`/seller/tracking?orderId=${o.id}`}>Track</Link>
                        </Button>
                      ) : (
                        <Button asChild variant="ghost" size="sm" onClick={() => setActiveOrderId(o.id)}>
                          <Link to={`/seller/dispatch?orderId=${o.id}`}>View</Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    No orders match your filters.
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