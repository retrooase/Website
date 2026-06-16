import { createServerSupabaseClient, createAdminSupabaseClient } from "@/lib/supabase/server";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  category: string;
  tags: string[];
  read_time: number | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogPostCard = Pick<BlogPost, "id" | "title" | "slug" | "excerpt" | "image" | "category" | "read_time" | "published_at" | "created_at">;

export async function getPublishedPosts(limit?: number): Promise<BlogPostCard[]> {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, image, category, read_time, published_at, created_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data } = await query;
  return (data ?? []) as BlogPostCard[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return (data as BlogPost) ?? null;
}

export async function getRelatedPosts(category: string, excludeSlug: string, limit = 3): Promise<BlogPostCard[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, image, category, read_time, published_at, created_at")
    .eq("is_published", true)
    .eq("category", category)
    .neq("slug", excludeSlug)
    .limit(limit);
  return (data ?? []) as BlogPostCard[];
}

// Admin-only: alle Posts (auch Entwürfe) für Sitemaps etc.
export async function getAllPostSlugs(): Promise<string[]> {
  const admin = createAdminSupabaseClient();
  const { data } = await admin.from("blog_posts").select("slug").eq("is_published", true);
  return (data ?? []).map((d) => d.slug as string);
}
