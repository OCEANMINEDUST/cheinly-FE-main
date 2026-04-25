import { Menu, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LogOut, FileText, Wallet, HelpCircle, Settings, ShieldCheck } from "lucide-react";
import { getRider, resetRiderDemo, formatNaira } from "@/lib/riderMock";
import { toast } from "sonner";

interface RiderTopBarProps {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}

export const RiderTopBar = ({ title, subtitle, trailing }: RiderTopBarProps) => {
  const rider = getRider();
  const navigate = useNavigate();

  const handleSignOut = () => {
    resetRiderDemo();
    toast.success("Signed out — demo reset.");
    navigate("/rider", { replace: true });
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <div className="bg-gradient-to-br from-primary/10 via-background to-gold/10 px-5 pb-5 pt-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-xl">
                {rider.name.split(" ").map((p) => p[0]).join("")}
              </div>
              <div>
                <p className="font-medium text-foreground">{rider.name}</p>
                <p className="text-xs text-muted-foreground">Rider ID • {rider.id}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                <ShieldCheck className="mr-1 h-3 w-3" /> {rider.status === "online" ? "Online" : rider.status === "offline" ? "Offline" : "Approved"}
              </Badge>
              <Badge variant="outline" className="border-gold/40 bg-gold/10 text-gold">
                {formatNaira(rider.earningsWeek)} this week
              </Badge>
            </div>
          </div>
          <SheetHeader className="px-5 pt-4">
            <SheetTitle className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Menu</SheetTitle>
          </SheetHeader>
          <Separator />
          <nav className="flex flex-col px-2 py-2 text-sm">
            {[
              { to: "/rider/dashboard", icon: Wallet, label: "Earnings & wallet" },
              { to: "/rider/history", icon: FileText, label: "Trip history" },
              { to: "/rider/profile", icon: Settings, label: "Account settings" },
              { to: "/rider/profile", icon: HelpCircle, label: "Support" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.to)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-foreground hover:bg-muted"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" /> {item.label}
              </button>
            ))}
          </nav>
          <Separator />
          <div className="px-5 py-4">
            <Button variant="outline" className="w-full" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg leading-tight text-foreground">{title}</p>
        {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      {trailing ?? (
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};