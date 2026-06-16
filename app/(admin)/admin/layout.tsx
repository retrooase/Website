import { redirect } from "next/navigation";
import { createServerSupabaseClient, createAdminSupabaseClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/access-denied");

  let hasAccess = isAdminUser(user.email);
  if (!hasAccess) {
    const adminClient = createAdminSupabaseClient();
    const { data } = await adminClient
      .from("user_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();
    hasAccess = data?.is_admin === true;
  }

  if (!hasAccess) redirect("/access-denied");

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar email={user.email!} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
