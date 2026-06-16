import type { Metadata } from "next";
import Link from "next/link";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Admin | RetrOase",
  robots: { index: false },
};

type Row = {
  id: string;
  title: string;
  category: string;
  is_published: boolean;
  read_time: number | null;
  created_at: string;
};

export default async function BlogListPage() {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("blog_posts")
    .select("id, title, category, is_published, read_time, created_at")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as Row[];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-sans text-2xl font-bold text-text-primary">Blog</h1>
          <p className="font-sans text-sm text-text-secondary mt-1">{rows.length} Artikel</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-1.5 font-sans text-sm px-4 py-2 bg-accent-orange text-white hover:bg-accent-orange/90 transition-colors"
        >
          <Plus size={15} />
          Neuer Artikel
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-sm text-red-700 mb-4">
          Fehler: {error.message}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="border-2 border-dashed border-border p-12 text-center">
          <p className="font-sans text-sm text-text-secondary">Noch keine Blog-Artikel vorhanden.</p>
        </div>
      ) : (
        <div className="border border-border">
          {/* Header */}
          <div className="grid grid-cols-[1fr_120px_90px_80px_100px] border-b border-border bg-surface-hover">
            {["Titel", "Kategorie", "Status", "Lesezeit", "Datum"].map((h) => (
              <div key={h} className="font-sans text-xs font-semibold uppercase tracking-wide text-text-secondary px-4 py-2.5">
                {h}
              </div>
            ))}
          </div>
          {rows.map((row) => (
            <Link
              key={row.id}
              href={`/admin/blog/${row.id}`}
              className="grid grid-cols-[1fr_120px_90px_80px_100px] border-b border-border hover:bg-surface-hover transition-colors last:border-b-0"
            >
              <div className="px-4 py-3 font-sans text-sm text-text-primary font-medium truncate self-center">
                {row.title}
              </div>
              <div className="px-4 py-3 font-sans text-xs text-text-secondary self-center">
                {row.category}
              </div>
              <div className="px-4 py-3 self-center">
                <span className={`font-sans text-xs px-2 py-0.5 ${row.is_published ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-surface-hover text-text-secondary border border-border"}`}>
                  {row.is_published ? "Live" : "Entwurf"}
                </span>
              </div>
              <div className="px-4 py-3 font-sans text-xs text-text-secondary self-center">
                {row.read_time ? `${row.read_time} Min.` : "—"}
              </div>
              <div className="px-4 py-3 font-sans text-xs text-text-secondary self-center">
                {new Date(row.created_at).toLocaleDateString("de-DE")}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
