import { Link, NavLink, useLocation } from "react-router-dom";
import { Bell, Search, Store } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const links = [
  { to: "/seller/dashboard", label: "Overview" },
  { to: "/seller/transactions", label: "Transactions" },
  { to: "/seller/orders", label: "Orders" },
];

const alerts = [
  { id: 1, title: "New order #ORD-3082", body: "Buyer paid into escrow • ₦42,500", time: "2m" },
  { id: 2, title: "Rider arrived", body: "Tunde is at your pickup point", time: "14m" },
  { id: 3, title: "Payout released", body: "₦128,000 moved to True Balance", time: "1h" },
];

export function SellerHeader() {
  const loc = useLocation();
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
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Alerts</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {alerts.map((a) => (
                <DropdownMenuItem key={a.id} className="flex flex-col items-start gap-0.5 py-2">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-sm font-medium">{a.title}</span>
                    <span className="text-xs text-muted-foreground">{a.time}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{a.body}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-gold-gradient text-gold-foreground text-xs font-semibold">
              AO
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}