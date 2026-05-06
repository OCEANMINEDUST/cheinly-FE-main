import { Link, NavLink, useLocation } from "react-router-dom";
import { Lock } from "lucide-react";
import logo from "@/assets/cheinly-logo.jpeg";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { HeaderActions } from "@/components/shared/HeaderActions";

interface BuyerHeaderProps {
  variant?: "checkout" | "dashboard";
}

export const BuyerHeader = ({ variant = "checkout" }: BuyerHeaderProps) => {
  const location = useLocation();
  const isDashboard = variant === "dashboard";

  return (
    <header className="border-b border-border/60 bg-card/60 backdrop-blur-sm sticky top-0 z-30">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Cheinly" className="h-8 w-8 rounded-md object-cover ring-1 ring-gold/40" />
            <span className="font-display text-xl text-gold tracking-wide">CHEINLY</span>
          </Link>
          {isDashboard && (
            <nav className="hidden md:flex items-center gap-1 text-sm">
              {[
                { to: "/buyer/dashboard", label: "Overview" },
                { to: "/buyer/transactions", label: "Transactions" },
                { to: "/buyer/orders", label: "Orders" },
                { to: "/buyer/help", label: "Help Centre" },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md transition-colors ${
                      isActive || location.pathname === item.to
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isDashboard ? (
            <HeaderActions role="buyer" />
          ) : (
            <Badge variant="outline" className="hidden sm:inline-flex gap-1.5 border-primary/40 text-primary">
              <Lock className="h-3 w-3" /> Secure Checkout
            </Badge>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};