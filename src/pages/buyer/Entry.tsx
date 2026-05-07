import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import { getBuyerSession, buyerDashboardUrl } from "@/lib/buyerSession";

/**
 * Entry route for buyers redirected from WhatsApp.
 * Example: /buy?productId=MD-9521X
 * Briefly shows a "Securing checkout" splash, then forwards to the product page.
 */
const BuyerEntry = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const productId = params.get("productId") ?? params.get("id") ?? "MD-9521X";

  useEffect(() => {
    const session = getBuyerSession();
    const t = setTimeout(() => {
      if (session) {
        navigate(buyerDashboardUrl(session), { replace: true });
      } else {
        navigate(`/buyer/product?productId=${encodeURIComponent(productId)}`, { replace: true });
      }
    }, 900);
    return () => clearTimeout(t);
  }, [navigate, productId]);

  return (
    <div className="min-h-screen bg-background bg-hero flex items-center justify-center px-4">
      <div className="text-center space-y-4 animate-fade-in">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/15 flex items-center justify-center">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-display text-3xl text-foreground">Securing your checkout…</h1>
        <p className="text-muted-foreground text-sm">
          Looking up product <span className="text-gold font-mono">{productId}</span>
        </p>
        <Loader2 className="h-5 w-5 text-gold animate-spin mx-auto" />
      </div>
    </div>
  );
};

export default BuyerEntry;