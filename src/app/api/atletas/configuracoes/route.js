import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/cryptoUtils';
import { atualizarSenhaAtleta } from '@/lib/services/atletaService';
import { loginAtleta } from '@/lib/services/authService';

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const atletaToken = cookieStore.get('atleta-session')?.value;
    
    if (!atletaToken) {
      return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });
    }

    const payload = await verifyToken(atletaToken);
    if (!payload || payload.tipo !== 'atleta') {
      return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });
    }

    const { senhaAtual, novaSenha } = await request.json();

    if (!senhaAtual || !novaSenha) {
      return NextResponse.json({ erro: 'Preencha a senha atual e a nova senha' }, { status: 400 });
    }

    // 1. Verifica se a senha atual está correta usando o serviço de login
    try {
      await loginAtleta(payload.telefone, senhaAtual);
    } catch (err) {
      return NextResponse.json({ erro: 'A senha atual está incorreta' }, { status: 400 });
    }

    // 2. Atualiza para nova senha
    await atualizarSenhaAtleta(payload.sub, novaSenha);

    return NextResponse.json({ mensagem: 'Senha atualizada com sucesso' }, { status: 200 });

  } catch (err) {
    console.error('[POST /api/atletas/configuracoes]', err);
    return NextResponse.json({ erro: 'Erro interno ao processar' }, { status: 500 });
  }
}
