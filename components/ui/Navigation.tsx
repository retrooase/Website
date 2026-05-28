"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Heart, User, ShoppingBag } from "lucide-react";
import { SITE, NAV_LINKS } from "@/lib/constants";
import { clsx } from "clsx";
import { ThemeToggle } from "./ThemeToggle";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Drawer schließen bei Routenwechsel
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Scroll blockieren wenn Drawer offen
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b-2 border-border"
            : "bg-background/80 backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group flex-shrink-0"
              aria-label="RetrOase — Startseite"
            >
              <span
                className="font-pixel text-accent-orange neon-text-orange"
                style={{ fontSize: "clamp(0.6rem, 2.5vw, 0.85rem)" }}
              >
                Retr
              </span>
              <span
                className="font-pixel text-accent-yellow neon-text-yellow"
                style={{ fontSize: "clamp(0.6rem, 2.5vw, 0.85rem)" }}
              >
                Oase
              </span>
            </Link>

            {/* Desktop-Navigation */}
            <nav
              className="hidden lg:flex items-center gap-8"
              aria-label="Hauptnavigation"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "font-pixel text-xs transition-all duration-150 relative pb-1",
                    "hover:text-accent-orange",
                    pathname === link.href || pathname.startsWith(link.href + "/")
                      ? "text-accent-orange"
                      : "text-text-secondary"
                  )}
                  style={{ fontSize: "0.55rem", letterSpacing: "0.05em" }}
                >
                  {link.label}
                  {(pathname === link.href || pathname.startsWith(link.href + "/")) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-orange" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop-Aktionen */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Suche */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-text-secondary hover:text-accent-orange transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Suche öffnen"
              >
                <Search size={20} />
              </button>

              {/* Wunschliste */}
              <Link
                href="/wunschliste"
                className="p-2 text-text-secondary hover:text-error transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center relative"
                aria-label="Wunschliste"
              >
                <Heart size={20} />
              </Link>

              {/* Account */}
              <Link
                href="/profil"
                className="p-2 text-text-secondary hover:text-accent-orange transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Mein Profil"
              >
                <User size={20} />
              </Link>

              {/* eBay-Link */}
              <a
                href={SITE.ebayShopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs py-2 px-4 min-h-[40px]"
                style={{ fontSize: "0.5rem" }}
                aria-label="Zu unserem eBay-Shop"
              >
                <ShoppingBag size={14} />
                eBay Shop
              </a>
            </div>

            {/* Mobile-Aktionen */}
            <div className="flex lg:hidden items-center gap-2">
              <ThemeToggle />
              <Link
                href="/wunschliste"
                className="p-2 text-text-secondary hover:text-error transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Wunschliste"
              >
                <Heart size={20} />
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-text-secondary hover:text-accent-orange transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop-Suchleiste */}
        {isSearchOpen && (
          <div className="hidden lg:block border-t-2 border-border bg-background/95 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <form
                action="/shop"
                method="get"
                className="flex gap-3"
                onSubmit={(e) => {
                  const input = e.currentTarget.querySelector("input");
                  if (!input?.value.trim()) e.preventDefault();
                }}
              >
                <input
                  type="search"
                  name="q"
                  className="pixel-input flex-1"
                  placeholder="Game Boy Color, Pokemon Gelb, SNES..."
                  autoFocus
                  aria-label="Produkte suchen"
                />
                <button type="submit" className="btn-primary py-2 px-6">
                  <Search size={16} />
                  Suchen
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer-Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50 lg:hidden",
          "bg-surface border-r-2 border-border",
          "transform transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Mobile Navigation"
        aria-hidden={!isMenuOpen}
      >
        {/* Drawer-Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-border">
          <Link href="/" className="flex items-center gap-1">
            <span className="font-pixel text-accent-orange" style={{ fontSize: "0.7rem" }}>Retr</span>
            <span className="font-pixel text-accent-yellow" style={{ fontSize: "0.7rem" }}>Oase</span>
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-text-secondary hover:text-accent-orange transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Menü schließen"
          >
            <X size={24} />
          </button>
        </div>

        {/* Drawer-Suche */}
        <div className="p-4 border-b-2 border-border">
          <form action="/shop" method="get">
            <input
              type="search"
              name="q"
              className="pixel-input w-full"
              placeholder="Produkte suchen..."
              aria-label="Produkte suchen"
            />
          </form>
        </div>

        {/* Drawer-Links */}
        <nav className="p-4 space-y-1" aria-label="Mobile Hauptnavigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 font-pixel transition-all duration-150 border-2 border-transparent",
                "hover:border-accent-orange hover:text-accent-orange hover:bg-surface-hover",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-accent-orange border-accent-orange bg-surface-hover"
                  : "text-text-secondary"
              )}
              style={{ fontSize: "0.55rem", letterSpacing: "0.05em" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Drawer-Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-border space-y-3">
          <Link
            href="/profil"
            className="flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-accent-orange transition-colors font-sans text-sm"
          >
            <User size={18} />
            Mein Profil
          </Link>
          <a
            href={SITE.ebayShopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary w-full text-center justify-center"
          >
            <ShoppingBag size={16} />
            eBay Shop
          </a>
        </div>
      </aside>

      {/* Platzhalter für sticky Header */}
      <div className="h-16 lg:h-20" aria-hidden="true" />
    </>
  );
}
