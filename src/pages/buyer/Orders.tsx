import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, Package, ArrowRight } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buyerOrders, orderStatusLabel } from "@/lib/orderMock";
import { formatNaira, mockProduct } from "@/lib/buyerMock";
import { cn } from "@/lib/utils";
import { FlowStructurePanel } from "@/components/marketplace/FlowStructurePanel";

const statusClass = (s: string) =>
  cn(
    "border hover:bg-transparent",
    s === "completed" && "bg-success/10 text-success border-success/20",
    s === "in-transit" && "bg-primary/10 text-primary border-primary/20",
    s === "processing" && "bg-gold/15 text-gold border-gold/30",
    s === "awaiting-verification" && "bg-gold/15 text-gold border-gold/30",
    s === "cancelled" && "bg-destructive/10 text-destructive border-destructive/20",
  );

const BuyerOrders = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const q = params.get("q")?.toLowerCase() ?? "";
  const orders = q
    ? buyerOrders.filter((o) =>
        [o.shortRef, o.sellerName, o.items[0]?.name].some((v) => v?.toLowerCase().includes(q)),
      )
    : buyerOrders;

  const open = (id: string) => {
    const p = new URLSearchParams({ productId: mockProduct.id, orderId: id, entry: "secure-checkout", mode: "guest", provider: "cheinly" });
    nav(`/buyer/order?${p.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />
      <main className="flex-1 mx-auto w-full max-w-7xl px-5 lg:px-8 py-8 space-y-6">
        <header>
          <h1 className="font-display text-3xl">My Orders</h1>
          <p className="text-sm text-muted-foreground">{q ? `Filtered by "${q}"` : "All purchases linked to your secure account."}</p>
        </header>

        <FlowStructurePanel role="buyer" active="orders" compact />

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-secondary grid place-items-center mb-3">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium">No orders match your search</p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left p-4">Ref</th>
                    <th className="text-left p-4">Product</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Seller</th>
                    <th className="text-left p-4">Total</th>
                    <th className="text-right p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t border-border hover:bg-secondary/30">
                      <td className="p-4 text-gold font-mono text-xs">{o.shortRef}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={o.items[0].image} className="h-9 w-9 rounded object-cover" alt="" />
                          <span className="font-medium">{o.items[0].name}</span>
                        </div>
                      </td>
                      <td className="p-4"><Badge className={statusClass(o.status)}>{orderStatusLabel[o.status]}</Badge></td>
                      <td className="p-4 text-muted-foreground">{o.sellerName}</td>
                      <td className="p-4 font-semibold">
                        {formatNaira(o.items.reduce((s, i) => s + i.price * i.quantity, 0) + o.shippingFee - o.discount)}
                      </td>
                      <td className="p-4 text-right">
                        <Button size="sm" variant="outline" onClick={() => open(o.id)}>
                          <Eye className="mr-1.5 h-3.5 w-3.5" /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <Card className="p-5 flex items-center justify-between gap-3">
          <div>
            <div className="font-semibold">Need a refresher?</div>
            <p className="text-sm text-muted-foreground">Visit the Help Centre for the full buyer flow.</p>
          </div>
          <Button asChild variant="outline"><a href="/buyer/help?section=buyer-flow">Open guide <ArrowRight className="ml-1.5 h-4 w-4" /></a></Button>
        </Card>
      </main>
      <BuyerFooter variant="dashboard" />
    </div>
  );
};

export default BuyerOrders;