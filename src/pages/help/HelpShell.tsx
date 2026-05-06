import { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Bell, Search, Wallet } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeaderActions } from "@/components/shared/HeaderActions";

const links = [
  { to: "/seller/dashboard", label: "Overview" },
  { to: "/seller/transactions", label: "Transactions" },
  { to: "/seller/orders", label: "Orders" },
  { to: "/help", label: "Help Centre" },
];

export function HelpShell({ children }: { children: ReactNode }) {
  const loc = useLocation();
  return (
    <div className="min-h-screen bg-[hsl(210_20%_98%)] text-slate-900">
      <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">
              <Wallet className="h-4 w-4" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Moniewise</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={() =>
                  cn(
                    "rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900",
                    (l.to === "/help" ? loc.pathname.startsWith("/help") : loc.pathname.startsWith(l.to)) &&
                      (l.to === "/help" ? "bg-blue-600 text-white hover:text-white" : "bg-slate-100 text-slate-900"),
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
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}