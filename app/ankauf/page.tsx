import type { Metadata } from "next";
import { loadPriceCatalog } from "@/components/ankauf/v2/price/loadPriceCatalog";
import { AnkaufFunnelV3 } from "@/components/ankauf/v3/AnkaufFunnelV3";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ankauf — Wert schätzen & verkaufen | RetrOase",
  description:
    "Schätze deine Konsolen, Spiele, Karten und Sammlungen kostenlos online. Danach unverbindliche Ankauf-Anfrage mit Fotos und Kontakt absenden.",
  alternates: {
    canonical: "/ankauf",
  },
};

export default async function AnkaufPage() {
  const priceCatalog = await loadPriceCatalog();

  return <AnkaufFunnelV3 priceCatalog={priceCatalog} />;
}
