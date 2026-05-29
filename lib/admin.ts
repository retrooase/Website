import { SITE } from "@/lib/constants";

export function isAdminUser(email?: string | null): boolean {
  if (!email) return false;
  const raw = process.env.ADMIN_EMAIL || SITE.adminEmail;
  const admins = raw.split(",").map((e) => e.trim().toLowerCase());
  return admins.includes(email.toLowerCase());
}
