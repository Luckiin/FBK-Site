/**
 * /api/filiados
 * GET  — Lista filiados da filial logada
 * POST — Cadastra novo filiado (filial logada)
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase-server';
import { verifyToken } from '@/lib/cryptoUtils';
import { listarFiliadosPorFilial, criarFiliado } from '@/lib/services/filiadoService';
import { buscarFilialPorAuthId } from '@/lib/services/filialService';

/**
 * Resolve a filial logada a partir de sessão Supabase (filial auth)
 * ou cookie JWT de filiado (para acesso próprio).
 */
async function resolverFilialId(request) {
  // 1. Verificar sessão Supabase (filial logada via Supabase Auth)
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const filial = await buscarFilialPorAuthId(user.id);
    if (filial) return { filialId: filial.id, tipo: 'filial' };

    // Admin via Supabase Auth
    const { data: perfil } = await supabase
      .from('users').select('role').eq('auth_id', user.id).single();
    if (perfil?.role === 'admin') return { filialId: null, tipo: 'admin' };
  }

  // 2. Verificar cookie JWT de filiado
  const cookieStore = cookies();
  const filiadoToken = cookieStore.get('filiado-session')?.value;
  if (filiadoToken) {
    const payload = await verifyToken(filiadoToken);
    if (payload?.filial_id) return { filialId: payload.filial_id, tipo: 'filiado' };
  }

  return null;
}

export async function GET(request) {
  try {
    const auth = await resolverFilialId(request);
    if (!auth) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const filialId = auth.tipo === 'admin'
      ? searchParams.get('filial_id')
      : auth.filialId;

    if (!filialId) {
      return NextResponse.json({ erro: 'filial_id obrigatório para admins' }, { status: 400 });
    }

    const filiados = await listarFiliadosPorFilial(filialId);
    return NextResponse.json({ filiados });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await resolverFilialId(request);
    if (!auth) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });

    // Filiados não podem cadastrar outros filiados
    if (auth.tipo === 'filiado') {
      return NextResponse.json({ erro: 'Acesso negado' }, { status: 403 });
    }

    const body = await request.json();
    const { cpf, telefone, email } = body;

    if (!cpf || !telefone) {
      return NextResponse.json(
        { erro: 'Campos obrigatórios: cpf, telefone' },
        { status: 400 }
      );
    }

    const filialId = auth.filialId || body.filial_id;
    if (!filialId) {
      return NextResponse.json({ erro: 'filial_id não identificado' }, { status: 400 });
    }

    const resultado = await criarFiliado(filialId, { cpf, telefone, email });

    return NextResponse.json(
      {
        mensagem: 'Filiado cadastrado com sucesso',
        filiado: resultado.filiado,
        // Em produção, NÃO retornar a senha — apenas enviar via WhatsApp/email
        senhaTemporaria: resultado.senhaTemporaria,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 400 });
  }
}
