import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Banknote, Building2, ChevronRight, Copy, Inbox, Landmark, Package, PackagePlus, Send, ShoppingBag, Wallet } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { mockBuyer, mockProduct, formatNaira } from "@/lib/buyerMock";
import { rememberBuyer, getBuyerSession } from "@/lib/buyerSession";
import { buyerOrders, orderStatusLabel } from "@/lib/orderMock";
import { OrderProgressDialog } from "@/components/buyer/OrderProgressDialog";
import { LiveTrackingDialog } from "@/components/buyer/LiveTrackingDialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FlowStructurePanel } from "@/components/marketplace/FlowStructurePanel";

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [fundOpen, setFundOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [amount, setAmount] = useState(mockProduct.price);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [method, setMethod] = useState<"transfer" | "deposit">("transfer");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(buyerOrders[0]?.id ?? null);
  const productId = params.get("productId") ?? mockProduct.id;
  const entry = params.get("entry");
  const mode = params.get("mode") ?? "guest";
  const provider = params.get("provider") ?? "cheinly";
  const checkoutQuery = new URLSearchParams({
    productId,
    entry: "secure-checkout",
    mode,
    provider,
  }).toString();

  useEffect(() => {
    const session = getBuyerSession();
    if (entry !== "secure-checkout" && !session) {
      navigate(`/buyer/product?productId=${encodeURIComponent(productId)}`, { replace: true });
      return;
    }
    // Remember this device for next visit
    rememberBuyer({ name: mockBuyer.name, email: mockBuyer.email, productId });
  }, [entry, navigate, productId]);

  const fee = +(amount * 0.015).toFixed(2);
  const final = amount + fee;
  const withdrawFee = +(withdrawAmount * 0.01).toFixed(2);
  const withdrawFinal = Math.max(withdrawAmount - withdrawFee, 0);
  const selectedOrder = buyerOrders.find((order) => order.id === selectedOrderId) ?? buyerOrders[0] ?? null;

  const openOrderFlow = (orderId: string) => {
    const order = buyerOrders.find((item) => item.id === orderId);

    if (!order) return;
    if (order.status === "awaiting-verification") {
      navigate(`/buyer/payment?${checkoutQuery}`);
      return;
    }
    if (order.status === "completed") {
      const verificationParams = new URLSearchParams({
        productId,
        orderId: order.id,
        entry: "secure-checkout",
        mode,
        provider,
      }).toString();
      navigate(`/buyer/confirm-delivery?${verificationParams}`);
      return;
    }
    if (order.status === "cancelled") {
      goToOrderDetails(order.id);
      return;
    }

    setSelectedOrderId(order.id);
    setProgressOpen(true);
  };

  const goToOrderDetails = (orderId: string) => {
    const detailParams = new URLSearchParams({
      productId,
      orderId,
      entry: "secure-checkout",
      mode,
      provider,
    }).toString();

    navigate(`/buyer/order?${detailParams}`);
  };

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />

      <main className="flex-1 mx-auto w-full max-w-7xl px-5 lg:px-8 py-8 space-y-8">
        <FlowStructurePanel role="buyer" active="overview" />

        {/* Complete order banner */}
        <Card className="overflow-hidden border-0 shadow-card">
          <div className="bg-gradient-to-r from-primary/90 to-primary/60 text-primary-foreground p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/15 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Complete Your Order</p>
                <p className="text-sm text-primary-foreground/80">
                  Finish your purchase of {mockProduct.name} to secure your delivery.
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate(`/buyer/payment?${checkoutQuery}`)}
              variant="secondary"
              className="bg-card text-foreground hover:bg-card/80 gap-2"
            >
              Finish Checkout <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <div>
          <h1 className="font-display text-4xl text-foreground">Welcome to Cheinly, {mockBuyer.name},</h1>
          <p className="text-muted-foreground text-sm mt-1">Your secure marketplace account is ready.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => navigate("/buyer/send-package")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PackagePlus className="mr-1.5 h-3.5 w-3.5" /> Send a package
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/buyer/invite-seller")}>
              <Send className="mr-1.5 h-3.5 w-3.5" /> Invite a seller
            </Button>
            <Button asChild size="sm" variant="ghost">
              <a href="/help">Help Centre</a>
            </Button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground border-0 shadow-card">
            <CardContent className="p-5 space-y-3">
              <p className="text-xs uppercase tracking-wider opacity-80">Protected Balance</p>
              <p className="font-display text-3xl">{formatNaira(amount)}</p>
              <Button
                size="sm"
                onClick={() => setFundOpen(true)}
                className="w-full bg-white/15 hover:bg-white/25 text-primary-foreground gap-1.5 backdrop-blur"
              >
                <Send className="h-3.5 w-3.5" /> Add Money
              </Button>
            </CardContent>
          </Card>

          <StatCard icon={Wallet} label="Earnings" value={formatNaira(0)} action={{ label: "Withdraw", onClick: () => setWithdrawOpen(true) }} />
          <StatCard icon={Package} label="Completed Transactions" value={String(buyerOrders.filter((order) => order.status === "completed").length)} sublabel="New Account" />
          <StatCard icon={ShoppingBag} label="Active Orders" value={String(buyerOrders.filter((order) => order.status !== "completed" && order.status !== "cancelled").length)} sublabel="In Progress" sublabelTone="gold" />
        </div>

        {/* Orders */}
        <section className="space-y-3">
          <div>
            <h2 className="font-display text-2xl text-foreground">Your Orders</h2>
            <p className="text-sm text-muted-foreground">Details of your recent product purchases</p>
          </div>
          <Card className="shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left p-4">Ref</th>
                    <th className="text-left p-4">Product Name</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Seller Location</th>
                    <th className="text-left p-4">Order Total</th>
                    <th className="text-right p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {buyerOrders.map((order) => {
                    return (
                      <tr
                        key={order.id}
                        className="border-t border-border transition-colors hover:bg-secondary/30 cursor-pointer"
                        onClick={() => openOrderFlow(order.id)}
                      >
                        <td className="p-4 text-gold font-mono text-xs">{order.shortRef}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={order.items[0].image} alt={order.items[0].name} className="h-9 w-9 rounded object-cover" loading="lazy" width={36} height={36} />
                            <span className="text-foreground font-medium">{order.items[0].name}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={cn(
                            "border hover:bg-transparent",
                            order.status === "completed" && "bg-success/10 text-success border-success/20",
                            order.status === "in-transit" && "bg-primary/10 text-primary border-primary/20",
                            order.status === "processing" && "bg-gold/15 text-gold border-gold/30",
                            order.status === "awaiting-verification" && "bg-gold/15 text-gold border-gold/30",
                            order.status === "cancelled" && "bg-destructive/10 text-destructive border-destructive/20",
                          )}>
                            {orderStatusLabel[order.status]}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">{order.sellerLocation}</td>
                        <td className="p-4 text-foreground font-semibold">
                          {formatNaira(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + order.shippingFee - order.discount)}
                        </td>
                        <td className="p-4 text-right">
                          {order.status === "awaiting-verification" ? (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/buyer/payment?${checkoutQuery}`);
                              }}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                              Pay Now
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                goToOrderDetails(order.id);
                              }}
                              className="border-border bg-card hover:bg-secondary"
                            >
                              View Order
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Recent transactions */}
        <section className="space-y-3">
          <div>
            <h2 className="font-display text-2xl text-foreground">Recent Transactions</h2>
            <p className="text-sm text-muted-foreground">Track your spending habits</p>
          </div>
          <Card className="shadow-card">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-3">
                <Inbox className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground">Empty Transaction History</p>
              <p className="text-sm text-muted-foreground mt-1">Complete your first purchase or fund your wallet to see your history here.</p>
            </CardContent>
          </Card>
        </section>
      </main>

      <BuyerFooter variant="dashboard" />

      {/* Fund Protected Balance modal */}
      <Dialog open={fundOpen} onOpenChange={setFundOpen}>
          <DialogContent className="max-w-md p-0 overflow-hidden">
          <DialogHeader className="space-y-2">
              <DialogTitle className="flex items-center gap-2 font-display text-xl px-6 pt-6">
                <Wallet className="h-5 w-5 text-primary" /> Add Money to Protected Balance
            </DialogTitle>
              <DialogDescription className="mx-6 rounded-lg bg-primary/10 border border-primary/20 p-3 text-xs text-foreground/80 mt-2">
              Funds in your Protected Balance are held securely in escrow and only released when you confirm delivery.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 px-6 pb-6 pt-2">
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block">Enter Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  className="h-12 pl-9 text-lg font-semibold"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[5000, 25000, 100000].map((q) => (
                  <button
                    key={q}
                    onClick={() => setAmount(q)}
                    className="flex-1 rounded-md border border-border bg-secondary/40 hover:border-gold/50 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {formatNaira(q)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <MethodTile
                  active={method === "transfer"}
                  onClick={() => setMethod("transfer")}
                  icon={Building2}
                  label="Bank Transfer"
                />
                <MethodTile
                  active={method === "deposit"}
                  onClick={() => setMethod("deposit")}
                  icon={Banknote}
                  label="Direct Deposit"
                />
              </div>
            </div>

            <div className="rounded-lg bg-secondary border border-border p-4 space-y-3 text-sm">
              <Row label="Virtual Account Name" value={`CHEINLY/${mockBuyer.name.toUpperCase()}`} />
              <Row
                label="Account Number"
                value="8821904452"
                action={
                  <button onClick={() => { navigator.clipboard.writeText("8821904452"); toast.success("Copied"); }} className="text-gold">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                }
              />
              <Row label="Bank Name" value="Cheinly Virtual Bank" />
            </div>

            <div className="space-y-1 text-sm border-t border-border pt-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Transaction Fee (1.5%)</span>
                <span>{formatNaira(fee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base">
                <span className="text-foreground">Final Amount</span>
                <span className="text-gold">{formatNaira(final)}</span>
              </div>
            </div>

            <Button
              onClick={() => {
                setFundOpen(false);
                toast.success("Transfer received — funds will reflect shortly.");
              }}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <Send className="h-4 w-4" /> I have made the transfer
            </Button>
            <button onClick={() => setFundOpen(false)} className="w-full text-sm text-muted-foreground hover:text-gold py-1">
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <DialogHeader className="space-y-2">
            <DialogTitle className="flex items-center gap-2 font-display text-xl px-6 pt-6">
              <Landmark className="h-5 w-5 text-primary" /> Withdraw from Earnings
            </DialogTitle>
            <DialogDescription className="mx-6 rounded-lg bg-primary/10 border border-primary/20 p-3 text-xs text-foreground/80 mt-2">
              Withdrawals are sent to your saved bank account after a quick compliance review.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 px-6 pb-6 pt-2">
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block">Withdraw Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                <Input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value) || 0)}
                  className="h-12 pl-9 text-lg font-semibold"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {[10000, 25000, 50000].map((q) => (
                  <button
                    key={q}
                    onClick={() => setWithdrawAmount(q)}
                    className="flex-1 rounded-md border border-border bg-secondary/40 hover:border-gold/50 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {formatNaira(q)}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-secondary border border-border p-4 space-y-3 text-sm">
              <Row label="Bank Name" value="Moniepoint MFB" />
              <Row label="Account Name" value={mockBuyer.name.toUpperCase()} />
              <Row label="Account Number" value="2039485721" />
            </div>

            <div className="rounded-lg bg-secondary/50 border border-border p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Available Earnings</span>
                <span>{formatNaira(0)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Withdrawal Fee (1%)</span>
                <span>{formatNaira(withdrawFee)}</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-base">
                <span className="text-foreground">You’ll Receive</span>
                <span className="text-gold">{formatNaira(withdrawFinal)}</span>
              </div>
            </div>

            <Button
              onClick={() => {
                setWithdrawOpen(false);
                toast.success("Withdrawal request submitted successfully.");
              }}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <Send className="h-4 w-4" /> Request Withdrawal
            </Button>
            <button onClick={() => setWithdrawOpen(false)} className="w-full text-sm text-muted-foreground hover:text-gold py-1">
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <OrderProgressDialog
        open={progressOpen}
        onOpenChange={setProgressOpen}
        order={selectedOrder}
        onTrack={() => {
          setProgressOpen(false);
          setTrackingOpen(true);
        }}
        onViewDetails={() => {
          setProgressOpen(false);
          if (selectedOrder) goToOrderDetails(selectedOrder.id);
        }}
      />

      <LiveTrackingDialog
        open={trackingOpen}
        onOpenChange={setTrackingOpen}
        order={selectedOrder}
        onViewDetails={() => {
          setTrackingOpen(false);
          if (selectedOrder) goToOrderDetails(selectedOrder.id);
        }}
      />
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  sublabel,
  sublabelTone,
  action,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sublabel?: string;
  sublabelTone?: "gold" | "success";
  action?: { label: string; onClick: () => void };
}) => (
  <Card className="shadow-card">
    <CardContent className="p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="font-display text-3xl text-foreground">{value}</p>
      {sublabel && (
        <p className={cn("text-xs", sublabelTone === "gold" ? "text-gold" : "text-muted-foreground")}>{sublabel}</p>
      )}
      {action && (
        <Button size="sm" onClick={action.onClick} className="w-full bg-success hover:bg-success/90 text-success-foreground gap-1.5">
          <ChevronRight className="h-3.5 w-3.5" /> {action.label}
        </Button>
      )}
    </CardContent>
  </Card>
);

const MethodTile = ({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) => (
  <button
    onClick={onClick}
    className={cn(
      "rounded-lg border p-3 text-left transition-all flex items-center gap-2.5",
      active ? "border-gold bg-gold/10 ring-1 ring-gold/40" : "border-border hover:border-gold/40 bg-card",
    )}
  >
    <Icon className={cn("h-4 w-4", active ? "text-gold" : "text-muted-foreground")} />
    <span className="text-sm font-medium text-foreground">{label}</span>
  </button>
);

const Row = ({ label, value, action }: { label: string; value: string; action?: React.ReactNode }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
    <span className="text-foreground font-medium flex items-center gap-2">
      {value} {action}
    </span>
  </div>
);

export default BuyerDashboard;