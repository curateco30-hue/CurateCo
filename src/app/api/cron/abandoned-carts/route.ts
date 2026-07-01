import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { notifyCartAbandonment } from "@/lib/actions/notify";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();
  const cutoff = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();

  const { data: carts } = await service
    .from("carts")
    .select("id, store_id, customer_email")
    .eq("abandoned_email_sent", false)
    .lte("created_at", cutoff)
    .not("customer_email", "is", null);

  if (!carts || carts.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  let processed = 0;
  for (const cart of carts) {
    if (!cart.store_id) continue;

    const { data: store } = await service
      .from("curator_stores")
      .select("store_slug, curator_id, curators(brand_name)")
      .eq("id", cart.store_id)
      .single();

    if (store && cart.customer_email) {
      const brandName = (store.curators as unknown as { brand_name: string } | null)?.brand_name ?? "this curator";
      await notifyCartAbandonment(cart.customer_email, brandName, store.store_slug);
      await service.from("analytics_events").insert({
        event_type: "abandonment",
        store_id: cart.store_id,
        curator_id: store.curator_id,
      });
    }

    await service.from("carts").update({ abandoned_email_sent: true }).eq("id", cart.id);
    processed += 1;
  }

  return NextResponse.json({ processed });
}
