import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Keine Stripe-Signatur" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[webhook] Signatur ungültig:", err);
    return NextResponse.json({ error: "Ungültige Signatur" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const productIdsRaw = session.metadata?.product_ids;

    if (productIdsRaw) {
      const ids = productIdsRaw.split(",").filter(Boolean);
      const admin = createAdminSupabaseClient();

      const { error } = await admin
        .from("products")
        .update({ is_sold: true })
        .in("id", ids);

      if (error) {
        console.error("[webhook] Supabase-Fehler:", error);
        return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
      }

      console.log(`[webhook] ${ids.length} Produkt(e) als verkauft markiert:`, ids);
    }
  }

  return NextResponse.json({ received: true });
}
