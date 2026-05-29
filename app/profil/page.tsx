"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, ShoppingBag, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { WishlistSection } from "@/components/profil/WishlistSection";
import { AlertsSection } from "@/components/profil/AlertsSection";
import { AnkaufSection } from "@/components/profil/AnkaufSection";

export default function ProfilPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-accent-orange border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-sans text-sm text-text-secondary">Lädt…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <GuestView />;
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Gamer";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-accent-orange/10 border-2 border-accent-orange/30 flex items-center justify-center flex-shrink-0">
            <User size={22} className="text-accent-orange" />
          </div>
          <div>
            <h1 className="font-sans text-xl font-bold text-text-primary leading-tight">
              Hallo, {displayName}!
            </h1>
            <p className="font-sans text-xs text-text-secondary mt-0.5">{user.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn-secondary text-sm py-2 px-4 min-h-[40px] self-start sm:self-auto"
        >
          <LogOut size={14} />
          Ausloggen
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-border mb-10" />

      {/* Sections */}
      <div className="space-y-12">
        <WishlistSection userId={user.id} />
        <div className="h-px bg-border" />
        <AlertsSection userId={user.id} />
        <div className="h-px bg-border" />
        <AnkaufSection email={user.email ?? ""} />
      </div>
    </div>
  );
}

function GuestView() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      {/* Icon */}
      <div className="w-20 h-20 bg-surface-hover border-2 border-border flex items-center justify-center mx-auto mb-6">
        <User size={36} className="text-text-secondary" />
      </div>

      <h1 className="font-sans text-2xl font-bold text-text-primary mb-3">
        Mein RetrOase-Account
      </h1>
      <p className="font-sans text-sm text-text-secondary leading-relaxed mb-8">
        Mit einem kostenlosen Account kannst du deine Wunschliste dauerhaft speichern,
        Such-Alerts anlegen und deine Ankauf-Anfragen verfolgen.
      </p>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
        {[
          { icon: "❤️", title: "Wunschliste", desc: "Produkte geräteübergreifend speichern" },
          { icon: "🔔", title: "Such-Alerts", desc: "Benachrichtigung bei gesuchten Artikeln" },
          { icon: "📦", title: "Anfragen", desc: "Ankauf-Status immer im Blick" },
        ].map((f) => (
          <div key={f.title} className="bg-surface border border-border p-4">
            <div className="text-xl mb-2">{f.icon}</div>
            <p className="font-sans text-sm font-semibold text-text-primary">{f.title}</p>
            <p className="font-sans text-xs text-text-secondary mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/register" className="btn-primary justify-center">
          <Sparkles size={15} />
          Kostenlos registrieren
        </Link>
        <Link href="/login" className="btn-secondary justify-center">
          Einloggen
        </Link>
      </div>

      <p className="font-sans text-xs text-text-secondary mt-6">
        Oder weiter im{" "}
        <Link href="/shop" className="text-accent-orange hover:underline">
          <ShoppingBag size={11} className="inline -mt-0.5" /> Shop stöbern
        </Link>
      </p>
    </div>
  );
}
