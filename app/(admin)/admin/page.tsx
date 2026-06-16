import type { Metadata } from "next";
import Link from "next/link";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import {
  Package,
  Clock,
  Send,
  CheckCircle,
  XCircle,
  Bell,
  Mail,
  ShoppingBag,
  FileText,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { AnkaufStatus } from "@/types";

export const metadata: Metadata = {
  title: "Admin Dashboard | RetrOase",
  robots: { index: false },
};

const STATUS_ORDER: AnkaufStatus[] = [
  "Eingegangen",
  "In Bewertung",
  "Angebot gesendet",
  "Angenommen",
  "Abgelehnt",
];

const STATUS_META: Record<AnkaufStatus, { icon: React.ElementType; color: string; bg: string }> = {
  Eingegangen: { icon: Package, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
  "In Bewertung": { icon: Clock, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
  "Angebot gesendet": { icon: Send, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
  Angenommen: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
  Abgelehnt: { icon: XCircle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
};

export default async function AdminDashboard() {
  const admin = createAdminSupabaseClient();

  const [
    ankaufResult,
    alertsResult,
    newsletterResult,
    productsResult,
    blogResult,
    recentAnkaufResult,
    recentProductsResult,
  ] = await Promise.all([
    admin.from("ankauf_requests").select("status"),
    admin.from("wishlist_alerts").select("id", { count: "exact", head: true }),
    admin
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
    admin.from("products").select("is_sold, is_featured, purchase_price, price"),
    admin.from("blog_posts").select("is_published"),
    admin
      .from("ankauf_requests")
      .select("id, name, product_name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    admin
      .from("products")
      .select("id, title, price, is_featured, is_sold")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  // Ankauf-Status-Counts
  const ankaufRows = (ankaufResult.data ?? []) as { status: AnkaufStatus }[];
  const statusCounts: Record<AnkaufStatus, number> = {
    Eingegangen: 0,
    "In Bewertung": 0,
    "Angebot gesendet": 0,
    Angenommen: 0,
    Abgelehnt: 0,
  };
  for (const row of ankaufRows) {
    if (row.status in statusCounts) statusCounts[row.status]++;
  }

  // Produkt-Stats
  const products = (productsResult.data ?? []) as {
    is_sold: boolean;
    is_featured: boolean;
    purchase_price: number | null;
    price: number;
  }[];
  const productTotal = products.length;
  const productAvailable = products.filter((p) => !p.is_sold).length;
  const productSold = products.filter((p) => p.is_sold).length;
  const productFeatured = products.filter((p) => p.is_featured).length;
  const productsWithMargin = products.filter((p) => p.purchase_price != null);
  const avgMargin =
    productsWithMargin.length > 0
      ? productsWithMargin.reduce(
          (sum, p) => sum + (p.price - (p.purchase_price ?? 0)),
          0
        ) / productsWithMargin.length
      : null;

  // Blog-Stats
  const blogPosts = (blogResult.data ?? []) as { is_published: boolean }[];
  const blogTotal = blogPosts.length;
  const blogPublished = blogPosts.filter((p) => p.is_published).length;
  const blogDrafts = blogTotal - blogPublished;

  const alertCount = alertsResult.count ?? 0;
  const newsletterCount = newsletterResult.count ?? 0;
  const recentAnkauf = (recentAnkaufResult.data ?? []) as {
    id: string;
    name: string;
    product_name: string;
    status: AnkaufStatus;
    created_at: string;
  }[];
  const recentProducts = (recentProductsResult.data ?? []) as {
    id: string;
    title: string;
    price: number;
    is_featured: boolean;
    is_sold: boolean;
  }[];

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-sans text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="font-sans text-sm text-text-secondary mt-1">Übersicht über alle Aktivitäten</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-1.5 font-sans text-xs px-3 py-2 bg-accent-orange text-white hover:bg-accent-orange/90 transition-colors"
          >
            <Plus size={13} />
            Neues Produkt
          </Link>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-1.5 font-sans text-xs px-3 py-2 border border-border text-text-secondary hover:border-text-secondary/50 transition-colors"
          >
            <Plus size={13} />
            Neuer Artikel
          </Link>
        </div>
      </div>

      {/* Ankauf */}
      <SectionHeader title="Ankauf-Anfragen" href="/admin/ankauf" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {STATUS_ORDER.map((status) => {
          const { icon: Icon, color, bg } = STATUS_META[status];
          return (
            <Link
              key={status}
              href={`/admin/ankauf?status=${encodeURIComponent(status)}`}
              className={`flex flex-col gap-2 p-4 border border-border hover:border-accent-orange/50 transition-colors ${bg}`}
            >
              <Icon size={18} className={color} />
              <div>
                <p className="font-sans text-2xl font-bold text-text-primary leading-none">
                  {statusCounts[status]}
                </p>
                <p className="font-sans text-xs text-text-secondary mt-1 leading-snug">{status}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Produkte */}
      <SectionHeader title="Produkte" href="/admin/products" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard value={productTotal} label="Gesamt" icon={ShoppingBag} iconColor="text-text-secondary" />
        <StatCard value={productAvailable} label="Verfügbar" icon={CheckCircle} iconColor="text-green-600" />
        <StatCard value={productSold} label="Verkauft" icon={XCircle} iconColor="text-red-500" />
        <StatCard value={productFeatured} label="Featured" icon={TrendingUp} iconColor="text-accent-orange" />
        {avgMargin != null && (
          <div className="col-span-2 sm:col-span-4 flex items-center gap-3 p-4 bg-surface border border-border">
            <TrendingUp size={16} className="text-accent-green flex-shrink-0" />
            <span className="font-sans text-sm text-text-secondary">
              Ø Marge (Produkte mit Einkaufspreis):
            </span>
            <span className="font-mono text-sm font-semibold text-accent-green">
              {avgMargin.toFixed(2)} €
            </span>
          </div>
        )}
      </div>

      {/* Blog */}
      <SectionHeader title="Blog" href="/admin/blog" />
      <div className="grid grid-cols-3 gap-3 mb-8">
        <StatCard value={blogTotal} label="Artikel gesamt" icon={FileText} iconColor="text-text-secondary" />
        <StatCard value={blogPublished} label="Veröffentlicht" icon={CheckCircle} iconColor="text-green-600" />
        <StatCard value={blogDrafts} label="Entwürfe" icon={Clock} iconColor="text-orange-500" />
      </div>

      {/* Community */}
      <SectionHeader title="Community" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <Link
          href="/admin/alerts"
          className="flex items-center gap-4 p-4 bg-surface border border-border hover:border-accent-orange/40 transition-colors"
        >
          <div className="w-10 h-10 rounded-sm bg-accent-orange/10 flex items-center justify-center flex-shrink-0">
            <Bell size={18} className="text-accent-orange" />
          </div>
          <div>
            <p className="font-sans text-2xl font-bold text-text-primary leading-none">{alertCount}</p>
            <p className="font-sans text-xs text-text-secondary mt-1">Such-Alerts gesamt</p>
          </div>
        </Link>
        <Link
          href="/admin/newsletter"
          className="flex items-center gap-4 p-4 bg-surface border border-border hover:border-accent-orange/40 transition-colors"
        >
          <div className="w-10 h-10 rounded-sm bg-accent-orange/10 flex items-center justify-center flex-shrink-0">
            <Mail size={18} className="text-accent-orange" />
          </div>
          <div>
            <p className="font-sans text-2xl font-bold text-text-primary leading-none">{newsletterCount}</p>
            <p className="font-sans text-xs text-text-secondary mt-1">Newsletter-Abonnenten aktiv</p>
          </div>
        </Link>
      </div>

      {/* Letzte Aktivität */}
      {(recentAnkauf.length > 0 || recentProducts.length > 0) && (
        <>
          <SectionHeader title="Letzte Aktivität" />
          <div className="grid lg:grid-cols-2 gap-4">
            {recentAnkauf.length > 0 && (
              <div className="bg-surface border border-border">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <span className="font-sans text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Letzte Ankauf-Anfragen
                  </span>
                  <Link
                    href="/admin/ankauf"
                    className="font-sans text-xs text-accent-orange hover:underline flex items-center gap-1"
                  >
                    Alle <ArrowRight size={11} />
                  </Link>
                </div>
                <div className="divide-y divide-border">
                  {recentAnkauf.map((a) => (
                    <Link
                      key={a.id}
                      href={`/admin/ankauf/${a.id}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-hover transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-sans text-sm text-text-primary font-medium truncate">
                          {a.product_name}
                        </p>
                        <p className="font-sans text-xs text-text-secondary truncate">{a.name}</p>
                      </div>
                      <StatusBadge status={a.status} size="sm" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {recentProducts.length > 0 && (
              <div className="bg-surface border border-border">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <span className="font-sans text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Letzte Produkte
                  </span>
                  <Link
                    href="/admin/products"
                    className="font-sans text-xs text-accent-orange hover:underline flex items-center gap-1"
                  >
                    Alle <ArrowRight size={11} />
                  </Link>
                </div>
                <div className="divide-y divide-border">
                  {recentProducts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/admin/products/${p.id}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-hover transition-colors"
                    >
                      <p className="font-sans text-sm text-text-primary font-medium truncate">{p.title}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {p.is_sold && (
                          <span className="font-sans text-xs px-1.5 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                            Verkauft
                          </span>
                        )}
                        <span className="font-mono text-sm text-text-primary">{p.price.toFixed(2)} €</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="font-sans text-xs text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
        >
          Alle anzeigen <ArrowRight size={11} />
        </Link>
      )}
    </div>
  );
}

function StatCard({
  value,
  label,
  icon: Icon,
  iconColor,
}: {
  value: number;
  label: string;
  icon: React.ElementType;
  iconColor: string;
}) {
  return (
    <div className="flex flex-col gap-2 p-4 bg-surface border border-border">
      <Icon size={16} className={iconColor} />
      <div>
        <p className="font-sans text-2xl font-bold text-text-primary leading-none">{value}</p>
        <p className="font-sans text-xs text-text-secondary mt-1">{label}</p>
      </div>
    </div>
  );
}
