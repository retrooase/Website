import type { Metadata } from "next";
import Link from "next/link";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { toggleAlertActive } from "./actions";

export const metadata: Metadata = {
  title: "Such-Alerts | Admin | RetrOase",
  robots: { index: false },
};

type AlertRow = {
  id: string;
  user_id: string;
  search_query: string;
  category: string | null;
  platform: string | null;
  condition: string | null;
  max_price: number | null;
  is_active: boolean;
  created_at: string;
  user_profiles: { name: string | null }[] | null;
};

type PageProps = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function AlertsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filter = params.filter ?? "all";

  const admin = createAdminSupabaseClient();
  let req = admin
    .from("wishlist_alerts")
    .select("id, user_id, search_query, category, platform, condition, max_price, is_active, created_at, user_profiles(name)")
    .order("created_at", { ascending: false });

  if (filter === "active") req = req.eq("is_active", true);
  else if (filter === "inactive") req = req.eq("is_active", false);

  const { data, error } = await req;
  const rows = (data ?? []) as AlertRow[];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-sans text-2xl font-bold text-text-primary">Such-Alerts</h1>
          <p className="font-sans text-sm text-text-secondary mt-1">{rows.length} Alerts</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1 mb-5">
        {[
          { key: "all", label: "Alle" },
          { key: "active", label: "Aktiv" },
          { key: "inactive", label: "Inaktiv" },
        ].map(({ key, label }) => (
          <Link
            key={key}
            href={key === "all" ? "/admin/alerts" : `/admin/alerts?filter=${key}`}
            className={`font-sans text-xs px-3 py-1.5 border transition-colors ${
              filter === key
                ? "border-accent-orange text-accent-orange bg-accent-orange/5"
                : "border-border text-text-secondary hover:border-text-secondary/50"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-sm text-red-700 mb-4">
          Fehler: {error.message}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="border-2 border-dashed border-border p-12 text-center">
          <p className="font-sans text-sm text-text-secondary">Keine Such-Alerts gefunden.</p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden sm:block border border-border">
            <div className="grid grid-cols-[1fr_110px_100px_80px_80px_100px_80px_90px] border-b border-border bg-surface-hover">
              {["Suche", "Kategorie", "Plattform", "Zustand", "Max €", "User", "Status", "Aktion"].map((h) => (
                <div key={h} className="font-sans text-xs font-semibold uppercase tracking-wide text-text-secondary px-3 py-2.5">
                  {h}
                </div>
              ))}
            </div>
            {rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[1fr_110px_100px_80px_80px_100px_80px_90px] border-b border-border last:border-b-0 hover:bg-surface-hover/50"
              >
                <div className="px-3 py-3 font-sans text-sm text-text-primary font-medium truncate self-center">
                  {row.search_query}
                </div>
                <div className="px-3 py-3 font-sans text-xs text-text-secondary self-center">
                  {row.category ?? "—"}
                </div>
                <div className="px-3 py-3 font-sans text-xs text-text-secondary self-center">
                  {row.platform ?? "—"}
                </div>
                <div className="px-3 py-3 font-sans text-xs text-text-secondary self-center">
                  {row.condition ?? "—"}
                </div>
                <div className="px-3 py-3 font-mono text-xs text-text-secondary self-center">
                  {row.max_price != null ? `${row.max_price.toFixed(0)} €` : "—"}
                </div>
                <div className="px-3 py-3 font-sans text-xs text-text-secondary self-center truncate">
                  {row.user_profiles?.[0]?.name ?? "—"}
                </div>
                <div className="px-3 py-3 self-center">
                  <span className={`font-sans text-xs px-1.5 py-0.5 ${row.is_active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-surface-hover text-text-secondary border border-border"}`}>
                    {row.is_active ? "Aktiv" : "Inaktiv"}
                  </span>
                </div>
                <div className="px-3 py-3 self-center">
                  <form
                    action={async () => {
                      "use server";
                      await toggleAlertActive(row.id, !row.is_active);
                    }}
                  >
                    <button
                      type="submit"
                      className={`font-sans text-xs px-2 py-1 border transition-colors ${
                        row.is_active
                          ? "border-border text-text-secondary hover:border-red-300 hover:text-red-600"
                          : "border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400"
                      }`}
                    >
                      {row.is_active ? "Deaktivieren" : "Aktivieren"}
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile */}
          <div className="sm:hidden space-y-3">
            {rows.map((row) => (
              <div key={row.id} className="p-4 bg-surface border border-border">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-sans text-sm font-semibold text-text-primary">{row.search_query}</p>
                  <span className={`font-sans text-xs px-1.5 py-0.5 flex-shrink-0 ${row.is_active ? "bg-green-100 text-green-700" : "bg-surface-hover text-text-secondary border border-border"}`}>
                    {row.is_active ? "Aktiv" : "Inaktiv"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-text-secondary mb-3">
                  {row.category && <span>{row.category}</span>}
                  {row.platform && <span>· {row.platform}</span>}
                  {row.condition && <span>· {row.condition}</span>}
                  {row.max_price != null && <span>· max {row.max_price} €</span>}
                  {row.user_profiles?.[0]?.name && <span>· {row.user_profiles[0].name}</span>}
                </div>
                <form
                  action={async () => {
                    "use server";
                    await toggleAlertActive(row.id, !row.is_active);
                  }}
                >
                  <button type="submit" className="font-sans text-xs px-2 py-1 border border-border text-text-secondary hover:border-accent-orange/50 transition-colors">
                    {row.is_active ? "Deaktivieren" : "Aktivieren"}
                  </button>
                </form>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
