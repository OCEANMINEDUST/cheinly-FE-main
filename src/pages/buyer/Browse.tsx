import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, ShieldCheck, Store, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/cheinly-logo.jpeg";
import { allProducts, formatNaira, getSellerByUsername } from "@/lib/storefront";
import { getBuyerSession } from "@/lib/buyerSession";

const BuyerBrowse = () => {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const session = getBuyerSession();

  const products = useMemo(() => {
    const list = allProducts();
    if (!q.trim()) return list;
    const needle = q.trim().toLowerCase();
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        p.sellerUsername.toLowerCase().includes(needle),
    );
  }, [q]);

  const openProduct = (id: string) => {
    // Signed-in buyers go straight to the gated buyer product page;
    // visitors see the public product page so they can still browse safely.
    if (session) {
      nav(`/buyer/product?productId=${encodeURIComponent(id)}`);
    } else {
      nav(`/p/${encodeURIComponent(id)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Cheinly logo" className="h-9 w-9 rounded-lg object-cover ring-1 ring-gold/40" />
            <span className="font-display text-2xl tracking-wider text-gold">CHEINLY</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {session ? (
              <Button asChild variant="hero" size="sm">
                <Link to="/buyer/dashboard?entry=secure-checkout">
                  My dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="hero" size="sm">
                <Link to="/buyer/login">
                  <UserCircle className="h-4 w-4" /> Sign in
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <section className="border-b border-border/50 bg-card/30 py-10">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Badge variant="outline" className="mb-3 border-gold/40 text-gold">
            <ShieldCheck className="mr-1 h-3 w-3" /> Escrow-protected marketplace
          </Badge>
          <h1 className="font-display text-4xl text-foreground md:text-5xl">
            Browse products from <span className="text-gold">verified sellers</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Discover listings from sellers and suppliers across Cheinly. Sign in to checkout, track orders, and sync across devices.
          </p>
          <div className="relative mx-auto mt-6 max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by product, description, or seller"
              className="h-12 pl-10"
            />
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6">
          {products.length === 0 ? (
            <p className="py-16 text-center text-muted-foreground">No products match “{q}”.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => {
                const seller = getSellerByUsername(p.sellerUsername);
                return (
                  <Card key={p.id} className="overflow-hidden border-border/60 transition-all hover:border-gold/40 hover:shadow-glow">
                    <button onClick={() => openProduct(p.id)} className="block w-full text-left">
                      <div className="aspect-[4/3] overflow-hidden bg-secondary/30">
                        <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform hover:scale-105" loading="lazy" />
                      </div>
                      <CardContent className="space-y-2 p-4">
                        <p className="font-mono text-[10px] text-muted-foreground">{p.id}</p>
                        <h3 className="line-clamp-2 font-display text-lg text-foreground">{p.name}</h3>
                        <p className="line-clamp-2 text-xs text-muted-foreground">{p.description}</p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="font-display text-xl text-primary">{formatNaira(p.price)}</span>
                          {!p.inStock && <Badge variant="outline" className="border-destructive/40 text-destructive">Out of stock</Badge>}
                        </div>
                        {seller && (
                          <p className="flex items-center gap-1 pt-1 text-xs text-muted-foreground">
                            <Store className="h-3 w-3" /> {seller.name}
                          </p>
                        )}
                      </CardContent>
                    </button>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BuyerBrowse;