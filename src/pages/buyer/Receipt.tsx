import { useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Download, Printer } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatNaira, mockBuyer } from "@/lib/buyerMock";
import { getBuyerOrderById, getOrderGrandTotal } from "@/lib/orderMock";
import { toast } from "sonner";

const BuyerReceipt = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [downloading, setDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const order = useMemo(() => getBuyerOrderById(params.get("orderId")), [params]);
  const productId = params.get("productId") ?? order.productId;
  const mode = params.get("mode") ?? "guest";
  const provider = params.get("provider") ?? "cheinly";
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = getOrderGrandTotal(order);

  const handleDownloadPdf = async () => {
    if (!receiptRef.current || downloading) return;

    try {
      setDownloading(true);
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      const image = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(image, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${order.shortRef.replace("#", "")}-receipt.pdf`);
      toast.success("Receipt exported as PDF.");
    } catch {
      toast.error("Could not export receipt right now.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />

      <main className="mx-auto flex-1 w-full max-w-5xl px-5 py-8 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button onClick={() => navigate(`/buyer/order?productId=${encodeURIComponent(productId)}&orderId=${order.id}&entry=secure-checkout&mode=${mode}&provider=${provider}`)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> Back to Order Details
          </button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.print()} className="gap-2 border-border bg-card hover:bg-secondary">
              <Printer className="h-4 w-4" /> Print PDF
            </Button>
            <Button onClick={handleDownloadPdf} disabled={downloading} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-70">
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        </div>

        <Card ref={receiptRef} className="mx-auto max-w-4xl shadow-card print:shadow-none">
          <CardContent className="space-y-8 p-8 md:p-10">
            <div className="flex flex-col gap-6 border-b border-border pb-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-display text-3xl text-foreground">Cheinly</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Secure commerce infrastructure</p>
              </div>
              <div className="text-left md:text-right">
                <p className="font-display text-3xl text-foreground">Transaction Receipt</p>
                <p className="text-xs text-muted-foreground">Official document</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 text-sm">
              <Meta label="Transaction ID" value={order.id} />
              <Meta label="Transaction Date" value={order.placedAt} />
              <Meta label="Payment Method" value={order.paymentMethod} tone="success" />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <InfoCard
                title="Sender Details"
                lines={[mockBuyer.name, mockBuyer.email, mockBuyer.phone, mockBuyer.address]}
              />
              <InfoCard
                title="Receiver Details"
                lines={[order.sellerName, "billing@techmart.com", order.sellerLocation, "Verified seller"]}
              />
            </div>

            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Purchase Breakdown</p>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50 text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Item Name</th>
                      <th className="px-4 py-3">Quantity</th>
                      <th className="px-4 py-3">Unit Price</th>
                      <th className="px-4 py-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id} className="border-t border-border">
                        <td className="px-4 py-4">
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                        </td>
                        <td className="px-4 py-4 text-foreground">{String(item.quantity).padStart(2, "0")}</td>
                        <td className="px-4 py-4 text-foreground">{formatNaira(item.price)}</td>
                        <td className="px-4 py-4 text-right font-semibold text-foreground">{formatNaira(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="ml-auto max-w-sm space-y-3 text-sm">
              <CalcRow label="Subtotal" value={formatNaira(subtotal)} />
              <CalcRow label="Delivery Fee" value={formatNaira(order.shippingFee)} />
              <CalcRow label="Insurance (Escrow)" value={formatNaira(Math.round(total * 0.015))} />
              <div className="flex items-center justify-between border-t border-border pt-4 text-lg font-semibold">
                <span className="text-foreground">Total Amount</span>
                <span className="text-success">{formatNaira(total)}</span>
              </div>
            </div>

            <div className="border-t border-border pt-6 text-sm text-muted-foreground">
              Thank you for choosing Cheinly. This receipt confirms your payment was protected through escrow-backed checkout.
            </div>
          </CardContent>
        </Card>
      </main>

      <BuyerFooter variant="dashboard" />
    </div>
  );
};

const Meta = ({ label, value, tone }: { label: string; value: string; tone?: "success" }) => (
  <div>
    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
    <p className={tone === "success" ? "mt-2 font-semibold text-success" : "mt-2 font-semibold text-foreground"}>{value}</p>
  </div>
);

const InfoCard = ({ title, lines }: { title: string; lines: string[] }) => (
  <div className="rounded-lg border border-border bg-secondary/40 p-5 text-sm">
    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
    <div className="mt-3 space-y-1">
      {lines.map((line) => (
        <p key={line} className="text-foreground first:font-semibold first:text-foreground">{line}</p>
      ))}
    </div>
  </div>
);

const CalcRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);

export default BuyerReceipt;