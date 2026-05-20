import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UploadCloud, CheckCircle2, MessageSquare, BookOpen, Sparkles } from "lucide-react";
import { HelpShell } from "./HelpShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function HelpContact() {
  const nav = useNavigate();
  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const max = 5000;

  const onFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list).map((f) => f.name)].slice(0, 5));
  };

  return (
    <HelpShell>
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
        <h1 className="text-3xl font-semibold">Contact Support</h1>
        <p className="mt-1 max-w-xl text-sm text-white/80">Tell us what's happening. Our team typically replies within 4 hours during business days.</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="rounded-2xl border-slate-200 p-6">
          <div className="grid gap-4">
            <div>
              <Label>Subject Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choose a category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dispute">Dispute / refund</SelectItem>
                  <SelectItem value="payout">Payout & withdrawals</SelectItem>
                  <SelectItem value="account">Account & security</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="orderId">Order ID (optional)</Label>
              <Input id="orderId" placeholder="ORD-3082" className="mt-1.5" />
            </div>
            <div>
              <div className="flex items-end justify-between">
                <Label htmlFor="desc">Detailed description</Label>
                <span className="text-xs text-slate-500">{desc.length}/{max}</span>
              </div>
              <Textarea
                id="desc"
                rows={6}
                maxLength={max}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Describe what happened, what you expected, and any steps to reproduce…"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Attachments</Label>
              <label className="mt-1.5 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center hover:border-blue-400 hover:bg-blue-50">
                <UploadCloud className="h-8 w-8 text-slate-400" />
                <div className="text-sm font-medium text-slate-700">Drop files here or click to upload</div>
                <div className="text-xs text-slate-500">Up to 5 files, 10MB each (PDF, PNG, JPG)</div>
                <input type="file" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
              </label>
              {files.length > 0 && (
                <ul className="mt-2 space-y-1 text-xs text-slate-600">
                  {files.map((f, i) => (
                    <li key={i} className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> {f}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => nav("/help")}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { toast.success("Ticket submitted — reference #TKT-" + Math.floor(Math.random()*9000+1000)); nav("/help"); }}>
                Submit Ticket
              </Button>
            </div>
          </div>
        </Card>

        <aside className="space-y-4">
          <Card className="rounded-2xl border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Support Status</div>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
                14 Active
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">Avg first response: <span className="font-medium text-slate-700">2h 14m</span></p>
          </Card>

          <Card className="rounded-2xl border-slate-200 p-5">
            <div className="mb-2 flex items-center gap-2 text-slate-700"><BookOpen className="h-4 w-4" /><span className="text-sm font-semibold">Quick Answers</span></div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help/article/escrow" className="text-blue-600 hover:underline">How escrow works</Link></li>
              <li><Link to="/help/article/withdraw" className="text-blue-600 hover:underline">Withdrawing funds</Link></li>
              <li><Link to="/help/article/dispute" className="text-blue-600 hover:underline">Opening a dispute</Link></li>
            </ul>
          </Card>

          <Card className="rounded-2xl border-0 bg-slate-900 p-5 text-white">
            <div className="mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-300" /><span className="text-sm font-semibold">Cheinly Community</span></div>
            <p className="text-xs text-white/70">Join 12,000+ sellers & buyers swapping tips and resolving issues together.</p>
            <Button size="sm" className="mt-3 w-full bg-blue-600 hover:bg-blue-700">
              <MessageSquare className="mr-2 h-4 w-4" /> Join the community
            </Button>
          </Card>
        </aside>
      </div>
    </HelpShell>
  );
}