import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Camera, Check, ImageOff, MapPin, Package, Phone, Star, Truck } from "lucide-react";
import { SellerShell } from "@/components/seller/SellerShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { OrderCompletedDialog, ReturnVerifiedDialog } from "@/components/seller/SettlementModals";
import { DispatchPhotos, getActiveOrderId, getDispatchPhotos, getOrderById } from "@/lib/sellerMock";

const steps = [
  { key: "accepted", label: "Order accepted", time: "10:02 AM", done: true },
  { key: "picked", label: "Picked up by rider", time: "10:48 AM", done: true },
  { key: "transit", label: "In transit", time: "Now", done: true, current: true },
  { key: "delivered", label: "Delivered", time: "—", done: false },
];

export default function SellerTracking() {
  const [params] = useSearchParams();
  const orderId = useMemo(() => params.get("orderId") || getActiveOrderId(), [params]);
  const order = getOrderById(orderId);
  const [photos, setPhotos] = useState<DispatchPhotos>({ before: null, after: null });
  useEffect(() => setPhotos(getDispatchPhotos(orderId)), [orderId]);

  function scrollToEvidence() {
    document.getElementById("dispatch-evidence")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <SellerShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Live tracking</h1>
          <p className="text-sm text-muted-foreground">
            Order {orderId}{order ? ` • ${order.buyer}` : ""} • Tunde is en route to buyer
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(photos.before || photos.after) && (
            <button
              type="button"
              onClick={scrollToEvidence}
              className="group flex items-center gap-1.5 rounded-md border bg-card p-1 pr-2 shadow-sm transition hover:border-primary/40"
              aria-label="Jump to dispatch evidence"
            >
              {(["before", "after"] as const).map((k) => (
                <div key={k} className="relative">
                  {photos[k] ? (
                    <img
                      src={photos[k] as string}
                      alt={`${k} packaging thumbnail`}
                      className="h-9 w-9 rounded object-cover ring-1 ring-border"
                    />
                  ) : (
                    <div className="grid h-9 w-9 place-items-center rounded bg-secondary text-muted-foreground">
                      <ImageOff className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                Evidence
              </span>
            </button>
          )}
          <div className="flex gap-2">
          <OrderCompletedDialog>
            <Button variant="outline" size="sm">Mark completed</Button>
          </OrderCompletedDialog>
          <ReturnVerifiedDialog>
            <Button variant="outline" size="sm">Return verified</Button>
          </ReturnVerifiedDialog>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: Map + rider */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="relative h-[360px] w-full bg-[hsl(40_15%_92%)]">
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(hsl(0 0% 80% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 80% / 0.5) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 360" preserveAspectRatio="none">
                <path
                  d="M 60 300 C 180 220, 240 260, 320 180 S 480 80, 540 60"
                  stroke="hsl(178 55% 42%)"
                  strokeWidth="4"
                  strokeDasharray="8 6"
                  fill="none"
                />
              </svg>
              <div className="absolute left-[10%] top-[80%] flex flex-col items-center">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="mt-1 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium shadow">Pickup</span>
              </div>
              <div className="absolute left-[55%] top-[45%] flex flex-col items-center">
                <div className="grid h-10 w-10 animate-pulse place-items-center rounded-full bg-gold text-gold-foreground shadow-xl">
                  <Truck className="h-5 w-5" />
                </div>
                <span className="mt-1 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium shadow">Rider</span>
              </div>
              <div className="absolute right-[6%] top-[10%] flex flex-col items-center">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-success text-success-foreground shadow-lg">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="mt-1 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium shadow">Buyer</span>
              </div>
              <div className="absolute bottom-3 left-3 rounded-md bg-background/90 px-2 py-1 text-xs shadow">
                ETA · 14 min
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Rider contact</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gold-gradient text-gold-foreground">TB</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">Tunde Balogun</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-gold text-gold" /> 4.9 · Honda CG 125 · LAG-432-XR
                </div>
              </div>
              <Button variant="outline" size="sm"><Phone className="mr-1 h-4 w-4" /> Call</Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Timeline + package */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Order timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-5 border-l border-border pl-5">
                {steps.map((s) => (
                  <li key={s.key} className="relative">
                    <span
                      className={
                        "absolute -left-[27px] grid h-5 w-5 place-items-center rounded-full border-2 " +
                        (s.done
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground")
                      }
                    >
                      {s.done ? <Check className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />}
                    </span>
                    <div className="flex items-center justify-between">
                      <div className={"text-sm " + (s.done ? "font-medium" : "text-muted-foreground")}>{s.label}</div>
                      <div className="text-xs text-muted-foreground">{s.time}</div>
                    </div>
                    {s.current && (
                      <Badge variant="outline" className="mt-1 border-primary/40 text-primary">
                        Current
                      </Badge>
                    )}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Package details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-secondary text-muted-foreground">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">Velvet Wrap Dress + 2 items</div>
                  <div className="text-xs text-muted-foreground">3 items · 1.2 kg · Fragile</div>
                </div>
              </div>
              <div className="rounded-md border bg-secondary/40 p-3 text-xs">
                <div className="mb-1 font-medium">Drop-off address</div>
                <div className="text-muted-foreground">12 Bourdillon Rd, Ikoyi, Lagos</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-md border p-2">
                  <div className="text-muted-foreground">Order value</div>
                  <div className="font-semibold">₦42,500</div>
                </div>
                <div className="rounded-md border p-2">
                  <div className="text-muted-foreground">Escrow</div>
                  <div className="font-semibold text-primary">Active</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card id="dispatch-evidence">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Camera className="h-4 w-4 text-primary" /> Dispatch evidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {(["before", "after"] as const).map((k) => {
                  const src = photos[k];
                  return (
                    <div key={k} className="space-y-1">
                      <div className="text-xs font-medium capitalize text-muted-foreground">{k} packaging</div>
                      <div className="relative aspect-square overflow-hidden rounded-md border bg-secondary/40">
                        {src ? (
                          <img src={src} alt={`${k} packaging`} className="h-full w-full object-cover" />
                        ) : (
                          <div className="grid h-full place-items-center text-muted-foreground">
                            <ImageOff className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {!photos.before && !photos.after && (
                <div className="mt-3 text-xs text-muted-foreground">
                  No photos uploaded yet. Add them on the dispatch screen.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SellerShell>
  );
}