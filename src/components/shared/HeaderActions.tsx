import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Search, X, ArrowRight, User, Settings, HelpCircle, LogOut } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { notificationsFor, iconFor, type Role } from "@/lib/notifications";
import { forgetBuyer } from "@/lib/buyerSession";
import { toast } from "sonner";

const profileLinks: Record<Role, { profile: string; orders: string; help: string; home: string; name: string; initials: string }> = {
  seller: { profile: "/seller/dashboard", orders: "/seller/orders", help: "/help", home: "/seller", name: "Adunni Okoye", initials: "AO" },
  buyer: { profile: "/buyer/dashboard", orders: "/buyer/orders", help: "/buyer/help", home: "/buy", name: "Goodness", initials: "G" },
  rider: { profile: "/rider/profile", orders: "/rider/history", help: "/help", home: "/rider", name: "Tunde A.", initials: "TA" },
};

export function HeaderActions({ role, compact = false }: { role: Role; compact?: boolean }) {
  const nav = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const alerts = notificationsFor(role);
  const profile = profileLinks[role];

  const submitSearch = () => {
    if (!q.trim()) return;
    nav(`${profile.orders}?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setQ("");
  };

  return (
    <div className="flex items-center gap-1.5">
      {/* Search */}
      <div className={cn("flex items-center transition-all", searchOpen ? "w-48 sm:w-56" : "w-9")}>
        {searchOpen ? (
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") { setSearchOpen(false); setQ(""); }
                if (e.key === "Enter") submitSearch();
              }}
              placeholder="Search…"
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
            <Search className="h-[18px] w-[18px]" />
          </Button>
        )}
      </div>

      {/* Notifications */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
              {alerts.length}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[22rem] p-0">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Notifications</div>
              <div className="text-xs text-muted-foreground">{alerts.length} new updates</div>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => toast.success("All notifications marked as read")}>Mark all read</Button>
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
                    a.kind === "alert" && "bg-destructive/15 text-destructive",
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
              <Link to={profile.help}>Open Help Centre</Link>
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" aria-label="Account menu">
            <Avatar className={cn("border", compact ? "h-8 w-8" : "h-9 w-9")}>
              <AvatarFallback className="bg-gold-gradient text-gold-foreground text-xs font-semibold">{profile.initials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="text-sm font-medium">{profile.name}</div>
            <div className="text-xs text-muted-foreground capitalize">{role} account</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => nav(profile.profile)}><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => nav(profile.orders)}><Settings className="mr-2 h-4 w-4" /> My activity</DropdownMenuItem>
          <DropdownMenuItem onClick={() => nav(profile.help)}><HelpCircle className="mr-2 h-4 w-4" /> Help Centre</DropdownMenuItem>
          <DropdownMenuSeparator />
          {role === "buyer" && (
            <DropdownMenuItem onClick={() => { forgetBuyer(); toast.success("This device has been forgotten."); }}>
              <LogOut className="mr-2 h-4 w-4" /> Forget this device
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => { toast.success("Signed out"); nav("/"); }} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
