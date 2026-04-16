/**
 * POST /api/auth/reset-password
 * Redefine a senha usando o token de recuperação.
 * Body: { token: string, novaSenha: string, confirmarSenha: string }
 *
 * GET /api/auth/reset-password?token=xxx
 * Valida se o token ainda é válido (para exibir/ocultar o formulário).
 */

import { NextResponse } from 'next/server';
import { redefinirSenha, validarTokenReset } from '@/lib/services/authService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ valido: false, erro: 'Token não informado' }, { status: 400 });
    }

    const resultado = await validarTokenReset(token);
    return NextResponse.json(resultado);
  } catch (err) {
    return NextResponse.json({ valido: false, erro: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, novaSenha, confirmarSenha } = body;

    if (!token) {
      return NextResponse.json({ erro: 'Token obrigatório' }, { status: 400 });
    }

    if (!novaSenha || novaSenha.length < 6) {
      return NextResponse.json(
        { erro: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    if (novaSenha !== confirmarSenha) {
      return NextResponse.json({ erro: 'As senhas não coincidem' }, { status: 400 });
    }

    await redefinirSenha(token, novaSenha);

    return NextResponse.json({ mensagem: 'Senha redefinida com sucesso. Faça login.' });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 400 });
  }
}
