import { Link, useNavigate, useParams } from "react-router-dom";
import { ShieldCheck, MessageCircle, Store, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { formatNaira, getProductById, getSellerByUsername, productLink } from "@/lib/storefront";
import { rememberBuyer } from "@/lib/buyerSession";

export default function ProductPublic() {
  const { productId = "" } = useParams();
  const nav = useNavigate();
  const product = getProductById(productId);
  const seller = product ? getSellerByUsername(product.sellerUsername) : undefined;

  if (!product || !seller) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-6 text-center">
        <Card className="max-w-md p-8">
          <h1 className="font-display text-2xl">Product not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">ID “{productId}” does not match any active listing.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Button asChild variant="outline"><Link to="/chat">Try Chat lookup</Link></Button>
            <Button asChild><Link to="/">Go home</Link></Button>
          </div>
        </Card>
      </div>
    );
  }

  const buyViaEscrow = () => {
    rememberBuyer({ name: "Guest Buyer", email: "guest@cheinly.app", productId: product.id });
    nav(`/buyer/dashboard?productId=${encodeURIComponent(product.id)}&entry=public-product&mode=guest&provider=cheinly`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-gold/10">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
          <Link to="/" className="font-display text-xl text-gold">CHEINLY</Link>
          <Badge variant="outline" className="border-primary/40 text-primary"><ShieldCheck className="mr-1 h-3 w-3" /> Escrow secured</Badge>
        </div>
      </header>

      <main className="mx-auto grid max-w-4xl gap-8 px-5 py-10 md:grid-cols-2">
        <Card className="overflow-hidden">
          <img src={product.image} alt={product.name} className="h-72 w-full object-cover md:h-full" />
        </Card>

        <div className="space-y-5">
          <div>
            <p className="font-mono text-xs text-muted-foreground">{product.id}</p>
            <h1 className="mt-1 font-display text-3xl">{product.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
            <p className="mt-3 font-display text-3xl text-primary">{formatNaira(product.price)}</p>
          </div>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Seller</p>
                <p className="font-medium">{seller.name}</p>
                <p className="text-xs text-muted-foreground">@{seller.username}</p>
              </div>
              <Button asChild variant="outline" size="sm"><Link to={`/u/${seller.username}`}><Store className="mr-1 h-4 w-4" /> View store</Link></Button>
            </div>
          </Card>

          <div className="grid gap-2 sm:grid-cols-2">
            <Button onClick={buyViaEscrow} className="bg-gold-gradient text-gold-foreground hover:opacity-90"><Lock className="mr-2 h-4 w-4" /> Buy via Escrow</Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <a href={`https://wa.me/${seller.phone}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name} (${product.id}) on Cheinly.`)}`} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" /> Chat on WhatsApp
              </a>
            </Button>
          </div>

          <Card className="p-4">
            <p className="mb-2 text-sm font-medium">Share this product</p>
            <ShareButtons url={productLink(product.id)} title={`${product.name} on Cheinly — ${formatNaira(product.price)}`} compact />
          </Card>
        </div>
      </main>
    </div>
  );
}