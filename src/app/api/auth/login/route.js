

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { signToken } from '@/lib/cryptoUtils';
import { loginFilial, loginFiliado } from '@/lib/services/authService';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 dias
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { tipo } = body;

    if (!tipo || !['filial', 'filiado'].includes(tipo)) {
      return NextResponse.json(
        { erro: "Campo 'tipo' obrigatório: 'filial' ou 'filiado'" },
        { status: 400 }
      );
    }

    if (tipo === 'filial') {
      const { email, senha } = body;
      if (!email || !senha) {
        return NextResponse.json({ erro: 'email e senha obrigatórios' }, { status: 400 });
      }

      const supabase = await createServerClient();
      const resultado = await loginFilial(supabase, email, senha);

      const response = NextResponse.json({
        mensagem: 'Login realizado com sucesso',
        tipo: resultado.tipo,
        usuario: resultado.usuario,
      });

      return response;
    }

    if (tipo === 'filiado') {
      const { telefone, senha } = body;
      if (!telefone || !senha) {
        return NextResponse.json({ erro: 'telefone e senha obrigatórios' }, { status: 400 });
      }

      const resultado = await loginFiliado(telefone, senha);

      const token = await signToken(
        {
          sub: resultado.usuario.id,
          telefone: resultado.usuario.telefone,
          filial_id: resultado.usuario.filial_id,
          nome: resultado.usuario.nome,
          tipo: 'filiado',
        },
        '7d'
      );

      const response = NextResponse.json({
        mensagem: 'Login realizado com sucesso',
        tipo: 'filiado',
        usuario: resultado.usuario,
      });

      response.cookies.set('filiado-session', token, COOKIE_OPTIONS);

      return response;
    }
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 401 });
  }
}
