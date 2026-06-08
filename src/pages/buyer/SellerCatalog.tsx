import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock3, Search, Store } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNaira, getProductsBySeller, getSellerByUsername, rankSellerProducts } from "@/lib/storefront";

const SellerCatalog = () => {
  const { username = "" } = useParams();
  const seller = getSellerByUsername(username);
  const products = useMemo(() => rankSellerProducts(getProductsBySeller(username)), [username]);
  const [q, setQ] = useState("");

  const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="checkout" />
      <main className="flex-1 mx-auto w-full max-w-7xl px-5 lg:px-8 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gold-gradient text-gold-foreground">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Seller Catalog</p>
              <h1 className="font-display text-3xl text-foreground">{seller?.name ?? `@${username}`}</h1>
              <p className="text-sm text-muted-foreground">
                {products.length} active product{products.length === 1 ? "" : "s"}
                {q ? ` • ${filtered.length} matching` : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="pl-9" />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <Card key={p.id} className="overflow-hidden border-border/60 transition-all hover:border-gold/40 hover:shadow-card">
              <img src={p.image} alt={p.name} className="h-40 w-full object-cover" />
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-foreground line-clamp-2">{p.name}</h3>
                  <Badge
                    variant="outline"
                    className={p.inStock ? "shrink-0 border-success/40 text-success" : "shrink-0 border-muted-foreground/30 text-muted-foreground"}
                  >
                    {p.inStock ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <Clock3 className="mr-1 h-3 w-3" />}
                    {p.inStock ? "In stock" : "Restocking"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg text-gold">{formatNaira(p.price)}</span>
                  <Button asChild size="sm">
                    <Link to={`/p/${encodeURIComponent(p.id)}`}>
                      View <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card className="col-span-full p-6 text-center text-sm text-muted-foreground">
              No products match your search.
            </Card>
          )}
        </div>
      </main>
      <BuyerFooter variant="checkout" />
    </div>
  );
};

export default SellerCatalog;