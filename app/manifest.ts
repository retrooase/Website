import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.name} — ${SITE.slogan}`,
    short_name: SITE.name,
    description:
      "Retro-Gaming Shop aus Deutschland. Geprüfte Secondhand-Konsolen, Spiele, Zubehör und Pokémon-Karten.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#0D0B12",
    lang: "de-DE",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
