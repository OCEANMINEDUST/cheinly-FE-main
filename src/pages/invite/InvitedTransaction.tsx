import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Lock, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getInvite, formatNaira } from "@/lib/invites";
import { rememberBuyer } from "@/lib/buyerSession";

export default function InvitedTransaction() {
  const { token = "" } = useParams();
  const nav = useNavigate();
  const invite = getInvite(token);

  if (!invite) {
    return <div className="p-10 text-center">Invitation not found.</div>;
  }

  const continueToDashboard = () => {
    rememberBuyer({
      name: invite.buyerName,
      email: `${invite.buyerName.toLowerCase().replace(/\s+/g, ".")}@cheinly.guest`,
      productId: invite.orderId,
    });
    nav(`/buyer/dashboard?productId=${encodeURIComponent(invite.orderId)}&entry=secure-checkout&mode=guest&provider=cheinly`);
  };

  return (
    <div className="min-h-screen bg-background px-5 py-10">
      <div className="mx-auto max-w-2xl space-y-5">
        <Badge variant="outline" className="border-primary/40 text-primary">Invited transaction</Badge>
        <h1 className="font-display text-3xl">{invite.buyerName}, your invited transaction is ready</h1>
        <p className="text-sm text-muted-foreground">You can review this transaction and continue to your buyer dashboard without signing up again.</p>

        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Order ID</span><span className="font-mono">{invite.orderId}</span></div>
          <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Item</span><span>{invite.productName}</span></div>
          <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Escrow amount</span><span className="font-semibold">{formatNaira(invite.amount)}</span></div>
          <div className="rounded-md bg-primary/10 p-3 text-sm text-primary"><Lock className="mr-1 inline h-4 w-4" /> Funds remain protected in escrow until delivery is confirmed.</div>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button onClick={continueToDashboard}><Wallet className="mr-2 h-4 w-4" /> Continue to buyer dashboard</Button>
          <Button asChild variant="outline"><Link to="/buyer/help?section=buyer-flow">View buyer flow <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
      </div>
    </div>
  );
}
