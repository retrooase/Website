import Link from "next/link";
import { SITE, FOOTER_LINKS } from "@/lib/constants";
import { Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border/60 mt-20 mb-20 lg:mb-0">
      {/* Main Footer */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5" aria-label="RetrOase — Startseite">
              <span className="font-display font-extrabold text-xl text-text-primary">
                Retr<span className="text-accent-orange">Oase</span>
              </span>
            </Link>
            <p className="font-sans text-sm text-text-secondary mb-6 leading-relaxed max-w-xs">
              {SITE.slogan}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2 mb-6">
              <a
                href={SITE.ebayShopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-border text-text-secondary hover:border-accent-orange hover:text-accent-orange transition-all duration-200 bg-background font-sans text-xs font-bold"
                aria-label="eBay Shop"
              >
                eBay
              </a>
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-border text-text-secondary hover:border-accent-orange hover:text-accent-orange transition-all duration-200 bg-background font-sans text-xs font-bold"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-border text-text-secondary hover:border-accent-orange hover:text-accent-orange transition-all duration-200 bg-background"
                aria-label="E-Mail schreiben"
              >
                <Mail size={15} />
              </a>
            </div>

            {/* Quick Newsletter */}
            <div>
              <p className="font-sans text-xs text-text-tertiary mb-2.5">Deals per Mail:</p>
              <form action="/api/newsletter" method="post" className="flex gap-2" aria-label="Newsletter anmelden">
                <input
                  type="email"
                  name="email"
                  className="flex-1 bg-background border border-border rounded-full text-text-primary placeholder:text-text-tertiary px-4 py-2 font-sans text-xs focus:outline-none focus:border-accent-orange transition-colors min-h-[36px]"
                  placeholder="deine@email.de"
                  required
                  aria-label="E-Mail-Adresse"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 px-4 py-2 rounded-full bg-accent-orange text-white font-sans text-xs font-semibold hover:bg-accent-orange/90 transition-colors min-h-[36px]"
                  aria-label="Newsletter abonnieren"
                >
                  OK
                </button>
              </form>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-display font-bold text-text-primary text-sm mb-5 uppercase tracking-[0.08em]">
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

          {/* Info Links */}
          <div>
            <h3 className="font-display font-bold text-text-primary text-sm mb-5 uppercase tracking-[0.08em]">
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

          {/* Legal */}
          <div>
            <h3 className="font-display font-bold text-text-primary text-sm mb-5 uppercase tracking-[0.08em]">
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

            <div className="mt-6 pt-5 border-t border-border/60">
              <a
                href={`mailto:${SITE.email}`}
                className="font-sans text-sm text-text-secondary hover:text-accent-orange transition-colors flex items-center gap-2"
              >
                <Mail size={14} aria-hidden="true" />
                {SITE.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border/60">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-text-tertiary text-center sm:text-left">
            © {currentYear} RetrOase. Alle Rechte vorbehalten.
          </p>
          <span className="font-sans text-xs text-text-tertiary">
            Inkl. 19% MwSt. · Made in Germany 🇩🇪
          </span>
        </div>
      </div>
    </footer>
  );
}
