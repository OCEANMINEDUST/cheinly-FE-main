import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Send, Bot, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatNaira, getProductById, getSellerByUsername } from "@/lib/storefront";

type Msg = { id: string; from: "bot" | "user"; text: string; node?: React.ReactNode };

const idFromText = (t: string) => {
  const m = t.match(/PRD[_-]?[A-Z0-9]{4,}/i);
  return m ? m[0].toUpperCase().replace("-", "_") : t.trim().toUpperCase();
};

export default function ChatPage() {
  const [params] = useSearchParams();
  const initialPid = params.get("pid") || "";
  const initialError = params.get("error") === "notfound";
  const [messages, setMessages] = useState<Msg[]>([
    { id: "m0", from: "bot", text: "Hi 👋 Paste a Product ID from Instagram / TikTok / Telegram (e.g. PRD_83921) and I'll pull up the product and seller for you." },
  ]);
  const [input, setInput] = useState(initialPid);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [messages]);

  const lookup = (raw: string) => {
    const id = idFromText(raw);
    const user: Msg = { id: crypto.randomUUID(), from: "user", text: raw };
    const product = getProductById(id);
    if (!product) {
      setMessages((m) => [...m, user, { id: crypto.randomUUID(), from: "bot", text: `I couldn't find a product with ID "${id}". Double-check the ID or paste another one.` }]);
      return;
    }
    const seller = getSellerByUsername(product.sellerUsername);
    const card = (
      <Card className="mt-2 overflow-hidden">
        <img src={product.image} alt={product.name} className="h-32 w-full object-cover" />
        <div className="space-y-2 p-3">
          <p className="font-medium">{product.name}</p>
          <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between"><span className="font-display text-lg text-primary">{formatNaira(product.price)}</span><Badge variant="outline">{product.id}</Badge></div>
          <div className="text-xs text-muted-foreground">Seller: {seller?.name} (@{seller?.username})</div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button asChild size="sm"><Link to={`/p/${product.id}`}>Open product</Link></Button>
            {seller && <Button asChild size="sm" variant="outline"><Link to={`/u/${seller.username}`}>View store</Link></Button>}
            {seller && <Button asChild size="sm" variant="outline"><a href={`https://wa.me/${seller.phone}`} target="_blank" rel="noreferrer">Chat seller</a></Button>}
          </div>
        </div>
      </Card>
    );
    setMessages((m) => [...m, user, { id: crypto.randomUUID(), from: "bot", text: `Got it — here's ${product.name}:`, node: card }]);
  };

  useEffect(() => {
    if (initialPid) lookup(initialPid);
    if (initialError) setMessages((m) => [...m, { id: "err", from: "bot", text: `That Product ID wasn't found. Try another, like PRD_83921.` }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = () => {
    const v = input.trim();
    if (!v) return;
    setInput("");
    lookup(v);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
          <Link to="/" className="font-display text-xl text-gold">CHEINLY</Link>
          <Badge variant="outline"><Bot className="mr-1 h-3 w-3" /> Cheinly Chat</Badge>
        </div>
      </header>

      <main className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-5 py-4">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto py-2">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.from === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${m.from === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                {m.from === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.from === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <p className="whitespace-pre-wrap">{m.text}</p>
                {m.node}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2 border-t pt-3">
          <Input placeholder="Paste Product ID (e.g. PRD_83921)" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
          <Button onClick={send}><Send className="mr-2 h-4 w-4" /> Send</Button>
        </div>
      </main>
    </div>
  );
}