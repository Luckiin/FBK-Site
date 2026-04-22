

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase-server';
import { verifyToken } from '@/lib/cryptoUtils';
import { validarCPF } from '@/lib/services/cpfService';

async function verificarAcesso() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) return true;

  const cookieStore = await cookies();
  const token = cookieStore.get('atleta-session')?.value;
  if (token) {
    const payload = await verifyToken(token);
    return false; // atletas não cadastram outros atletas
  }

  return false;
}

export async function GET(request, { params }) {
  try {
    const autorizado = await verificarAcesso();
    if (!autorizado) {
      return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });
    }

    const { cpf } = params;
    if (!cpf) {
      return NextResponse.json({ erro: 'CPF não informado' }, { status: 400 });
    }

    if (!validarCPF(cpf)) {
      return NextResponse.json(
        {
          valido: false,
          erro: 'CPF inválido. Verifique os dígitos e tente novamente.',
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      valido: true,
      preenchimento: 'manual',
      mensagem: 'CPF válido. Preencha os dados do atleta abaixo.',
    });

  } catch (err) {
    console.error('[API /cpf]', err);
    return NextResponse.json({ erro: 'Erro interno ao validar CPF.' }, { status: 500 });
  }
}
