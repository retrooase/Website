import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

export function CategoriesGrid() {
  return (
    <section className="py-20 sm:py-28 bg-surface scroll-fade">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-orange mb-2">
              Sortiert nach Plattform
            </p>
            <h2
              className="font-sans font-bold text-text-primary"
              style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)" }}
            >
              Was suchst du?
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 font-sans text-sm font-semibold text-accent-orange hover:text-text-primary transition-colors"
          >
            Alle anzeigen
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${encodeURIComponent(cat.label)}`}
              className="group flex flex-col items-center gap-4 p-6 sm:p-8 bg-background border border-border hover:border-accent-orange hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(255,107,53,0.12)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-200 text-center"
              aria-label={`${cat.label}: ${cat.description}`}
            >
              <span
                className="text-4xl transition-transform duration-200 group-hover:scale-110"
                aria-hidden="true"
              >
                {cat.icon}
              </span>
              <div>
                <p className="font-sans font-semibold text-sm text-text-primary group-hover:text-accent-orange transition-colors">
                  {cat.label}
                </p>
                <p className="font-sans text-xs text-text-secondary mt-1 leading-tight">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
