import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; href?: string };

export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((crumb, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight size={12} className="text-text-secondary flex-shrink-0" />
            )}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="font-sans text-xs text-text-secondary hover:text-accent-orange transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="font-sans text-xs text-text-primary">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
