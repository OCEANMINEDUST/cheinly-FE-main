import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Copy, MessageCircle, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { upsertInvite, makeToken, inviteUrl, formatNaira } from "@/lib/invites";

export default function InviteCompose() {
  const nav = useNavigate();
  const [sellerName, setSellerName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [token, setToken] = useState<string | null>(null);

  const url = token ? inviteUrl(token) : "";

  const generate = () => {
    if (!sellerName.trim() || !sellerEmail.trim() || !productName.trim() || !amount) {
      toast.error("Please fill seller details and transaction info");
      return;
    }
    const t = makeToken();
    const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    upsertInvite({
      token: t,
      sellerName: sellerName.trim(),
      sellerEmail: sellerEmail.trim(),
      sellerPhone: sellerPhone.trim() || undefined,
      buyerName: "Goodness",
      productName: productName.trim(),
      productDescription: productDescription.trim() || undefined,
      amount: Number(amount) || 0,
      orderId,
      createdAt: new Date().toISOString(),
      status: "invited",
    });
    setToken(t);
    toast.success("Invite link generated");
  };

  const copy = () => { navigator.clipboard.writeText(url); toast.success("Link copied"); };
  const wa = () => {
    const text = encodeURIComponent(`Hi ${sellerName}, I'd like to pay you ${formatNaira(amount)} for "${productName}" through Cheinly's secure escrow. Open this link to view & accept: ${url}`);
    const phone = sellerPhone.replace(/\D/g, "");
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };
  const email = () => {
    const subject = encodeURIComponent(`Cheinly escrow payment from ${"Goodness"}`);
    const body = encodeURIComponent(`Hi ${sellerName},\n\nI'd like to pay you ${formatNaira(amount)} for "${productName}" through Cheinly's secure escrow. View and accept here:\n${url}\n\nFunds are held safely until delivery is confirmed.`);
    window.location.href = `mailto:${sellerEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <BuyerHeader variant="dashboard" />
      <div className="mx-auto max-w-3xl px-5 py-8 lg:px-8">
        <div className="mb-6">
          <Badge variant="outline" className="border-primary/40 text-primary"><Sparkles className="mr-1 h-3 w-3" /> New flow</Badge>
          <h1 className="mt-2 font-display text-3xl">Invite a seller to Cheinly</h1>
          <p className="text-sm text-muted-foreground">Send a secure escrow link. They'll only need to register their bank when they're ready to withdraw.</p>
        </div>

        <Card className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Seller name</Label>
              <Input value={sellerName} onChange={(e) => setSellerName(e.target.value)} placeholder="e.g. Femi Okeke" />
            </div>
            <div>
              <Label>Seller email</Label>
              <Input type="email" value={sellerEmail} onChange={(e) => setSellerEmail(e.target.value)} placeholder="seller@email.com" />
            </div>
            <div className="md:col-span-2">
              <Label>Phone (for WhatsApp, optional)</Label>
              <Input value={sellerPhone} onChange={(e) => setSellerPhone(e.target.value)} placeholder="+234 812…" />
            </div>
            <div className="md:col-span-2">
              <Label>What are you buying?</Label>
              <Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Vintage Yamaha keyboard" />
            </div>
            <div className="md:col-span-2">
              <Label>Notes (optional)</Label>
              <Textarea rows={3} value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="Condition, color, agreed delivery date…" />
            </div>
            <div>
              <Label>Amount (₦)</Label>
              <Input type="number" inputMode="numeric" value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} placeholder="120000" />
            </div>
            <div className="flex items-end">
              <div className="rounded-lg bg-primary/10 p-3 text-xs text-primary"><ShieldCheck className="mr-1 inline h-3 w-3" /> Funds held in escrow until delivery confirmed.</div>
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={generate} className="w-full sm:w-auto"><Send className="mr-2 h-4 w-4" /> Generate invite link</Button>
          </div>

          {token && (
            <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">Share this link</div>
              <div className="mt-2 flex items-center gap-2">
                <Input readOnly value={url} className="font-mono text-xs" />
                <Button variant="outline" size="icon" onClick={copy} aria-label="Copy"><Copy className="h-4 w-4" /></Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={wa} className="bg-emerald-600 hover:bg-emerald-700" disabled={!sellerPhone}><MessageCircle className="mr-2 h-4 w-4" /> WhatsApp</Button>
                <Button onClick={email} variant="outline"><Mail className="mr-2 h-4 w-4" /> Email</Button>
                <Button variant="ghost" onClick={() => nav(`/invite/seller/${token}`)}>Preview seller view →</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}