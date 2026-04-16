

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase-server';
import { verifyToken } from '@/lib/cryptoUtils';
import {
  buscarFiliadoPorId,
  atualizarFiliado,
  deletarFiliado,
} from '@/lib/services/filiadoService';
import { buscarFilialPorAuthId } from '@/lib/services/filialService';

async function resolverAcesso(filiadoId) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: perfil } = await supabase
      .from('users').select('role').eq('auth_id', user.id).single();
    if (perfil?.role === 'admin') return { ok: true, filialId: null, tipo: 'admin' };

    const filial = await buscarFilialPorAuthId(user.id);
    if (filial) return { ok: true, filialId: filial.id, tipo: 'filial' };
  }

  const cookieStore = cookies();
  const token = cookieStore.get('filiado-session')?.value;
  if (token) {
    const payload = await verifyToken(token);
    if (payload?.sub === filiadoId) {
      return { ok: true, filialId: payload.filial_id, tipo: 'filiado', filiadoId: payload.sub };
    }
  }

  return { ok: false };
}

export async function GET(request, { params }) {
  try {
    const acesso = await resolverAcesso(params.id);
    if (!acesso.ok) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });

    const filiado = await buscarFiliadoPorId(params.id);
    return NextResponse.json({ filiado });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 404 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const acesso = await resolverAcesso(params.id);
    if (!acesso.ok) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });

    const body = await request.json();

    if (acesso.tipo === 'filiado') {
      const { nome, email, telefone } = body;
      const filiado = await atualizarFiliado(params.id, acesso.filialId, { nome, email, telefone });
      return NextResponse.json({ filiado });
    }

    const filiado = await atualizarFiliado(params.id, acesso.filialId, body);
    return NextResponse.json({ filiado });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const acesso = await resolverAcesso(params.id);
    if (!acesso.ok || acesso.tipo === 'filiado') {
      return NextResponse.json({ erro: 'Acesso negado' }, { status: 403 });
    }

    await deletarFiliado(params.id, acesso.filialId);
    return NextResponse.json({ mensagem: 'Filiado removido com sucesso' });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 400 });
  }
}
