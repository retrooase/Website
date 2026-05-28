import Link from "next/link";
import { SITE, FOOTER_LINKS } from "@/lib/constants";
import { Mail, ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t-2 border-border mt-20">
      {/* KaizenDesk-Banner */}
      <div className="bg-surface-hover border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a
            href={SITE.kaizenDeskUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 group"
            aria-label="KaizenDesk — Schwestermarke"
          >
            <span className="font-pixel text-text-secondary" style={{ fontSize: "0.5rem" }}>
              Neuware & Setup-Zubehör →
            </span>
            <span className="font-pixel text-accent-yellow group-hover:neon-text-yellow transition-all" style={{ fontSize: "0.6rem" }}>
              KaizenDesk.de
            </span>
            <ExternalLink size={12} className="text-text-secondary group-hover:text-accent-yellow transition-colors" />
          </a>
        </div>
      </div>

      {/* Haupt-Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Branding-Spalte */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4" aria-label="RetrOase — Startseite">
              <div className="flex items-center gap-1">
                <span className="font-pixel text-accent-orange" style={{ fontSize: "0.85rem" }}>Retr</span>
                <span className="font-pixel text-accent-yellow" style={{ fontSize: "0.85rem" }}>Oase</span>
              </div>
              <p className="font-sans text-xs text-text-secondary mt-2 leading-relaxed">
                {SITE.slogan}
              </p>
            </Link>

            {/* Social-Links */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href={SITE.ebayShopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background border-2 border-border flex items-center justify-center text-text-secondary hover:border-accent-orange hover:text-accent-orange transition-all"
                aria-label="eBay Shop"
              >
                <span className="font-pixel" style={{ fontSize: "0.4rem" }}>eBay</span>
              </a>
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background border-2 border-border flex items-center justify-center text-text-secondary hover:border-accent-orange hover:text-accent-orange transition-all"
                aria-label="Instagram"
              >
                <span className="font-pixel" style={{ fontSize: "0.4rem" }}>IG</span>
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="w-10 h-10 bg-background border-2 border-border flex items-center justify-center text-text-secondary hover:border-accent-orange hover:text-accent-orange transition-all"
                aria-label="E-Mail schreiben"
              >
                <Mail size={16} />
              </a>
            </div>

            {/* Newsletter Quick-Signup */}
            <div className="mt-6">
              <p className="font-pixel text-text-secondary mb-3" style={{ fontSize: "0.5rem" }}>
                Deals per Mail:
              </p>
              <form
                action="/api/newsletter"
                method="post"
                className="flex gap-2"
                aria-label="Newsletter anmelden"
              >
                <input
                  type="email"
                  name="email"
                  className="pixel-input flex-1 py-2 text-xs"
                  placeholder="deine@email.de"
                  required
                  aria-label="E-Mail-Adresse"
                />
                <button
                  type="submit"
                  className="btn-primary py-2 px-3 min-h-[40px]"
                  style={{ fontSize: "0.45rem" }}
                  aria-label="Newsletter abonnieren"
                >
                  OK
                </button>
              </form>
            </div>
          </div>

          {/* Shop-Links */}
          <div>
            <h3 className="font-pixel text-text-primary mb-5" style={{ fontSize: "0.55rem", letterSpacing: "0.08em" }}>
              Shop
            </h3>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-text-secondary hover:text-accent-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info-Links */}
          <div>
            <h3 className="font-pixel text-text-primary mb-5" style={{ fontSize: "0.55rem", letterSpacing: "0.08em" }}>
              RetrOase
            </h3>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.info.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-text-secondary hover:text-accent-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className="font-pixel text-text-primary mb-5" style={{ fontSize: "0.55rem", letterSpacing: "0.08em" }}>
              Rechtliches
            </h3>
            <ul className="space-y-3" role="list">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-text-secondary hover:text-accent-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Kontakt */}
            <div className="mt-6 pt-4 border-t border-border">
              <a
                href={`mailto:${SITE.email}`}
                className="font-sans text-sm text-text-secondary hover:text-accent-orange transition-colors flex items-center gap-2"
              >
                <Mail size={14} />
                {SITE.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright-Leiste */}
      <div className="border-t-2 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-text-secondary text-center sm:text-left">
            © {currentYear} RetrOase. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-sans text-xs text-text-secondary">
              Inkl. 19% MwSt. · Made in Germany 🇩🇪
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
