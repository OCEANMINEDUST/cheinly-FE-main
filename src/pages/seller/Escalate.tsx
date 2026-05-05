import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, FileText, Image as ImageIcon, Info, Trash2, Upload } from "lucide-react";
import { SellerShell } from "@/components/seller/SellerShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const reasons = [
  { id: "unresponsive", label: "Seller / buyer unresponsive", desc: "No reply within SLA" },
  { id: "invalid", label: "Invalid proof provided", desc: "Evidence appears tampered" },
  { id: "fraud", label: "Suspected fraud", desc: "Pattern of repeat disputes" },
  { id: "policy", label: "Policy interpretation", desc: "Needs admin clarification" },
];

const steps = [
  { id: 1, label: "Dispute opened", state: "done" as const },
  { id: 2, label: "Mediation active", state: "current" as const },
  { id: 3, label: "Final decision", state: "pending" as const },
];

interface UFile { id: string; name: string; size: number; kind: "image" | "pdf" | "other" }

export default function SellerEscalate() {
  const nav = useNavigate();
  const [reason, setReason] = useState("invalid");
  const [statement, setStatement] = useState("");
  const [files, setFiles] = useState<UFile[]>([
    { id: "f1", name: "before-packaging.jpg", size: 248_000, kind: "image" },
    { id: "f2", name: "shipping-receipt.pdf", size: 84_000, kind: "pdf" },
  ]);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = Array.from(list).map<UFile>((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      kind: f.type.startsWith("image/") ? "image" : f.type === "application/pdf" ? "pdf" : "other",
    }));
    setFiles((prev) => [...prev, ...next]);
  }

  return (
    <SellerShell>
      <div className="mb-4 flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/seller/negotiate"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link>
        </Button>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Admin Escalation Form</h1>
        <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">Final step</Badge>
      </div>

      {/* Stepper */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <ol className="flex items-center gap-3">
            {steps.map((s, i) => (
              <li key={s.id} className="flex flex-1 items-center gap-3">
                <div className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm font-semibold",
                  s.state === "done" && "border-success bg-success text-success-foreground",
                  s.state === "current" && "border-primary bg-primary text-primary-foreground",
                  s.state === "pending" && "border-muted bg-background text-muted-foreground",
                )}>
                  {s.state === "done" ? <Check className="h-4 w-4" /> : s.id}
                </div>
                <div className="min-w-0">
                  <div className={cn("text-sm font-medium", s.state === "pending" && "text-muted-foreground")}>{s.label}</div>
                </div>
                {i < steps.length - 1 && <div className={cn("h-px flex-1", s.state === "done" ? "bg-success" : "bg-border")} />}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {/* Reason */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reason for escalation</CardTitle>
            <CardDescription>Choose the closest match</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={reason} onValueChange={setReason} className="grid gap-3 sm:grid-cols-2">
              {reasons.map((r) => (
                <Label key={r.id} htmlFor={r.id} className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition",
                  reason === r.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-foreground/20",
                )}>
                  <RadioGroupItem value={r.id} id={r.id} className="mt-1" />
                  <div>
                    <div className="text-sm font-medium">{r.label}</div>
                    <div className="text-xs text-muted-foreground">{r.desc}</div>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Statement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Statement of facts</CardTitle>
            <CardDescription>Be specific — admins decide based on what you write here</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={6}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Walk us through what happened, in order. Include dates, amounts, and any communication highlights…"
            />
            <div className="mt-1 text-xs text-muted-foreground">{statement.length}/2000</div>
          </CardContent>
        </Card>

        {/* Uploads */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upload additional evidence</CardTitle>
            <CardDescription>JPG, PNG or PDF up to 10MB each</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
              className={cn(
                "grid place-items-center rounded-xl border-2 border-dashed p-8 text-center transition",
                drag ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20",
              )}
            >
              <Upload className="h-7 w-7 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Drag files here, or</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => inputRef.current?.click()}>
                Browse files
              </Button>
              <input ref={inputRef} type="file" multiple accept="image/*,application/pdf" hidden
                onChange={(e) => addFiles(e.target.files)} />
            </div>

            {files.length > 0 && (
              <ul className="divide-y rounded-lg border">
                {files.map((f) => (
                  <li key={f.id} className="flex items-center gap-3 p-3">
                    <div className="grid h-9 w-9 place-items-center rounded-md bg-muted text-muted-foreground">
                      {f.kind === "image" ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{f.name}</div>
                      <div className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(0)} KB</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setFiles((p) => p.filter(x => x.id !== f.id))} aria-label="Remove">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <Alert className="border-primary/30 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Once submitted, the admin's decision is <strong>final</strong> and will be applied to both parties' wallets.
          </AlertDescription>
        </Alert>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => toast({ title: "Draft saved" })}>Save as Draft</Button>
          <Button onClick={() => { toast({ title: "Submitted for review", description: "Admin team will respond within 24h." }); nav("/seller/dashboard"); }}>
            Submit for Review
          </Button>
        </div>
      </div>
    </SellerShell>
  );
}
