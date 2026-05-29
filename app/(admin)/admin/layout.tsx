import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminUser(user.email)) {
    redirect("/access-denied");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar email={user.email!} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
