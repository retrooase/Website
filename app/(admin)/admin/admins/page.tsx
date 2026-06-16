import type { Metadata } from "next";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/constants";
import { Shield, ShieldOff, ShieldCheck } from "lucide-react";
import { toggleAdminStatus } from "./actions";

export const metadata: Metadata = {
  title: "Admin-Verwaltung | Admin | RetrOase",
  robots: { index: false },
};

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  is_admin: boolean;
  isSuperAdmin: boolean;
  created_at: string;
};

export default async function AdminsPage() {
  const adminClient = createAdminSupabaseClient();

  const [{ data: authData }, { data: profiles }] = await Promise.all([
    adminClient.auth.admin.listUsers(),
    adminClient.from("user_profiles").select("id, name, is_admin"),
  ]);

  const profileMap = new Map(
    (profiles ?? []).map((p: { id: string; name: string | null; is_admin: boolean }) => [p.id, p])
  );

  const raw = process.env.ADMIN_EMAIL || SITE.adminEmail;
  const superAdmins = raw.split(",").map((e) => e.trim().toLowerCase());

  const rows: UserRow[] = (authData?.users ?? []).map((u) => {
    const profile = profileMap.get(u.id);
    const isSuperAdmin = superAdmins.includes((u.email ?? "").toLowerCase());
    return {
      id: u.id,
      email: u.email ?? "—",
      name: profile?.name ?? null,
      is_admin: isSuperAdmin || profile?.is_admin === true,
      isSuperAdmin,
      created_at: u.created_at,
    };
  });

  rows.sort((a, b) => {
    if (a.isSuperAdmin !== b.isSuperAdmin) return a.isSuperAdmin ? -1 : 1;
    if (a.is_admin !== b.is_admin) return a.is_admin ? -1 : 1;
    return a.email.localeCompare(b.email);
  });

  const adminCount = rows.filter((r) => r.is_admin).length;

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-sans text-2xl font-bold text-text-primary">Admin-Verwaltung</h1>
          <p className="font-sans text-sm text-text-secondary mt-1">
            {adminCount} Admin{adminCount !== 1 ? "s" : ""} · {rows.length} Nutzer gesamt
          </p>
        </div>
      </div>

      <div className="p-3 mb-5 bg-amber-50 border border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/50">
        <p className="font-sans text-xs text-amber-700 dark:text-amber-400">
          <strong>Hinweis:</strong> Nur der Haupt-Admin (via <code className="font-mono">ADMIN_EMAIL</code>) kann Rechte vergeben und entziehen.
          Haupt-Admin-Rechte können nicht entzogen werden.
        </p>
      </div>

      <div className="border border-border">
        <div className="grid grid-cols-[1fr_160px_100px_110px] border-b border-border bg-surface-hover">
          {["Nutzer", "E-Mail", "Typ", "Aktion"].map((h) => (
            <div key={h} className="font-sans text-xs font-semibold uppercase tracking-wide text-text-secondary px-4 py-2.5">
              {h}
            </div>
          ))}
        </div>

        {rows.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-sans text-sm text-text-secondary">Keine Nutzer gefunden.</p>
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-[1fr_160px_100px_110px] border-b border-border last:border-b-0 hover:bg-surface-hover/50"
            >
              <div className="px-4 py-3 self-center">
                <p className="font-sans text-sm text-text-primary font-medium">
                  {row.name ?? "—"}
                </p>
                <p className="font-sans text-xs text-text-secondary mt-0.5">
                  Seit {new Date(row.created_at).toLocaleDateString("de-DE")}
                </p>
              </div>
              <div className="px-4 py-3 self-center">
                <p className="font-sans text-xs text-text-secondary truncate">{row.email}</p>
              </div>
              <div className="px-4 py-3 self-center">
                {row.isSuperAdmin ? (
                  <span className="inline-flex items-center gap-1 font-sans text-xs px-2 py-0.5 bg-accent-orange/10 text-accent-orange border border-accent-orange/30">
                    <ShieldCheck size={10} />
                    Haupt-Admin
                  </span>
                ) : row.is_admin ? (
                  <span className="inline-flex items-center gap-1 font-sans text-xs px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    <Shield size={10} />
                    Admin
                  </span>
                ) : (
                  <span className="font-sans text-xs text-text-secondary">Nutzer</span>
                )}
              </div>
              <div className="px-4 py-3 self-center">
                {row.isSuperAdmin ? (
                  <span className="font-sans text-xs text-text-secondary">—</span>
                ) : (
                  <form
                    action={async () => {
                      "use server";
                      await toggleAdminStatus(row.id, !row.is_admin);
                    }}
                  >
                    <button
                      type="submit"
                      className={`inline-flex items-center gap-1.5 font-sans text-xs px-2.5 py-1.5 border transition-colors ${
                        row.is_admin
                          ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                          : "border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                      }`}
                    >
                      {row.is_admin ? (
                        <><ShieldOff size={11} /> Entziehen</>
                      ) : (
                        <><Shield size={11} /> Ernennen</>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
