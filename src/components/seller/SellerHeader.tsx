import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bell, Search, Store, X, Wallet, ShoppingBag, History, ArrowRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const links = [
  { to: "/seller/dashboard", label: "Overview" },
  { to: "/seller/transactions", label: "Transactions" },
  { to: "/seller/orders", label: "Orders" },
];

type Alert = {
  id: number;
  kind: "payout" | "payment" | "order";
  title: string;
  body: string;
  time: string;
  cta: string;
  to: string;
};

const alerts: Alert[] = [
  { id: 1, kind: "payout", title: "Payout successful", body: "₦128,000 moved to True Balance", time: "1h", cta: "View History", to: "/seller/transactions" },
  { id: 2, kind: "payment", title: "Payment received", body: "Buyer paid ₦42,500 into escrow", time: "14m", cta: "View Wallet", to: "/seller/dashboard" },
  { id: 3, kind: "order", title: "New order #ORD-3082", body: "Velvet Wrap Dress • Emerald M", time: "2m", cta: "View Order", to: "/seller/orders" },
];

const iconFor = (k: Alert["kind"]) =>
  k === "payout" ? History : k === "payment" ? Wallet : ShoppingBag;

export function SellerHeader() {
  const loc = useLocation();
  const nav = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/seller/dashboard" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold-gradient text-gold-foreground">
            <Store className="h-4 w-4" />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">Cheinly</span>
          <Badge variant="secondary" className="ml-1 hidden sm:inline-flex">Seller</Badge>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  (isActive || loc.pathname.startsWith(l.to)) && "bg-secondary text-foreground",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Search */}
          <div className={cn("flex items-center transition-all", searchOpen ? "w-56" : "w-9")}>
            {searchOpen ? (
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") { setSearchOpen(false); setQ(""); }
                    if (e.key === "Enter" && q.trim()) nav(`/seller/orders?q=${encodeURIComponent(q)}`);
                  }}
                  placeholder="Search orders, txns…"
                  className="h-9 pl-8 pr-8"
                />
                <button
                  onClick={() => { setSearchOpen(false); setQ(""); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Search">
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                  {alerts.length}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-96 p-0">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div>
                  <div className="text-sm font-semibold">Notifications</div>
                  <div className="text-xs text-muted-foreground">{alerts.length} new updates</div>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs">Mark all read</Button>
              </div>
              <ul className="max-h-96 divide-y overflow-auto">
                {alerts.map((a) => {
                  const Icon = iconFor(a.kind);
                  return (
                    <li key={a.id} className="flex gap-3 px-4 py-3 hover:bg-muted/40">
                      <div className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-full",
                        a.kind === "payout" && "bg-success/15 text-success",
                        a.kind === "payment" && "bg-primary/15 text-primary",
                        a.kind === "order" && "bg-gold/15 text-gold",
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="truncate text-sm font-medium">{a.title}</p>
                          <span className="shrink-0 text-[11px] text-muted-foreground">{a.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{a.body}</p>
                        <Button asChild size="sm" variant="outline" className="mt-2 h-7 text-xs">
                          <Link to={a.to}>{a.cta}<ArrowRight className="ml-1 h-3 w-3" /></Link>
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t p-2">
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link to="/seller/transactions">View all activity</Link>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-gold-gradient text-gold-foreground text-xs font-semibold">AO</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
