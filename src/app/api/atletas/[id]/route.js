

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
  // Validar se o ID é um UUID válido para evitar erros de sintaxe no Supabase/Postgres
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!atletaId || !uuidRegex.test(atletaId)) {
    return { ok: false, status: 400, erro: 'ID de atleta inválido' };
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: perfil } = await supabase
      .from('users').select('*').eq('auth_id', user.id).single();
    if (perfil?.role === 'admin') return { ok: true, filialId: null, tipo: 'admin', profile: perfil };

    const filial = await buscarFilialPorAuthId(user.id);
    if (filial) return { ok: true, filialId: filial.id, tipo: 'filial', profile: filial };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('atleta-session')?.value;
  if (token) {
    const payload = await verifyToken(token);
    if (payload?.sub === atletaId) {
      const { data: atleta } = await supabase.from('atletas').select('*').eq('id', payload.sub).single();
      return { ok: true, filialId: payload.filial_id, tipo: 'atleta', atletaId: payload.sub, profile: atleta };
    }
  }

  return { ok: false };
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const acesso = await resolverAcesso(id);
    if (!acesso.ok) return NextResponse.json({ erro: acesso.erro || 'Não autorizado' }, { status: acesso.status || 401 });

    const atleta = await buscarAtletaPorId(id);
    return NextResponse.json({ atleta });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 404 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const acesso = await resolverAcesso(id);
    if (!acesso.ok) return NextResponse.json({ erro: acesso.erro || 'Não autorizado' }, { status: acesso.status || 401 });

    const body = await request.json();

    if (acesso.tipo === 'atleta') {
      const {
        nome,
        email,
        telefone,
        sexo,
        data_nascimento,
        uf,
        cidade,
        endereco,
        nome_professor,
        modalidades,
      } = body;

      const atleta = await atualizarAtleta(
        id,
        acesso.filialId,
        { nome, email, telefone, sexo, data_nascimento, uf, cidade, endereco, nome_professor, modalidades },
        acesso.profile
      );
      return NextResponse.json({ atleta });
    }

    const atleta = await atualizarAtleta(id, acesso.filialId, body, acesso.profile);
    return NextResponse.json({ atleta });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const acesso = await resolverAcesso(id);
    if (!acesso.ok) return NextResponse.json({ erro: acesso.erro || 'Não autorizado' }, { status: acesso.status || 401 });

    if (acesso.tipo === 'atleta') {
      return NextResponse.json({ erro: 'Acesso negado' }, { status: 403 });
    }

    await deletarAtleta(id, acesso.filialId, acesso.profile);
    return NextResponse.json({ mensagem: 'Atleta removido com sucesso' });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 400 });
  }
}
