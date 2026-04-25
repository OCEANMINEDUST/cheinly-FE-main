import { Clock, MapPin } from "lucide-react";
import { RiderShell } from "@/components/rider/RiderShell";
import { RiderTopBar } from "@/components/rider/RiderTopBar";
import { RiderBottomNav } from "@/components/rider/RiderBottomNav";
import { formatNaira, getHistory } from "@/lib/riderMock";

const RiderHistory = () => {
  const history = getHistory();
  const total = history.reduce((sum, entry) => sum + entry.payout, 0);
  return (
    <RiderShell topBar={<RiderTopBar title="Trip history" subtitle={`${history.length} completed deliveries`} />} bottomNav={<RiderBottomNav />}>
      <section className="space-y-4 px-5 py-5">
        <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 via-card to-gold/10 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Lifetime payouts</p>
          <p className="mt-1 font-display text-3xl text-foreground">{formatNaira(total)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Across all completed trips on this device.</p>
        </div>
        <div className="space-y-2">
          {history.map((entry) => (
            <div key={entry.id + entry.completedAt} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-success">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{entry.shortRef} → {entry.destination}</p>
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><Clock className="h-3 w-3" /> {entry.completedAt}</p>
              </div>
              <p className="font-display text-base text-foreground">{formatNaira(entry.payout)}</p>
            </div>
          ))}
        </div>
      </section>
    </RiderShell>
  );
};

export default RiderHistory;