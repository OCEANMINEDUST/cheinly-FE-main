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
  Bike,
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
  intro?: string;
  steps?: { title: string; desc: string }[];
  faqs?: { q: string; a: string }[];
  tip?: string;
  callouts?: { title: string; body: string }[];
};

const sections: Section[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    blurb: "Set up your Cheinly buyer account in under 60 seconds.",
    icon: Rocket,
    color: "bg-blue-100 text-blue-700",
    intro: "Cheinly is a social-commerce escrow platform. You buy from sellers you meet on WhatsApp, Instagram or TikTok — and Cheinly holds the money in the middle so no one gets scammed. There's no lengthy signup: your first checkout creates a guest profile tied to this device, and future visits drop you straight on your dashboard. If you switch devices or clear your browser, sign in with Google or email to sync.",
    steps: [
      { title: "Open a secured checkout", desc: "Tap any seller's product link (a Cheinly bio link, WhatsApp catalogue, or product invite). You'll land on the escrow checkout with the item and price pre-filled." },
      { title: "Enter delivery details", desc: "Name, phone, delivery address and a preferred pickup window. Cheinly stores this so future orders auto-fill." },
      { title: "Fund the Protected Balance", desc: "Pay by card, bank transfer or virtual account. Funds land in your Protected Balance — held by Cheinly, invisible to the seller as spendable money." },
      { title: "Track everything", desc: "Your dashboard shows every active order, rider ETA, escrow balance and refund history in one place." },
      { title: "Confirm and release", desc: "Inspect the delivered item, then tap Confirm Delivery. Funds move to the seller instantly — or open a dispute to freeze the release." },
    ],
    callouts: [
      { title: "No account required", body: "Guest checkout is fully functional. Sign-in only becomes necessary when moving between devices or requesting a withdrawal." },
      { title: "Same-device auto-login", body: "Cheinly fingerprints this browser (no cookies needed). Return within 90 days and you skip login entirely." },
    ],
    tip: "Cheinly remembers this device — next time you'll land straight on your dashboard.",
  },
  {
    id: "buyer-flow",
    label: "Buyer Flow",
    blurb: "How a purchase moves from cart to confirmation.",
    icon: ShoppingBag,
    color: "bg-emerald-100 text-emerald-700",
    intro: "Every buyer transaction on Cheinly moves through five audited stages: Funded → Dispatched → In-Transit → Delivered → Released. At each stage both you and the seller receive a synchronized event notification, and the escrow state is visible on your dashboard. If any stage stalls beyond its SLA, Cheinly automatically alerts support and pauses further releases.",
    steps: [
      { title: "Review the product", desc: "Confirm the listing — price, seller identity badge, delivery region and return policy. Every listing shows the seller's completed-order count and dispute-free rate." },
      { title: "Pay into escrow", desc: "Choose card, bank transfer or virtual account. Your Protected Balance is credited and a receipt is emailed immediately. The seller only sees a 'Funded' badge." },
      { title: "Seller dispatches with evidence", desc: "The seller uploads before-photos of the packed item and hands it to the rider. You'll get a notification with the photos attached — proof the item existed and was packaged correctly." },
      { title: "Track the rider", desc: "Live map, ETA and a 6-digit pickup code appear on your dashboard. The rider must enter the code at handover, locking chain-of-custody." },
      { title: "Inspect & release", desc: "You get a 24-hour inspection window from the moment the rider marks delivered. Open the box, verify items match the evidence photos, then tap Confirm Delivery to release funds — or Report an Issue to freeze escrow." },
    ],
    callouts: [
      { title: "Multi-item purchases", body: "Buying several items from one seller? Use the Packing Slip generator to bundle them into one delivery, saving on logistics fees (1% insurance is auto-applied)." },
      { title: "Rider handover proof", body: "The rider photographs the item at pickup and again at drop-off. Both photos are attached to your order timeline and admissible as dispute evidence." },
    ],
    tip: "You have up to 24 hours to inspect items before funds auto-release.",
  },
  {
    id: "seller-flow",
    label: "Seller Flow",
    blurb: "What happens on the seller's side after you pay.",
    icon: Store,
    color: "bg-violet-100 text-violet-700",
    intro: "Understanding what the seller sees helps you know what to expect at each stage. Sellers never touch your money until you release it, but they do see order confirmations, dispatch requirements and dispute notifications in real time. Cheinly enforces evidence uploads and pickup-code verification as mandatory steps — a seller who skips them cannot progress the order.",
    steps: [
      { title: "Order notification", desc: "The seller gets a push, email and (if enabled) WhatsApp alert with your order details and a 'Funds Confirmed in Escrow' badge — the trigger for them to start packing." },
      { title: "Pre-dispatch evidence", desc: "They upload before-photos of the packed item (multi-item orders require one photo per item). Cheinly blocks dispatch scheduling until evidence is complete." },
      { title: "Rider handover with pickup code", desc: "When the rider arrives, the seller reads out the 6-digit pickup code you share. Correct code = handover locked. Wrong code = the rider refuses the parcel and Cheinly is alerted." },
      { title: "Delivery & auto-release", desc: "Once you confirm delivery (or the 24-hour window closes), the seller's True Balance is credited instantly and they can withdraw to their bank." },
      { title: "Dispute response", desc: "If you report an issue, the seller has 24 hours to respond — accept refund, counter-offer, or escalate to Cheinly mediation." },
    ],
  },
  {
    id: "escrow",
    label: "Escrow",
    blurb: "How your money stays safe between order and delivery.",
    icon: ShieldCheck,
    color: "bg-amber-100 text-amber-700",
    intro: "Cheinly's escrow is a regulated custodial account. When you pay, funds move out of your bank into a segregated Cheinly-controlled account — not into the seller's wallet. The seller sees a 'Funded' status which allows them to dispatch confidently, but they cannot withdraw, spend or transfer that money. Only three events trigger release: (1) you tap Confirm Delivery, (2) the 24-hour post-delivery window expires without a dispute, or (3) Cheinly mediation rules in the seller's favour after a dispute.",
    steps: [
      { title: "Funds enter Protected Balance", desc: "Held in a segregated Cheinly-controlled account. The seller sees the funded state but cannot access the money." },
      { title: "Triggered release", desc: "Released only after you tap Confirm Delivery or after the 24-hour post-delivery window closes without a dispute." },
      { title: "Frozen on dispute", desc: "Filing a dispute pauses escrow immediately. Neither party can move funds until mediation concludes — usually within 72 hours." },
      { title: "Refunds", desc: "Approved refunds return to your original payment method within 3–5 business days. Partial refunds work the same way — only the disputed amount is returned; the balance settles to the seller." },
    ],
    callouts: [
      { title: "What escrow doesn't cover", body: "Cash-on-delivery, off-platform payments, and buyer's-remorse returns after Confirm Delivery is tapped. Once you release funds, the transaction is considered complete." },
      { title: "Fees", body: "1.5% platform fee on funding, 1% withdrawal fee on refunds paid to your bank. Both are shown before you confirm any transaction." },
    ],
    tip: "Escrow protects every Naira — the seller can see it's funded but cannot touch it.",
  },
  {
    id: "disputes",
    label: "Disputes",
    blurb: "What to do when something goes wrong.",
    icon: Scale,
    color: "bg-rose-100 text-rose-700",
    intro: "Disputes exist for four scenarios: item not received, wrong item delivered, item damaged, and item materially different from the listing. Filing a dispute is free, freezes escrow instantly, and does not affect your buyer standing. The stronger your evidence — especially unboxing photos taken within 24 hours of delivery — the faster the verdict.",
    steps: [
      { title: "Open a dispute", desc: "From Orders → select the order → Report an Issue. Pick a category (Not Received, Wrong Item, Damaged, Not as Described) and describe the problem in your own words." },
      { title: "Upload evidence", desc: "Attach up to 6 photos and one 60-second unboxing video per item. Include the original packaging if it shows damage. Screenshots of your seller chat are welcome." },
      { title: "Seller response window", desc: "The seller has 24 hours to respond. Options: accept a full refund, propose a partial refund, propose a redelivery, or reject and escalate to Cheinly." },
      { title: "Negotiation", desc: "You can accept, counter, or decline the seller's offer. All chat and counter-offers are stored as timestamped evidence." },
      { title: "Escalation & verdict", desc: "If you can't agree, Cheinly mediators review all evidence and issue a binding verdict within 72 hours: full refund, partial refund, redelivery, or release to seller." },
    ],
    callouts: [
      { title: "Rider disputes", body: "If the rider damages an item in transit, Cheinly's insurance covers up to the declared package value. File the dispute against the delivery, not the seller — we handle the rest." },
      { title: "Frivolous disputes", body: "Repeatedly filing disputes that mediation rules against will lower your buyer standing and, after three, restrict escrow limits. Only file when you have a genuine problem." },
    ],
    tip: "Always upload at least one unboxing photo within 24 hours — it dramatically improves dispute outcomes.",
  },
  {
    id: "pickup-tracking",
    label: "Pickup Tracking",
    blurb: "Track the rider from assignment to delivered — the full Send-a-Package flow.",
    icon: Bike,
    color: "bg-sky-100 text-sky-700",
    intro: "When you use Send a Package from your dashboard, Cheinly holds the delivery fee in escrow and dispatches a verified rider. The Pickup Tracking screen is your single source of truth from the moment you book to the moment your recipient signs off. It shows a live map, the rider's identity, an animated stage timeline, and — most importantly — the 6-digit pickup code that locks chain-of-custody at handover. This guide walks you through every stage, what you should do at each one, and what the rider sees on their side.",
    steps: [
      { title: "Book the pickup", desc: "Dashboard → Send a Package. Enter pickup and drop-off addresses, package size, declared value (used for insurance), and any handling notes. The escrow fee is calculated live and locked when you confirm. You're redirected to /buyer/pickup-tracking with the order reference." },
      { title: "Stage 1 — Finding a rider", desc: "Cheinly matches the closest verified rider. This usually takes 30–90 seconds. Your map shows the pickup and drop-off pins; the rider avatar is hidden until a match is made. Escrow is already locked at this point — you cannot be double-charged." },
      { title: "Stage 2 — Rider en route to you", desc: "The rider card appears with name, plate number, vehicle, and rating. The map animates the rider's position toward your pickup pin. Use the Call or Chat buttons to send access instructions (gate code, building number, floor)." },
      { title: "Stage 3 — Rider arrived, share your pickup code", desc: "A highlighted 6-digit code appears on screen. Read it out — or tap Copy — only after you physically see the rider and the package is ready. The rider enters it in their app; a correct code unlocks the handover and photographs the parcel. A wrong code refuses the pickup and alerts Cheinly." },
      { title: "Handover confirmation", desc: "Tap 'Rider entered the code — hand over the package' to lock the handover on your side. The order transitions to In-Transit, the rider's app opens turn-by-turn navigation to the drop-off, and your recipient receives an SMS with the tracking link." },
      { title: "Stage 4 — In-transit with live ETA", desc: "The map animates the rider toward the drop-off. A live countdown ETA replaces the code panel. If the ETA increases sharply or the rider deviates from the route for more than 5 minutes, Cheinly notifies you and offers a one-tap contact-support shortcut." },
      { title: "Stage 5 — Delivered", desc: "The recipient confirms receipt (in-app OTP or in-person signature). Escrow releases the delivery fee to the rider instantly, a delivery confirmation card slides into your Pickup Tracking screen, and the order archives to Orders → Completed. A tap on Done returns you to your dashboard." },
    ],
    callouts: [
      { title: "Insurance", body: "The 1% insurance option covers loss or damage in transit up to the declared package value. If you skip it, Cheinly's baseline rider indemnity still covers up to ₦20,000." },
      { title: "Pickup code security", body: "Never share the 6-digit code over WhatsApp or SMS in advance. If a 'rider' asks for it before arriving, it's a scam attempt — cancel from the tracking screen and Cheinly will reassign." },
      { title: "Multiple stops", body: "Need one rider to hit several stops? Book each leg as a separate Send-a-Package with the same pickup address — Cheinly's dispatcher automatically bundles them onto one rider when the timing overlaps." },
      { title: "If the rider is late", body: "After the ETA elapses by 10 minutes, an Escalate button appears next to the rider card. Escalating pauses the escrow-release timer and routes you to a live support agent — no dispute filing needed." },
    ],
    faqs: [
      { q: "Can I cancel after booking?", a: "Yes — free cancellation any time before Stage 3 (rider arrival). After the rider arrives at pickup, a small trip fee applies to cover the rider's travel time; the balance is refunded within 24 hours." },
      { q: "What if I need to change the drop-off address?", a: "Tap the Chat icon on the rider card and share the new address before Stage 4. Address changes after In-Transit require the rider's agreement and may adjust the fee." },
      { q: "Does the recipient need a Cheinly account?", a: "No. They receive an SMS with a tracking link and, at drop-off, either confirm in-person or read out the 4-digit delivery OTP the rider requests." },
      { q: "What if the recipient isn't home?", a: "The rider waits 10 minutes free, then contacts you via the app. You can authorise leaving the parcel at a safe spot (photographed as proof) or reschedule for a small re-attempt fee." },
    ],
    tip: "Only share the 6-digit pickup code face-to-face when the rider physically arrives — never in advance over chat or SMS.",
  },
  {
    id: "faqs",
    label: "FAQs",
    blurb: "Quick answers to the questions we hear most.",
    icon: HelpCircle,
    color: "bg-slate-200 text-slate-700",
    intro: "The most common buyer questions, grouped by topic. Can't find your answer? Tap Contact Help Desk at the bottom — our team replies within 4 hours on business days.",
    faqs: [
      { q: "Do I need to sign up to buy?", a: "No. The first time you check out, Cheinly creates a guest profile tied to your device. Returning on the same browser drops you straight on your dashboard." },
      { q: "How long does escrow hold funds?", a: "Until you confirm delivery, or up to 24 hours after the rider marks the order as delivered if you take no action. Filing a dispute freezes escrow indefinitely until the dispute is resolved." },
      { q: "Can I cancel an order?", a: "Yes — before dispatch you can cancel for a full refund with one tap from Orders → Cancel. After dispatch, cancellation requires either the seller's agreement or a dispute for non-delivery." },
      { q: "Are there hidden fees?", a: "No hidden fees. A 1.5% platform fee is shown before you fund, a 1% withdrawal fee is shown before you request a payout, and 1% package insurance is opt-in when you send a package. Nothing is deducted silently." },
      { q: "What if the rider never arrives?", a: "Open a non-delivery dispute from Orders. Cheinly checks the rider's GPS and pickup logs — if the rider genuinely never dispatched, funds return in full within 24 hours." },
      { q: "Can I pay with cash?", a: "No — escrow only works with card, bank transfer or virtual account funding so the chain of custody is auditable. Cash-on-delivery bypasses the whole safety model." },
      { q: "How do refunds reach me?", a: "Refunds return to your original payment method within 3–5 business days. For bank-transfer funders without a saved account, we'll ask for account details at approval time." },
      { q: "Can I buy from a seller who's not on Cheinly?", a: "Yes. Use the Invite Seller flow from your dashboard — Cheinly generates a tokenized escrow link you share with the seller. They handle only that one order without a full signup, then withdraw when done." },
      { q: "How do I send my own package?", a: "Dashboard → Send a Package. Enter pickup and drop-off details, pick a size, declare the value (for insurance), and pay into escrow. A rider is dispatched and funds release to them only after your recipient confirms delivery." },
      { q: "How is my personal data used?", a: "Only for order fulfilment, dispute mediation and regulatory KYC where required. We never sell buyer data. Full policy is under Settings → Legal → Privacy Policy." },
      { q: "What happens if I lose access to my device?", a: "Sign in with Google or email on any new device. Your order history, refunds and Protected Balance are tied to your identity, not the device." },
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

          {current.intro && (
            <p className="mt-4 text-sm leading-relaxed text-foreground/80">{current.intro}</p>
          )}

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

          {current.callouts && current.callouts.length > 0 && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {current.callouts.map((c) => (
                <div key={c.title} className="rounded-xl border border-border bg-background p-4">
                  <div className="text-sm font-semibold text-foreground">{c.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
                </div>
              ))}
            </div>
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