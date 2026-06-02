import { Link, NavLink } from "react-router-dom";
import { PackageCheck, ChevronDown } from "lucide-react";
import { HeaderActions } from "@/components/shared/HeaderActions";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { to: "/supplier/dashboard", label: "Overview" },
  { to: "/supplier/orders", label: "Orders" },
  { to: "/supplier/transactions", label: "Transactions" },
  { to: "/supplier/fulfillment", label: "Fulfillment" },
  { to: "/supplier/market-lookup", label: "Product Finder" },
];

const moreLinks = [
  { to: "/supplier/dispute-review", label: "Dispute Review" },
  { to: "/supplier/return-tracking", label: "Return Tracking" },
  { to: "/supplier/return-inspection", label: "Return Inspection" },
  { to: "/supplier/account", label: "Account" },
  { to: "/supplier/performance", label: "Performance" },
  { to: "/supplier/tier-progress", label: "Tier Progress" },
  { to: "/supplier/settings-kyc", label: "Settings & KYC" },
  { to: "/supplier/onboarding", label: "Onboarding" },
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
            {primaryLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={({isActive}) => cn("px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground", isActive && "bg-secondary text-foreground")}>{l.label}</NavLink>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 outline-none">
                More <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                {moreLinks.map((l) => (
                  <DropdownMenuItem key={l.to} asChild>
                    <NavLink to={l.to}>{l.label}</NavLink>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          <div className="ml-auto"><HeaderActions role="supplier" /></div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">{children}</main>
    </div>
  );
}
