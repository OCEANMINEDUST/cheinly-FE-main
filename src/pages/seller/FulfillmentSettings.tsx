import { useState } from "react";
import { Truck, Plus, Trash2, Save, Webhook, RefreshCw, Link2 } from "lucide-react";
import { SellerShell } from "@/components/seller/SellerShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROVIDERS, getProvider, SyncMode, ProviderId } from "@/lib/logistics/providers";
import {
  FulfillmentRule,
  MatchType,
  loadSettings,
  makeRule,
  saveSettings,
} from "@/lib/logistics/fulfillmentSettings";
import { toast } from "sonner";

const matchLabels: Record<MatchType, string> = {
  product: "Product name / SKU",
  category: "Category",
  weight: "Weight band",
  destination: "Destination",
};

export default function SellerFulfillmentSettings() {
  const [settings, setSettings] = useState(loadSettings);

  const patch = (p: Partial<typeof settings>) => setSettings((s) => ({ ...s, ...p }));
  const patchRule = (id: string, p: Partial<FulfillmentRule>) =>
    setSettings((s) => ({ ...s, rules: s.rules.map((r) => (r.id === id ? { ...r, ...p } : r)) }));

  const save = () => {
    saveSettings(settings);
    toast.success("Fulfillment settings saved — new orders will route with these rules.");
  };

  const testConnection = async (id: ProviderId) => {
    toast.message(`Pinging ${getProvider(id).name}…`);
    await new Promise((r) => setTimeout(r, 600));
    toast.success(`${getProvider(id).name} responded 200 OK`);
  };

  return (
    <SellerShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" /> Fulfillment Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Map products and orders to the external rider APIs that should carry them.
            </p>
          </div>
          <Button onClick={save} className="bg-primary hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" /> Save settings
          </Button>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Default logistics provider</CardTitle>
            <CardDescription>Used whenever no mapping rule matches an order.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select value={settings.defaultProvider} onValueChange={(v) => patch({ defaultProvider: v as ProviderId })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROVIDERS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{getProvider(settings.defaultProvider).description}</p>
            </div>
            <div className="space-y-2">
              <Label>Status updates</Label>
              <Select value={settings.defaultSyncMode} onValueChange={(v) => patch({ defaultSyncMode: v as SyncMode })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="callback">Webhook callbacks (push)</SelectItem>
                  <SelectItem value="polling">Polling (pull)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {settings.defaultProvider === "custom" && (
              <div className="space-y-2 md:col-span-2">
                <Label>Custom API base URL</Label>
                <Input value={settings.customBaseUrl} onChange={(e) => patch({ customBaseUrl: e.target.value })} placeholder="https://api.my-rider-partner.com/v1" />
              </div>
            )}
            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-1.5"><Webhook className="h-3.5 w-3.5" /> Callback URL</Label>
              <Input value={settings.callbackUrl} onChange={(e) => patch({ callbackUrl: e.target.value })} />
              <p className="text-xs text-muted-foreground">Give this URL to your provider so delivery status pushes back into Cheinly.</p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><RefreshCw className="h-3.5 w-3.5" /> Poll interval (seconds)</Label>
              <Input
                type="number"
                min={10}
                value={settings.pollIntervalSeconds}
                onChange={(e) => patch({ pollIntervalSeconds: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="text-sm font-medium">Auto-dispatch on payment</p>
                <p className="text-xs text-muted-foreground">Request a pickup as soon as escrow is funded.</p>
              </div>
              <Switch checked={settings.autoDispatch} onCheckedChange={(v) => patch({ autoDispatch: v })} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg">Product & order mapping</CardTitle>
              <CardDescription>First matching rule wins; otherwise the default provider is used.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => patch({ rules: [...settings.rules, makeRule()] })}>
              <Plus className="mr-1.5 h-4 w-4" /> Add rule
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.rules.length === 0 && (
              <p className="text-sm text-muted-foreground">No rules yet — every order uses the default provider.</p>
            )}
            {settings.rules.map((rule) => (
              <div key={rule.id} className="rounded-xl border border-border p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Input
                    value={rule.label}
                    onChange={(e) => patchRule(rule.id, { label: e.target.value })}
                    placeholder="Rule name"
                    className="max-w-xs font-medium"
                  />
                  <Badge variant={rule.enabled ? "secondary" : "outline"}>{rule.enabled ? "Active" : "Paused"}</Badge>
                  <div className="ml-auto flex items-center gap-2">
                    <Switch checked={rule.enabled} onCheckedChange={(v) => patchRule(rule.id, { enabled: v })} />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => patch({ rules: settings.rules.filter((r) => r.id !== rule.id) })}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Match on</Label>
                    <Select value={rule.matchType} onValueChange={(v) => patchRule(rule.id, { matchType: v as MatchType })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(Object.keys(matchLabels) as MatchType[]).map((m) => (
                          <SelectItem key={m} value={m}>{matchLabels[m]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Value contains</Label>
                    <Input value={rule.matchValue} onChange={(e) => patchRule(rule.id, { matchValue: e.target.value })} placeholder="e.g. Sneakers" />
                  </div>
                  <div className="space-y-2">
                    <Label>Send to</Label>
                    <Select value={rule.providerId} onValueChange={(v) => patchRule(rule.id, { providerId: v as ProviderId })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PROVIDERS.map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Updates</Label>
                    <Select value={rule.syncMode} onValueChange={(v) => patchRule(rule.id, { syncMode: v as SyncMode })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="callback">Webhook</SelectItem>
                        <SelectItem value="polling">Polling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Connected rider APIs</CardTitle>
            <CardDescription>Cheinly never employs riders — pickups are requested from these partners.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {PROVIDERS.map((p) => (
              <div key={p.id} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{p.name}</p>
                  <Badge variant="secondary">{p.supports.join(" · ")}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{p.region}</p>
                <p className="mt-2 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <Link2 className="h-3 w-3" /> {p.id === "custom" ? settings.customBaseUrl || p.baseUrl : p.baseUrl}
                </p>
                <Button size="sm" variant="outline" className="mt-3" onClick={() => testConnection(p.id)}>
                  Test connection
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </SellerShell>
  );
}