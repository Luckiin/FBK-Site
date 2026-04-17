

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

const ROTAS_PROTEGIDAS = [
  '/home',
  '/atletas',
  '/eventos-dash',
  '/exames',
  '/documentos',
  '/auditoria',
  '/filial',
  '/filiados',
  '/noticias',
];

const ROTAS_FILIAL = ['/filial', '/filiados'];

const strToBytes = (str) => new TextEncoder().encode(str);

async function verificarTokenFiliado(token) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret || !token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const message = `${header}.${body}`;

    const key = await crypto.subtle.importKey(
      'raw',
      strToBytes(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = Uint8Array.from(
      atob(signature.replace(/-/g, '+').replace(/_/g, '/')),
      (c) => c.charCodeAt(0)
    );

    const valido = await crypto.subtle.verify('HMAC', key, sigBytes, strToBytes(message));
    if (!valido) return null;

    const payload = JSON.parse(atob(body.replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  const filiadoToken = request.cookies.get('filiado-session')?.value;
  const filiadoPayload = filiadoToken ? await verificarTokenFiliado(filiadoToken) : null;

  const estaAutenticado = !!supabaseUser || !!filiadoPayload;
  const eRota = (prefixos) => prefixos.some((p) => pathname.startsWith(p));

  if (estaAutenticado && pathname.startsWith('/auth/')) {
    const excecoes = [
      '/auth/entrar',
      '/auth/cadastro-filial',
      '/auth/esqueceu-senha',
      '/auth/redefinir-senha',
      '/auth/aguardando-aprovacao',
    ];

    if (!excecoes.some((rota) => pathname.startsWith(rota))) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  const rotaProtegida = eRota(ROTAS_PROTEGIDAS);
  if (!rotaProtegida) return supabaseResponse;

  if (!estaAutenticado) {
    const url = new URL('/auth/entrar', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (supabaseUser && !filiadoPayload) {
    const filialStatus = request.cookies.get('filial-status')?.value;
    if (filialStatus === 'pendente' || filialStatus === 'reprovado') {
      return NextResponse.redirect(new URL('/auth/aguardando-aprovacao', request.url));
    }
  }

  if (filiadoPayload && !supabaseUser && eRota(ROTAS_FILIAL)) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
