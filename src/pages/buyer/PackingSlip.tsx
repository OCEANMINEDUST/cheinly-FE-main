import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, FileText, Printer } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNaira, getProductsBySeller, getSellerByUsername } from "@/lib/storefront";
import { mockBuyer } from "@/lib/buyerMock";

const PackingSlip = () => {
  const [params] = useSearchParams();
  const username = params.get("seller") ?? "globalsneakers";
  const seller = getSellerByUsername(username);
  const products = useMemo(() => getProductsBySeller(username), [username]);

  const [qty, setQty] = useState<Record<string, number>>(() =>
    Object.fromEntries(products.map((p) => [p.id, 0])),
  );
  const [note, setNote] = useState("");
  const slipNo = useMemo(() => `PS-${Date.now().toString(36).toUpperCase()}`, []);
  const today = new Date().toLocaleDateString();

  const selected = products.filter((p) => (qty[p.id] ?? 0) > 0);
  const subtotal = selected.reduce((s, p) => s + p.price * (qty[p.id] ?? 0), 0);

  if (!seller) {
    return (
      <div className="min-h-screen bg-background grid place-items-center p-6">
        <Card className="max-w-md p-6 text-center">
          <h1 className="font-display text-2xl">Seller not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">No seller matches “{username}”.</p>
          <Button asChild className="mt-4"><Link to="/buyer/dashboard">Back to dashboard</Link></Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <div className="print:hidden">
        <BuyerHeader variant="checkout" />
      </div>

      <main className="flex-1 mx-auto w-full max-w-5xl px-5 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Button asChild variant="ghost" size="sm">
            <Link to={`/buyer/seller/${username}`}><ArrowLeft className="mr-1 h-4 w-4" /> Back to catalog</Link>
          </Button>
          <Button onClick={() => window.print()} className="bg-primary text-primary-foreground">
            <Printer className="mr-2 h-4 w-4" /> Print packing slip
          </Button>
        </div>

        {/* Builder */}
        <Card className="mb-8 print:hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gold" />
              <h2 className="font-display text-xl">Select items from {seller.name}</h2>
            </div>
            <div className="divide-y divide-border rounded-md border">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-3">
                  <Checkbox
                    checked={(qty[p.id] ?? 0) > 0}
                    onCheckedChange={(v) => setQty((s) => ({ ...s, [p.id]: v ? Math.max(s[p.id] ?? 0, 1) : 0 }))}
                  />
                  <img src={p.image} alt="" className="h-12 w-12 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.id} · {formatNaira(p.price)}</p>
                  </div>
                  <Input
                    type="number"
                    min={0}
                    value={qty[p.id] ?? 0}
                    onChange={(e) => setQty((s) => ({ ...s, [p.id]: Math.max(0, Number(e.target.value || 0)) }))}
                    className="w-20"
                  />
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="note">Notes for seller (optional)</Label>
              <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Gift wrapping, fragile, etc." className="mt-1" />
            </div>
          </CardContent>
        </Card>

        {/* Printable slip */}
        <Card className="print:border-0 print:shadow-none">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <p className="font-display text-3xl text-gold">CHEINLY</p>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Packing Slip</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-mono">{slipNo}</p>
                <p className="text-muted-foreground">{today}</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">From (Seller)</p>
                <p className="mt-1 font-medium">{seller.name}</p>
                <p className="text-sm text-muted-foreground">@{seller.username}</p>
                <p className="text-sm text-muted-foreground">+{seller.phone}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Ship To (Buyer)</p>
                <p className="mt-1 font-medium">{mockBuyer.name}</p>
                <p className="text-sm text-muted-foreground">{mockBuyer.address}</p>
                <p className="text-sm text-muted-foreground">{mockBuyer.phone}</p>
              </div>
            </div>

            <div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2">Item</th>
                    <th className="py-2">SKU</th>
                    <th className="py-2 text-right">Qty</th>
                    <th className="py-2 text-right">Unit</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.length === 0 ? (
                    <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">Select items above to populate the slip.</td></tr>
                  ) : selected.map((p) => (
                    <tr key={p.id} className="border-b">
                      <td className="py-2">{p.name}</td>
                      <td className="py-2 font-mono text-xs">{p.id}</td>
                      <td className="py-2 text-right">{qty[p.id]}</td>
                      <td className="py-2 text-right">{formatNaira(p.price)}</td>
                      <td className="py-2 text-right">{formatNaira(p.price * (qty[p.id] ?? 0))}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="pt-3 text-right text-sm text-muted-foreground">Subtotal</td>
                    <td className="pt-3 text-right font-display text-lg text-gold">{formatNaira(subtotal)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {note && (
              <div className="rounded-md border bg-muted/30 p-3 text-sm">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Notes</p>
                <p className="mt-1">{note}</p>
              </div>
            )}

            <p className="text-center text-xs text-muted-foreground border-t pt-4">
              Escrow-protected via Cheinly · Funds release on confirmed delivery.
            </p>
          </CardContent>
        </Card>
      </main>

      <div className="print:hidden">
        <BuyerFooter variant="checkout" />
      </div>
    </div>
  );
};

export default PackingSlip;