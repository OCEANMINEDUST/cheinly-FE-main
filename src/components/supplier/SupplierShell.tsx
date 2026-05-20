import { Link, NavLink } from "react-router-dom";
import { PackageCheck } from "lucide-react";
import { HeaderActions } from "@/components/shared/HeaderActions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const links = [
  { to: "/supplier/dashboard", label: "Overview" },
  { to: "/supplier/orders", label: "Orders" },
  { to: "/supplier/transactions", label: "Transactions" },
  { to: "/supplier/onboarding", label: "Onboarding" },
  { to: "/supplier/market-lookup", label: "Product Finder" },
];

export function SupplierShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background bg-hero">
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 lg:px-8">
          <Link to="/supplier/dashboard" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold-gradient text-gold-foreground"><PackageCheck className="h-4 w-4" /></div>
            <span className="font-display text-xl">MONIEWISE</span>
            <Badge variant="secondary" className="ml-1">Supplier</Badge>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({isActive}) => cn("px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground", isActive && "bg-secondary text-foreground")}>{l.label}</NavLink>
            ))}
          </nav>
          <div className="ml-auto"><HeaderActions role="seller" /></div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">{children}</main>
    </div>
  );
}
