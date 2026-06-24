import Stripe from "stripe";

let cachedStripe: Stripe | null = null;

/**
 * Lazy Stripe-Client.
 *
 * Wird erst beim ersten Aufruf zur Laufzeit instanziiert. Würde der Client
 * auf Modulebene erzeugt (`new Stripe(...)`), liefe der Konstruktor bereits
 * während des Builds (Next.js "Collecting page data"), wo STRIPE_SECRET_KEY
 * nicht gesetzt ist – das ließ den Vercel-Build mit "Neither apiKey nor
 * config.authenticator provided" fehlschlagen.
 */
export function getStripe(): Stripe {
  if (cachedStripe) return cachedStripe;

  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY ist nicht gesetzt");
  }

  cachedStripe = new Stripe(apiKey, {
    apiVersion: "2026-05-27.dahlia",
  });

  return cachedStripe;
}
