/**
 * supabase-server.js
 * Clientes Supabase para uso no servidor (API routes, Server Components).
 *
 * createServerClient() — usa cookies para sessão (anon key)
 * createAdminClient()  — usa service_role key (bypassa RLS)
 */

import { createServerClient as _createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient as _createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase para Server Components e API Routes.
 * Gerencia cookies de sessão automaticamente.
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return _createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
            // Em Server Components (read-only), ignora silenciosamente
          }
        },
      },
    }
  );
}

/**
 * Alias para compatibilidade com código legado.
 */
export { createServerClient as createClient };

/**
 * Cliente Supabase com service_role key.
 * ⚠️ Bypassa RLS — usar apenas em API routes seguras (servidor).
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createAdminClient() {
  return _createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
