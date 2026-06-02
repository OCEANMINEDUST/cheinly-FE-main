import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MessageSquareMore, PackageX, RotateCcw, ShieldAlert, Undo2 } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { getBuyerOrderById } from "@/lib/orderMock";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FlowStructurePanel } from "@/components/marketplace/FlowStructurePanel";

type ResolutionOption = "refund-full" | "refund-partial" | "replacement" | "talk";

const resolutionOptions: Array<{
  id: ResolutionOption;
  label: string;
  description: string;
  icon: typeof Undo2;
}> = [
  { id: "refund-full", label: "Request Full Refund", description: "Release the entire protected amount back to the buyer after review.", icon: Undo2 },
  { id: "refund-partial", label: "Request Partial Refund", description: "Resolve with a negotiated refund while keeping the order active.", icon: ShieldAlert },
  { id: "replacement", label: "Request Replacement", description: "Ask the seller to replace the item while escrow remains locked.", icon: ShieldAlert },
  { id: "talk", label: "Talk to Seller/Rider", description: "Start a direct resolution conversation with the seller or the rider.", icon: MessageSquareMore },
];

const BuyerDispute = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const order = useMemo(() => getBuyerOrderById(params.get("orderId")), [params]);
  const productId = params.get("productId") ?? order.productId;
  const mode = params.get("mode") ?? "guest";
  const provider = params.get("provider") ?? "cheinly";
  const baseQuery = new URLSearchParams({ productId, orderId: order.id, entry: "secure-checkout", mode, provider }).toString();
  const initialSummary = params.get("summary") ? decodeURIComponent(params.get("summary") as string) : order.disputeSummary;
  const [selectedOption, setSelectedOption] = useState<ResolutionOption>("refund-full");
  const [summary, setSummary] = useState(initialSummary);

  const handleSubmit = () => {
    toast.success("Dispute report submitted. Funds remain locked until resolution.");
    if (selectedOption === "talk") {
      navigate(`/buyer/negotiation?${baseQuery}`);
    } else if (selectedOption === "refund-partial") {
      navigate(`/buyer/refund-partial?${baseQuery}`);
    } else if (selectedOption === "refund-full") {
      navigate(`/buyer/wrong-item?${baseQuery}`);
    } else {
      navigate(`/buyer/order?${baseQuery}`);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />

      <main className="mx-auto flex-1 w-full max-w-7xl px-5 py-8 lg:px-8 space-y-6">
        <FlowStructurePanel role="buyer" active="disputes" compact />

        <div className="space-y-2">
          <button onClick={() => navigate(`/buyer/authentication?${baseQuery}`)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> Back to verification
          </button>
          <h1 className="font-display text-4xl text-foreground">Dispute Resolution</h1>
          <p className="text-sm text-muted-foreground">Document the issue and choose the resolution path while escrow remains locked.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <section className="space-y-6">
            <Card className="shadow-card">
              <CardContent className="space-y-5 p-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Report summary</p>
                  <h2 className="mt-2 font-display text-2xl text-foreground">Auto-generated issue description</h2>
                </div>
                <Textarea value={summary} onChange={(event) => setSummary(event.target.value.slice(0, 600))} className="min-h-[160px] resize-none" />
                <p className="text-xs text-muted-foreground">Include mismatch details, packaging concerns, and rider handoff observations.</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="space-y-5 p-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Resolution options</p>
                  <h2 className="mt-2 font-display text-2xl text-foreground">Choose how this dispute should proceed</h2>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {resolutionOptions.map(({ id, label, description, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedOption(id)}
                      className={cn(
                        "rounded-lg border p-4 text-left transition-colors",
                        selectedOption === id ? "border-primary/40 bg-primary/10" : "border-border bg-card hover:bg-secondary/30",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("mt-0.5 flex h-9 w-9 items-center justify-center rounded-md", selectedOption === id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{label}</p>
                          <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card className="shadow-card">
              <CardContent className="space-y-4 p-5 text-sm">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Case metadata</p>
                  <h2 className="mt-2 font-display text-2xl text-foreground">Dispute snapshot</h2>
                </div>
                <div className="rounded-lg border border-border bg-secondary/40 p-4 space-y-3">
                  <DetailRow label="Order ID" value={order.id} />
                  <DetailRow label="Report ID" value={order.disputeReportId} />
                  <DetailRow label="Selected action" value={resolutionOptions.find((option) => option.id === selectedOption)?.label ?? "Request Full Refund"} stacked />
                </div>
                <div className="rounded-lg border border-gold/20 bg-gold/10 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="mt-0.5 h-4 w-4 text-gold" />
                    <div>
                      <p className="font-medium text-foreground">Funds are held and will not be released until resolved</p>
                      <p className="mt-1 text-xs text-muted-foreground">Resolution requires admin intervention or a mutual agreement between buyer and seller.</p>
                    </div>
                  </div>
                </div>
                <Button onClick={handleSubmit} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Submit Report</Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="space-y-3 p-5 text-sm">
                <div className="flex items-center gap-2 font-semibold text-foreground"><RotateCcw className="h-4 w-4 text-primary" /> Quick actions</div>
                <div className="grid gap-2">
                  <Button variant="outline" onClick={() => navigate(`/buyer/verify-items?${baseQuery}`)} className="justify-start border-border bg-card hover:bg-secondary">Re-check items</Button>
                  <Button variant="outline" onClick={() => navigate(`/buyer/wrong-item?${baseQuery}`)} className="justify-start border-border bg-card hover:bg-secondary"><PackageX className="mr-2 h-4 w-4" /> Wrong package?</Button>
                  <Button variant="outline" onClick={() => navigate(`/buyer/negotiation?${baseQuery}`)} className="justify-start border-border bg-card hover:bg-secondary"><MessageSquareMore className="mr-2 h-4 w-4" /> Open negotiation</Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <BuyerFooter variant="dashboard" />
    </div>
  );
};

const DetailRow = ({ label, value, stacked = false }: { label: string; value: string; stacked?: boolean }) => (
  <div className={stacked ? "space-y-1" : "flex items-start justify-between gap-3"}>
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-right text-foreground">{value}</span>
  </div>
);

export default BuyerDispute;