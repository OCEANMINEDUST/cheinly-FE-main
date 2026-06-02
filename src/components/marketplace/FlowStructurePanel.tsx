import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { flowByKey, marketplaceFlows, roleLabels, type FlowKey, type MarketplaceRole } from "./flowStructure";
import { cn } from "@/lib/utils";

type FlowStructurePanelProps = {
  role: MarketplaceRole;
  active: FlowKey;
  compact?: boolean;
};

export function FlowStructurePanel({ role, active, compact = false }: FlowStructurePanelProps) {
  const activeFlow = flowByKey[active];
  const ActiveIcon = activeFlow.icon;

  if (compact) {
    return (
      <Card className="border-primary/20 bg-primary/5 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <ActiveIcon className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base">{roleLabels[role]} {activeFlow.label} structure</CardTitle>
              <p className="text-xs text-muted-foreground">{activeFlow.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {activeFlow.sections.map((section) => (
            <div key={section.title} className="rounded-lg border bg-background/80 p-3">
              <p className="text-sm font-semibold text-foreground">{section.title}</p>
              <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-1.5">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">Final navigation</Badge>
        <h2 className="mt-2 font-display text-2xl text-foreground">Marketplace flow structure</h2>
        <p className="text-sm text-muted-foreground">The {roleLabels[role].toLowerCase()} workspace is grouped into Overview, Transactions, Orders, and Disputes.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {marketplaceFlows.map((flow) => {
          const Icon = flow.icon;
          const selected = flow.key === active;
          return (
            <Card key={flow.key} className={cn("transition-colors", selected && "border-primary/40 bg-primary/5")}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className={cn("grid h-9 w-9 place-items-center rounded-lg", selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">{flow.label}</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">{flow.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {flow.sections.map((section) => (
                  <div key={section.title}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground">{section.title}</p>
                    <p className="text-xs text-muted-foreground">{section.items.join(" • ")}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
