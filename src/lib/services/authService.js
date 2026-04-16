/**
 * authService.js
 * Toda lógica de autenticação: login de filial/admin (Supabase Auth),
 * login de filiado (customizado), e recuperação de senha.
 */

import { createAdminClient } from '@/lib/supabase-server';
import { verificarSenha } from '@/lib/cryptoUtils';
import { buscarFilialPorAuthId, buscarFilialPorEmail } from './filialService';
import { buscarFiliadoPorTelefone, buscarFiliadoPorEmail, atualizarSenhaFiliado } from './filiadoService';
import { sendRecuperacaoSenha } from './emailService';

// ============================================================
// LOGIN — FILIAL / ADMIN (via Supabase Auth)
// ============================================================

/**
 * Autentica via email + senha (Supabase Auth).
 * Se o usuário for admin/atleta legado em public.users, libera acesso por lá.
 * Se for filial, valida aprovação antes de conceder acesso.
 *
 * @param {object} supabase — cliente Supabase do contexto da request
 * @param {string} email
 * @param {string} senha
 * @returns {{ filial: object, session: object }}
 */
export async function loginFilial(supabase, email, senha) {
  // Autenticar via Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) throw new Error('Email ou senha incorretos');

  // 1. Tenta fluxo de filial
  const filial = await buscarFilialPorAuthId(data.user.id);
  if (filial) {
    if (filial.status === 'pendente') {
      throw new Error('Seu cadastro está sendo analisado. Aguarde a aprovação.');
    }
    if (filial.status === 'reprovado') {
      throw new Error('Seu cadastro foi reprovado. Entre em contato com a federação.');
    }

    return {
      tipo: 'filial',
      usuario: filial,
      session: data.session,
    };
  }

  // 2. Fallback para admin/atleta legado
  const { data: perfil, error: perfilError } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', data.user.id)
    .single();

  if (perfilError || !perfil) {
    throw new Error('Usuário não encontrado. Verifique o cadastro.');
  }

  return {
    tipo: perfil.role,
    usuario: perfil,
    session: data.session,
  };
}

// ============================================================
// LOGIN — FILIADO (customizado: telefone + senha)
// ============================================================

/**
 * Autentica um filiado via telefone + senha (PBKDF2).
 * Retorna os dados do filiado para geração de token JWT no controller.
 *
 * @param {string} telefone
 * @param {string} senha
 * @returns {{ filiado: object }}
 */
export async function loginFiliado(telefone, senha) {
  const filiado = await buscarFiliadoPorTelefone(telefone);
  if (!filiado) throw new Error('Telefone ou senha incorretos');

  const senhaValida = await verificarSenha(senha, filiado.senha_hash);
  if (!senhaValida) throw new Error('Telefone ou senha incorretos');

  // Remover hash da resposta
  const { senha_hash, ...filiadoSeguro } = filiado;

  return {
    tipo: 'filiado',
    usuario: filiadoSeguro,
  };
}

// ============================================================
// RECUPERAÇÃO DE SENHA
// ============================================================

/**
 * Inicia o fluxo de recuperação de senha.
 * Gera token único (UUID), armazena no banco com expiração de 15 min,
 * e dispara email (mock).
 *
 * @param {string} email
 * @returns {{ sucesso: boolean }}
 */
export async function solicitarRecuperacaoSenha(email) {
  const supabase = createAdminClient();

  // Verificar se o email pertence a um filiado ou filial
  const filiado = await buscarFiliadoPorEmail(email);
  const filial = await buscarFilialPorEmail(email);
  const dono = filiado || filial;

  // Não revelamos se o email existe (segurança contra enumeração)
  if (!dono) {
    console.log(`[AUTH] Recuperação solicitada para email inexistente: ${email}`);
    return { sucesso: true };
  }

  // Gerar token único
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

  // Remover tokens anteriores do mesmo email
  await supabase.from('password_resets').delete().eq('email', email);

  // Inserir novo token
  const { error } = await supabase.from('password_resets').insert({
    email,
    token,
    expires_at: expiresAt.toISOString(),
  });

  if (error) throw new Error('Erro ao gerar token de recuperação');

  // Montar URL de redefinição
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetUrl = `${appUrl}/auth/redefinir-senha?token=${token}`;

  // Enviar email (mock)
  await sendRecuperacaoSenha({ to: email, nome: dono.nome, resetUrl }).catch(console.error);

  return { sucesso: true };
}

/**
 * Redefine a senha usando o token de recuperação.
 * Valida expiração, aplica hash e atualiza a senha.
 *
 * @param {string} token
 * @param {string} novaSenha
 * @returns {{ sucesso: boolean }}
 */
export async function redefinirSenha(token, novaSenha) {
  const supabase = createAdminClient();

  // Buscar token
  const { data: reset, error } = await supabase
    .from('password_resets')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !reset) throw new Error('Token inválido ou já utilizado');

  // Verificar expiração
  if (new Date(reset.expires_at) < new Date()) {
    await supabase.from('password_resets').delete().eq('token', token);
    throw new Error('Token expirado. Solicite um novo link de recuperação.');
  }

  // Verificar força da senha
  if (novaSenha.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres');
  }

  // Atualizar filiado
  const filiado = await buscarFiliadoPorEmail(reset.email);
  if (filiado) {
    await atualizarSenhaFiliado(filiado.id, novaSenha);
  } else {
    // Atualizar filial via Supabase Auth
    const filial = await buscarFilialPorEmail(reset.email);
    if (filial?.auth_id) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        filial.auth_id,
        { password: novaSenha }
      );
      if (authError) throw new Error('Erro ao atualizar senha da filial');
    }
  }

  // Invalidar token usado
  await supabase.from('password_resets').delete().eq('token', token);

  return { sucesso: true };
}

/**
 * Verifica se um token de reset é válido e não expirado.
 * Útil para validar antes de exibir o formulário de redefinição.
 *
 * @param {string} token
 * @returns {{ valido: boolean, email?: string }}
 */
export async function validarTokenReset(token) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('password_resets')
    .select('email, expires_at')
    .eq('token', token)
    .single();

  if (error || !data) return { valido: false };
  if (new Date(data.expires_at) < new Date()) return { valido: false };

  return { valido: true, email: data.email };
}
