import type { Metadata } from "next";
import { loadPriceCatalog } from "@/components/ankauf/v2/price/loadPriceCatalog";
import { AnkaufFunnelV3 } from "@/components/ankauf/v3/AnkaufFunnelV3";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ankauf - Wert schatzen & verkaufen | RetrOase",
  description:
    "Schatz Konsolen, Spiele, Karten und Sammlungen direkt online. Danach unverbindliche Ankauf-Anfrage mit Fotos und Kontakt absenden.",
};

export default async function AnkaufPage() {
  const priceCatalog = await loadPriceCatalog();

  return <AnkaufFunnelV3 priceCatalog={priceCatalog} />;
}
