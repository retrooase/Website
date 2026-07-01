import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/login",
          "/register",
          "/profil",
          "/warenkorb",
          "/access-denied",
          "/auth/",
          "/shop/bestellung/",
          "/ankauf/status/",
          "/*?q=*",
        ],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
