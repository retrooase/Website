import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { getAvailableProducts } from "@/lib/products";
import { getPublishedPosts } from "@/lib/blog";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([
    getAvailableProducts().catch(() => []),
    getPublishedPosts().catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/shop`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE.url}/ankauf`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE.url}/ueber-uns`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/kontakt`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/impressum`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/datenschutz`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/agb`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/widerruf`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = [
    "nintendo",
    "gameboy",
    "playstation",
    "pokemon",
    "zubehoer",
    "retro",
  ].map((slug) => ({
    url: `${SITE.url}/shop?category=${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE.url}/shop/${product.slug}`,
    lastModified: product.created_at ? new Date(product.created_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : new Date(post.created_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
