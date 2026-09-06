import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { mapProviderStatus, PROVIDER_CONFIG, type ProviderId } from "../_shared/providers.ts";

// Public callback endpoint the logistics partners POST to when a pickup
// changes state. It writes straight to the order, which the buyer and seller
// screens are subscribed to in real time — no polling needed.

const BodySchema = z.object({
  request_id: z.string().min(1).max(200).optional(),
  reference: z.string().min(1).max(200).optional(),
  status: z.string().min(1).max(100),
  note: z.string().max(500).optional(),
  eta_minutes: z.number().int().min(0).max(10000).optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const url = new URL(req.url);
    const provider = (url.searchParams.get("provider") ?? "") as ProviderId;
    if (!PROVIDER_CONFIG[provider]) return json({ error: "Unknown provider" }, 400);

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const { request_id, reference, status, note, eta_minutes } = parsed.data;
    if (!request_id && !reference) return json({ error: "request_id or reference is required" }, 400);

    const mapped = mapProviderStatus(status);
    if (!mapped) return json({ ok: true, ignored: status });

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const query = admin.from("orders").select("id,status").limit(1);
    const { data: orders, error: findError } = request_id
      ? await query.eq("provider_request_id", request_id)
      : await query.eq("reference", reference!);
    if (findError) return json({ error: findError.message }, 500);
    const order = orders?.[0];
    if (!order) return json({ error: "Order not found for this pickup" }, 404);

    const patch: Record<string, unknown> = { status: mapped };
    if (typeof eta_minutes === "number") patch.eta_minutes = eta_minutes;
    if (mapped === "delivered") {
      patch.delivered_at = new Date().toISOString();
      patch.eta_minutes = 0;
    }

    const { error: updateError } = await admin.from("orders").update(patch).eq("id", order.id);
    if (updateError) return json({ error: updateError.message }, 500);

    await admin.from("order_events").insert({
      order_id: order.id,
      status: mapped,
      source: PROVIDER_CONFIG[provider].name,
      note: note ?? `Status update: ${status}`,
    });

    return json({ ok: true, orderId: order.id, status: mapped });
  } catch (error) {
    console.error("logistics-webhook failed:", error);
    return json({ error: error instanceof Error ? error.message : "Unexpected error" }, 500);
  }
});
