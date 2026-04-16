

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import {
  buscarFilialPorId,
  atualizarFilial,
  alterarStatusFilial,
  deletarFilial,
} from '@/lib/services/filialService';

async function getAdminOrFilial(supabase, filialId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { autorizado: false, motivo: 'Não autorizado' };

  const { data: perfil } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  const isAdmin = perfil?.role === 'admin';

  const filial = await buscarFilialPorId(filialId);
  const isOwnFilial = filial?.auth_id === user.id;

  if (!isAdmin && !isOwnFilial) {
    return { autorizado: false, motivo: 'Acesso negado' };
  }

  return { autorizado: true, isAdmin, user };
}

export async function GET(request, { params }) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });

    const filial = await buscarFilialPorId(params.id);
    return NextResponse.json({ filial });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 404 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const supabase = await createServerClient();
    const auth = await getAdminOrFilial(supabase, params.id);
    if (!auth.autorizado) {
      return NextResponse.json({ erro: auth.motivo }, { status: 403 });
    }

    const body = await request.json();

    if (body.status !== undefined) {
      if (!auth.isAdmin) {
        return NextResponse.json({ erro: 'Apenas admins alteram o status' }, { status: 403 });
      }
      const filial = await alterarStatusFilial(
        params.id,
        body.status,
        body.motivo_reprovacao || ''
      );
      return NextResponse.json({ mensagem: `Filial ${body.status} com sucesso`, filial });
    }

    const filial = await atualizarFilial(params.id, body);
    return NextResponse.json({ filial });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });

    const { data: perfil } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', user.id)
      .single();

    if (perfil?.role !== 'admin') {
      return NextResponse.json({ erro: 'Apenas admins podem excluir filiais' }, { status: 403 });
    }

    await deletarFilial(params.id);
    return NextResponse.json({ mensagem: 'Filial removida com sucesso' });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 400 });
  }
}
