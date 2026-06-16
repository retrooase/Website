"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search, Heart, User, ShoppingBag, Shield, ShoppingCart,
  Home, X, ChevronDown, Menu, Gamepad2, Zap, Star,
} from "lucide-react";
import { SITE, NAV_LINKS } from "@/lib/constants";
import { clsx } from "clsx";
import { ThemeToggle } from "./ThemeToggle";
import { useWishlistHybrid } from "@/lib/hooks/useWishlistHybrid";
import { useCart } from "@/lib/hooks/useCart";

const SHOP_CATEGORIES = [
  { href: "/shop?category=gameboy", label: "Game Boy", emoji: "🎮" },
  { href: "/shop?category=nintendo", label: "Nintendo", emoji: "🍄" },
  { href: "/shop?category=playstation", label: "PlayStation", emoji: "🎯" },
  { href: "/shop?category=snes", label: "SNES", emoji: "🕹️" },
  { href: "/shop?category=n64", label: "Nintendo 64", emoji: "🌟" },
  { href: "/shop?category=pokemon", label: "Pokémon", emoji: "⚡" },
  { href: "/shop?category=zubehoer", label: "Zubehör", emoji: "🔧" },
  { href: "/shop", label: "Alle Artikel", emoji: "✨" },
];

export function Navigation({ isAdmin = false }: { isAdmin?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { count: wishlistCount, isLoaded: wishlistLoaded } = useWishlistHybrid();
  const { count: cartCount, isLoaded: cartLoaded } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsShopDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsShopDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <>
      {/* ─── Desktop / Tablet Header ─────────────────────────────────────────── */}
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-background/80 backdrop-blur-2xl border-b border-border/40 shadow-[0_2px_32px_rgba(0,0,0,0.12)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 group"
              aria-label="RetrOase — Startseite"
            >
              <span className="font-display font-extrabold text-xl lg:text-2xl text-text-primary tracking-tight group-hover:text-accent-orange transition-colors duration-200">
                Retr<span className="text-accent-orange">Oase</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Hauptnavigation">
              {/* Shop with dropdown */}
              <div className="relative flex items-center" ref={dropdownRef}>
                <Link
                  href="/shop"
                  className={clsx(
                    "px-4 py-2 rounded-full font-sans text-sm font-medium transition-all duration-200",
                    isActive("/shop")
                      ? "text-accent-orange bg-accent-orange/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                  )}
                >
                  Shop
                </Link>
                <button
                  onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
                  className={clsx(
                    "p-1.5 rounded-full transition-all duration-200",
                    isActive("/shop")
                      ? "text-accent-orange hover:bg-accent-orange/10"
                      : "text-text-tertiary hover:text-text-primary hover:bg-surface-hover"
                  )}
                  aria-expanded={isShopDropdownOpen}
                  aria-haspopup="true"
                  aria-label="Shop-Kategorien"
                >
                  <ChevronDown
                    size={14}
                    className={clsx("transition-transform duration-200", isShopDropdownOpen && "rotate-180")}
                  />
                </button>

                {/* Dropdown */}
                {isShopDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-surface/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.2)] overflow-hidden animate-fade-in">
                    <div className="p-2">
                      {SHOP_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-150 group"
                        >
                          <span className="text-base">{cat.emoji}</span>
                          <span className="font-medium">{cat.label}</span>
                          {cat.label === "Alle Artikel" && (
                            <span className="ml-auto text-xs text-accent-orange font-semibold">→</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Other nav links */}
              {NAV_LINKS.filter(l => l.href !== "/shop").map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "px-4 py-2 rounded-full font-sans text-sm font-medium transition-all duration-200",
                    isActive(link.href)
                      ? "text-accent-orange bg-accent-orange/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-1">
              <ThemeToggle />

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Suche öffnen"
                aria-expanded={isSearchOpen}
              >
                <Search size={18} />
              </button>

              <Link
                href="/wunschliste"
                className="relative p-2.5 rounded-full text-text-secondary hover:text-error hover:bg-error/10 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Wunschliste"
              >
                <Heart size={18} />
                {wishlistLoaded && wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-error text-white font-sans text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/warenkorb"
                className="relative p-2.5 rounded-full text-text-secondary hover:text-accent-orange hover:bg-accent-orange/10 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Warenkorb"
              >
                <ShoppingCart size={18} />
                {cartLoaded && cartCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-accent-orange text-white font-sans text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full font-sans text-xs font-semibold text-accent-orange border border-accent-orange/40 hover:bg-accent-orange/10 transition-all duration-200"
                  aria-label="Admin-Bereich"
                >
                  <Shield size={13} />
                  Admin
                </Link>
              )}

              <Link
                href="/profil"
                className="p-2.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Mein Profil"
              >
                <User size={18} />
              </Link>

              <a
                href={SITE.ebayShopUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent-orange text-white font-sans text-xs font-semibold hover:bg-accent-orange/90 hover:-translate-y-0.5 shadow-[0_2px_12px_rgba(255,95,46,0.35)] hover:shadow-[0_4px_20px_rgba(255,95,46,0.5)] transition-all duration-200"
                aria-label="Zu unserem eBay-Shop"
              >
                <ShoppingBag size={13} />
                eBay
              </a>
            </div>

            {/* Mobile Header Actions */}
            <div className="flex lg:hidden items-center gap-1">
              <ThemeToggle />

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Suche öffnen"
              >
                <Search size={20} />
              </button>

              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Menü öffnen"
                aria-expanded={isMenuOpen}
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar (slides down) */}
        <div
          className={clsx(
            "overflow-hidden transition-all duration-300 border-t border-border/30",
            isSearchOpen ? "max-h-24 opacity-100" : "max-h-0 opacity-0 border-transparent"
          )}
        >
          <div className="bg-background/95 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-3 max-w-8xl mx-auto">
            <form
              action="/shop"
              method="get"
              className="flex gap-2"
              onSubmit={(e) => {
                const input = e.currentTarget.querySelector("input");
                if (!input?.value.trim()) e.preventDefault();
              }}
            >
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  ref={searchInputRef}
                  type="search"
                  name="q"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-full font-sans text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20 transition-all"
                  placeholder="Game Boy Color, Pokémon Gelb, SNES..."
                  aria-label="Produkte suchen"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-accent-orange text-white rounded-full font-sans text-sm font-semibold hover:bg-accent-orange/90 transition-colors"
              >
                Suchen
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
                aria-label="Suche schließen"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ─── Mobile Slide-In Menu (right) ────────────────────────────────────── */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={clsx(
          "fixed top-0 right-0 h-full w-80 max-w-[90vw] z-[60] lg:hidden",
          "bg-surface/95 backdrop-blur-2xl border-l border-border/40",
          "transform transition-transform duration-350 ease-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Mobile Navigation"
        aria-hidden={!isMenuOpen}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
          <Link href="/" onClick={() => setIsMenuOpen(false)} aria-label="RetrOase — Startseite">
            <span className="font-display font-extrabold text-xl text-text-primary">
              Retr<span className="text-accent-orange">Oase</span>
            </span>
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Menü schließen"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Body */}
        <div className="overflow-y-auto h-[calc(100%-130px)]">
          {/* Search */}
          <div className="px-5 py-4 border-b border-border/30">
            <form action="/shop" method="get">
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="search"
                  name="q"
                  className="w-full pl-9 pr-4 py-2.5 bg-surface-hover border border-border/40 rounded-full font-sans text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-orange transition-all"
                  placeholder="Suchen..."
                  aria-label="Produkte suchen"
                />
              </div>
            </form>
          </div>

          {/* Nav Links */}
          <nav className="px-3 py-3" aria-label="Mobile Hauptnavigation">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all duration-150",
                isActive("/")
                  ? "text-accent-orange bg-accent-orange/10"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
              )}
            >
              <Home size={17} />
              Startseite
            </Link>

            {/* Shop section with categories */}
            <div className="mt-1">
              <Link
                href="/shop"
                onClick={() => setIsMenuOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all duration-150",
                  isActive("/shop")
                    ? "text-accent-orange bg-accent-orange/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                )}
              >
                <Gamepad2 size={17} />
                Shop
              </Link>
              <div className="ml-4 pl-4 border-l border-border/40 mt-1 space-y-0.5">
                {SHOP_CATEGORIES.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-all"
                  >
                    <span>{cat.emoji}</span>
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            {NAV_LINKS.filter(l => l.href !== "/shop").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all duration-150 mt-1",
                  isActive(link.href)
                    ? "text-accent-orange bg-accent-orange/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                )}
              >
                {link.href === "/ankauf" && <Zap size={17} />}
                {link.href === "/blog" && <Star size={17} />}
                {![ "/ankauf", "/blog"].includes(link.href) && <span className="w-[17px]" />}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="px-3 py-2 border-t border-border/30 mt-2">
            <Link
              href="/profil"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
            >
              <User size={17} />
              Mein Profil
            </Link>
            <Link
              href="/wunschliste"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-secondary hover:text-error hover:bg-error/10 transition-all"
            >
              <Heart size={17} />
              Wunschliste
              {wishlistLoaded && wishlistCount > 0 && (
                <span className="ml-auto text-xs font-semibold text-error">{wishlistCount}</span>
              )}
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-accent-orange font-semibold hover:bg-accent-orange/10 transition-all"
              >
                <Shield size={17} />
                Admin-Bereich
              </Link>
            )}
          </div>
        </div>

        {/* Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-4 border-t border-border/30 bg-surface/80 backdrop-blur-lg">
          <a
            href={SITE.ebayShopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-accent-orange text-white rounded-full font-sans text-sm font-semibold hover:bg-accent-orange/90 transition-colors shadow-[0_2px_12px_rgba(255,95,46,0.35)]"
            onClick={() => setIsMenuOpen(false)}
          >
            <ShoppingBag size={15} />
            eBay Shop besuchen
          </a>
        </div>
      </aside>

      {/* ─── Spacer for fixed header ─────────────────────────────────────────── */}
      <div className="h-16 lg:h-20" aria-hidden="true" />

      {/* ─── Mobile Bottom Tab Bar ───────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-surface/90 backdrop-blur-2xl border-t border-border/40 safe-area-pb"
        aria-label="Mobile Tab-Navigation"
      >
        <div className="flex items-end justify-around px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {/* Home */}
          <Link
            href="/"
            className={clsx(
              "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]",
              isActive("/") && pathname === "/"
                ? "text-accent-orange"
                : "text-text-tertiary hover:text-text-secondary"
            )}
            aria-label="Startseite"
          >
            <Home size={22} strokeWidth={pathname === "/" ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium font-sans">Home</span>
          </Link>

          {/* Shop */}
          <Link
            href="/shop"
            className={clsx(
              "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]",
              isActive("/shop")
                ? "text-accent-orange"
                : "text-text-tertiary hover:text-text-secondary"
            )}
            aria-label="Shop"
          >
            <Gamepad2 size={22} strokeWidth={isActive("/shop") ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium font-sans">Shop</span>
          </Link>

          {/* Cart — center, elevated */}
          <Link
            href="/warenkorb"
            className="relative flex flex-col items-center -mt-5"
            aria-label="Warenkorb"
          >
            <div
              className={clsx(
                "flex items-center justify-center w-14 h-14 rounded-full shadow-[0_4px_20px_rgba(255,95,46,0.45)] transition-all duration-200 hover:-translate-y-0.5",
                isActive("/warenkorb")
                  ? "bg-accent-orange scale-105"
                  : "bg-accent-orange hover:bg-accent-orange/90"
              )}
            >
              <ShoppingCart size={24} className="text-white" strokeWidth={2} />
              {cartLoaded && cartCount > 0 && (
                <span className="absolute top-0 right-0 min-w-[18px] h-[18px] bg-white text-accent-orange font-sans text-[9px] font-extrabold rounded-full flex items-center justify-center px-1 leading-none border border-accent-orange/20">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium font-sans text-text-tertiary mt-1">Korb</span>
          </Link>

          {/* Wunschliste */}
          <Link
            href="/wunschliste"
            className={clsx(
              "relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]",
              isActive("/wunschliste")
                ? "text-error"
                : "text-text-tertiary hover:text-text-secondary"
            )}
            aria-label="Wunschliste"
          >
            <Heart size={22} strokeWidth={isActive("/wunschliste") ? 2.5 : 1.8} />
            {wishlistLoaded && wishlistCount > 0 && (
              <span className="absolute top-0.5 right-2 min-w-[14px] h-[14px] bg-error text-white font-sans text-[8px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
            <span className="text-[10px] font-medium font-sans">Merkliste</span>
          </Link>

          {/* Profil */}
          <Link
            href="/profil"
            className={clsx(
              "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]",
              isActive("/profil")
                ? "text-accent-orange"
                : "text-text-tertiary hover:text-text-secondary"
            )}
            aria-label="Mein Profil"
          >
            <User size={22} strokeWidth={isActive("/profil") ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium font-sans">Profil</span>
          </Link>
        </div>
      </nav>

    </>
  );
}
