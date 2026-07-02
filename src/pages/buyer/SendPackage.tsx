import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, MapPin, User, Phone, Ruler, ShieldCheck } from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatNaira } from "@/lib/buyerMock";
import { toast } from "sonner";

const sizeFees: Record<string, number> = { small: 1500, medium: 2800, large: 4500 };

export default function BuyerSendPackage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [size, setSize] = useState<keyof typeof sizeFees>("small");
  const [form, setForm] = useState({
    senderName: "", senderPhone: "", pickup: "",
    receiverName: "", receiverPhone: "", dropoff: "",
    description: "", value: 0,
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "number" ? Number(e.target.value) : e.target.value }));

  const fee = sizeFees[size];
  const insurance = +(form.value * 0.01).toFixed(2);
  const total = fee + insurance;

  const next = () => setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));
  const back = () => (step === 1 ? navigate(-1) : setStep((s) => ((s - 1) as 1 | 2 | 3)));

  const book = () => {
    toast.success("Pickup booked — finding a rider near you.");
    const q = new URLSearchParams({
      fee: String(total),
      pickup: form.pickup,
      dropoff: form.dropoff,
    }).toString();
    setTimeout(() => navigate(`/buyer/pickup-tracking?${q}`), 500);
  };

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />
      <main className="flex-1 mx-auto w-full max-w-3xl px-5 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={back}><ArrowLeft className="mr-1.5 h-4 w-4" /> Back</Button>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((n) => (
              <span key={n} className={`h-1.5 w-8 rounded-full ${n <= step ? "bg-primary" : "bg-secondary"}`} />
            ))}
          </div>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-2xl flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" /> Send a Package
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us where it's coming from and where it's going."}
              {step === 2 && "Describe the package so we match the right rider."}
              {step === 3 && "Review and confirm the pickup. Payment is held in escrow until delivery."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {step === 1 && (
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label><User className="mr-1 inline h-3.5 w-3.5" /> Sender name</Label>
                  <Input value={form.senderName} onChange={set("senderName")} placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <Label><Phone className="mr-1 inline h-3.5 w-3.5" /> Sender phone</Label>
                  <Input value={form.senderPhone} onChange={set("senderPhone")} placeholder="080..." />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label><MapPin className="mr-1 inline h-3.5 w-3.5" /> Pickup address</Label>
                  <Input value={form.pickup} onChange={set("pickup")} placeholder="Street, area, city" />
                </div>
                <div className="space-y-2">
                  <Label><User className="mr-1 inline h-3.5 w-3.5" /> Receiver name</Label>
                  <Input value={form.receiverName} onChange={set("receiverName")} placeholder="Recipient name" />
                </div>
                <div className="space-y-2">
                  <Label><Phone className="mr-1 inline h-3.5 w-3.5" /> Receiver phone</Label>
                  <Input value={form.receiverPhone} onChange={set("receiverPhone")} placeholder="080..." />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label><MapPin className="mr-1 inline h-3.5 w-3.5" /> Drop-off address</Label>
                  <Input value={form.dropoff} onChange={set("dropoff")} placeholder="Street, area, city" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label><Ruler className="mr-1 inline h-3.5 w-3.5" /> Package size</Label>
                  <RadioGroup value={size} onValueChange={(v) => setSize(v as keyof typeof sizeFees)} className="grid gap-3 md:grid-cols-3">
                    {([
                      ["small", "Small", "Envelope · up to 2kg", 1500],
                      ["medium", "Medium", "Shoebox · up to 8kg", 2800],
                      ["large", "Large", "Carton · up to 20kg", 4500],
                    ] as const).map(([v, label, desc, price]) => (
                      <label key={v} className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-4 transition-colors ${size === v ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{label}</span>
                          <RadioGroupItem value={v} />
                        </div>
                        <span className="text-xs text-muted-foreground">{desc}</span>
                        <span className="mt-1 text-sm font-semibold text-gold">{formatNaira(price)}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label>What's inside?</Label>
                  <Textarea value={form.description} onChange={set("description")} placeholder="Briefly describe the item(s)" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Declared value (₦) — used for insurance</Label>
                  <Input type="number" value={form.value || ""} onChange={set("value")} placeholder="0" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm">
                  <p className="font-medium text-foreground">Route</p>
                  <p className="mt-1 text-muted-foreground">{form.pickup || "—"} → {form.dropoff || "—"}</p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm">
                  <p className="font-medium text-foreground">Package</p>
                  <p className="mt-1 text-muted-foreground">{size.toUpperCase()} · {form.description || "No description"}</p>
                </div>
                <div className="rounded-lg border border-border p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Delivery fee</span><span>{formatNaira(fee)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Insurance (1%)</span><span>{formatNaira(insurance)}</span></div>
                  <div className="flex justify-between border-t border-border pt-2 font-semibold"><span>Total</span><span className="text-gold">{formatNaira(total)}</span></div>
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Payment is held in escrow and released to the rider only after the recipient confirms delivery.</span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              {step < 3 ? (
                <Button onClick={next} className="bg-primary hover:bg-primary/90">Continue</Button>
              ) : (
                <Button onClick={book} className="bg-primary hover:bg-primary/90">Book Pickup · {formatNaira(total)}</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <BuyerFooter variant="dashboard" />
    </div>
  );
}