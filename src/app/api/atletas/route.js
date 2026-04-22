

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase-server';
import { verifyToken } from '@/lib/cryptoUtils';
import { listarAtletasPorFilial, criarAtleta } from '@/lib/services/atletaService';
import { buscarFilialPorAuthId } from '@/lib/services/filialService';


async function resolverOperadorId(request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const filial = await buscarFilialPorAuthId(user.id);
    if (filial) return { filialId: filial.id, tipo: 'filial', profile: filial };

    const { data: perfil } = await supabase
      .from('users').select('*').eq('auth_id', user.id).single();
    if (perfil?.role === 'admin') return { filialId: null, tipo: 'admin', profile: perfil };
  }

  const cookieStore = await cookies();
  const atletaToken = cookieStore.get('atleta-session')?.value;
  if (atletaToken) {
    const payload = await verifyToken(atletaToken);
    if (payload?.sub) {
       const { data: atleta } = await supabase.from('atletas').select('*').eq('id', payload.sub).single();
       if (atleta) return { filialId: atleta.filial_id, tipo: 'atleta', profile: atleta };
    }
  }

  return null;
}

export async function GET(request) {
  try {
    const auth = await resolverOperadorId(request);
    if (!auth) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const filialId = auth.tipo === 'admin'
      ? searchParams.get('filial_id')
      : auth.filialId;

    if (!filialId) {
      return NextResponse.json({ erro: 'filial_id obrigatório para admins' }, { status: 400 });
    }

    const atletas = await listarAtletasPorFilial(filialId);
    return NextResponse.json({ atletas });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await resolverOperadorId(request);
    if (!auth) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });

    if (auth.tipo === 'atleta') {
      return NextResponse.json({ erro: 'Acesso negado' }, { status: 403 });
    }

    const body = await request.json();
    const { cpf, telefone, email, nome, sexo, data_nascimento } = body;

    if (!cpf || !telefone || !nome) {
      return NextResponse.json(
        { erro: 'Campos obrigatórios: nome, cpf, telefone' },
        { status: 400 }
      );
    }

    const filialId = auth.filialId || body.filial_id;
    if (!filialId) {
      return NextResponse.json({ erro: 'filial_id não identificado' }, { status: 400 });
    }

    const resultado = await criarAtleta(filialId, { cpf, telefone, email, nome, sexo, data_nascimento }, auth.profile);

    return NextResponse.json(
      {
        mensagem: 'Atleta cadastrado com sucesso',
        atleta: resultado.atleta,
        senhaTemporaria: resultado.senhaTemporaria,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 400 });
  }
}
