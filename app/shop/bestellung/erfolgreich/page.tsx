import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Bestellung erfolgreich | RetrOase",
  robots: { index: false },
};

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function ErfolgreichPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  let customerEmail: string | null = null;
  let productName: string | null = null;

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ["line_items"],
      });
      customerEmail = session.customer_details?.email ?? null;
      productName = session.line_items?.data[0]?.description ?? null;
    } catch {
      // Session nicht gefunden — trotzdem Erfolgsseite zeigen
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <CheckCircle className="mx-auto mb-6 text-accent-green" size={56} strokeWidth={1.5} />

      <h1 className="font-sans text-2xl sm:text-3xl font-bold text-text-primary mb-3">
        Bestellung erfolgreich!
      </h1>

      <p className="font-sans text-text-secondary leading-relaxed mb-2">
        {productName ? (
          <>
            <span className="text-text-primary font-semibold">{productName}</span> ist auf dem Weg zu dir.
          </>
        ) : (
          "Vielen Dank für deine Bestellung."
        )}
      </p>

      {customerEmail && (
        <p className="font-sans text-sm text-text-secondary mb-8">
          Eine Bestätigung wurde an <span className="text-text-primary">{customerEmail}</span> gesendet.
        </p>
      )}

      <div className="border border-border bg-surface p-4 mb-8 text-left space-y-2">
        <p className="font-sans text-sm text-text-secondary flex items-center gap-2">
          <span className="text-accent-green">✓</span> Zahlung eingegangen
        </p>
        <p className="font-sans text-sm text-text-secondary flex items-center gap-2">
          <span className="text-accent-green">✓</span> Versand in 1–2 Werktagen
        </p>
        <p className="font-sans text-sm text-text-secondary flex items-center gap-2">
          <span className="text-accent-green">✓</span> Geprüfte Secondhand-Ware
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/shop" className="btn-primary justify-center">
          Weiter stöbern
        </Link>
        <Link href="/" className="btn-secondary justify-center">
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
