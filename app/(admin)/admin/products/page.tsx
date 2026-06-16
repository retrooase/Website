import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { Plus, TrendingUp } from "lucide-react";
import type { ProductBadge } from "@/types";

export const metadata: Metadata = {
  title: "Produkte | Admin | RetrOase",
  robots: { index: false },
};

type Row = {
  id: string;
  title: string;
  category: string;
  platform: string;
  condition: string;
  price: number;
  purchase_price: number | null;
  is_sold: boolean;
  is_featured: boolean;
  badge: ProductBadge | null;
  ean: string | null;
  images: string[];
  created_at: string;
};

type PageProps = {
  searchParams: Promise<{ filter?: string }>;
};

const BADGE_STYLES: Record<string, string> = {
  NEU: "bg-accent-green/10 text-accent-green",
  SELTEN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  "TOP-ZUSTAND": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  SCHNÄPPCHEN: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  "TOP DEAL": "bg-accent-orange/10 text-accent-orange",
};

export default async function ProductsListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filter = params.filter ?? "all";

  const admin = createAdminSupabaseClient();
  let req = admin
    .from("products")
    .select("id, title, category, platform, condition, price, purchase_price, is_sold, is_featured, badge, ean, images, created_at")
    .order("created_at", { ascending: false });

  if (filter === "available") req = req.eq("is_sold", false);
  else if (filter === "sold") req = req.eq("is_sold", true);
  else if (filter === "featured") req = req.eq("is_featured", true);

  const { data, error } = await req;
  const rows = (data ?? []) as Row[];

  const FILTERS = [
    { key: "all", label: "Alle" },
    { key: "available", label: "Verfügbar" },
    { key: "sold", label: "Verkauft" },
    { key: "featured", label: "Featured" },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-sans text-2xl font-bold text-text-primary">Produkte</h1>
          <p className="font-sans text-sm text-text-secondary mt-1">{rows.length} Einträge</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 font-sans text-sm px-4 py-2 bg-accent-orange text-white hover:bg-accent-orange/90 transition-colors"
        >
          <Plus size={15} />
          Neues Produkt
        </Link>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1 mb-5 flex-wrap">
        {FILTERS.map(({ key, label }) => (
          <Link
            key={key}
            href={key === "all" ? "/admin/products" : `/admin/products?filter=${key}`}
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
          Fehler beim Laden: {error.message}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="border-2 border-dashed border-border p-12 text-center">
          <p className="font-sans text-sm text-text-secondary mb-2">Keine Produkte gefunden.</p>
          {filter === "all" && (
            <p className="font-sans text-xs text-text-secondary">
              Der Shop nutzt derzeit noch <code className="font-mono">data/products.json</code>. Hier erscheinen Supabase-Produkte.
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <div className="grid grid-cols-[44px_1fr_110px_100px_80px_90px_80px_80px_80px] gap-0 border-b border-border">
              {["", "Titel", "Kategorie", "Zustand", "Preis", "Marge", "Status", "Badge", "EAN"].map((h) => (
                <div key={h} className="font-sans text-xs font-semibold uppercase tracking-wide text-text-secondary px-3 py-2.5">
                  {h}
                </div>
              ))}
            </div>
            {rows.map((row) => {
              const margin =
                row.purchase_price != null ? row.price - row.purchase_price : null;
              return (
                <Link
                  key={row.id}
                  href={`/admin/products/${row.id}`}
                  className="grid grid-cols-[44px_1fr_110px_100px_80px_90px_80px_80px_80px] gap-0 border-b border-border hover:bg-surface-hover transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="px-2 py-2 self-center">
                    {row.images?.[0] ? (
                      <div className="relative w-8 h-8 border border-border overflow-hidden">
                        <Image src={row.images[0]} alt="" fill className="object-cover" sizes="32px" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 border border-border bg-surface-hover" />
                    )}
                  </div>
                  <div className="px-3 py-3 font-sans text-sm text-text-primary font-medium overflow-hidden text-ellipsis whitespace-nowrap self-center">
                    {row.title}
                  </div>
                  <div className="px-3 py-3 font-sans text-xs text-text-secondary self-center whitespace-nowrap">
                    {row.category}
                  </div>
                  <div className="px-3 py-3 font-sans text-xs text-text-secondary self-center whitespace-nowrap">
                    {row.condition}
                  </div>
                  <div className="px-3 py-3 font-mono text-sm text-text-primary self-center whitespace-nowrap">
                    {row.price.toFixed(2)} €
                  </div>
                  <div className="px-3 py-3 self-center">
                    {margin != null ? (
                      <span className={`font-mono text-xs font-medium flex items-center gap-0.5 ${margin >= 0 ? "text-accent-green" : "text-red-500"}`}>
                        <TrendingUp size={11} />
                        {margin.toFixed(2)} €
                      </span>
                    ) : (
                      <span className="font-sans text-xs text-text-secondary/50">—</span>
                    )}
                  </div>
                  <div className="px-3 py-3 self-center">
                    <span className={`font-sans text-xs px-1.5 py-0.5 ${row.is_sold ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"}`}>
                      {row.is_sold ? "Verkauft" : "Verfügbar"}
                    </span>
                  </div>
                  <div className="px-3 py-3 self-center">
                    {row.badge ? (
                      <span className={`font-sans text-xs px-1.5 py-0.5 ${BADGE_STYLES[row.badge] ?? "bg-surface-hover text-text-secondary"}`}>
                        {row.badge}
                      </span>
                    ) : (
                      <span className="font-sans text-xs text-text-secondary/50">—</span>
                    )}
                  </div>
                  <div className="px-3 py-3 font-mono text-xs text-text-secondary self-center truncate">
                    {row.ean ?? "—"}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mobile */}
          <div className="sm:hidden space-y-3">
            {rows.map((row) => {
              const margin = row.purchase_price != null ? row.price - row.purchase_price : null;
              return (
                <Link
                  key={row.id}
                  href={`/admin/products/${row.id}`}
                  className="block p-4 bg-surface border border-border hover:border-accent-orange/50 transition-colors"
                >
                  <div className="flex items-start gap-3 mb-2">
                    {row.images?.[0] ? (
                      <div className="relative w-12 h-12 flex-shrink-0 border border-border overflow-hidden">
                        <Image src={row.images[0]} alt="" fill className="object-cover" sizes="48px" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 flex-shrink-0 border border-border bg-surface-hover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm font-semibold text-text-primary truncate">{row.title}</p>
                      <p className="font-sans text-xs text-text-secondary">{row.category} · {row.condition}</p>
                    </div>
                    <span className={`font-sans text-xs px-1.5 py-0.5 flex-shrink-0 ${row.is_sold ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {row.is_sold ? "Verkauft" : "OK"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-mono text-text-primary">{row.price.toFixed(2)} €</span>
                    {margin != null && (
                      <span className={`font-mono ${margin >= 0 ? "text-accent-green" : "text-red-500"}`}>
                        +{margin.toFixed(2)} €
                      </span>
                    )}
                    {row.badge && (
                      <span className={`px-1.5 py-0.5 ${BADGE_STYLES[row.badge] ?? "bg-surface-hover text-text-secondary"}`}>
                        {row.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
