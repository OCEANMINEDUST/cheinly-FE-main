import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, FileText, MessageCircle, Send, ShieldCheck, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShareButtons } from "@/components/shared/ShareButtons";
import { bioLink, formatNaira, getProductById, getProductsBySeller, getSellerByUsername } from "@/lib/storefront";

export default function BioStore() {
  const { username = "" } = useParams();
  const nav = useNavigate();
  const seller = getSellerByUsername(username);
  const products = seller ? getProductsBySeller(seller.username) : [];
  const [pid, setPid] = useState("");

  if (!seller) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-6 text-center">
        <Card className="max-w-md p-8">
          <h1 className="font-display text-2xl">Store not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">The link @{username} is not a Cheinly store.</p>
          <Button asChild className="mt-4"><Link to="/">Go home</Link></Button>
        </Card>
      </div>
    );
  }

  const onLookup = () => {
    const id = pid.trim();
    if (!id) return;
    const found = getProductById(id);
    if (found) nav(`/p/${found.id}`);
    else nav(`/chat?pid=${encodeURIComponent(id)}&error=notfound`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-gold/10">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2 font-display text-xl text-gold">CHEINLY</Link>
          <Badge variant="outline" className="border-primary/40 text-primary"><ShieldCheck className="mr-1 h-3 w-3" /> Escrow-protected store</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10">
        <section className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gold-gradient text-gold-foreground"><Store className="h-7 w-7" /></div>
          <h1 className="mt-4 font-display text-3xl">{seller.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{seller.bio}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">@{seller.username}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <a href={`https://wa.me/${seller.phone}`} target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> Chat on WhatsApp</a>
            </Button>
            {seller.telegram && (
              <Button asChild variant="outline">
                <a href={`https://t.me/${seller.telegram}?start=store_${seller.username}`} target="_blank" rel="noreferrer"><Send className="mr-2 h-4 w-4" /> Open Telegram Store</a>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link to={`/buyer/packing-slip?seller=${encodeURIComponent(seller.username)}`}>
                <FileText className="mr-2 h-4 w-4" /> Generate packing slip
              </Link>
            </Button>
          </div>
          <div className="mt-4 flex justify-center"><ShareButtons url={bioLink(seller.username)} title={`Shop ${seller.name} on Cheinly`} compact /></div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 font-display text-xl">Products</h2>
          {products.length === 0 ? (
            <Card className="p-6 text-center text-sm text-muted-foreground">This seller hasn't posted products yet.</Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {products.map((p) => (
                <Card key={p.id} className="overflow-hidden">
                  <img src={p.image} alt={p.name} className="h-40 w-full object-cover" />
                  <CardHeader className="pb-2"><CardTitle className="text-base">{p.name}</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg">{formatNaira(p.price)}</span>
                      <Button asChild size="sm"><Link to={`/p/${p.id}`}>View <ArrowRight className="ml-1 h-3 w-3" /></Link></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <Card className="p-5">
            <h3 className="font-display text-lg">Have a Product ID?</h3>
            <p className="text-sm text-muted-foreground">Paste a Product ID from Instagram, TikTok or Telegram to open it directly.</p>
            <div className="mt-3 flex gap-2">
              <Input placeholder="e.g. PRD_83921" value={pid} onChange={(e) => setPid(e.target.value)} />
              <Button onClick={onLookup}>Open</Button>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}