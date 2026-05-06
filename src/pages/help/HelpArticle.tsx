import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Search, ThumbsUp, ThumbsDown, AlertTriangle, PackageX, RotateCcw, Lightbulb, MessageSquare } from "lucide-react";
import { HelpShell } from "./HelpShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const articles = [
  { id: "escrow", title: "How escrow protects every transaction" },
  { id: "invite-seller", title: "Invite a seller who isn't on Cheinly" },
  { id: "withdraw", title: "Withdraw to your bank account" },
  { id: "dispute", title: "Open a dispute & upload evidence" },
  { id: "kyc", title: "Verify your identity (KYC)" },
  { id: "2fa", title: "Set up two-factor authentication" },
];

const issueTypes = [
  { icon: PackageX, label: "Non-Delivery", desc: "Order never arrived" },
  { icon: AlertTriangle, label: "Wrong Item", desc: "Different product received" },
  { icon: RotateCcw, label: "Damaged on Arrival", desc: "Open a return claim" },
];

const steps = [
  { n: 1, title: "Check your order status", desc: "Go to Orders → select the order to see live tracking and timestamps." },
  { n: 2, title: "Contact the rider", desc: "Use the in-app chat from the order page to message the assigned rider." },
  { n: 3, title: "Open a formal dispute", desc: "If unresolved, escalate to Cheinly support with photo evidence." },
  { n: 4, title: "Refund decision", desc: "Funds in escrow are released or refunded based on the verdict." },
];

export default function HelpArticle() {
  const { slug = "escrow" } = useParams();
  const active = articles.find((a) => a.id === slug) ?? articles[0];
  const [feedback, setFeedback] = useState<"yes" | "no" | null>(null);

  return (
    <HelpShell>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search articles…" className="pl-9" />
          </div>
          <Card className="rounded-2xl border-slate-200 p-2">
            <ul className="text-sm">
              {articles.map((a) => (
                <li key={a.id}>
                  <Link
                    to={`/help/article/${a.id}`}
                    className={`block rounded-lg px-3 py-2 ${a.id === active.id ? "bg-blue-50 font-medium text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
            <Link to="/help/contact"><MessageSquare className="mr-2 h-4 w-4" /> Contact Help Desk</Link>
          </Button>
        </aside>

        {/* Content */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
            <div className="text-xs font-semibold uppercase tracking-wider text-white/70">Help article</div>
            <h1 className="mt-1 text-3xl font-semibold">{active.title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/80">A quick walkthrough so you know exactly what to do — and what to expect at every stage.</p>
          </div>

          <Card className="rounded-2xl border-slate-200 p-6">
            <h2 className="text-lg font-semibold">Step-by-step</h2>
            <ol className="mt-4 space-y-3">
              {steps.map((s) => (
                <li key={s.n} className="flex items-start gap-4 rounded-xl bg-slate-50 p-4">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-semibold text-white">{s.n}</div>
                  <div>
                    <div className="font-medium text-slate-900">{s.title}</div>
                    <p className="text-sm text-slate-600">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-xl border-l-4 border-blue-600 bg-blue-50 p-4">
              <div className="flex items-center gap-2 text-blue-700"><Lightbulb className="h-4 w-4" /><span className="text-sm font-semibold">Pro Tip</span></div>
              <p className="mt-1 text-sm text-slate-700">Always upload a clear unboxing photo within 24 hours — it dramatically improves dispute outcomes.</p>
            </div>
          </Card>

          <Card className="rounded-2xl border-slate-200 p-6">
            <h2 className="text-lg font-semibold">Common issue types</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {issueTypes.map((it) => (
                <div key={it.label} className="rounded-xl border border-slate-200 p-4">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-rose-100 text-rose-600">
                    <it.icon className="h-4 w-4" />
                  </div>
                  <div className="mt-3 font-medium text-slate-900">{it.label}</div>
                  <p className="text-sm text-slate-500">{it.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-medium">Was this article helpful?</div>
                <p className="text-xs text-slate-500">Your feedback helps us improve the help centre.</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={feedback === "yes" ? "default" : "outline"}
                  className={feedback === "yes" ? "bg-blue-600 hover:bg-blue-700" : ""}
                  onClick={() => { setFeedback("yes"); toast.success("Thanks for your feedback!"); }}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" /> Yes
                </Button>
                <Button
                  variant={feedback === "no" ? "default" : "outline"}
                  className={feedback === "no" ? "bg-blue-600 hover:bg-blue-700" : ""}
                  onClick={() => { setFeedback("no"); toast.message("Got it — we'll improve this article."); }}
                >
                  <ThumbsDown className="mr-2 h-4 w-4" /> No
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </HelpShell>
  );
}