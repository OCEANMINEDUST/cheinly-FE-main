import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNaira, getMoreFromSellerProducts, getProductsBySeller, getSellerByUsername } from "@/lib/storefront";
import { trackEvent } from "@/lib/analytics";

type Props = {
  sellerUsername: string;
  excludeProductId?: string;
  sellerNameOverride?: string;
  getProductPath?: (productId: string) => string;
};

export const MoreFromThisSeller = ({
  sellerUsername,
  excludeProductId,
  sellerNameOverride,
  getProductPath = (productId) => `/buyer/product?productId=${encodeURIComponent(productId)}`,
}: Props) => {
  const seller = getSellerByUsername(sellerUsername);
  const all = getProductsBySeller(sellerUsername).filter((p) => p.id.toLowerCase() !== excludeProductId?.toLowerCase());
  const picks = getMoreFromSellerProducts(sellerUsername, excludeProductId, 6);

  if (picks.length < 3) return null;

  const sellerName = sellerNameOverride ?? seller?.name ?? sellerUsername;

  const handleViewAllClick = () => {
    trackEvent("view_all_products_click", {
      seller_username: sellerUsername,
      seller_name: sellerName,
      product_count: all.length,
    });
  };

  const handleProductClick = (productId: string, productName: string) => {
    trackEvent("more_from_seller_click", {
      seller_username: sellerUsername,
      seller_name: sellerName,
      product_id: productId,
      product_name: productName,
    });
  };

  return (
    <section className="mt-16 border-t border-border pt-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">More From This Seller</p>
          <h2 className="mt-1 font-display text-2xl text-foreground">Sold by {sellerName}</h2>
        </div>
        <Button asChild variant="ghost" className="text-gold hover:text-gold" onClick={handleViewAllClick}>
          <Link to={`/buyer/seller/${sellerUsername}`}>
            View All Products <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {picks.map((p) => (
          <Card key={p.id} className="overflow-hidden border-border/60 bg-card/60 backdrop-blur transition-all hover:border-gold/40 hover:shadow-card">
            <Link to={getProductPath(p.id)} onClick={() => handleProductClick(p.id, p.name)}>
              <img src={p.image} alt={p.name} className="h-40 w-full object-cover" loading="lazy" />
            </Link>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <Link
                  to={getProductPath(p.id)}
                  onClick={() => handleProductClick(p.id, p.name)}
                  className="font-medium text-foreground line-clamp-2 hover:underline"
                >
                  {p.name}
                </Link>
                <Badge
                  variant="outline"
                  className={p.inStock ? "shrink-0 border-success/40 text-success" : "shrink-0 border-muted-foreground/30 text-muted-foreground"}
                >
                  {p.inStock ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <Clock3 className="mr-1 h-3 w-3" />}
                  {p.inStock ? "In stock" : "Restocking"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-display text-lg text-gold">{formatNaira(p.price)}</span>
                <Button asChild size="sm" onClick={() => handleProductClick(p.id, p.name)}>
                  <Link to={getProductPath(p.id)}>View Product</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
