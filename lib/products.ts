import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as Product[];
}

export async function getAvailableProducts(): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_sold", false)
    .order("created_at", { ascending: false });
  return (data ?? []) as Product[];
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .eq("is_sold", false)
    .limit(limit);
  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data as Product | null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();
  const [{ data: same }, { data: rest }] = await Promise.all([
    supabase.from("products").select("*").neq("id", product.id).eq("is_sold", false).eq("category", product.category).limit(limit),
    supabase.from("products").select("*").neq("id", product.id).eq("is_sold", false).neq("category", product.category).limit(limit),
  ]);
  const sameCat = (same ?? []) as Product[];
  const otherCat = (rest ?? []) as Product[];
  return [...sameCat, ...otherCat].slice(0, limit);
}

export async function getCategories(): Promise<string[]> {
  const products = await getAllProducts();
  return Array.from(new Set(products.map((p) => p.category)));
}

export async function getPlatforms(): Promise<string[]> {
  const products = await getAllProducts();
  return Array.from(new Set(products.map((p) => p.platform).filter(Boolean)));
}
