import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json() as { productId?: string; productIds?: string[] };

    // Einzel-Kauf (BuyButton) oder Warenkorb
    const ids: string[] = body.productIds ?? (body.productId ? [body.productId] : []);

    if (ids.length === 0) {
      return NextResponse.json({ error: "Keine Produkte angegeben" }, { status: 400 });
    }

    const admin = createAdminSupabaseClient();
    const { data: products, error } = await admin
      .from("products")
      .select("*")
      .in("id", ids);

    if (error || !products || products.length !== ids.length) {
      return NextResponse.json({ error: "Ein oder mehrere Produkte nicht gefunden" }, { status: 404 });
    }

    const soldProduct = products.find((p) => p.is_sold);
    if (soldProduct) {
      return NextResponse.json(
        { error: `"${soldProduct.title}" wurde bereits verkauft` },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const line_items = products.map((product) => {
      const images = Array.isArray(product.images)
        ? (product.images as string[]).filter((img: string) => img.startsWith("http"))
        : [];

      return {
        quantity: 1,
        price_data: {
          currency: "eur",
          product_data: {
            name: product.title,
            description: `${product.condition} · ${product.platform ?? product.category}`,
            ...(images.length > 0 && { images: [images[0]] }),
          },
          unit_amount: Math.round(product.price * 100),
        },
      };
    });

    const isSingle = ids.length === 1;
    const firstProduct = products[0];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "de",
      line_items,
      metadata: {
        product_ids: ids.join(","),
        // Einzelkauf: slug für cancel_url
        ...(isSingle && { slug: firstProduct.slug }),
      },
      shipping_address_collection: { allowed_countries: ["DE", "AT", "CH"] },
      success_url: `${siteUrl}/shop/bestellung/erfolgreich?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: isSingle
        ? `${siteUrl}/shop/${firstProduct.slug}`
        : `${siteUrl}/warenkorb`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Interner Fehler" }, { status: 500 });
  }
}
