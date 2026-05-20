import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Rocket, ShoppingBag, Store, ShieldCheck, Scale, HelpCircle, ChevronRight, MessageSquare, BookOpen, AlertTriangle } from "lucide-react";
import { HelpShell } from "./HelpShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const categories = [
  { icon: Rocket, label: "Getting Started", desc: "Set up your account & first payment.", to: "/buyer/help?section=getting-started", color: "bg-blue-100 text-blue-700" },
  { icon: ShoppingBag, label: "Buyer Flow", desc: "From checkout to delivery confirmation.", to: "/buyer/help?section=buyer-flow", color: "bg-emerald-100 text-emerald-700" },
  { icon: Store, label: "Seller Flow", desc: "What happens on seller side after payment.", to: "/buyer/help?section=seller-flow", color: "bg-violet-100 text-violet-700" },
  { icon: ShieldCheck, label: "Escrow", desc: "How your funds stay protected.", to: "/buyer/help?section=escrow", color: "bg-amber-100 text-amber-700" },
  { icon: Scale, label: "Disputes", desc: "Resolve issues and raise claims fast.", to: "/buyer/help?section=disputes", color: "bg-rose-100 text-rose-700" },
  { icon: HelpCircle, label: "FAQs", desc: "Quick answers to common questions.", to: "/buyer/help?section=faqs", color: "bg-slate-200 text-slate-700" },
];

export default function HelpCentre() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((c) => c.label.toLowerCase().includes(term) || c.desc.toLowerCase().includes(term));
  }, [q]);

  return (
    <HelpShell>
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 p-8 text-center text-white shadow-lg">
        <h2 className="text-3xl font-semibold">Cheinly Help Centre</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/80">Search across Getting Started, Buyer Flow, Seller Flow, Escrow, Disputes and FAQs.</p>
        <div className="mx-auto mt-6 flex max-w-2xl items-center gap-2 rounded-xl bg-white p-2 shadow">
          <Search className="ml-2 h-4 w-4 text-slate-400" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for a topic…" className="h-10 flex-1 border-0 bg-transparent text-slate-900 shadow-none focus-visible:ring-0" />
          <Button className="h-10 bg-blue-600 hover:bg-blue-700">Search</Button>
        </div>
      </section>

      <section className="mt-10">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Topics</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link key={c.label} to={c.to} className="group">
              <Card className="rounded-2xl border-slate-200 p-5 transition hover:border-blue-300 hover:shadow-md">
                <div className={`mb-3 grid h-10 w-10 place-items-center rounded-lg ${c.color}`}>
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="font-semibold text-slate-900">{c.label}</div>
                <p className="text-sm text-slate-500">{c.desc}</p>
                <div className="mt-3 inline-flex items-center text-sm font-medium text-blue-600">Open <ChevronRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" /></div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-slate-200 p-5 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2 text-slate-700"><BookOpen className="h-4 w-4" /><span className="text-sm font-semibold">Popular paths</span></div>
          <ul className="divide-y text-sm">
            {[
              ["Start as a buyer", "/buyer/help?section=getting-started"],
              ["Understand escrow", "/buyer/help?section=escrow"],
              ["Raise a dispute", "/buyer/help?section=disputes"],
            ].map(([label, to]) => (
              <li key={label}><Link to={to} className="flex items-center justify-between py-3 hover:text-blue-600"><span>{label}</span><ChevronRight className="h-4 w-4 text-slate-400" /></Link></li>
            ))}
          </ul>
        </Card>
        <Card className="rounded-2xl border-blue-200 bg-blue-50 p-5">
          <div className="flex items-center gap-2 text-blue-700"><MessageSquare className="h-4 w-4" /><span className="text-sm font-semibold">Need a human?</span></div>
          <p className="mt-2 text-sm text-slate-700">Submit a ticket and our team will get back within 4 hours.</p>
          <Button asChild className="mt-4 w-full bg-blue-600 hover:bg-blue-700"><Link to="/help/contact">Contact Help Desk</Link></Button>
          <Button asChild variant="ghost" className="mt-1 w-full text-blue-700 hover:bg-blue-100"><Link to="/help/agent"><AlertTriangle className="mr-2 h-4 w-4" />Open agent console</Link></Button>
        </Card>
      </section>
    </HelpShell>
  );
}
