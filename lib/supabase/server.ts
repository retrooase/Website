import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-seitiger Supabase-Client (für Server Components & API Routes)
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll kann in Server Components nicht aufgerufen werden
          }
        },
      },
    }
  );
}

// Admin-Client mit Service-Key (nur in API Routes verwenden!)
import { createClient } from "@supabase/supabase-js";

export function createAdminSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}
