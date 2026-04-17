/**
 * GET /api/debug
 * Diagnóstico temporário — DELETE AFTER USE
 */
import { NextResponse } from 'next/server';
import { createServerClient as _createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const svc  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const jwt  = process.env.JWT_SECRET;

  const config = {
    SUPABASE_URL:          url  ? `${url.slice(0, 30)}...` : '❌ NÃO DEFINIDA',
    SUPABASE_ANON_KEY:     anon ? `${anon.slice(0, 20)}...` : '❌ NÃO DEFINIDA',
    SERVICE_ROLE_KEY:      svc  ? `${svc.slice(0, 10)}...`  : '❌ NÃO DEFINIDA',
    JWT_SECRET:            jwt  ? '✅ definida'              : '❌ NÃO DEFINIDA',
    NODE_ENV:              process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL:   process.env.NEXT_PUBLIC_APP_URL ?? '❌ NÃO DEFINIDA',
  };

  // Testa conexão real com o Supabase
  let supabaseOk = false;
  let supabaseError = null;
  let authTest = null;

  try {
    const cookieStore = await cookies();
    const supabase = _createServerClient(url, anon, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    });

    // Tenta buscar o usuário — se a conexão funciona retorna null (não autenticado), não erro
    const { data, error } = await supabase.auth.getUser();
    if (error && error.message !== 'Auth session missing!') {
      supabaseError = error.message;
    } else {
      supabaseOk = true;
    }

    // Testa signInWithPassword com credencial inválida — o código do erro revela o estado do auth
    const { error: authErr } = await supabase.auth.signInWithPassword({
      email: '__test_diagnostico__@fbk.invalid',
      password: 'invalid',
    });
    authTest = authErr?.message ?? 'sem erro (inesperado)';

  } catch (e) {
    supabaseError = e.message;
  }

  return NextResponse.json({
    config,
    supabase: {
      conectado: supabaseOk,
      erro: supabaseError,
      auth_test_message: authTest,
      // Se auth_test_message === "Invalid login credentials" → Supabase conectou mas credencial errada
      // Se contém "fetch" ou "network" → URL errada ou sem conexão
      // Se contém "Invalid API key" → anon key errada
    },
  });
}
