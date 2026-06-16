"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PackageSearch,
  Package,
  FileText,
  Bell,
  Mail,
  Settings,
  Shield,
  LogOut,
} from "lucide-react";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase/client";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  exact: boolean;
};

const NAV_SECTIONS: NavItem[][] = [
  [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/ankauf", label: "Ankauf", icon: PackageSearch, exact: false },
    { href: "/admin/products", label: "Produkte", icon: Package, exact: false },
    { href: "/admin/blog", label: "Blog", icon: FileText, exact: false },
    { href: "/admin/alerts", label: "Such-Alerts", icon: Bell, exact: false },
    { href: "/admin/newsletter", label: "Newsletter", icon: Mail, exact: false },
  ],
  [
    { href: "/admin/admins", label: "Admins", icon: Shield, exact: false },
    { href: "/admin/settings", label: "Einstellungen", icon: Settings, exact: false },
  ],
];

type Props = { email: string };

export function AdminSidebar({ email }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-surface border-r border-border flex-shrink-0">
      {/* Header */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-accent-orange" style={{ fontSize: "0.65rem" }}>
            Retr
          </span>
          <span className="font-pixel text-accent-yellow" style={{ fontSize: "0.65rem" }}>
            Oase
          </span>
          <span className="ml-1 font-sans text-[10px] font-bold uppercase tracking-widest text-text-secondary bg-surface-hover border border-border px-1.5 py-0.5">
            Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        {NAV_SECTIONS.map((section, si) => (
          <div key={si}>
            {si > 0 && <hr className="border-border my-2" />}
            <div className="space-y-0.5">
              {section.map(({ href, label, icon: Icon, exact }) => {
                const active = exact ? pathname === href : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 font-sans text-sm transition-colors",
                      active
                        ? "bg-accent-orange/10 text-accent-orange font-medium"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                    )}
                  >
                    <Icon size={16} className="flex-shrink-0" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-1">
        <div className="px-3 py-2">
          <p className="font-sans text-xs text-text-secondary truncate">{email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 font-sans text-sm text-text-secondary hover:text-error hover:bg-surface-hover transition-colors"
        >
          <LogOut size={16} className="flex-shrink-0" />
          Abmelden
        </button>
      </div>
    </aside>
  );
}
