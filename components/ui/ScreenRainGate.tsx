"use client";

import { usePathname } from "next/navigation";
import { ScreenRain } from "@/components/home/ScreenRain";

/**
 * Mountet den Vollbild-Regen site-weit — außer im Admin-Bereich.
 * Wird im Root-Layout gerendert; auf `/admin`-Pfaden wird nichts ausgegeben,
 * damit Backend-/Verwaltungsseiten clean bleiben.
 */
export function ScreenRainGate() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <ScreenRain />;
}
