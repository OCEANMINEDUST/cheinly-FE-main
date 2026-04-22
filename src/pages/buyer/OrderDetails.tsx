import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Download, FileText, LifeBuoy, MapPinned, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNaira } from "@/lib/buyerMock";
import { getBuyerOrderById, orderStatusLabel } from "@/lib/orderMock";
import { OrderProgressDialog } from "@/components/buyer/OrderProgressDialog";
import { LiveTrackingDialog } from "@/components/buyer/LiveTrackingDialog";
import { cn } from "@/lib/utils";

const BuyerOrderDetails = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [progressOpen, setProgressOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);

  const order = useMemo(() => getBuyerOrderById(params.get("orderId")), [params]);
  const productId = params.get("productId") ?? order.productId;
  const mode = params.get("mode") ?? "guest";
  const provider = params.get("provider") ?? "cheinly";
  const baseQuery = new URLSearchParams({ productId, orderId: order.id, entry: "secure-checkout", mode, provider }).toString();
  const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + order.shippingFee - order.discount;

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />

      <main className="mx-auto flex-1 w-full max-w-7xl px-5 py-8 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <button onClick={() => navigate(`/buyer/dashboard?productId=${encodeURIComponent(productId)}&entry=secure-checkout&mode=${mode}&provider=${provider}`)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-4xl text-foreground">Order {order.shortRef}</h1>
              <Badge className={cn(
                "border",
                order.status === "completed" ? "border-success/20 bg-success/10 text-success" : "border-primary/20 bg-primary/10 text-primary",
              )}>{orderStatusLabel[order.status]}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Placed on {order.placedAt}{order.deliveredAt ? ` • Delivered on ${order.deliveredAt}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setProgressOpen(true)} className="gap-2 border-border bg-card hover:bg-secondary">
              <Truck className="h-4 w-4" /> Order Progress
            </Button>
            <Button variant="outline" onClick={() => navigate(`/buyer/receipt?${baseQuery}`)} className="gap-2 border-border bg-card hover:bg-secondary">
              <Download className="h-4 w-4" /> Download Receipt
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className="grid gap-6 lg:grid-cols-2">
              <Card className="shadow-card">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-center gap-2 text-foreground font-semibold"><MapPinned className="h-4 w-4 text-primary" /> Shipping Information</div>
                  <div className="space-y-1 text-sm">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Delivery Address</p>
                    <p className="font-semibold text-foreground">{order.shippingAddress.fullName}</p>
                    <p className="text-muted-foreground">{order.shippingAddress.line1}</p>
                    <p className="text-muted-foreground">{order.shippingAddress.line2}</p>
                    <p className="text-muted-foreground">{order.shippingAddress.city}</p>
                    <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-center gap-2 text-foreground font-semibold"><Truck className="h-4 w-4 text-primary" /> Delivery Partner</div>
                  <div className="rounded-lg border border-border bg-secondary/50 p-4">
                    <p className="font-semibold text-foreground">{order.courier.name}</p>
                    <p className="text-sm text-muted-foreground">⭐ {order.courier.rating} rider rating</p>
                    <p className="mt-3 text-sm text-muted-foreground">{order.courier.vehicleType} • {order.courier.plateNumber}</p>
                  </div>
                  <Button onClick={() => setTrackingOpen(true)} className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <MapPinned className="h-4 w-4" /> View Live Tracking
                  </Button>
                </CardContent>
              </Card>
            </section>

            <Card className="shadow-card">
              <CardContent className="space-y-5 p-5">
                <div className="flex items-center gap-2 text-foreground font-semibold"><ShoppingCart className="h-4 w-4 text-primary" /> Order Items ({order.items.length})</div>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="h-14 w-14 rounded-md object-cover ring-1 ring-border" loading="lazy" width={56} height={56} />
                        <div>
                          <p className="font-semibold uppercase text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 sm:text-right">
                        <div>
                          <p className="font-semibold text-foreground">{formatNaira(item.price)}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <Button variant="outline" className="gap-2 border-success/30 bg-success/5 text-success hover:bg-success/10">
                          <ShoppingCart className="h-4 w-4" /> Buy Again
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-5">
            <Card className="shadow-card">
              <CardContent className="space-y-4 p-5 text-sm">
                <div className="flex items-center gap-2 font-semibold text-foreground"><FileText className="h-4 w-4 text-primary" /> Payment Summary</div>
                <SummaryRow label="Subtotal" value={formatNaira(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0))} />
                <SummaryRow label="Delivery Fee" value={formatNaira(order.shippingFee)} />
                <SummaryRow label="Discount" value={order.discount ? `-${formatNaira(order.discount)}` : formatNaira(0)} valueClassName={order.discount ? "text-success" : undefined} />
                <div className="border-t border-border pt-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Total Paid</p>
                  <p className="mt-2 font-display text-4xl text-foreground">{formatNaira(total)}</p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/50 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Payment Method</p>
                  <p className="mt-1 font-semibold text-foreground">{order.paymentMethod}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-success/20 bg-success/5 shadow-card">
              <CardContent className="space-y-2 p-5 text-sm">
                <div className="flex items-center gap-2 font-semibold text-success"><ShieldCheck className="h-4 w-4" /> Safe Purchase Guarantee</div>
                <p className="text-success/90">Funds were securely managed in escrow and released based on your delivery confirmation.</p>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full gap-2 border-border bg-card hover:bg-secondary">
              <LifeBuoy className="h-4 w-4" /> Contact Support
            </Button>
            <Button variant="outline" className="w-full gap-2 border-border bg-card hover:bg-secondary">
              <FileText className="h-4 w-4" /> Report an Issue
            </Button>
          </aside>
        </div>
      </main>

      <BuyerFooter variant="dashboard" />

      <OrderProgressDialog open={progressOpen} onOpenChange={setProgressOpen} order={order} onTrack={() => { setProgressOpen(false); setTrackingOpen(true); }} onViewDetails={() => setProgressOpen(false)} />
      <LiveTrackingDialog open={trackingOpen} onOpenChange={setTrackingOpen} order={order} onViewDetails={() => setTrackingOpen(false)} />
    </div>
  );
};

const SummaryRow = ({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className={cn("font-medium text-foreground", valueClassName)}>{value}</span>
  </div>
);

export default BuyerOrderDetails;