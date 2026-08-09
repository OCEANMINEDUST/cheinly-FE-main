import { useState, useMemo } from "react";
import { Plus, AlertTriangle, ShieldCheck, Webhook, Trash2, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type MappingRule = {
  id: string;
  conditionType: "destination" | "weight";
  conditionValue: string;
  provider: string;
};

// Mock Webhook Data
const mockWebhooks = [
  {
    id: "wh_109283",
    timestamp: "2026-08-09T10:18:22Z",
    provider: "GIG Logistics",
    event: "status_update",
    payload: '{"orderId":"123","status":"IN_TRANSIT","code":"402915"}',
    hmacValid: true,
  },
  {
    id: "wh_109284",
    timestamp: "2026-08-09T10:20:15Z",
    provider: "Unknown",
    event: "status_update",
    payload: '{"orderId":"123","status":"DELIVERED"}',
    hmacValid: false,
  },
];

export function LogisticsSettings() {
  const [rules, setRules] = useState<MappingRule[]>([
    { id: "1", conditionType: "destination", conditionValue: "Lagos", provider: "GIG Logistics" },
    { id: "2", conditionType: "weight", conditionValue: "< 5kg", provider: "Kwik Delivery" },
  ]);

  const [newRule, setNewRule] = useState<Partial<MappingRule>>({
    conditionType: "destination",
    conditionValue: "",
    provider: "GIG Logistics",
  });

  const addRule = () => {
    if (!newRule.conditionValue) return;
    setRules([...rules, { ...newRule, id: Date.now().toString() } as MappingRule]);
    setNewRule({ ...newRule, conditionValue: "" });
  };

  const removeRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  // Detect Conflicts
  const conflicts = useMemo(() => {
    const destRules = rules.filter((r) => r.conditionType === "destination");
    const weightRules = rules.filter((r) => r.conditionType === "weight");
    
    const issues: string[] = [];
    
    // Exact duplicate checks
    const seenDests = new Set();
    destRules.forEach(r => {
      if (seenDests.has(r.conditionValue.toLowerCase())) {
        issues.push(`Conflict Detected: Multiple rules target the destination "${r.conditionValue}". The most recently added rule will override previous ones.`);
      }
      seenDests.add(r.conditionValue.toLowerCase());
    });

    // Overlap checks (Destination vs Weight)
    if (destRules.length > 0 && weightRules.length > 0) {
      issues.push(`Overlap Warning: You have both destination and weight rules. For a < 5kg package going to Lagos, the destination rule (Lagos -> ${destRules[0]?.provider}) will take precedence over the weight rule (< 5kg -> ${weightRules[0]?.provider}).`);
    }

    return issues;
  }, [rules]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fulfillment Mapping Rules</CardTitle>
          <CardDescription>Automatically route orders to specific logistics providers based on package weight or destination.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {conflicts.length > 0 && (
            <div className="space-y-2 mb-4">
              {conflicts.map((conflict, i) => (
                <Alert variant="destructive" key={i} className="bg-destructive/10 border-destructive/20 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Rule Conflict</AlertTitle>
                  <AlertDescription>{conflict}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-[150px_1fr_200px_auto] items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Condition</label>
              <Select 
                value={newRule.conditionType} 
                onValueChange={(v: "destination" | "weight") => setNewRule({ ...newRule, conditionType: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="destination">Destination</SelectItem>
                  <SelectItem value="weight">Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Value</label>
              <Input 
                placeholder={newRule.conditionType === "destination" ? "e.g. Lagos, Abuja" : "e.g. < 5kg, > 10kg"} 
                value={newRule.conditionValue}
                onChange={(e) => setNewRule({ ...newRule, conditionValue: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Provider</label>
              <Select 
                value={newRule.provider} 
                onValueChange={(v) => setNewRule({ ...newRule, provider: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GIG Logistics">GIG Logistics</SelectItem>
                  <SelectItem value="Kwik Delivery">Kwik Delivery</SelectItem>
                  <SelectItem value="DHL">DHL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={addRule} className="mb-0.5"><Plus className="mr-2 h-4 w-4" /> Add Rule</Button>
          </div>

          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Condition</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Assigned Provider</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No rules defined. Default provider will be used.</TableCell></TableRow>
                )}
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="capitalize">{rule.conditionType}</TableCell>
                    <TableCell className="font-medium">{rule.conditionValue}</TableCell>
                    <TableCell><Badge variant="secondary">{rule.provider}</Badge></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => removeRule(rule.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5 text-primary" /> Webhook Audit Logs
              </CardTitle>
              <CardDescription>Securely verify and monitor real-time status callbacks from logistics providers.</CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/5 text-primary">Listening on /api/webhooks/logistics</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>HMAC Verification</TableHead>
                  <TableHead>Payload (Snipped)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockWebhooks.map((wh) => (
                  <TableRow key={wh.id} className={!wh.hmacValid ? "bg-destructive/5" : ""}>
                    <TableCell className="text-xs text-muted-foreground">{new Date(wh.timestamp).toLocaleTimeString()}</TableCell>
                    <TableCell className="font-medium">{wh.provider}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{wh.event}</Badge></TableCell>
                    <TableCell>
                      {wh.hmacValid ? (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                          <ShieldCheck className="h-3.5 w-3.5" /> Valid Signature
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-destructive font-medium">
                          <ShieldAlert className="h-3.5 w-3.5" /> Invalid Signature
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs max-w-[200px] truncate" title={wh.payload}>
                      {wh.payload}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
