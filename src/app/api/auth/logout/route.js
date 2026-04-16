

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function POST() {
  try {
    const supabase = await createServerClient();

    await supabase.auth.signOut();

    const response = NextResponse.json({ mensagem: 'Logout realizado com sucesso' });

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
