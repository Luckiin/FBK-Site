

import { NextResponse } from 'next/server';
import { solicitarRecuperacaoSenha } from '@/lib/services/authService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ erro: 'Email inválido' }, { status: 400 });
    }

    await solicitarRecuperacaoSenha(email);

    return NextResponse.json({
      mensagem: 'Se este email estiver cadastrado, você receberá um link de recuperação em breve.',
    });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 500 });
  }
}
