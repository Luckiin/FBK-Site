import { NextResponse } from 'next/server';
import { createServerClient as _createServerClient } from '@supabase/ssr';
import { signToken } from '@/lib/cryptoUtils';
import { loginFilial, loginAtleta } from '@/lib/services/authService';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60,
};

/**
 * Cria um cliente Supabase para Route Handlers.
 * Lê cookies do request e coleta os cookies que o Supabase
 * quer gravar para aplicarmos manualmente no NextResponse.
 */
function makeSupabaseForRoute(request, cookieCollector) {
  return _createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach((c) => cookieCollector.push(c));
        },
      },
    }
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { tipo } = body;

    if (!tipo || !['filial', 'atleta'].includes(tipo)) {
      return NextResponse.json(
        { erro: "Campo 'tipo' obrigatório: 'filial' ou 'atleta'" },
        { status: 400 }
      );
    }

    /* ── Filial (Supabase Auth) ─────────────────────────────── */
    if (tipo === 'filial') {
      const { email, senha } = body;
      if (!email || !senha)
        return NextResponse.json({ erro: 'email e senha obrigatórios' }, { status: 400 });

      // Cria cliente que coleta os cookies de sessão do Supabase
      const supabaseCookies = [];
      const supabase = makeSupabaseForRoute(request, supabaseCookies);

      const resultado = await loginFilial(supabase, email, senha);

      const response = NextResponse.json({
        mensagem: 'Login realizado com sucesso',
        tipo: resultado.tipo,
        usuario: resultado.usuario,
      });

      // Aplica os cookies de sessão do Supabase no response
      supabaseCookies.forEach(({ name, value, options }) =>
        response.cookies.set(name, value, { ...options, ...COOKIE_OPTIONS })
      );

      return response;
    }

    /* ── Atleta (JWT próprio) ──────────────────────────────── */
    if (tipo === 'atleta' || tipo === 'filiado') {
      const { telefone, senha } = body;
      if (!telefone || !senha)
        return NextResponse.json({ erro: 'telefone e senha obrigatórios' }, { status: 400 });

      const resultado = await loginAtleta(telefone, senha);

      const token = await signToken(
        {
          sub:       resultado.usuario.id,
          telefone:  resultado.usuario.telefone,
          filial_id: resultado.usuario.filial_id,
          nome:      resultado.usuario.nome,
          tipo:      'atleta',
        },
        '7d'
      );

      const response = NextResponse.json({
        mensagem: 'Login realizado com sucesso',
        tipo: 'atleta',
        usuario: resultado.usuario,
      });

      response.cookies.set('atleta-session', token, COOKIE_OPTIONS);

      return response;
    }
  } catch (err) {
    console.error('[POST /api/auth/login]', err.message);
    return NextResponse.json({ erro: err.message }, { status: 401 });
  }
}
