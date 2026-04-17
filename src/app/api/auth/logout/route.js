import { NextResponse } from 'next/server';
import { createServerClient as _createServerClient } from '@supabase/ssr';

const EXPIRED = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 0,
};

export async function POST(request) {
  try {
    const supabaseCookies = [];
    const supabase = _createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach((c) => supabaseCookies.push(c));
          },
        },
      }
    );

    await supabase.auth.signOut();

    const response = NextResponse.json({ mensagem: 'Logout realizado com sucesso' });

    // Remove cookies que o Supabase quer limpar
    supabaseCookies.forEach(({ name }) =>
      response.cookies.set(name, '', EXPIRED)
    );

    // Limpa explicitamente cookies conhecidos do Supabase e filiado
    ['sb-access-token', 'sb-refresh-token', 'filiado-session'].forEach((name) =>
      response.cookies.set(name, '', EXPIRED)
    );

    return response;
  } catch (err) {
    console.error('[POST /api/auth/logout]', err.message);
    return NextResponse.json({ erro: err.message }, { status: 500 });
  }
}
