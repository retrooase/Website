import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { updateBlogPost } from "../actions";
import { DeleteBlogButton } from "./DeleteBlogButton";

export const metadata: Metadata = {
  title: "Artikel bearbeiten | Admin | RetrOase",
  robots: { index: false },
};

const CATEGORIES = ["Guides", "News", "Sammlertipps", "Produktvorstellungen"];

type PageProps = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function BlogEditPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { saved } = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const admin = createAdminSupabaseClient();
  const { data: post, error } = await admin.from("blog_posts").select("*").eq("id", id).single();
  if (error || !post) notFound();

  const updateAction = updateBlogPost.bind(null, id);

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/blog"
          className="flex items-center gap-1.5 font-sans text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={15} />
          Zurück
        </Link>
        <span className="text-border">/</span>
        <span className="font-sans text-sm text-text-primary font-medium truncate max-w-sm">{post.title}</span>
        <span className={`ml-2 font-sans text-xs px-2 py-0.5 ${post.is_published ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-surface-hover text-text-secondary border border-border"}`}>
          {post.is_published ? "Live" : "Entwurf"}
        </span>
      </div>

      {saved === "1" && (
        <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <span className="text-green-600 dark:text-green-400 text-sm font-sans">Änderungen gespeichert.</span>
        </div>
      )}

      <form action={updateAction} className="space-y-5">
        {/* Publish toggle — prominent */}
        <div className={`flex items-center justify-between p-4 border ${post.is_published ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20" : "border-border bg-surface"}`}>
          <div>
            <p className="font-sans text-sm font-semibold text-text-primary">
              {post.is_published ? "Veröffentlicht" : "Entwurf"}
            </p>
            {post.published_at && (
              <p className="font-sans text-xs text-text-secondary mt-0.5">
                Seit {new Date(post.published_at).toLocaleDateString("de-DE")}
              </p>
            )}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={post.is_published}
              className="w-4 h-4 accent-accent-orange"
            />
            <span className="font-sans text-sm text-text-primary flex items-center gap-1.5">
              {post.is_published ? <Eye size={14} /> : <EyeOff size={14} />}
              {post.is_published ? "Sichtbar" : "Veröffentlichen"}
            </span>
          </label>
        </div>

        {/* Metadaten */}
        <Section title="Metadaten">
          <div className="space-y-3">
            <Field label="Titel *">
              <input name="title" required defaultValue={post.title} className="pixel-input w-full text-sm py-2" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Kategorie *">
                <select name="category" required defaultValue={post.category} className="pixel-input w-full text-sm py-2">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Lesezeit (Min.)">
                <input name="read_time" type="number" min="1" defaultValue={post.read_time ?? ""} className="pixel-input w-full text-sm py-2" />
              </Field>
            </div>
            <Field label="Excerpt">
              <textarea name="excerpt" rows={2} defaultValue={post.excerpt ?? ""} className="pixel-input w-full text-sm py-2 resize-none" />
            </Field>
            <Field label="Titelbild">
              {post.image && (
                <div className="relative h-32 w-full mb-2 border border-border overflow-hidden">
                  <Image src={post.image} alt="" fill className="object-cover" sizes="600px" />
                </div>
              )}
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
                className="font-sans text-sm text-text-primary file:mr-2 file:py-1 file:px-2 file:border file:border-border file:bg-surface-hover file:text-xs file:font-sans file:text-text-secondary file:cursor-pointer"
              />
              {post.image && <p className="font-sans text-xs text-text-secondary mt-1">Neues Bild wählen um das aktuelle zu ersetzen.</p>}
            </Field>
          </div>
        </Section>

        {/* Inhalt */}
        <Section title="Inhalt">
          <Field label="Artikel-Text (Markdown) *">
            <textarea
              name="content"
              required
              rows={20}
              defaultValue={post.content}
              className="pixel-input w-full text-sm py-2 resize-y font-mono"
            />
          </Field>
        </Section>

        <div className="flex items-center justify-between pt-2">
          <button type="submit" className="btn-primary py-2.5 px-6 text-sm">
            Änderungen speichern
          </button>

          <DeleteBlogButton id={post.id} />
        </div>
      </form>

      {/* Meta */}
      <div className="mt-6 bg-surface border border-border p-4">
        <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">Meta</h2>
        <div className="space-y-1.5">
          <MetaRow label="ID" value={post.id} mono />
          <MetaRow label="Slug" value={post.slug} mono />
          <MetaRow label="Erstellt" value={new Date(post.created_at).toLocaleString("de-DE")} />
          {post.updated_at && <MetaRow label="Aktualisiert" value={new Date(post.updated_at).toLocaleString("de-DE")} />}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border p-4">
      <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-sans text-xs font-semibold text-text-secondary mb-1">{label}</label>
      {children}
    </div>
  );
}

function MetaRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex gap-2">
      <span className="font-sans text-xs text-text-secondary w-24 flex-shrink-0">{label}</span>
      <span className={`font-sans text-xs text-text-primary break-all ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
