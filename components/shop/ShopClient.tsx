"use client";

import { useState, useMemo, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { clsx } from "clsx";
import type { Product } from "@/lib/types";
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
  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    categories: initialCategory ? [initialCategory] : [],
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Drawer: Scroll sperren
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const filtered = useMemo(() => {
    let list = [...products];

    // Suche
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.platform.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Verfügbarkeit
    if (filters.onlyAvailable) list = list.filter((p) => !p.is_sold);

    // Kategorie
    if (filters.categories.length > 0) {
      list = list.filter((p) => filters.categories.includes(p.category));
    }

    // Zustand
    if (filters.conditions.length > 0) {
      list = list.filter((p) => filters.conditions.includes(p.condition));
    }

    // Preis
    list = list.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Plattform
    if (filters.platforms.length > 0) {
      list = list.filter((p) => filters.platforms.includes(p.platform));
    }

    // Sortierung
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        list.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
      default:
        // "newest" = Reihenfolge aus JSON (id-basiert)
        list.sort((a, b) => b.id.localeCompare(a.id));
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          {/* Mobile Filter-Trigger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={clsx(
              "lg:hidden flex items-center gap-2 flex-shrink-0 px-4 py-2.5 border border-border font-sans text-sm text-text-secondary hover:border-accent-orange hover:text-accent-orange transition-all duration-150 bg-surface min-h-[44px]",
              activeFilterCount > 0 && "border-accent-orange text-accent-orange"
            )}
            aria-expanded={drawerOpen}
          >
            <SlidersHorizontal size={16} />
            Filter
            {activeFilterCount > 0 && (
              <span className="bg-accent-orange text-background text-xs px-1.5 font-bold">
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
          <div className="sticky top-24 bg-surface border border-border p-5">
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
          {/* Ergebnis-Info */}
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
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={clsx(
          "fixed top-0 right-0 h-full w-80 max-w-[90vw] z-50 lg:hidden",
          "bg-surface border-l border-border",
          "transform transition-transform duration-300 ease-in-out overflow-y-auto",
          drawerOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Filter-Drawer"
        aria-hidden={!drawerOpen}
      >
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-surface z-10">
          <span className="font-sans text-sm font-semibold text-text-primary uppercase tracking-wide">
            Filter
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 text-text-secondary hover:text-accent-orange transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Drawer schließen"
          >
            <X size={22} />
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
            className="btn-primary w-full mt-6 justify-center"
          >
            {filtered.length} Artikel anzeigen
          </button>
        </div>
      </aside>
    </div>
  );
}
