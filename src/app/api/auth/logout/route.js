/**
 * POST /api/auth/logout
 * Encerra sessão de filial (Supabase) e/ou filiado (JWT cookie).
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST() {
  try {
    const supabase = await createServerClient();

    // Logout Supabase (filial)
    await supabase.auth.signOut();

    const response = NextResponse.json({ mensagem: 'Logout realizado com sucesso' });

    // Remover cookie de sessão do filiado
    response.cookies.set('filiado-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Expira imediatamente
    });

    return response;
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 500 });
  }
}
