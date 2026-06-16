import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createBlogPost } from "../actions";

export const metadata: Metadata = {
  title: "Neuer Artikel | Admin | RetrOase",
  robots: { index: false },
};

const CATEGORIES = ["Guides", "News", "Sammlertipps", "Produktvorstellungen"];

export default function NewBlogPostPage() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/blog"
          className="flex items-center gap-1.5 font-sans text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={15} />
          Zurück
        </Link>
        <span className="text-border">/</span>
        <span className="font-sans text-sm text-text-primary font-medium">Neuer Artikel</span>
      </div>

      <form action={createBlogPost} className="space-y-5">
        <Section title="Metadaten">
          <div className="space-y-3">
            <Field label="Titel *">
              <input name="title" required className="pixel-input w-full text-sm py-2" placeholder="Artikel-Titel…" />
            </Field>
            <Field label="Slug (leer = auto)">
              <input name="slug" className="pixel-input w-full text-sm py-2 font-mono" placeholder="mein-artikel-titel" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Kategorie *">
                <select name="category" required className="pixel-input w-full text-sm py-2">
                  <option value="">— wählen —</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Lesezeit (Min.)">
                <input name="read_time" type="number" min="1" className="pixel-input w-full text-sm py-2" placeholder="5" />
              </Field>
            </div>
            <Field label="Kurzbeschreibung (Excerpt)">
              <textarea name="excerpt" rows={2} className="pixel-input w-full text-sm py-2 resize-none" placeholder="Kurze Vorschau für Listen und SEO…" />
            </Field>
            <Field label="Titelbild">
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
                className="font-sans text-sm text-text-primary file:mr-2 file:py-1 file:px-2 file:border file:border-border file:bg-surface-hover file:text-xs file:font-sans file:text-text-secondary file:cursor-pointer"
              />
            </Field>
          </div>
        </Section>

        <Section title="Inhalt">
          <Field label="Artikel-Text (Markdown) *">
            <textarea
              name="content"
              required
              rows={16}
              className="pixel-input w-full text-sm py-2 resize-y font-mono"
              placeholder="# Überschrift&#10;&#10;Artikel-Inhalt…"
            />
          </Field>
        </Section>

        <Section title="Veröffentlichung">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="is_published" className="w-4 h-4 accent-accent-orange" />
            <div>
              <span className="font-sans text-sm text-text-primary">Sofort veröffentlichen</span>
              <p className="font-sans text-xs text-text-secondary">Artikel ist danach öffentlich im Blog sichtbar.</p>
            </div>
          </label>
        </Section>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary py-2.5 px-6 text-sm">
            Artikel erstellen
          </button>
          <Link href="/admin/blog" className="btn-secondary py-2.5 px-6 text-sm">
            Abbrechen
          </Link>
        </div>
      </form>
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
