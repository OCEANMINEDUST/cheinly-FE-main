import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Wallet, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInvite, updateInvite, formatNaira } from "@/lib/invites";
import { toast } from "sonner";

const banks = ["GTBank", "Access Bank", "Zenith", "UBA", "Kuda", "Opay", "Standard Merchant Bank"];

export default function InvitedWithdraw() {
  const { token = "" } = useParams();
  const nav = useNavigate();
  const invite = getInvite(token);
  const [step, setStep] = useState<"kyc" | "bank" | "done">(invite?.bank ? "bank" : "kyc");
  const [bvn, setBvn] = useState("");
  const [name, setName] = useState(invite?.sellerName ?? "");
  const [bank, setBank] = useState("");
  const [acct, setAcct] = useState("");

  if (!invite) return <div className="p-10 text-center">Invite not found.</div>;

  const submitKyc = () => {
    if (bvn.length < 10 || !name.trim()) { toast.error("Enter a valid BVN and full legal name"); return; }
    setStep("bank");
  };
  const submitBank = () => {
    if (!bank || acct.length < 10) { toast.error("Pick a bank and enter your 10-digit account number"); return; }
    updateInvite(token, { bank: { accountName: name, bankName: bank, accountNumber: acct }, withdrawn: true });
    setStep("done");
    toast.success("Payout sent to your bank");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-5">
          <Button variant="ghost" size="sm" onClick={() => nav(-1)}><ArrowLeft className="mr-1 h-4 w-4" /> Back</Button>
          <div className="font-display text-lg">Withdraw {formatNaira(invite.amount)}</div>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-5 py-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"><ShieldCheck className="h-3 w-3" /> Identity verification required for first withdrawal</div>

        {step === "kyc" && (
          <Card className="p-6">
            <h2 className="font-display text-2xl">Verify your identity</h2>
            <p className="text-sm text-muted-foreground">A one-time KYC check before your first payout.</p>
            <div className="mt-5 grid gap-4">
              <div><Label>Full legal name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div><Label>BVN</Label><Input inputMode="numeric" maxLength={11} value={bvn} onChange={(e) => setBvn(e.target.value.replace(/\D/g, ""))} placeholder="22XXXXXXXXX" /></div>
            </div>
            <Button className="mt-5 w-full" onClick={submitKyc}>Continue to bank details</Button>
          </Card>
        )}

        {step === "bank" && (
          <Card className="p-6">
            <h2 className="font-display text-2xl">Payout destination</h2>
            <p className="text-sm text-muted-foreground">Where should we send {formatNaira(invite.amount)}?</p>
            <div className="mt-5 grid gap-4">
              <div>
                <Label>Bank</Label>
                <Select value={bank} onValueChange={setBank}>
                  <SelectTrigger><SelectValue placeholder="Select bank" /></SelectTrigger>
                  <SelectContent>
                    {banks.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Account number</Label><Input inputMode="numeric" maxLength={10} value={acct} onChange={(e) => setAcct(e.target.value.replace(/\D/g, ""))} placeholder="0123456789" /></div>
              <div><Label>Account name</Label><Input value={name} disabled /></div>
            </div>
            <Button className="mt-5 w-full" onClick={submitBank}><Wallet className="mr-2 h-4 w-4" /> Withdraw {formatNaira(invite.amount)}</Button>
          </Card>
        )}

        {step === "done" && (
          <Card className="p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/15 text-success"><CheckCircle2 className="h-7 w-7" /></div>
            <h2 className="mt-4 font-display text-2xl">Payout sent</h2>
            <p className="text-sm text-muted-foreground">{formatNaira(invite.amount)} is on its way to {bank} •••• {acct.slice(-4)}.</p>
            <div className="mt-5 flex justify-center gap-2">
              <Button asChild variant="outline"><Link to={`/invited/${token}/dashboard`}>Back to dashboard</Link></Button>
              <Button asChild><Link to="/seller">Set up full seller account</Link></Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}