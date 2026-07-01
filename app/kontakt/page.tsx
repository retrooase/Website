import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, Clock, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/constants";
import { breadcrumbSchema, jsonLdString } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Fragen zu Bestellung, Ankauf oder Produkten? Kontaktiere das RetrOase-Team per E-Mail oder WhatsApp — wir antworten schnell.",
  alternates: {
    canonical: "/kontakt",
  },
};

export default function KontaktPage() {
  const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(breadcrumbSchema([{ name: "Startseite", url: "/" }, { name: "Kontakt" }])),
        }}
      />

      <section className="border-b border-border bg-surface">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-orange mb-3">
            Wir sind für dich da
          </p>
          <h1
            className="font-sans font-bold text-text-primary mb-4"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            Kontakt
          </h1>
          <p className="font-sans text-sm text-text-secondary max-w-xl leading-relaxed">
            Fragen zu einer Bestellung, einem Produkt oder deinem Ankauf-Angebot? Schreib uns —
            wir melden uns in der Regel innerhalb eines Werktags zurück.
          </p>
        </div>
      </section>

      <section className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          <a
            href={`mailto:${SITE.email}`}
            className="group flex flex-col gap-3 p-6 bg-surface border border-border hover:border-accent-orange transition-colors"
          >
            <span className="flex items-center justify-center w-11 h-11 rounded-full bg-accent-orange/10 text-accent-orange">
              <Mail size={20} />
            </span>
            <span className="font-sans font-bold text-text-primary text-sm">E-Mail</span>
            <span className="font-sans text-sm text-text-secondary group-hover:text-accent-orange transition-colors">
              {SITE.email}
            </span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-3 p-6 bg-surface border border-border hover:border-success transition-colors"
          >
            <span className="flex items-center justify-center w-11 h-11 rounded-full bg-success/10 text-success">
              <MessageCircle size={20} />
            </span>
            <span className="font-sans font-bold text-text-primary text-sm">WhatsApp</span>
            <span className="font-sans text-sm text-text-secondary group-hover:text-success transition-colors">
              Direktnachricht senden
            </span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-border pt-10">
          <div className="flex items-start gap-3">
            <Clock size={18} className="text-accent-orange flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-sans font-semibold text-text-primary text-sm mb-1">Antwortzeit</p>
              <p className="font-sans text-xs text-text-secondary leading-relaxed">
                Werktags in der Regel innerhalb von 24 Stunden.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck size={18} className="text-accent-orange flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-sans font-semibold text-text-primary text-sm mb-1">Ankauf-Anfrage?</p>
              <p className="font-sans text-xs text-text-secondary leading-relaxed">
                Nutze für Ankauf-Anfragen direkt unser{" "}
                <Link href="/ankauf" className="text-accent-orange hover:underline">
                  Ankauf-Formular
                </Link>{" "}
                — so bearbeiten wir dein Angebot am schnellsten.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
