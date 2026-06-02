import { useSearchParams } from "react-router-dom";
import { ArrowDownLeft, ArrowUpRight, Lock, Unlock } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNaira } from "@/lib/buyerMock";
import { cn } from "@/lib/utils";
import { FlowStructurePanel } from "@/components/marketplace/FlowStructurePanel";

type Tx = {
  id: string;
  date: string;
  label: string;
  ref: string;
  amount: number;
  type: "fund" | "escrow-hold" | "release" | "refund";
  status: "completed" | "pending";
};

const txns: Tx[] = [
  { id: "TXN-9981", date: "17 Oct, 10:45", label: "Funded Protected Balance", ref: "FUND-9981", amount: 45000, type: "fund", status: "completed" },
  { id: "TXN-9982", date: "17 Oct, 10:46", label: "Escrow hold — Premium Sneakers", ref: "ORD-521-450", amount: -45000, type: "escrow-hold", status: "completed" },
  { id: "TXN-9970", date: "12 Aug, 20:21", label: "Funded Protected Balance", ref: "FUND-9970", amount: 27000, type: "fund", status: "completed" },
  { id: "TXN-9971", date: "12 Aug, 20:26", label: "Escrow hold — ChainLink 3000s", ref: "ORD-887-640", amount: -27000, type: "escrow-hold", status: "pending" },
  { id: "TXN-8845", date: "24 Oct '23, 14:45", label: "Released to seller", ref: "ORD-527-456", amount: -47500, type: "release", status: "completed" },
  { id: "TXN-8800", date: "20 Oct '23, 09:11", label: "Refund returned to wallet", ref: "DSP-001", amount: 12000, type: "refund", status: "completed" },
];

const tone: Record<Tx["type"], string> = {
  fund: "bg-success/10 text-success border-success/20",
  "escrow-hold": "bg-primary/10 text-primary border-primary/20",
  release: "bg-gold/15 text-gold border-gold/30",
  refund: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const Icon = ({ t }: { t: Tx["type"] }) => {
  if (t === "fund") return <ArrowDownLeft className="h-4 w-4" />;
  if (t === "refund") return <ArrowDownLeft className="h-4 w-4" />;
  if (t === "release") return <Unlock className="h-4 w-4" />;
  return <Lock className="h-4 w-4" />;
};

const BuyerTransactions = () => {
  const [params] = useSearchParams();
  const q = params.get("q")?.toLowerCase() ?? "";
  const list = q ? txns.filter((t) => [t.label, t.ref, t.id].some((v) => v.toLowerCase().includes(q))) : txns;

  const totalIn = list.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = list.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />
      <main className="flex-1 mx-auto w-full max-w-7xl px-5 lg:px-8 py-8 space-y-6">
        <header>
          <h1 className="font-display text-3xl">Transactions</h1>
          <p className="text-sm text-muted-foreground">Every move in and out of your Protected Balance.</p>
        </header>

        <FlowStructurePanel role="buyer" active="transactions" compact />

        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="p-4"><p className="text-xs text-muted-foreground">Money in</p><p className="font-display text-2xl text-success">{formatNaira(totalIn)}</p></Card>
          <Card className="p-4"><p className="text-xs text-muted-foreground">Money out (escrow + payouts)</p><p className="font-display text-2xl text-primary">{formatNaira(totalOut)}</p></Card>
          <Card className="p-4"><p className="text-xs text-muted-foreground">Transactions</p><p className="font-display text-2xl">{list.length}</p></Card>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Description</th>
                  <th className="text-left p-4">Reference</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-right p-4">Amount</th>
                  <th className="text-right p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((t) => (
                  <tr key={t.id} className="border-t border-border hover:bg-secondary/30">
                    <td className="p-4 text-muted-foreground">{t.date}</td>
                    <td className="p-4 font-medium">
                      <div className="flex items-center gap-2"><Icon t={t.type} /> {t.label}</div>
                    </td>
                    <td className="p-4 text-gold font-mono text-xs">{t.ref}</td>
                    <td className="p-4"><Badge variant="outline" className={cn(tone[t.type])}>{t.type.replace("-", " ")}</Badge></td>
                    <td className={cn("p-4 text-right font-semibold", t.amount > 0 ? "text-success" : "text-foreground")}>
                      {t.amount > 0 ? "+" : ""}{formatNaira(t.amount)}
                    </td>
                    <td className="p-4 text-right">
                      <Badge className={t.status === "completed" ? "bg-success/10 text-success border-success/20" : "bg-gold/15 text-gold border-gold/30"} variant="outline">
                        {t.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
      <BuyerFooter variant="dashboard" />
    </div>
  );
};

export default BuyerTransactions;