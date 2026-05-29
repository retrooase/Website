import type { Metadata } from "next";
import Link from "next/link";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Search } from "lucide-react";
import type { AnkaufStatus } from "@/types";

export const metadata: Metadata = {
  title: "Ankauf-Anfragen | Admin | RetrOase",
  robots: { index: false },
};

const ALL_STATUSES: AnkaufStatus[] = [
  "Eingegangen",
  "In Bewertung",
  "Angebot gesendet",
  "Angenommen",
  "Abgelehnt",
];

type Row = {
  id: string;
  name: string;
  email: string;
  product_name: string;
  category: string;
  condition: string;
  status: AnkaufStatus;
  images: string[];
  created_at: string;
};

type PageProps = {
  searchParams: Promise<{ status?: string; q?: string; sort?: string }>;
};

export default async function AnkaufListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeStatus = params.status as AnkaufStatus | undefined;
  const query = params.q ?? "";
  const sort = params.sort === "asc" ? "asc" : "desc";

  const admin = createAdminSupabaseClient();
  let req = admin
    .from("ankauf_requests")
    .select("id, name, email, product_name, category, condition, status, images, created_at")
    .order("created_at", { ascending: sort === "asc" });

  if (activeStatus && ALL_STATUSES.includes(activeStatus)) {
    req = req.eq("status", activeStatus);
  }
  if (query.trim()) {
    req = req.or(
      `name.ilike.%${query}%,email.ilike.%${query}%,product_name.ilike.%${query}%`
    );
  }

  const { data, error } = await req;
  const rows = (data ?? []) as Row[];

  function buildUrl(overrides: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    const merged = { status: activeStatus, q: query || undefined, sort: sort === "asc" ? "asc" : undefined, ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v) p.set(k, v);
    }
    const s = p.toString();
    return `/admin/ankauf${s ? `?${s}` : ""}`;
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-sans text-2xl font-bold text-text-primary">Ankauf-Anfragen</h1>
          <p className="font-sans text-sm text-text-secondary mt-1">{rows.length} Einträge</p>
        </div>
      </div>

      {/* Filter + Suche */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <form method="get" action="/admin/ankauf" className="relative flex-1 max-w-xs">
          {activeStatus && <input type="hidden" name="status" value={activeStatus} />}
          {sort === "asc" && <input type="hidden" name="sort" value="asc" />}
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Name, E-Mail, Produkt…"
            className="pixel-input pl-8 py-2 text-sm w-full"
          />
        </form>

        <div className="flex items-center gap-1 flex-wrap">
          <Link href={buildUrl({ status: undefined })} className={`font-sans text-xs px-3 py-1.5 border transition-colors ${!activeStatus ? "border-accent-orange text-accent-orange bg-accent-orange/5" : "border-border text-text-secondary hover:border-text-secondary/50"}`}>
            Alle
          </Link>
          {ALL_STATUSES.map((s) => (
            <Link key={s} href={buildUrl({ status: s })} className={`font-sans text-xs px-3 py-1.5 border transition-colors ${activeStatus === s ? "border-accent-orange text-accent-orange bg-accent-orange/5" : "border-border text-text-secondary hover:border-text-secondary/50"}`}>
              {s}
            </Link>
          ))}
        </div>

        <Link
          href={buildUrl({ sort: sort === "asc" ? undefined : "asc" })}
          className="font-sans text-xs px-3 py-1.5 border border-border text-text-secondary hover:border-text-secondary/50 transition-colors whitespace-nowrap"
        >
          {sort === "asc" ? "↑ Älteste" : "↓ Neueste"}
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-sm text-red-700 mb-4">
          Fehler beim Laden: {error.message}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="border-2 border-dashed border-border p-12 text-center">
          <p className="font-sans text-sm text-text-secondary">Keine Anfragen gefunden.</p>
        </div>
      ) : (
        <>
          {/* Desktop Tabelle */}
          <div className="hidden sm:block overflow-x-auto">
            {/* Header */}
            <div className="grid grid-cols-[100px_140px_180px_1fr_110px_100px_140px_60px] gap-0 border-b border-border">
              {["Datum", "Name", "E-Mail", "Produkt", "Kategorie", "Zustand", "Status", "Fotos"].map((h) => (
                <div key={h} className="font-sans text-xs font-semibold uppercase tracking-wide text-text-secondary px-3 py-2.5">
                  {h}
                </div>
              ))}
            </div>
            {/* Rows */}
            {rows.map((row) => (
              <Link
                key={row.id}
                href={`/admin/ankauf/${row.id}`}
                className="grid grid-cols-[100px_140px_180px_1fr_110px_100px_140px_60px] gap-0 border-b border-border hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <div className="px-3 py-3 font-sans text-xs text-text-secondary whitespace-nowrap self-center">
                  {new Date(row.created_at).toLocaleDateString("de-DE")}
                </div>
                <div className="px-3 py-3 font-sans text-sm text-text-primary font-medium whitespace-nowrap overflow-hidden text-ellipsis self-center">
                  {row.name}
                </div>
                <div className="px-3 py-3 font-sans text-xs text-text-secondary overflow-hidden text-ellipsis whitespace-nowrap self-center">
                  {row.email}
                </div>
                <div className="px-3 py-3 font-sans text-sm text-text-primary overflow-hidden text-ellipsis whitespace-nowrap self-center">
                  {row.product_name}
                </div>
                <div className="px-3 py-3 font-sans text-xs text-text-secondary whitespace-nowrap self-center">
                  {row.category}
                </div>
                <div className="px-3 py-3 font-sans text-xs text-text-secondary whitespace-nowrap self-center">
                  {row.condition}
                </div>
                <div className="px-3 py-3 whitespace-nowrap self-center">
                  <StatusBadge status={row.status} size="sm" />
                </div>
                <div className="px-3 py-3 font-sans text-xs text-text-secondary text-center self-center">
                  {row.images?.length ?? 0}
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {rows.map((row) => (
              <Link
                key={row.id}
                href={`/admin/ankauf/${row.id}`}
                className="block p-4 bg-surface border border-border hover:border-accent-orange/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-sans text-sm font-semibold text-text-primary">{row.name}</p>
                    <p className="font-sans text-xs text-text-secondary">{row.email}</p>
                  </div>
                  <StatusBadge status={row.status} size="sm" />
                </div>
                <p className="font-sans text-sm text-text-primary mb-1">{row.product_name}</p>
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                  <span>{row.category}</span>
                  <span>·</span>
                  <span>{row.condition}</span>
                  <span>·</span>
                  <span>{row.images?.length ?? 0} Foto(s)</span>
                  <span>·</span>
                  <span>{new Date(row.created_at).toLocaleDateString("de-DE")}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
