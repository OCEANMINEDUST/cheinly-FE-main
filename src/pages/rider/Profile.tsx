import { Bike, FileText, Mail, Phone, ShieldCheck, Star, Wallet } from "lucide-react";
import { RiderShell } from "@/components/rider/RiderShell";
import { RiderTopBar } from "@/components/rider/RiderTopBar";
import { RiderBottomNav } from "@/components/rider/RiderBottomNav";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatNaira, getRider } from "@/lib/riderMock";

const RiderProfile = () => {
  const rider = getRider();
  return (
    <RiderShell topBar={<RiderTopBar title="Profile" subtitle={`Rider ID • ${rider.id}`} />} bottomNav={<RiderBottomNav />}>
      <section className="space-y-5 px-5 py-5">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-gold/10 p-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-3xl">
            {rider.name.split(" ").map((p) => p[0]).join("")}
          </div>
          <div>
            <p className="font-display text-2xl text-foreground">{rider.name}</p>
            <p className="text-xs text-muted-foreground">Joined {rider.joinedAt}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary"><ShieldCheck className="mr-1 h-3 w-3" /> Verified</Badge>
            <Badge variant="outline" className="border-gold/40 bg-gold/10 text-gold"><Star className="mr-1 h-3 w-3 fill-gold" /> {rider.rating}</Badge>
          </div>
        </div>

        <div className="space-y-1 rounded-xl border border-border bg-card p-2">
          <Row icon={Mail} label="Email" value={rider.email} />
          <Separator />
          <Row icon={Phone} label="Phone" value={rider.phone} />
          <Separator />
          <Row icon={Bike} label="Vehicle" value={`${rider.vehicle} • ${rider.plate}`} />
        </div>

        <div className="space-y-1 rounded-xl border border-border bg-card p-2">
          <Row icon={Wallet} label="This week's earnings" value={formatNaira(rider.earningsWeek)} />
          <Separator />
          <Row icon={FileText} label="Trips completed" value={`${rider.trips}`} />
        </div>
      </section>
    </RiderShell>
  );
};

const Row = ({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) => (
  <div className="flex items-center justify-between gap-3 px-3 py-3">
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      {label}
    </div>
    <span className="text-right text-sm font-medium text-foreground">{value}</span>
  </div>
);

export default RiderProfile;