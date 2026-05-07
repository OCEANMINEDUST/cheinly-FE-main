import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Rocket,
  ShoppingBag,
  Store,
  ShieldCheck,
  Scale,
  HelpCircle,
  ChevronRight,
  Lightbulb,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { BuyerHeader } from "@/components/buyer/BuyerHeader";
import { BuyerFooter } from "@/components/buyer/BuyerFooter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Section = {
  id: string;
  label: string;
  blurb: string;
  icon: typeof Rocket;
  color: string;
  steps?: { title: string; desc: string }[];
  faqs?: { q: string; a: string }[];
  tip?: string;
};

const sections: Section[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    blurb: "Set up your Cheinly buyer account in under 60 seconds.",
    icon: Rocket,
    color: "bg-blue-100 text-blue-700",
    steps: [
      { title: "Open a secured checkout", desc: "Tap any seller's product link to enter Cheinly's escrow checkout." },
      { title: "Enter delivery details", desc: "Address, phone and preferred logistics provider — only takes a moment." },
      { title: "Fund the Protected Balance", desc: "Pay into escrow. Money is only released when you confirm delivery." },
      { title: "Track everything", desc: "Use your dashboard for orders, transactions and live rider updates." },
    ],
    tip: "Cheinly remembers this device — next time you'll land straight on your dashboard.",
  },
  {
    id: "buyer-flow",
    label: "Buyer Flow",
    blurb: "How a purchase moves from cart to confirmation.",
    icon: ShoppingBag,
    color: "bg-emerald-100 text-emerald-700",
    steps: [
      { title: "Review the product", desc: "Confirm price, seller location and shipping options." },
      { title: "Pay into escrow", desc: "Funds sit in your Protected Balance — sellers never get the money yet." },
      { title: "Track the rider", desc: "Live tracking + 6-digit pickup code keeps the chain of custody honest." },
      { title: "Inspect & release", desc: "Open package, verify items, then release payment from your dashboard." },
    ],
    tip: "You have up to 24 hours to inspect items before funds auto-release.",
  },
  {
    id: "seller-flow",
    label: "Seller Flow",
    blurb: "What happens on the seller's side after you pay.",
    icon: Store,
    color: "bg-violet-100 text-violet-700",
    steps: [
      { title: "Order notification", desc: "Seller is alerted with funds confirmed-in-escrow status." },
      { title: "Pre-dispatch evidence", desc: "Seller uploads 'before' photos of the packed item." },
      { title: "Hand-off to rider", desc: "Pickup code from the buyer locks the dispatch event." },
      { title: "Settlement", desc: "Once you confirm delivery, the seller's True Balance is credited instantly." },
    ],
  },
  {
    id: "escrow",
    label: "Escrow",
    blurb: "How your money stays safe between order and delivery.",
    icon: ShieldCheck,
    color: "bg-amber-100 text-amber-700",
    steps: [
      { title: "Funds enter Protected Balance", desc: "Held by Cheinly, not by the seller." },
      { title: "Triggered release", desc: "Released only after you tap 'Confirm Delivery' or after the inspection window expires without a dispute." },
      { title: "Refundable on dispute", desc: "If you raise a dispute, escrow is frozen until verdict." },
    ],
    tip: "Escrow protects every Naira — the seller can see it's funded but cannot touch it.",
  },
  {
    id: "disputes",
    label: "Disputes",
    blurb: "What to do when something goes wrong.",
    icon: Scale,
    color: "bg-rose-100 text-rose-700",
    steps: [
      { title: "Open a dispute", desc: "From Orders → select order → Report an Issue." },
      { title: "Upload evidence", desc: "Photos, unboxing video, screenshots of seller chat." },
      { title: "Mediation window", desc: "Seller has 24h to respond. You can negotiate, accept partial refund, or escalate." },
      { title: "Verdict", desc: "Cheinly support reviews evidence — refund, partial refund, or release." },
    ],
    tip: "Always upload at least one unboxing photo within 24 hours — it dramatically improves dispute outcomes.",
  },
  {
    id: "faqs",
    label: "FAQs",
    blurb: "Quick answers to the questions we hear most.",
    icon: HelpCircle,
    color: "bg-slate-200 text-slate-700",
    faqs: [
      { q: "Do I need to sign up to buy?", a: "No. The first time you check out, Cheinly creates a guest profile tied to your device. Returning on the same browser drops you straight on your dashboard." },
      { q: "How long does escrow hold funds?", a: "Until you confirm delivery, or up to 24 hours after the rider marks delivered if you take no action." },
      { q: "Can I cancel an order?", a: "Yes — before dispatch you can cancel for a full refund. After dispatch you'll need the seller's agreement or a dispute." },
      { q: "Are there hidden fees?", a: "A 1.5% transaction fee is shown before you fund. Withdrawal fees are 1%." },
      { q: "What if the rider never arrives?", a: "Open a non-delivery dispute. Funds are returned in full once the timeline is verified." },
      { q: "Can I pay with cash?", a: "No — escrow only works with bank transfer or virtual account funding so the chain of custody is auditable." },
    ],
  },
];

const BuyerHelp = () => {
  const [params, setParams] = useSearchParams();
  const initial = params.get("section") ?? "getting-started";
  const [active, setActive] = useState<string>(initial);
  const [q, setQ] = useState("");
  const [feedback, setFeedback] = useState<Record<string, "yes" | "no" | undefined>>({});

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return sections;
    return sections.filter((s) =>
      s.label.toLowerCase().includes(term) ||
      s.blurb.toLowerCase().includes(term) ||
      s.steps?.some((st) => st.title.toLowerCase().includes(term) || st.desc.toLowerCase().includes(term)) ||
      s.faqs?.some((f) => f.q.toLowerCase().includes(term) || f.a.toLowerCase().includes(term)),
    );
  }, [q]);

  const current = sections.find((s) => s.id === active) ?? sections[0];

  const select = (id: string) => {
    setActive(id);
    const p = new URLSearchParams(params);
    p.set("section", id);
    setParams(p, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background bg-hero flex flex-col">
      <BuyerHeader variant="dashboard" />
      <main className="flex-1 mx-auto w-full max-w-7xl px-5 lg:px-8 py-8 space-y-6">
        <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-primary/70 p-8 text-primary-foreground shadow-card">
          <p className="text-xs uppercase tracking-[0.25em] opacity-80">Help Centre</p>
          <h1 className="font-display text-3xl mt-2">How can we help, Goodness?</h1>
          <p className="mt-1 text-sm opacity-80 max-w-xl">Search our guides on getting started, escrow, disputes and more — or jump into a section below.</p>
          <div className="mx-auto mt-6 flex max-w-2xl items-center gap-2 rounded-xl bg-card p-2 shadow">
            <Search className="ml-2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles…" className="h-10 flex-1 border-0 bg-transparent text-foreground shadow-none focus-visible:ring-0" />
            <Button onClick={() => toast.message(filtered.length ? `${filtered.length} match${filtered.length === 1 ? "" : "es"}` : "No matches")}>Search</Button>
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <button
              key={s.id}
              onClick={() => select(s.id)}
              className={cn(
                "text-left",
              )}
            >
              <Card className={cn("rounded-2xl p-5 transition hover:shadow-md hover:border-primary/40", active === s.id && "border-primary ring-2 ring-primary/20")}>
                <div className={cn("mb-3 grid h-10 w-10 place-items-center rounded-lg", s.color)}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="font-semibold text-foreground">{s.label}</div>
                <p className="text-sm text-muted-foreground">{s.blurb}</p>
                <div className="mt-3 inline-flex items-center text-sm font-medium text-primary">Open <ChevronRight className="ml-1 h-4 w-4" /></div>
              </Card>
            </button>
          ))}
        </div>

        <Card className="rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className={cn("grid h-10 w-10 place-items-center rounded-lg", current.color)}>
              <current.icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{current.label}</h2>
              <p className="text-sm text-muted-foreground">{current.blurb}</p>
            </div>
          </div>

          {current.steps && (
            <ol className="mt-5 space-y-3">
              {current.steps.map((s, i) => (
                <li key={s.title} className="flex items-start gap-4 rounded-xl bg-secondary/50 p-4">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{i + 1}</div>
                  <div>
                    <div className="font-medium text-foreground">{s.title}</div>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {current.faqs && (
            <Accordion type="single" collapsible className="mt-5">
              {current.faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`q${i}`}>
                  <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {current.tip && (
            <div className="mt-6 rounded-xl border-l-4 border-primary bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-primary"><Lightbulb className="h-4 w-4" /><span className="text-sm font-semibold">Pro Tip</span></div>
              <p className="mt-1 text-sm text-foreground/80">{current.tip}</p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 p-4">
            <div>
              <div className="font-medium">Was this section helpful?</div>
              <p className="text-xs text-muted-foreground">Your feedback shapes future articles.</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={feedback[current.id] === "yes" ? "default" : "outline"}
                onClick={() => { setFeedback({ ...feedback, [current.id]: "yes" }); toast.success("Thanks!"); }}
              >
                <ThumbsUp className="mr-2 h-4 w-4" /> Yes
              </Button>
              <Button
                size="sm"
                variant={feedback[current.id] === "no" ? "default" : "outline"}
                onClick={() => { setFeedback({ ...feedback, [current.id]: "no" }); toast.message("We'll improve this section."); }}
              >
                <ThumbsDown className="mr-2 h-4 w-4" /> No
              </Button>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border-primary/30 bg-primary/5 p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">Still need help?</div>
              <p className="text-sm text-muted-foreground">Submit a ticket — average reply under 4 hours.</p>
            </div>
          </div>
          <Button asChild><a href="/help/contact">Contact Help Desk</a></Button>
        </Card>
      </main>
      <BuyerFooter variant="dashboard" />
    </div>
  );
};

export default BuyerHelp;