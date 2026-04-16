/**
 * GET /api/cpf/[cpf]
 *
 * Valida o CPF usando o algoritmo oficial dos dígitos verificadores (gratuito, offline).
 * Não retorna dados pessoais — isso é protegido pela LGPD e não há API pública gratuita.
 *
 * Resposta quando VÁLIDO:
 *   { valido: true }
 *   → O formulário exibe campos para preenchimento manual de nome/sexo/nascimento.
 *
 * Resposta quando INVÁLIDO:
 *   { valido: false, erro: "CPF inválido..." }
 *   → O formulário bloqueia o cadastro.
 *
 * Para integrar auto-preenchimento real no futuro (Serpro DataValid, etc.),
 * adicione a chamada ao serviço dentro de getDadosPorCPF() no cpfService.js.
 *
 * Acesso protegido: apenas filiais e admins logados podem validar CPFs.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase-server';
import { verifyToken } from '@/lib/cryptoUtils';
import { validarCPF } from '@/lib/services/cpfService';

async function verificarAcesso() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) return true;

  // Filiados (JWT) não têm permissão para validar CPF de outros
  const cookieStore = await cookies();
  const token = cookieStore.get('filiado-session')?.value;
  if (token) {
    const payload = await verifyToken(token);
    return false; // filiados não cadastram outros filiados
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

    // Validação matemática dos dígitos verificadores (Receita Federal)
    if (!validarCPF(cpf)) {
      return NextResponse.json(
        {
          valido: false,
          erro: 'CPF inválido. Verifique os dígitos e tente novamente.',
        },
        { status: 422 }
      );
    }

    // CPF matematicamente válido — dados pessoais devem ser preenchidos manualmente
    return NextResponse.json({
      valido: true,
      preenchimento: 'manual',
      mensagem: 'CPF válido. Preencha os dados do filiado abaixo.',
    });

  } catch (err) {
    console.error('[API /cpf]', err);
    return NextResponse.json({ erro: 'Erro interno ao validar CPF.' }, { status: 500 });
  }
}
