"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/admin";

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
    const { data } = await admin.from("blog_posts").select("id").eq("slug", slug).limit(1);
    if (!data || data.length === 0) return slug;
    slug = `${base}-${i++}`;
  }
}

export async function createBlogPost(formData: FormData) {
  await assertAdmin();
  const admin = createAdminSupabaseClient();

  const titleRaw = (formData.get("title") as string)?.trim();
  const slugRaw = (formData.get("slug") as string)?.trim();
  const slug = await uniqueSlug(admin, slugRaw || slugify(titleRaw));

  let imageUrl: string | null = null;
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await admin.storage.from("blog-images").upload(path, file);
    if (error) throw new Error(`Bild-Upload fehlgeschlagen: ${error.message}`);
    const { data: { publicUrl } } = admin.storage.from("blog-images").getPublicUrl(path);
    imageUrl = publicUrl;
  }

  const isPublished = formData.get("is_published") === "on";
  const readTimeRaw = formData.get("read_time") as string;

  const payload = {
    title: titleRaw,
    slug,
    content: (formData.get("content") as string)?.trim(),
    excerpt: (formData.get("excerpt") as string)?.trim() || null,
    image: imageUrl,
    category: formData.get("category") as string,
    read_time: readTimeRaw ? parseInt(readTimeRaw) : null,
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
  };

  const { data, error } = await admin.from("blog_posts").insert(payload).select("id").single();
  if (error) throw new Error(error.message);

  redirect(`/admin/blog/${data.id}`);
}

export async function updateBlogPost(id: string, formData: FormData) {
  await assertAdmin();
  const admin = createAdminSupabaseClient();

  const { data: existing } = await admin.from("blog_posts").select("published_at").eq("id", id).single();

  const isPublished = formData.get("is_published") === "on";
  const readTimeRaw = formData.get("read_time") as string;

  let imageUrl: string | undefined = undefined;
  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await admin.storage.from("blog-images").upload(path, file);
    if (!error) {
      const { data: { publicUrl } } = admin.storage.from("blog-images").getPublicUrl(path);
      imageUrl = publicUrl;
    }
  }

  const payload: Record<string, unknown> = {
    title: (formData.get("title") as string)?.trim(),
    content: (formData.get("content") as string)?.trim(),
    excerpt: (formData.get("excerpt") as string)?.trim() || null,
    category: formData.get("category") as string,
    read_time: readTimeRaw ? parseInt(readTimeRaw) : null,
    is_published: isPublished,
    published_at: isPublished ? (existing?.published_at ?? new Date().toISOString()) : null,
    updated_at: new Date().toISOString(),
  };

  if (imageUrl !== undefined) payload.image = imageUrl;

  const { error } = await admin.from("blog_posts").update(payload).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect(`/admin/blog/${id}?saved=1`);
}

export async function deleteBlogPost(id: string) {
  await assertAdmin();
  const admin = createAdminSupabaseClient();
  const { error } = await admin.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}
