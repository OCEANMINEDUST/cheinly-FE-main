import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, MessageSquare, Inbox, BarChart2, Search, Send, Paperclip, Bold, Italic, Smile, Phone, Wallet, ShieldCheck, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: MessageSquare, label: "Active Chats", active: true },
  { icon: Inbox, label: "Ticket Queue" },
  { icon: BarChart2, label: "Analytics" },
];

const inbox = [
  { id: 1, name: "Goodness A.", last: "Hi, my order didn't arrive…", time: "2m", unread: 2, active: true },
  { id: 2, name: "Femi Okeke", last: "Can I withdraw to USD?", time: "12m" },
  { id: 3, name: "Ada N.", last: "Refund pending for 3 days", time: "1h" },
  { id: 4, name: "Tunde A. (Rider)", last: "Buyer not responding", time: "3h" },
];

const txns = [
  { id: "t1", label: "Deposit", amount: 4500, status: "Completed", at: "Today" },
  { id: "t2", label: "Withdrawal", amount: -1200, status: "Processing", at: "Yesterday" },
  { id: "t3", label: "Refund", amount: 250, status: "Completed", at: "Mar 12" },
];

export default function HelpAgent() {
  const [tab, setTab] = useState<"active" | "queue" | "closed">("active");
  const [msg, setMsg] = useState("");
  return (
    <div className="grid h-screen w-full grid-cols-[64px_320px_1fr_320px] bg-slate-100 text-slate-900">
      {/* Pane 1 — Nav */}
      <aside className="flex flex-col items-center gap-2 border-r bg-white py-4">
        <Link to="/help" className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white"><Wallet className="h-4 w-4" /></Link>
        <Link to="/help" className="mt-2 grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" title="Back to Help">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="my-2 h-px w-8 bg-slate-200" />
        {navItems.map((n) => (
          <button key={n.label} className={cn("grid h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100", n.active && "bg-blue-50 text-blue-600")} title={n.label}>
            <n.icon className="h-4 w-4" />
          </button>
        ))}
      </aside>

      {/* Pane 2 — Inbox */}
      <aside className="flex min-h-0 flex-col border-r bg-white">
        <div className="border-b p-4">
          <div className="text-base font-semibold">Inbox</div>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search conversations…" className="pl-8" />
          </div>
          <div className="mt-3 flex gap-1 text-xs">
            {(["active", "queue", "closed"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={cn("rounded-full px-3 py-1 capitalize", tab === t ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <ul className="flex-1 overflow-auto">
          {inbox.map((c) => (
            <li key={c.id} className={cn("flex cursor-pointer gap-3 border-b px-4 py-3 hover:bg-slate-50", c.active && "bg-blue-50/50")}>
              <Avatar className="h-10 w-10"><AvatarFallback className="bg-slate-200 text-xs">{c.name.split(" ").map((p) => p[0]).join("")}</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2"><span className="truncate text-sm font-medium">{c.name}</span><span className="text-[10px] text-slate-500">{c.time}</span></div>
                <p className="truncate text-xs text-slate-500">{c.last}</p>
              </div>
              {c.unread ? <span className="self-center rounded-full bg-blue-600 px-1.5 text-[10px] font-semibold text-white">{c.unread}</span> : null}
            </li>
          ))}
        </ul>
      </aside>

      {/* Pane 3 — Chat */}
      <section className="flex min-h-0 flex-col bg-slate-50">
        <header className="flex items-center justify-between border-b bg-white px-5 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9"><AvatarFallback className="bg-slate-200 text-xs">GA</AvatarFallback></Avatar>
            <div>
              <div className="text-sm font-semibold">Goodness A.</div>
              <div className="text-xs text-slate-500">Buyer • Lagos • Online</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Phone className="mr-2 h-3 w-3" /> Call</Button>
            <Button size="sm" variant="destructive">End Chat</Button>
          </div>
        </header>
        <div className="flex-1 space-y-3 overflow-auto p-6">
          <div className="flex justify-start"><div className="max-w-md rounded-2xl rounded-tl-sm bg-white px-4 py-2 text-sm shadow-sm">Hi! My order #ORD-3082 was supposed to arrive yesterday but I haven't received it.</div></div>
          <div className="flex justify-end"><div className="max-w-md rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-2 text-sm text-white shadow-sm">Hi Goodness — I see the rider is currently 3.2km away. ETA ~18 min. Want me to ping them?</div></div>
          <div className="flex justify-start"><div className="max-w-md rounded-2xl rounded-tl-sm bg-white px-4 py-2 text-sm shadow-sm">Yes please, thank you!</div></div>
        </div>
        <footer className="border-t bg-white p-3">
          <div className="flex items-center gap-2 rounded-xl border bg-white p-2">
            <Button variant="ghost" size="icon" className="h-8 w-8"><Paperclip className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Bold className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Italic className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Smile className="h-4 w-4" /></Button>
            <Input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type a reply…" className="border-0 shadow-none focus-visible:ring-0" />
            <Button size="icon" className="h-8 w-8 bg-blue-600 hover:bg-blue-700"><Send className="h-4 w-4" /></Button>
          </div>
        </footer>
      </section>

      {/* Pane 4 — User Context */}
      <aside className="min-h-0 overflow-auto border-l bg-white p-5">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-16 w-16"><AvatarFallback className="bg-blue-600 text-white">GA</AvatarFallback></Avatar>
          <div className="mt-2 font-semibold">Goodness A.</div>
          <div className="text-xs text-slate-500">goodness@buyer.cheinly.app</div>
          <Badge variant="outline" className="mt-2 border-emerald-300 bg-emerald-50 text-emerald-700"><ShieldCheck className="mr-1 h-3 w-3" /> Verified</Badge>
        </div>
        <div className="mt-5 rounded-xl bg-slate-900 p-4 text-white">
          <div className="text-[10px] uppercase tracking-wider text-white/60">Protected Balance</div>
          <div className="mt-1 text-2xl font-semibold">$12,450.00</div>
          <div className="text-xs text-white/70">Across 4 active orders</div>
        </div>
        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recent Transactions</div>
          <ul className="mt-2 divide-y">
            {txns.map((t) => (
              <li key={t.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-medium">{t.label}</div>
                  <div className="text-[11px] text-slate-500">{t.at}</div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={cn("text-sm font-semibold", t.amount > 0 ? "text-emerald-600" : "text-rose-600")}>{t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toLocaleString()}</span>
                  <Badge variant="outline" className={cn("mt-1 text-[10px]", t.status === "Completed" ? "border-emerald-300 text-emerald-700" : "border-amber-300 text-amber-700")}>{t.status}</Badge>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}