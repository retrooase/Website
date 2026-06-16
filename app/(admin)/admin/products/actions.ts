"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/admin";
import type { ProductCategory, ProductCondition, ProductBadge } from "@/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uniqueSlug(admin: ReturnType<typeof createAdminSupabaseClient>, base: string): Promise<string> {
  let slug = base;
  let i = 2;
  while (true) {
    const { data } = await admin.from("products").select("id").eq("slug", slug).limit(1);
    if (!data || data.length === 0) return slug;
    slug = `${base}-${i++}`;
  }
}

async function uploadImages(
  admin: ReturnType<typeof createAdminSupabaseClient>,
  files: File[]
): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    if (!file || file.size === 0) continue;
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await admin.storage.from("product-images").upload(path, file);
    if (error) throw new Error(`Bild-Upload fehlgeschlagen: ${error.message}`);
    const { data: { publicUrl } } = admin.storage.from("product-images").getPublicUrl(path);
    urls.push(publicUrl);
  }
  return urls;
}

export async function createProduct(formData: FormData) {
  await assertAdmin();
  const admin = createAdminSupabaseClient();

  const files = formData.getAll("images") as File[];
  const imageUrls = await uploadImages(admin, files);

  const titleRaw = (formData.get("title") as string)?.trim();
  const slugRaw = (formData.get("slug") as string)?.trim();
  const slug = await uniqueSlug(admin, slugRaw || slugify(titleRaw));

  const priceRaw = formData.get("price") as string;
  const purchasePriceRaw = formData.get("purchase_price") as string;

  const payload = {
    title: titleRaw,
    slug,
    description: (formData.get("description") as string)?.trim(),
    price: parseFloat(priceRaw),
    purchase_price: purchasePriceRaw ? parseFloat(purchasePriceRaw) : null,
    category: formData.get("category") as ProductCategory,
    platform: (formData.get("platform") as string)?.trim() ?? "",
    condition: formData.get("condition") as ProductCondition,
    badge: (formData.get("badge") as ProductBadge) || null,
    ebay_id: (formData.get("ebay_id") as string)?.trim() || null,
    ebay_url: (formData.get("ebay_url") as string)?.trim() || null,
    ean: (formData.get("ean") as string)?.trim() || null,
    is_featured: formData.get("is_featured") === "on",
    is_sold: false,
    images: imageUrls,
    language: (formData.get("language") as string)?.trim() || null,
    region: (formData.get("region") as string)?.trim() || null,
  };

  const { data, error } = await admin.from("products").insert(payload).select("id").single();
  if (error) throw new Error(error.message);

  redirect(`/admin/products/${data.id}`);
}

export async function updateProduct(id: string, formData: FormData) {
  await assertAdmin();
  const admin = createAdminSupabaseClient();

  const priceRaw = formData.get("price") as string;
  const purchasePriceRaw = formData.get("purchase_price") as string;

  const payload = {
    title: (formData.get("title") as string)?.trim(),
    description: (formData.get("description") as string)?.trim(),
    price: parseFloat(priceRaw),
    purchase_price: purchasePriceRaw ? parseFloat(purchasePriceRaw) : null,
    category: formData.get("category") as ProductCategory,
    platform: (formData.get("platform") as string)?.trim() ?? "",
    condition: formData.get("condition") as ProductCondition,
    badge: (formData.get("badge") as ProductBadge) || null,
    ebay_id: (formData.get("ebay_id") as string)?.trim() || null,
    ebay_url: (formData.get("ebay_url") as string)?.trim() || null,
    ean: (formData.get("ean") as string)?.trim() || null,
    is_featured: formData.get("is_featured") === "on",
    language: (formData.get("language") as string)?.trim() || null,
    region: (formData.get("region") as string)?.trim() || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin.from("products").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/admin/products");
  redirect(`/admin/products/${id}?saved=1`);
}

export async function addProductImages(id: string, formData: FormData) {
  await assertAdmin();
  const admin = createAdminSupabaseClient();

  const files = formData.getAll("images") as File[];
  const newUrls = await uploadImages(admin, files);
  if (newUrls.length === 0) return;

  const { data: existing } = await admin.from("products").select("images").eq("id", id).single();
  const currentImages: string[] = existing?.images ?? [];
  const merged = [...currentImages, ...newUrls];

  const { error } = await admin.from("products").update({ images: merged, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/products/${id}`);
}

export async function deleteProductImage(productId: string, imageUrl: string) {
  await assertAdmin();
  const admin = createAdminSupabaseClient();

  // Extract storage path from public URL if it's a Supabase URL
  const match = imageUrl.match(/product-images\/(.+)$/);
  if (match) {
    await admin.storage.from("product-images").remove([match[1]]);
  }

  const { data: existing } = await admin.from("products").select("images").eq("id", productId).single();
  const images: string[] = (existing?.images ?? []).filter((u: string) => u !== imageUrl);

  const { error } = await admin.from("products").update({ images, updated_at: new Date().toISOString() }).eq("id", productId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/products/${productId}`);
}

export async function toggleProductSold(id: string, sold: boolean) {
  await assertAdmin();
  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("products").update({ is_sold: sold, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/admin/products");
}

export async function toggleProductFeatured(id: string, featured: boolean) {
  await assertAdmin();
  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("products").update({ is_featured: featured, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  await assertAdmin();
  const admin = createAdminSupabaseClient();

  const { data } = await admin.from("products").select("images").eq("id", id).single();
  const images: string[] = data?.images ?? [];
  for (const url of images) {
    const match = url.match(/product-images\/(.+)$/);
    if (match) await admin.storage.from("product-images").remove([match[1]]);
  }

  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  redirect("/admin/products");
}
