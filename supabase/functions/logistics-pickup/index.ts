import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { createPickup, PROVIDER_CONFIG, type ProviderId } from "../_shared/providers.ts";

const BodySchema = z.object({
  orderId: z.string().uuid(),
  providerId: z.enum(["kwik", "gokada", "sendbox"]),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) return json({ error: "Not signed in" }, 401);

    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData.user) return json({ error: "Not signed in" }, 401);

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const { orderId, providerId } = parsed.data;

    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: order, error: orderError } = await admin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();
    if (orderError) return json({ error: orderError.message }, 500);
    if (!order) return json({ error: "Order not found" }, 404);

    const uid = userData.user.id;
    if (order.buyer_id !== uid && order.seller_id !== uid)
      return json({ error: "You are not part of this order" }, 403);

    const callbackUrl = `${supabaseUrl}/functions/v1/logistics-webhook?provider=${providerId}`;

    const result = await createPickup(providerId as ProviderId, {
      reference: order.reference,
      pickupAddress: order.pickup_address ?? "",
      dropoffAddress: order.dropoff_address ?? "",
      senderPhone: order.seller_phone ?? undefined,
      receiverPhone: order.buyer_phone ?? undefined,
      packageSize: "medium",
      declaredValue: Number(order.amount ?? 0),
      fee: Number(order.delivery_fee ?? 0),
      callbackUrl,
    });

    const { error: updateError } = await admin
      .from("orders")
      .update({
        status: "pickup_assigned",
        provider_id: result.providerId,
        provider_name: result.providerName,
        provider_request_id: result.requestId,
        pickup_code: result.pickupCode,
        tracking_url: result.trackingUrl,
        eta_minutes: result.etaMinutes,
      })
      .eq("id", orderId);
    if (updateError) return json({ error: updateError.message }, 500);

    await admin.from("order_events").insert({
      order_id: orderId,
      status: "pickup_assigned",
      source: result.live ? result.providerName : `${result.providerName} (demo mode)`,
      note: `Pickup request ${result.requestId} accepted. Pickup code ${result.pickupCode}.`,
    });

    return json({
      ...result,
      callbackUrl: PROVIDER_CONFIG[providerId as ProviderId].supportsCallback ? callbackUrl : null,
    });
  } catch (error) {
    console.error("logistics-pickup failed:", error);
    return json({ error: error instanceof Error ? error.message : "Unexpected error" }, 500);
  }
});
