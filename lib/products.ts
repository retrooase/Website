import productsData from "@/data/products.json";
import type { Product } from "./types";

const products = productsData as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getAvailableProducts(): Product[] {
  return products.filter((p) => !p.is_sold);
}

export function getFeaturedProducts(limit = 6): Product[] {
  return products.filter((p) => p.is_featured && !p.is_sold).slice(0, limit);
}

export function getProductBySlug(slug: string): Product | null {
  return products.find((p) => p.slug === slug) ?? null;
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCat = products.filter(
    (p) => p.id !== product.id && !p.is_sold && p.category === product.category
  );
  if (sameCat.length >= limit) return sameCat.slice(0, limit);
  const rest = products.filter(
    (p) => p.id !== product.id && !p.is_sold && p.category !== product.category
  );
  return [...sameCat, ...rest].slice(0, limit);
}

export function getCategories(): string[] {
  return Array.from(new Set(products.map((p) => p.category)));
}

export function getPlatforms(): string[] {
  return Array.from(new Set(products.map((p) => p.platform)));
}
