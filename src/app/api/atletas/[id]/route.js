

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase-server';
import { verifyToken } from '@/lib/cryptoUtils';
import {
  buscarAtletaPorId,
  atualizarAtleta,
  deletarAtleta,
} from '@/lib/services/atletaService';
import { buscarFilialPorAuthId } from '@/lib/services/filialService';

async function resolverAcesso(atletaId) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: perfil } = await supabase
      .from('users').select('role').eq('auth_id', user.id).single();
    if (perfil?.role === 'admin') return { ok: true, filialId: null, tipo: 'admin' };

    const filial = await buscarFilialPorAuthId(user.id);
    if (filial) return { ok: true, filialId: filial.id, tipo: 'filial' };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('atleta-session')?.value;
  if (token) {
    const payload = await verifyToken(token);
    if (payload?.sub === atletaId) {
      return { ok: true, filialId: payload.filial_id, tipo: 'atleta', atletaId: payload.sub };
    }
  }

  return { ok: false };
}

export async function GET(request, { params }) {
  try {
    const acesso = await resolverAcesso(params.id);
    if (!acesso.ok) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });

    const atleta = await buscarAtletaPorId(params.id);
    return NextResponse.json({ atleta });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 404 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const acesso = await resolverAcesso(params.id);
    if (!acesso.ok) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });

    const body = await request.json();

    if (acesso.tipo === 'atleta') {
      const { nome, email, telefone } = body;
      const atleta = await atualizarAtleta(params.id, acesso.filialId, { nome, email, telefone });
      return NextResponse.json({ atleta });
    }

    const atleta = await atualizarAtleta(params.id, acesso.filialId, body);
    return NextResponse.json({ atleta });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const acesso = await resolverAcesso(params.id);
    if (!acesso.ok || acesso.tipo === 'atleta') {
      return NextResponse.json({ erro: 'Acesso negado' }, { status: 403 });
    }

    await deletarAtleta(params.id, acesso.filialId);
    return NextResponse.json({ mensagem: 'Atleta removido com sucesso' });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 400 });
  }
}
