import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Search, X, ArrowRight, User, Settings, HelpCircle, LogOut, ShieldCheck, CheckCheck, ChevronRight, Bot, MessageCircle, Send } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { notificationsFor, iconFor, type Role } from "@/lib/notifications";
import { forgetBuyer } from "@/lib/buyerSession";
import { getAccountRole, setAccountRole } from "@/lib/accountRole";
import { toast } from "sonner";

const profileLinks: Record<Role, { profile: string; orders: string; help: string; home: string; name: string; initials: string; settings: string; kyc: string }> = {
  seller: { profile: "/seller/dashboard", orders: "/seller/orders", help: "/help", home: "/seller", name: "Adunni Okoye", initials: "AO", settings: "/seller/transactions", kyc: "/supplier/settings-kyc" },
  supplier: { profile: "/supplier/account", orders: "/supplier/orders", help: "/help", home: "/supplier", name: "Moniewise Supplies", initials: "MS", settings: "/supplier/settings-kyc", kyc: "/supplier/settings-kyc" },
  buyer: { profile: "/buyer/dashboard", orders: "/buyer/orders", help: "/buyer/help", home: "/buy", name: "Goodness", initials: "G", settings: "/buyer/transactions", kyc: "/buyer/help?section=kyc" },
  rider: { profile: "/rider/profile", orders: "/rider/history", help: "/help", home: "/rider", name: "Tunde A.", initials: "TA", settings: "/rider/profile/security", kyc: "/rider/document-review" },
};

const helpSuggestions = [
  { id: "escrow", title: "How escrow protects every transaction", roles: ["seller", "supplier", "buyer"] as const },
  { id: "dispute", title: "Open a dispute & upload evidence", roles: ["seller", "supplier", "buyer"] as const },
  { id: "kyc", title: "Verify your identity (KYC)", roles: ["seller", "supplier", "buyer"] as const },
  { id: "withdraw", title: "Withdraw to your bank account", roles: ["seller", "supplier", "buyer"] as const },
  { id: "invite-seller", title: "Invite a seller who isn't on Cheinly", roles: ["buyer"] as const },
  { id: "2fa", title: "Set up two-factor authentication", roles: ["seller", "supplier", "buyer"] as const },
  { id: "market-lookup", title: "Find suppliers by product", roles: ["supplier"] as const, to: "/supplier/market-lookup" },
  { id: "seller-orders", title: "Manage seller orders", roles: ["seller"] as const, to: "/seller/orders" },
];

export function HeaderActions({ role, compact = false }: { role: Role; compact?: boolean }) {
  const nav = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [readIds, setReadIds] = useState<number[]>([]);
  const alerts = notificationsFor(role);
  const unread = alerts.filter((a) => !readIds.includes(a.id));
  const profile = profileLinks[role];

  const accountRole = getAccountRole();

  const suggestions = useMemo(() => {
    const term = q.trim().toLowerCase();
    const scoped = helpSuggestions.filter((s) => (s.roles as readonly string[]).includes(accountRole) || (s.roles as readonly string[]).includes(role));
    if (!term) return scoped.slice(0, 4);
    return scoped.filter((s) => s.title.toLowerCase().includes(term)).slice(0, 5);
  }, [q]);

  const submitSearch = () => {
    if (!q.trim()) return;
    const first = suggestions[0];
    if (first) {
      nav(first.to || `/help/article/${first.id}`);
    } else {
      nav(`${profile.orders}?q=${encodeURIComponent(q)}`);
    }
    setSearchOpen(false);
    setQ("");
  };

  return (
    <div className="flex items-center gap-1.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="AI chatbot"><Bot className="h-[18px] w-[18px]" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel>
            <div className="text-sm font-medium">Cheinly AI Assistant</div>
            <div className="text-xs text-muted-foreground capitalize">{role} chatbot</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a
              href={`https://wa.me/2348000000000?text=${encodeURIComponent(`Hi Cheinly, I'm a ${role} and I need help.`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-4 w-4 text-success" /> Chat on WhatsApp
            </a>
          </DropdownMenuItem>
          {(role === "seller" || role === "supplier") && (
            <DropdownMenuItem asChild>
              <a
                href={`https://t.me/CheinlyBot?start=${role}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Send className="mr-2 h-4 w-4 text-primary" /> Chat on Telegram
              </a>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover open={searchOpen} onOpenChange={setSearchOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Search"><Search className="h-[18px] w-[18px]" /></Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[22rem] p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e)=>{if(e.key==='Enter') submitSearch(); if(e.key==='Escape'){setSearchOpen(false);setQ("");}}} placeholder="Search help articles…" className="h-9 pl-8 pr-8" />
            <button onClick={() => { setSearchOpen(false); setQ(""); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Close search"><X className="h-4 w-4" /></button>
          </div>
          <div className="mt-2 rounded-md border">
            {suggestions.length ? suggestions.map((s) => (
              <button key={s.id} onClick={() => { nav(s.to || `/help/article/${s.id}`); setSearchOpen(false); setQ(""); }} className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50">
                <span>{s.title}</span><ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
            )) : <div className="px-3 py-2 text-sm text-muted-foreground">No matches found</div>}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="h-[18px] w-[18px]" />
            {unread.length > 0 && <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">{unread.length}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[22rem] p-0">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div><div className="text-sm font-semibold">Notifications</div><div className="text-xs text-muted-foreground">{unread.length} unread updates</div></div>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setReadIds(alerts.map((a) => a.id)); toast.success("All notifications marked as read"); }}><CheckCheck className="mr-1 h-3 w-3" />Mark all read</Button>
          </div>
          <ul className="max-h-96 divide-y overflow-auto">
            {alerts.map((a) => {
              const Icon = iconFor(a.kind);
              const isRead = readIds.includes(a.id);
              return (
                <li key={a.id} className={cn("flex gap-3 px-4 py-3 hover:bg-muted/40", isRead && "opacity-70")}>
                  <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full", a.kind === "payout" && "bg-success/15 text-success", a.kind === "payment" && "bg-primary/15 text-primary", a.kind === "order" && "bg-gold/15 text-gold", a.kind === "alert" && "bg-destructive/15 text-destructive")}><Icon className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2"><p className="truncate text-sm font-medium">{a.title}</p><span className="shrink-0 text-[11px] text-muted-foreground">{a.time}</span></div>
                    <p className="text-xs text-muted-foreground">{a.body}</p>
                    <div className="mt-2 flex gap-2">
                      <Button asChild size="sm" variant="outline" className="h-7 text-xs" onClick={() => setReadIds((prev) => [...new Set([...prev, a.id])])}><Link to={a.to}>{a.cta}<ArrowRight className="ml-1 h-3 w-3" /></Link></Button>
                      {!isRead && <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setReadIds((prev) => [...new Set([...prev, a.id])])}>Mark read</Button>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" aria-label="Account menu">
            <Avatar className={cn("border", compact ? "h-8 w-8" : "h-9 w-9")}><AvatarFallback className="bg-gold-gradient text-gold-foreground text-xs font-semibold">{profile.initials}</AvatarFallback></Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel><div className="text-sm font-medium">{profile.name}</div><div className="text-xs text-muted-foreground capitalize">{role} account</div></DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => nav(profile.profile)}><User className="mr-2 h-4 w-4" /> Account settings</DropdownMenuItem>
          <DropdownMenuItem onClick={() => nav(profile.kyc)}><ShieldCheck className="mr-2 h-4 w-4" /> KYC status</DropdownMenuItem>
          <DropdownMenuItem onClick={() => nav(profile.help)}><HelpCircle className="mr-2 h-4 w-4" /> Help Centre</DropdownMenuItem>
          {accountRole === "seller" && <DropdownMenuItem onClick={() => { setAccountRole("supplier"); nav("/supplier/dashboard"); }}><Settings className="mr-2 h-4 w-4" /> Switch to Supplier</DropdownMenuItem>}
          {accountRole === "supplier" && <DropdownMenuItem onClick={() => { setAccountRole("seller"); nav("/seller/dashboard"); }}><Settings className="mr-2 h-4 w-4" /> Switch to Seller</DropdownMenuItem>}
          {role === "buyer" && (
            <DropdownMenuItem onClick={() => { forgetBuyer(); toast.success("This device has been forgotten."); }}>
              <LogOut className="mr-2 h-4 w-4" /> Forget this device
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { toast.success("Signed out"); nav("/"); }} className="text-destructive focus:text-destructive"><LogOut className="mr-2 h-4 w-4" /> Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
