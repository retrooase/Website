"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/admin";
import { createAdminSupabaseClient } from "@/lib/supabase/server";

const ADMIN_PRICE_PATH = "/admin/ankauf-preise";
const ANKAUF_PATH = "/ankauf";

function revalidatePriceCatalog() {
  revalidatePath(ADMIN_PRICE_PATH);
  revalidatePath(ANKAUF_PATH);
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function readString(formData: FormData, key: string) {
  return ((formData.get(key) as string | null) ?? "").trim();
}

function readNumber(formData: FormData, key: string, fallback = 0) {
  const raw = readString(formData, key).replace(",", ".");
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function readList(formData: FormData, key: string) {
  return readString(formData, key)
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function assertPriceRange(min: number, max: number) {
  if (min < 0 || max < 0) throw new Error("Preise duerfen nicht negativ sein.");
  if (max < min) throw new Error("Maximalpreis muss groesser oder gleich Minimalpreis sein.");
}

export async function updateStoreCreditBonus(formData: FormData) {
  await assertAdmin();
  const admin = createAdminSupabaseClient();
  const percent = Math.max(0, Math.min(50, readNumber(formData, "store_credit_bonus_percent", 10)));

  const { error } = await admin
    .from("ankauf_price_settings")
    .upsert({
      key: "store_credit_bonus",
      numeric_value: percent / 100,
      description: "Bonus fuer RetrOase-Guthaben gegenueber Sofort-Auszahlung",
    });

  if (error) throw new Error(error.message);
  revalidatePriceCatalog();
  redirect(`${ADMIN_PRICE_PATH}?saved=bonus`);
}

export async function createBrand(formData: FormData) {
  await assertAdmin();
  const admin = createAdminSupabaseClient();
  const name = readString(formData, "name");
  const slug = readString(formData, "slug") || slugify(name);
  if (!name || !slug) throw new Error("Name und Slug sind erforderlich.");

  const { error } = await admin.from("ankauf_price_brands").insert({
    slug,
    name,
    logo_url: readString(formData, "logo_url") || null,
    sort_order: readNumber(formData, "sort_order", 100),
    is_active: formData.get("is_active") === "on",
  });

  if (error) throw new Error(error.message);
  revalidatePriceCatalog();
  redirect(`${ADMIN_PRICE_PATH}?brand=${slug}&saved=brand`);
}

export async function createDevice(formData: FormData) {
  await assertAdmin();
  const admin = createAdminSupabaseClient();
  const brandSlug = readString(formData, "brand_slug");
  const name = readString(formData, "name");
  const slug = readString(formData, "slug") || slugify(`${brandSlug} ${name}`);
  if (!brandSlug || !name || !slug) throw new Error("Marke, Name und Slug sind erforderlich.");

  const { error } = await admin.from("ankauf_price_devices").insert({
    slug,
    brand_slug: brandSlug,
    name,
    image_url: readString(formData, "image_url") || null,
    sort_order: readNumber(formData, "sort_order", 100),
    is_active: formData.get("is_active") === "on",
  });

  if (error) throw new Error(error.message);
  revalidatePriceCatalog();
  redirect(`${ADMIN_PRICE_PATH}?brand=${brandSlug}&saved=device`);
}

export async function createVariant(formData: FormData) {
  await assertAdmin();
  const admin = createAdminSupabaseClient();
  const brandSlug = readString(formData, "brand_slug");
  const deviceSlug = readString(formData, "device_slug");
  const name = readString(formData, "name");
  const slug = readString(formData, "slug") || slugify(`${brandSlug} ${name}`);
  const min = readNumber(formData, "base_price_min");
  const max = readNumber(formData, "base_price_max");
  assertPriceRange(min, max);

  const { error } = await admin.from("ankauf_price_variants").insert({
    slug,
    brand_slug: brandSlug,
    device_slug: deviceSlug,
    name,
    item_type: readString(formData, "item_type") || "console",
    base_price_min: min,
    base_price_max: max,
    demand_level: readString(formData, "demand_level") || "steady",
    aliases: readList(formData, "aliases"),
    eans: readList(formData, "eans"),
    image_url: readString(formData, "image_url") || null,
    required_accessories: readList(formData, "required_accessories"),
    optional_accessories: readList(formData, "optional_accessories"),
    notes: readString(formData, "notes") || null,
    sort_order: readNumber(formData, "sort_order", 100),
    is_active: formData.get("is_active") === "on",
  });

  if (error) throw new Error(error.message);
  revalidatePriceCatalog();
  redirect(`${ADMIN_PRICE_PATH}?brand=${brandSlug}&saved=variant`);
}

export async function updateVariant(slug: string, formData: FormData) {
  await assertAdmin();
  const admin = createAdminSupabaseClient();
  const min = readNumber(formData, "base_price_min");
  const max = readNumber(formData, "base_price_max");
  assertPriceRange(min, max);

  const { error } = await admin
    .from("ankauf_price_variants")
    .update({
      name: readString(formData, "name"),
      item_type: readString(formData, "item_type") || "console",
      base_price_min: min,
      base_price_max: max,
      demand_level: readString(formData, "demand_level") || "steady",
      aliases: readList(formData, "aliases"),
      eans: readList(formData, "eans"),
      image_url: readString(formData, "image_url") || null,
      required_accessories: readList(formData, "required_accessories"),
      optional_accessories: readList(formData, "optional_accessories"),
      notes: readString(formData, "notes") || null,
      is_active: formData.get("is_active") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  if (error) throw new Error(error.message);
  revalidatePriceCatalog();
}

export async function toggleVariantActive(slug: string, active: boolean) {
  await assertAdmin();
  const admin = createAdminSupabaseClient();
  const { error } = await admin
    .from("ankauf_price_variants")
    .update({ is_active: active, updated_at: new Date().toISOString() })
    .eq("slug", slug);

  if (error) throw new Error(error.message);
  revalidatePriceCatalog();
}
