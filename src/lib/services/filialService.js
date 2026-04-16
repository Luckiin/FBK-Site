/**
 * filialService.js
 * Toda lógica de negócio relacionada a filiais.
 * Controllers (API routes) apenas chamam este service.
 */

import { createAdminClient } from '@/lib/supabase-server';
import {
  sendFilialAprovada,
  sendFilialCadastroRecebido,
  sendFilialReprovada,
  sendNovaFilialAdmin,
} from './emailService';

// ============================================================
// LEITURA
// ============================================================

/**
 * Lista todas as filiais (uso admin).
 * @param {{ status?: string }} filtros
 */
export async function listarFiliais(filtros = {}) {
  const supabase = createAdminClient();

  let query = supabase
    .from('filiais')
    .select('*')
    .order('created_at', { ascending: false });

  if (filtros.status) {
    query = query.eq('status', filtros.status);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Erro ao listar filiais: ${error.message}`);
  return data;
}

/**
 * Busca uma filial pelo ID.
 * @param {string} id
 */
export async function buscarFilialPorId(id) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('filiais')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Filial não encontrada: ${error.message}`);
  return data;
}

/**
 * Busca uma filial pelo auth_id do Supabase Auth.
 * @param {string} authId
 */
export async function buscarFilialPorAuthId(authId) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('filiais')
    .select('*')
    .eq('auth_id', authId)
    .single();

  if (error) return null;
  return data;
}

/**
 * Busca uma filial pelo email.
 * @param {string} email
 */
export async function buscarFilialPorEmail(email) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('filiais')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return null;
  return data;
}

// ============================================================
// CRIAÇÃO
// ============================================================

/**
 * Cria uma nova filial com status 'pendente'.
 * Cria usuário no Supabase Auth e víncula ao registro de filial.
 * @param {{ nome: string, email: string, telefone: string, senha: string }}
 */
export async function criarFilial({ nome, email, telefone, senha }) {
  const supabase = createAdminClient();

  // Verificar se email já existe
  const filialExistente = await buscarFilialPorEmail(email);
  if (filialExistente) {
    throw new Error('Este email já está cadastrado');
  }

  // Criar usuário no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true, // Confirma automaticamente (sem email de verificação)
  });

  if (authError) throw new Error(`Erro ao criar conta: ${authError.message}`);

  // Criar registro na tabela filiais
  const { data: filial, error: filialError } = await supabase
    .from('filiais')
    .insert({
      auth_id: authData.user.id,
      nome,
      email,
      telefone,
      status: 'pendente',
    })
    .select()
    .single();

  if (filialError) {
    // Rollback: deletar usuário auth se insert falhar
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw new Error(`Erro ao criar filial: ${filialError.message}`);
  }

  // Notificar admin (mock)
  await sendFilialCadastroRecebido({ to: email, nome }).catch(console.error);
  await sendNovaFilialAdmin({ nomeFilial: nome, emailFilial: email }).catch(console.error);

  return filial;
}

// ============================================================
// ATUALIZAÇÃO
// ============================================================

/**
 * Atualiza dados de uma filial.
 * @param {string} id
 * @param {{ nome?: string, telefone?: string }} dados
 */
export async function atualizarFilial(id, dados) {
  const supabase = createAdminClient();

  const camposPermitidos = ['nome', 'telefone'];
  const update = Object.fromEntries(
    Object.entries(dados).filter(([k]) => camposPermitidos.includes(k))
  );

  const { data, error } = await supabase
    .from('filiais')
    .update(update)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Erro ao atualizar filial: ${error.message}`);
  return data;
}

/**
 * Aprova ou reprova uma filial (admin).
 * @param {string} id
 * @param {'aprovado' | 'reprovado'} novoStatus
 * @param {string} [motivoReprovacao]
 */
export async function alterarStatusFilial(id, novoStatus, motivoReprovacao = '') {
  if (!['aprovado', 'reprovado'].includes(novoStatus)) {
    throw new Error('Status inválido. Use: aprovado ou reprovado');
  }
  if (novoStatus === 'reprovado' && !motivoReprovacao.trim()) {
    throw new Error('Informe a justificativa da reprovação');
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('filiais')
    .update({
      status: novoStatus,
      motivo_reprovacao: novoStatus === 'reprovado' ? motivoReprovacao.trim() : null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Erro ao alterar status: ${error.message}`);

  // Notificar filial por email se aprovada (mock)
  if (novoStatus === 'aprovado') {
    await sendFilialAprovada({ to: data.email, nome: data.nome }).catch(console.error);
  }
  if (novoStatus === 'reprovado') {
    await sendFilialReprovada({
      to: data.email,
      nome: data.nome,
      motivo: data.motivo_reprovacao,
    }).catch(console.error);
  }

  return data;
}

// ============================================================
// DELEÇÃO
// ============================================================

/**
 * Remove uma filial e seu usuário Auth.
 * @param {string} id
 */
export async function deletarFilial(id) {
  const supabase = createAdminClient();

  const filial = await buscarFilialPorId(id);

  const { error } = await supabase.from('filiais').delete().eq('id', id);
  if (error) throw new Error(`Erro ao deletar filial: ${error.message}`);

  // Remove usuário do Supabase Auth
  if (filial.auth_id) {
    await supabase.auth.admin.deleteUser(filial.auth_id).catch(console.error);
  }

  return { sucesso: true };
}
