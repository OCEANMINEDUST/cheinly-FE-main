import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, Wallet, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getInvite, updateInvite, formatNaira } from "@/lib/invites";

export default function InvitedLanding() {
  const { token = "" } = useParams();
  const nav = useNavigate();
  const invite = getInvite(token);

  useEffect(() => {
    if (invite && invite.status === "invited") updateInvite(token, { status: "viewed" });
  }, [token, invite]);

  if (!invite) {
    return (
      <div className="grid min-h-screen place-items-center bg-background p-6 text-center">
        <Card className="max-w-md p-8">
          <h1 className="font-display text-2xl">Invite not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">This invitation link is invalid or has expired.</p>
          <Button asChild className="mt-4"><Link to="/">Go home</Link></Button>
        </Card>
      </div>
    );
  }

  const accept = () => { updateInvite(token, { status: "accepted" }); nav(`/invited/${token}/dashboard`); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-gold/10">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold-gradient text-gold-foreground"><Wallet className="h-4 w-4" /></div>
            <span className="font-display text-xl text-gold">CHEINLY</span>
          </div>
          <Badge variant="outline" className="border-primary/40 text-primary"><ShieldCheck className="mr-1 h-3 w-3" /> Secure invite</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Hi {invite.sellerName} 👋</p>
          <h1 className="mt-1 font-display text-3xl">{invite.buyerName} sent you a payment via Cheinly</h1>
          <p className="mt-2 text-sm text-muted-foreground">Funds are already held in escrow. You don't need an account to accept — register only when you're ready to withdraw.</p>
        </div>

        <Card className="mt-8 overflow-hidden">
          <div className="bg-primary/10 px-6 py-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Transaction</div>
            <div className="mt-1 text-2xl font-display">{invite.productName}</div>
            {invite.productDescription && <p className="text-sm text-muted-foreground">{invite.productDescription}</p>}
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs text-muted-foreground">Amount in escrow</div>
              <div className="mt-1 text-2xl font-semibold">{formatNaira(invite.amount)}</div>
              <div className="mt-1 inline-flex items-center gap-1 text-xs text-success"><Lock className="h-3 w-3" /> Held safely</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs text-muted-foreground">Order ID</div>
              <div className="mt-1 font-mono text-lg">{invite.orderId}</div>
              <div className="mt-1 text-xs text-muted-foreground">From {invite.buyerName}</div>
            </div>
          </div>

          <div className="grid gap-3 border-t bg-muted/30 px-6 py-5 sm:grid-cols-3">
            {[
              { i: CheckCircle2, t: "Accept invite", d: "Get a free dashboard" },
              { i: ShieldCheck, t: "Deliver to buyer", d: "Funds stay in escrow" },
              { i: Wallet, t: "Add bank & withdraw", d: "Only needed at payout" },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-primary"><s.i className="h-4 w-4" /></div>
                <div>
                  <div className="text-sm font-medium">{s.t}</div>
                  <div className="text-xs text-muted-foreground">{s.d}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t p-6 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => window.history.back()}>Maybe later</Button>
            <Button onClick={accept}>Accept & view dashboard <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">Cheinly never releases funds without your consent. Learn more in the <Link to="/help" className="underline">Help Centre</Link>.</p>
      </main>
    </div>
  );
}