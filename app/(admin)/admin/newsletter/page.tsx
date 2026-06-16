import type { Metadata } from "next";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";
import { SITE } from "@/lib/constants";
import { Mail, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Newsletter | Admin | RetrOase",
  robots: { index: false },
};

type Sub = {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
};

async function sendTestNewsletter(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user.email)) throw new Error("Unauthorized");

  const subject = (formData.get("subject") as string)?.trim();
  const body = (formData.get("body") as string)?.trim();

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY ist nicht gesetzt.");

  const toEmail = process.env.ADMIN_EMAIL ?? SITE.adminEmail;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? `noreply@${SITE.domain}`;

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: `[TEST] ${subject}`,
    text: body,
  });
}

export default async function NewsletterPage() {
  const admin = createAdminSupabaseClient();

  const [{ data: subs, error }, { count: activeCount }] = await Promise.all([
    admin.from("newsletter_subscribers").select("id, email, is_active, created_at").order("created_at", { ascending: false }),
    admin.from("newsletter_subscribers").select("id", { count: "exact", head: true }).eq("is_active", true),
  ]);

  const rows = (subs ?? []) as Sub[];
  const totalCount = rows.length;

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-sans text-2xl font-bold text-text-primary">Newsletter</h1>
        <p className="font-sans text-sm text-text-secondary mt-1">Abonnenten verwalten + Entwürfe</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center gap-4 p-4 bg-surface border border-border">
          <div className="w-10 h-10 bg-accent-orange/10 flex items-center justify-center flex-shrink-0">
            <Users size={18} className="text-accent-orange" />
          </div>
          <div>
            <p className="font-sans text-2xl font-bold text-text-primary leading-none">{activeCount ?? 0}</p>
            <p className="font-sans text-xs text-text-secondary mt-1">Aktive Abonnenten</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-surface border border-border">
          <div className="w-10 h-10 bg-surface-hover flex items-center justify-center flex-shrink-0">
            <Mail size={18} className="text-text-secondary" />
          </div>
          <div>
            <p className="font-sans text-2xl font-bold text-text-primary leading-none">{totalCount}</p>
            <p className="font-sans text-xs text-text-secondary mt-1">Gesamt (inkl. inaktiv)</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Abonnenten-Liste */}
        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">
            Abonnenten
          </h2>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-sm text-red-700 mb-3">
              Fehler: {error.message}
            </div>
          )}

          {rows.length === 0 ? (
            <div className="border-2 border-dashed border-border p-8 text-center">
              <p className="font-sans text-sm text-text-secondary">Noch keine Abonnenten.</p>
            </div>
          ) : (
            <div className="border border-border">
              <div className="grid grid-cols-[1fr_60px_90px] border-b border-border bg-surface-hover">
                {["E-Mail", "Status", "Datum"].map((h) => (
                  <div key={h} className="font-sans text-xs font-semibold uppercase tracking-wide text-text-secondary px-3 py-2">
                    {h}
                  </div>
                ))}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {rows.map((sub) => (
                  <div key={sub.id} className="grid grid-cols-[1fr_60px_90px] border-b border-border last:border-b-0">
                    <div className="px-3 py-2.5 font-sans text-xs text-text-primary truncate self-center">
                      {sub.email}
                    </div>
                    <div className="px-3 py-2.5 self-center">
                      <span className={`font-sans text-xs px-1 py-0.5 ${sub.is_active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "text-text-secondary"}`}>
                        {sub.is_active ? "Aktiv" : "Inaktiv"}
                      </span>
                    </div>
                    <div className="px-3 py-2.5 font-sans text-xs text-text-secondary self-center">
                      {new Date(sub.created_at).toLocaleDateString("de-DE")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Newsletter verfassen */}
        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">
            Newsletter verfassen
          </h2>

          <div className="bg-surface border border-border p-4">
            <form action={sendTestNewsletter} className="space-y-4">
              <div>
                <label className="block font-sans text-xs font-semibold text-text-secondary mb-1">
                  Betreff
                </label>
                <input
                  name="subject"
                  required
                  className="pixel-input w-full text-sm py-2"
                  placeholder="Neue Retro-Highlights im Shop! 🎮"
                />
              </div>
              <div>
                <label className="block font-sans text-xs font-semibold text-text-secondary mb-1">
                  Inhalt
                </label>
                <textarea
                  name="body"
                  required
                  rows={8}
                  className="pixel-input w-full text-sm py-2 resize-y"
                  placeholder="Newsletter-Inhalt…"
                />
              </div>

              <button type="submit" className="btn-secondary w-full text-sm py-2 flex items-center justify-center gap-2">
                <Mail size={14} />
                Testmail an Admin senden
              </button>
            </form>

            <div className="mt-4 p-3 bg-surface-hover border border-border">
              <p className="font-sans text-xs text-text-secondary">
                <strong>Hinweis:</strong> Testmail geht nur an die Admin-E-Mail. Massenversand an alle Abonnenten wird in Phase 6 eingebaut.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
