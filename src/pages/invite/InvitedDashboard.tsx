import { Link, useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, Wallet, ArrowRight, Package, CheckCircle2, Clock, MessageSquare, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getInvite, updateInvite, formatNaira } from "@/lib/invites";
import { toast } from "sonner";

export default function InvitedDashboard() {
  const { token = "" } = useParams();
  const nav = useNavigate();
  const invite = getInvite(token);
  if (!invite) return <div className="p-10 text-center">Invite not found.</div>;

  const markCompleted = () => { updateInvite(token, { status: "completed" }); toast.success("Marked delivered. Buyer will confirm."); };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold-gradient text-gold-foreground"><Wallet className="h-4 w-4" /></div>
            <span className="font-display text-xl text-gold">CHEINLY</span>
            <Badge variant="secondary" className="ml-1">Invited Seller</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/help"><HelpCircle className="mr-1 h-4 w-4" /> Help</Link></Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl">Welcome, {invite.sellerName}</h1>
          <p className="text-sm text-muted-foreground">You have 1 active escrow transaction. No account setup needed yet.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="relative overflow-hidden border-0 p-5 text-white">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(178_55%_42%),hsl(190_70%_45%))]" />
            <div className="relative">
              <div className="text-xs text-white/80"><ShieldCheck className="mr-1 inline h-3 w-3" /> Pending escrow</div>
              <div className="mt-1 text-3xl font-semibold">{formatNaira(invite.amount)}</div>
              <div className="text-xs text-white/80">Released after buyer confirmation</div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-xs text-muted-foreground">Available to withdraw</div>
            <div className="mt-1 text-3xl font-semibold">{invite.withdrawn ? formatNaira(0) : invite.status === "completed" ? formatNaira(invite.amount) : formatNaira(0)}</div>
            <Button size="sm" className="mt-3" disabled={invite.status !== "completed" || invite.withdrawn} onClick={() => nav(`/invited/${token}/withdraw`)}>
              <Wallet className="mr-2 h-4 w-4" /> {invite.withdrawn ? "Withdrawn" : "Withdraw funds"}
            </Button>
          </Card>
          <Card className="p-5">
            <div className="text-xs text-muted-foreground">Status</div>
            <div className="mt-1 inline-flex items-center gap-2 text-lg font-medium capitalize">
              {invite.status === "completed" ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Clock className="h-5 w-5 text-gold" />}
              {invite.status}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{invite.status === "completed" ? "Funds ready to withdraw" : "Awaiting delivery confirmation"}</p>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Active transaction</div>
                <div className="mt-1 font-display text-xl">{invite.productName}</div>
                {invite.productDescription && <p className="text-sm text-muted-foreground">{invite.productDescription}</p>}
              </div>
              <Badge variant="outline">{invite.orderId}</Badge>
            </div>

            <div className="mt-5 space-y-3">
              {[
                { i: CheckCircle2, t: "Invite sent by buyer", d: new Date(invite.createdAt).toLocaleString(), done: true },
                { i: CheckCircle2, t: "Funds placed in escrow", d: formatNaira(invite.amount) + " held by Cheinly", done: true },
                { i: Package, t: "Deliver the item", d: "Mark as delivered when handed over", done: invite.status === "completed" },
                { i: Wallet, t: "Add bank & withdraw", d: "Required only when withdrawing", done: !!invite.withdrawn },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border bg-card p-3">
                  <div className={`grid h-8 w-8 place-items-center rounded-full ${s.done ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}><s.i className="h-4 w-4" /></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{s.t}</div>
                    <div className="text-xs text-muted-foreground">{s.d}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {invite.status !== "completed" && (
                <Button onClick={markCompleted}><Package className="mr-2 h-4 w-4" /> Mark as delivered</Button>
              )}
              <Button variant="outline" onClick={() => nav(`/invite/seller/${token}`)}>View invite details</Button>
              <Button variant="ghost"><MessageSquare className="mr-2 h-4 w-4" /> Message buyer</Button>
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-sm font-semibold">Buyer</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-gradient text-gold-foreground font-semibold">{invite.buyerName[0]}</div>
              <div>
                <div className="text-sm font-medium">{invite.buyerName}</div>
                <div className="text-xs text-muted-foreground">Verified Cheinly buyer</div>
              </div>
            </div>
            <div className="mt-4 rounded-lg border-l-4 border-primary bg-primary/5 p-3 text-xs text-foreground">
              You're using Cheinly as a guest. Your bank account is only needed when you decide to withdraw — not before.
            </div>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full"><Link to="/help/article/escrow">How escrow works <ArrowRight className="ml-1 h-3 w-3" /></Link></Button>
          </Card>
        </div>
      </main>
    </div>
  );
}