import { Building2, ChevronRight, KeyRound, Lock, LogOut, ShieldCheck, Star, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RiderShell } from "@/components/rider/RiderShell";
import { RiderTopBar } from "@/components/rider/RiderTopBar";
import { RiderBottomNav } from "@/components/rider/RiderBottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRider, resetRiderDemo } from "@/lib/riderMock";
import { toast } from "sonner";

const RiderProfile = () => {
  const rider = getRider();
  const navigate = useNavigate();

  const sections: { title: string; items: { icon: React.ComponentType<{ className?: string }>; label: string; sub?: string; to: string }[] }[] = [
    {
      title: "Personal Information",
      items: [
        { icon: User, label: "Profile details", sub: `${rider.name} • ${rider.email}`, to: "/rider/profile/personal" },
      ],
    },
    {
      title: "Bank Details",
      items: [
        { icon: Building2, label: "Payout account", sub: "Manage where earnings are sent", to: "/rider/profile/bank" },
      ],
    },
    {
      title: "Security",
      items: [
        { icon: Lock, label: "Change password", to: "/rider/profile/security?type=password" },
        { icon: KeyRound, label: "Change PIN", to: "/rider/profile/security?type=pin" },
      ],
    },
  ];

  const signOut = () => {
    resetRiderDemo();
    toast.success("Signed out — demo reset.");
    navigate("/rider", { replace: true });
  };

  return (
    <RiderShell topBar={<RiderTopBar title="Profile" subtitle={`Rider ID • ${rider.id}`} />} bottomNav={<RiderBottomNav />}>
      <section className="space-y-5 px-5 py-5">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-gold/10 p-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-3xl">
            {rider.name.split(" ").map((p) => p[0]).join("")}
          </div>
          <div>
            <p className="font-display text-2xl text-foreground">{rider.name}</p>
            <p className="text-xs text-muted-foreground">{rider.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary"><ShieldCheck className="mr-1 h-3 w-3" /> Verified</Badge>
            <Badge variant="outline" className="border-gold/40 bg-gold/10 text-gold"><Star className="mr-1 h-3 w-3 fill-gold" /> {rider.rating}</Badge>
          </div>
        </div>

        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{section.title}</p>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              {section.items.map((item, idx) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.to)}
                  className={`flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-muted ${idx > 0 ? "border-t border-border" : ""}`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    {item.sub ? <p className="truncate text-xs text-muted-foreground">{item.sub}</p> : null}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </section>
    </RiderShell>
  );
};

export default RiderProfile;