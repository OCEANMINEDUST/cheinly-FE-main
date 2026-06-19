import { ReactNode, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Wallet, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { HeaderActions } from "@/components/shared/HeaderActions";
import { Button } from "@/components/ui/button";
import { getAccountRole } from "@/lib/accountRole";



export function HelpShell({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const accountRole = getAccountRole();
  const base = accountRole === "supplier" ? "/supplier" : "/seller";
  const links = [
    { to: `${base}/dashboard`, label: "Overview" },
    { to: `${base}/transactions`, label: "Transactions" },
    { to: `${base}/orders`, label: "Orders" },
    { to: "/help", label: "Help Centre", activeOnly: true },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900">
      <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white"><Wallet className="h-4 w-4" /></div>
            <span className="text-xl font-semibold tracking-tight">cheinly</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink key={l.to+l.label} to={l.to} className={() => cn("rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900", ((l.activeOnly && loc.pathname === "/help") || (!l.activeOnly && loc.pathname.startsWith(l.to))) && (l.to === "/help" ? "bg-blue-600 text-white hover:text-white" : "bg-slate-100 text-slate-900"))}>{l.label}</NavLink>
            ))}
          </nav>
          <div className="ml-auto hidden md:block"><HeaderActions role={accountRole} /></div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Open menu">{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button>
        </div>
        {mobileOpen && (
          <div className="border-t bg-white px-4 py-3 md:hidden">
            <nav className="mb-3 grid gap-2">
              {links.map((l) => (
                <NavLink key={l.to+l.label+"m"} to={l.to} onClick={() => setMobileOpen(false)} className={() => cn("rounded-lg px-3 py-2 text-sm font-medium text-slate-600", ((l.activeOnly && loc.pathname === "/help") || (!l.activeOnly && loc.pathname.startsWith(l.to))) && "bg-blue-50 text-blue-700")}>{l.label}</NavLink>
              ))}
            </nav>
            <div className="flex justify-end"><HeaderActions role={accountRole} compact /></div>
          </div>
        )}
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
