import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BadgeCheck, Lock, ShieldCheck, ShoppingCart, Truck, RotateCcw, Gem, Ruler } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { mockProduct, formatNaira } from "@/lib/buyerMock";
import { MoreFromThisSeller } from "@/components/buyer/MoreFromThisSeller";

const perkIcons = [Truck, RotateCcw, Gem, Ruler];

const BuyerProduct = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const productId = params.get("productId") ?? mockProduct.id;
  const [activeImg, setActiveImg] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.title = `${mockProduct.name} • Cheinly`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", mockProduct.description.slice(0, 155));
  }, []);

  const galleryImage = useMemo(() => mockProduct.thumbs[activeImg] ?? mockProduct.image, [activeImg]);

  const checkoutParams = new URLSearchParams({
    productId,
    entry: "secure-checkout",
  });

  const handleGuest = () => {
    setOpen(false);
    checkoutParams.set("mode", "guest");
    navigate(`/buyer/shipping?${checkoutParams.toString()}`);
  };

  const handleGoogle = () => {
    setOpen(false);
    checkoutParams.set("mode", "google");
    navigate(`/buyer/shipping?${checkoutParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="checkout" />

      <main className="flex-1 mx-auto w-full max-w-7xl px-5 lg:px-8 py-8">
        <nav className="text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-gold">Home</Link> · <span>Footwear</span> · <span className="text-foreground">{mockProduct.name}</span>
          <span className="ml-3 text-gold/80">ref {productId}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-card shadow-card overflow-hidden flex items-center justify-center">
              <img src={galleryImage} alt={mockProduct.name} className="w-full h-full object-cover" width={1024} height={1024} />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {mockProduct.thumbs.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square rounded-lg overflow-hidden ring-1 transition-all ${
                    i === activeImg ? "ring-2 ring-gold" : "ring-border hover:ring-gold/50"
                  }`}
                >
                  <img src={src} alt={`view ${i + 1}`} className="w-full h-full object-cover" loading="lazy" width={200} height={200} />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <Badge variant="outline" className="gap-1.5 border-primary/40 text-primary">
              <BadgeCheck className="h-3 w-3" /> Verified Seller
            </Badge>
            <h1 className="font-display text-5xl lg:text-6xl text-foreground leading-[1.05]">
              {mockProduct.name}
            </h1>
            <div className="flex items-end gap-3">
              <span className="font-display text-4xl text-gold">{formatNaira(mockProduct.price)}</span>
              <span className="text-muted-foreground line-through text-lg mb-1">{formatNaira(mockProduct.originalPrice)}</span>
              <Badge className="bg-success text-success-foreground mb-1">{mockProduct.discountPct}% OFF</Badge>
            </div>
            <p className="text-muted-foreground leading-relaxed">{mockProduct.description}</p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {mockProduct.perks.map((perk, i) => {
                const Icon = perkIcons[i] ?? BadgeCheck;
                return (
                  <div key={perk} className="flex items-center gap-2 text-sm text-foreground">
                    <Icon className="h-4 w-4 text-primary" /> {perk}
                  </div>
                );
              })}
            </div>

            <Button
              size="lg"
              onClick={() => setOpen(true)}
              className="w-full h-14 text-base bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-glow"
            >
              <ShoppingCart className="h-5 w-5" />
              Buy Now via Protected Balance
            </Button>

            <div className="rounded-xl border border-success/30 bg-success/10 p-4 flex gap-3">
              <ShieldCheck className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Secured by Cheinly Protected Balance</p>
                <p className="text-muted-foreground text-xs mt-0.5">Funds are held safely until you confirm delivery and quality.</p>
              </div>
            </div>

            <p className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" /> SECURE CHECKOUT
            </p>
          </div>
        </div>

        {/* How it works */}
        <section className="mt-20 border-t border-border pt-12">
          <h2 className="font-display text-3xl text-center text-foreground mb-10">
            How <span className="text-gold">Protected Balance</span> Works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { n: 1, t: "Pay Securely", d: "Your payment is held in a secure Cheinly escrow account." },
              { n: 2, t: "Seller Ships", d: "The seller sends your item. Track it directly within your dashboard." },
              { n: 3, t: "Release Funds", d: "Funds are only released to the seller after you confirm satisfaction." },
            ].map((s) => (
              <div key={s.n} className="text-center space-y-2">
                <div className="mx-auto h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-gold font-display text-xl">
                  {s.n}
                </div>
                <p className="font-medium text-foreground">{s.t}</p>
                <p className="text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        <MoreFromThisSeller
          sellerUsername="globalsneakers"
          excludeProductId={productId}
          sellerNameOverride={mockProduct.seller.name}
        />
      </main>

      <BuyerFooter variant="checkout" />

      {/* Secure Checkout Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="items-center text-center space-y-3">
            <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="font-display text-2xl">Secure Checkout</DialogTitle>
            <DialogDescription>
              Sign in to complete your purchase and activate your Protected Balance coverage.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <Button onClick={handleGoogle} variant="outline" className="w-full h-11 gap-2 border-border">
              <GoogleG /> Continue with Google
            </Button>
            <div className="relative text-center">
              <span className="text-xs text-muted-foreground bg-card px-2 relative z-10">or</span>
              <span className="absolute inset-x-0 top-1/2 h-px bg-border -z-0" />
            </div>
            <button
              onClick={handleGuest}
              className="w-full text-sm text-foreground hover:text-gold transition-colors py-2"
            >
              Continue as guest
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const GoogleG = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
  </svg>
);

export default BuyerProduct;