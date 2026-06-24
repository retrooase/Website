import { SITE } from "@/lib/constants";

// Reine, Edge-taugliche Admin-Pruefung (keine Supabase-/Node-Importe!).
// Liegt bewusst getrennt von lib/admin.ts, damit die Middleware (Edge-Runtime)
// nicht den Supabase-Admin-Client mitbuendeln muss.
export function isAdminUser(email?: string | null): boolean {
  if (!email) return false;
  const raw = process.env.ADMIN_EMAIL || SITE.adminEmail;
  const admins = raw.split(",").map((e) => e.trim().toLowerCase());
  return admins.includes(email.toLowerCase());
}
