// ============================================================
// RetrOase — Zentrale Schema.org / JSON-LD Helper
// ============================================================

import { SITE } from "@/lib/constants";
import type { Product } from "@/types";
import type { BlogPost } from "@/lib/blog";

/**
 * Serialisiert ein JSON-LD-Objekt sicher für <script>-Einbettung.
 * Escaped `<`, damit Werte wie "</script>" das Script-Tag nicht vorzeitig
 * schließen können (Standardrisiko bei dangerouslySetInnerHTML + JSON.stringify).
 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icon.svg`,
    email: SITE.email,
    sameAs: [SITE.ebayShopUrl, SITE.instagramUrl].filter(Boolean),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    inLanguage: "de-DE",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: `${SITE.url}${item.url}` } : {}),
    })),
  };
}

const CONDITION_MAP: Record<string, string> = {
  "Sehr Gut": "https://schema.org/UsedCondition",
  Gut: "https://schema.org/UsedCondition",
  Akzeptabel: "https://schema.org/UsedCondition",
};

function toAbsoluteUrl(url: string): string {
  return url.startsWith("http") ? url : `${SITE.url}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    sku: product.id,
    ...(product.ean ? { gtin: product.ean } : {}),
    category: product.category,
    image: product.images.map(toAbsoluteUrl),
    itemCondition: CONDITION_MAP[product.condition] ?? "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/shop/${product.slug}`,
      priceCurrency: SITE.currency,
      price: product.price.toFixed(2),
      availability: product.is_sold
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      itemCondition: CONDITION_MAP[product.condition] ?? "https://schema.org/UsedCondition",
      seller: {
        "@type": "Organization",
        name: SITE.name,
      },
    },
  };
}

export function blogPostingSchema(post: BlogPost) {
  const date = post.published_at ?? post.created_at;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.image ? [toAbsoluteUrl(post.image)] : undefined,
    datePublished: date,
    dateModified: post.updated_at ?? date,
    author: {
      "@type": "Organization",
      name: SITE.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}/blog/${post.slug}`,
    },
  };
}
