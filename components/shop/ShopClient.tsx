"use client";

import { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { clsx } from "clsx";
import type { Product } from "@/lib/types";
import { normalizeText, productMatchesCategory, resolveCategorySlug } from "@/lib/categories";
import { ProductCard } from "./ProductCard";
import { SearchInput } from "./SearchInput";
import { SortSelect, type SortOption } from "./SortSelect";
import { FilterPanel, type Filters, DEFAULT_FILTERS } from "./FilterPanel";
import { EmptyState } from "./EmptyState";

type Props = {
  products: Product[];
  allPlatforms: string[];
  initialQuery?: string;
  initialCategory?: string;
};

export function ShopClient({ products, allPlatforms, initialQuery = "", initialCategory = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortOption>("newest");
  // Eingehenden Kategorie-Wert (Slug ODER Label) auf den kanonischen Slug
  // normalisieren, damit Matching UND FilterPanel-Checkbox synchron sind.
  const seededCategory = initialCategory
    ? resolveCategorySlug(initialCategory) ?? initialCategory
    : "";
  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    categories: seededCategory ? [seededCategory] : [],
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (query.trim()) {
      const q = normalizeText(query);
      list = list.filter(
        (p) =>
          normalizeText(p.title).includes(q) ||
          normalizeText(p.platform ?? "").includes(q) ||
          normalizeText(p.category).includes(q) ||
          normalizeText(p.description).includes(q)
      );
    }

    if (filters.onlyAvailable) list = list.filter((p) => !p.is_sold);
    if (filters.categories.length > 0)
      list = list.filter((p) =>
        filters.categories.some((c) => productMatchesCategory(p, c))
      );
    if (filters.conditions.length > 0) list = list.filter((p) => filters.conditions.includes(p.condition));
    list = list.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
    if (filters.platforms.length > 0) list = list.filter((p) => filters.platforms.includes(p.platform));

    switch (sort) {
      case "price-asc":  list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "popular":    list.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)); break;
      default:           list.sort((a, b) => b.id.localeCompare(a.id));
    }

    return list;
  }, [products, query, sort, filters]);

  const activeFilterCount =
    filters.categories.length +
    filters.conditions.length +
    filters.platforms.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 250 ? 1 : 0) +
    (!filters.onlyAvailable ? 1 : 0);

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Game Boy Color, Pokémon Gelb, SNES…"
          />
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={() => setDrawerOpen(true)}
            className={clsx(
              "lg:hidden flex items-center gap-2 flex-shrink-0 px-4 py-2.5 rounded-full border font-sans text-sm transition-all duration-150 bg-surface min-h-[44px]",
              activeFilterCount > 0
                ? "border-accent-orange text-accent-orange bg-accent-orange/5"
                : "border-border text-text-secondary hover:border-accent-orange hover:text-accent-orange"
            )}
            aria-expanded={drawerOpen}
          >
            <SlidersHorizontal size={16} />
            Filter
            {activeFilterCount > 0 && (
              <span className="bg-accent-orange text-white text-xs px-1.5 py-0.5 rounded-full font-bold leading-none">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="w-full sm:w-56">
            <SortSelect value={sort} onChange={setSort} />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-28 bg-surface border border-border rounded-2xl p-5">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              allPlatforms={allPlatforms}
              resultCount={filtered.length}
            />
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="font-sans text-sm text-text-secondary">
              <span className="text-text-primary font-semibold">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "Artikel" : "Artikel"}
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="font-sans text-xs text-text-secondary hover:text-accent-orange transition-colors flex items-center gap-1"
              >
                <X size={12} /> Filter zurücksetzen
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <EmptyState query={query || undefined} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 4} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={clsx(
          "fixed top-0 right-0 h-full w-80 max-w-[90vw] z-50 lg:hidden",
          "bg-surface/95 backdrop-blur-2xl border-l border-border/40",
          "transform transition-transform duration-300 ease-out overflow-y-auto",
          drawerOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Filter-Drawer"
        aria-hidden={!drawerOpen}
      >
        <div className="flex items-center justify-between p-5 border-b border-border/60 sticky top-0 bg-surface/95 backdrop-blur-xl z-10">
          <span className="font-display text-sm font-bold text-text-primary uppercase tracking-wider">
            Filter
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Drawer schließen"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            allPlatforms={allPlatforms}
            resultCount={filtered.length}
          />
          <button
            onClick={() => setDrawerOpen(false)}
            className="inline-flex items-center justify-center w-full px-6 py-3.5 rounded-full bg-accent-orange text-white font-sans font-semibold text-sm hover:bg-accent-orange/90 transition-colors mt-6"
          >
            {filtered.length} Artikel anzeigen
          </button>
        </div>
      </aside>
    </div>
  );
}
