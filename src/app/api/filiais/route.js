/**
 * /api/filiais
 * GET  — Lista filiais (admin)
 * POST — Cria nova filial (público — cadastro)
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { listarFiliais, criarFilial } from '@/lib/services/filialService';

export async function GET(request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });
    }

    // Apenas admins listam filiais
    const { data: perfil } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', user.id)
      .single();

    if (perfil?.role !== 'admin') {
      return NextResponse.json({ erro: 'Acesso negado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const filiais = await listarFiliais(status ? { status } : {});
    return NextResponse.json({ filiais });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { nome, email, telefone, senha } = body;

    if (!nome || !email || !senha) {
      return NextResponse.json(
        { erro: 'Campos obrigatórios: nome, email, senha' },
        { status: 400 }
      );
    }

    if (senha.length < 6) {
      return NextResponse.json(
        { erro: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    const filial = await criarFilial({ nome, email, telefone, senha });

    return NextResponse.json(
      { mensagem: 'Filial cadastrada com sucesso. Aguarde aprovação.', filial },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 400 });
  }
}
