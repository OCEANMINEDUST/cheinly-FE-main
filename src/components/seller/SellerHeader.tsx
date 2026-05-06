import { Link, NavLink, useLocation } from "react-router-dom";
import { Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { HeaderActions } from "@/components/shared/HeaderActions";

const links = [
  { to: "/seller/dashboard", label: "Overview" },
  { to: "/seller/transactions", label: "Transactions" },
  { to: "/seller/orders", label: "Orders" },
  { to: "/help", label: "Help Centre" },
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
                  (isActive || loc.pathname.startsWith(l.to)) && (l.to === "/help" ? "bg-primary/15 text-primary" : "bg-secondary text-foreground"),
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto"><HeaderActions role="seller" /></div>
      </div>
    </header>
  );
}
