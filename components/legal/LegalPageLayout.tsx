import { AlertTriangle } from "lucide-react";
import { breadcrumbSchema, jsonLdString } from "@/lib/seo";

type Props = {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
};

export function LegalPageLayout({ title, lastUpdated, children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(breadcrumbSchema([{ name: "Startseite", url: "/" }, { name: title }])),
        }}
      />

      <section className="border-b border-border bg-surface">
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1
            className="font-sans font-bold text-text-primary mb-3"
            style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)" }}
          >
            {title}
          </h1>
          <p className="font-sans text-xs text-text-tertiary">Stand: {lastUpdated}</p>
        </div>
      </section>

      <div className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div
          role="note"
          className="flex items-start gap-3 mb-10 p-4 border-2 border-warning bg-warning/10"
        >
          <AlertTriangle size={18} className="text-warning flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="font-sans text-xs text-text-primary leading-relaxed">
            <strong>Hinweis (nur intern sichtbar für Betreiber):</strong> Diese Seite enthält mit{" "}
            <code className="font-mono text-warning">[PLATZHALTER]</code> markierte Angaben. Bitte
            vor Veröffentlichung mit den echten Unternehmensdaten vervollständigen und rechtlich
            prüfen lassen (z. B. durch einen Anwalt oder einen Impressum-/AGB-Generator).
          </p>
        </div>

        <div className="prose-legal font-sans text-sm text-text-secondary leading-relaxed space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
