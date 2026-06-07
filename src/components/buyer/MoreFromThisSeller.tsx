import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNaira, getProductsBySeller, getSellerByUsername } from "@/lib/storefront";

type Props = {
  sellerUsername: string;
  excludeProductId?: string;
  sellerNameOverride?: string;
};

export const MoreFromThisSeller = ({ sellerUsername, excludeProductId, sellerNameOverride }: Props) => {
  const seller = getSellerByUsername(sellerUsername);
  const all = getProductsBySeller(sellerUsername).filter((p) => p.id !== excludeProductId);
  // Randomize when no ranking data, then take 3–6
  const picks = [...all].sort(() => Math.random() - 0.5).slice(0, 6);

  if (picks.length === 0) return null;

  const sellerName = sellerNameOverride ?? seller?.name ?? sellerUsername;

  return (
    <section className="mt-20 border-t border-border pt-12">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">More From This Seller</p>
          <h2 className="mt-1 font-display text-2xl text-foreground">Sold by {sellerName}</h2>
        </div>
        <Button asChild variant="ghost" className="text-gold hover:text-gold">
          <Link to={`/buyer/seller/${sellerUsername}`}>
            View All Products <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {picks.map((p) => (
          <Card key={p.id} className="overflow-hidden border-border/60 bg-card/60 backdrop-blur transition-all hover:border-gold/40 hover:shadow-card">
            <img src={p.image} alt={p.name} className="h-40 w-full object-cover" loading="lazy" />
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-foreground line-clamp-2">{p.name}</h3>
                <Badge variant="outline" className="shrink-0 border-success/40 text-success">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> In stock
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-display text-lg text-gold">{formatNaira(p.price)}</span>
                <Button asChild size="sm">
                  <Link to={`/buyer/product?productId=${encodeURIComponent(p.id)}`}>View Product</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};