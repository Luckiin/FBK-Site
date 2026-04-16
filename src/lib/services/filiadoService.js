/**
 * filiadoService.js
 * Toda lógica de negócio relacionada a filiados.
 * Controllers (API routes) apenas chamam este service.
 */

import { createAdminClient } from '@/lib/supabase-server';
import { hashSenha, gerarSenhaAleatoria } from '@/lib/cryptoUtils';
import { validarCPF } from './cpfService';
import { sendBoasVindas, sendNovoFiliado } from './whatsappService';

// ============================================================
// LEITURA
// ============================================================

/**
 * Lista filiados de uma filial específica.
 * @param {string} filialId
 */
export async function listarFiliadosPorFilial(filialId) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('filiados')
    .select('id, cpf, nome, sexo, data_nascimento, telefone, email, filial_id, created_at, updated_at')
    .eq('filial_id', filialId)
    .order('nome', { ascending: true });

  if (error) throw new Error(`Erro ao listar filiados: ${error.message}`);
  return data;
}

/**
 * Busca um filiado pelo ID (sem senha_hash).
 * @param {string} id
 */
export async function buscarFiliadoPorId(id) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('filiados')
    .select('id, cpf, nome, sexo, data_nascimento, telefone, email, filial_id, created_at, updated_at')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Filiado não encontrado: ${error.message}`);
  return data;
}

/**
 * Busca um filiado pelo telefone (inclui senha_hash — uso interno do authService).
 * @param {string} telefone
 */
export async function buscarFiliadoPorTelefone(telefone) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('filiados')
    .select('*')
    .eq('telefone', telefone)
    .single();

  if (error) return null;
  return data;
}

/**
 * Busca um filiado pelo email (para recuperação de senha).
 * @param {string} email
 */
export async function buscarFiliadoPorEmail(email) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('filiados')
    .select('id, email, nome')
    .eq('email', email)
    .single();

  if (error) return null;
  return data;
}

// ============================================================
// CRIAÇÃO
// ============================================================

/**
 * Cadastra um novo filiado vinculado à filial logada.
 * - Valida CPF (dígitos verificadores)
 * - Aceita dados pessoais preenchidos manualmente pelo operador
 * - Gera senha temporária automática
 * - Faz hash PBKDF2 da senha
 * - Envia WhatsApp com credenciais (mock)
 *
 * @param {string} filialId
 * @param {{
 *   cpf: string,
 *   nome: string,
 *   sexo?: string,
 *   data_nascimento?: string,
 *   telefone: string,
 *   email?: string
 * }} dados
 * @returns {{ filiado: object, senhaTemporaria: string }}
 */
export async function criarFiliado(filialId, dados) {
  const supabase = createAdminClient();

  // Validar CPF pelos dígitos verificadores
  if (!validarCPF(dados.cpf)) {
    throw new Error('CPF inválido');
  }

  if (!dados.nome?.trim()) {
    throw new Error('Nome do filiado é obrigatório');
  }

  // Verificar duplicidade de CPF
  const { data: cpfExiste } = await supabase
    .from('filiados')
    .select('id')
    .eq('cpf', dados.cpf)
    .single();

  if (cpfExiste) throw new Error('CPF já cadastrado');

  // Verificar duplicidade de telefone
  const { data: telExiste } = await supabase
    .from('filiados')
    .select('id')
    .eq('telefone', dados.telefone)
    .single();

  if (telExiste) throw new Error('Telefone já cadastrado');

  // Gerar senha temporária
  const senhaTemporaria = gerarSenhaAleatoria(10);
  const senhaHash = await hashSenha(senhaTemporaria);

  // Inserir filiado com dados fornecidos pelo operador
  const { data: filiado, error } = await supabase
    .from('filiados')
    .insert({
      filial_id: filialId,
      cpf: dados.cpf,
      nome: dados.nome.trim(),
      sexo: dados.sexo || null,
      data_nascimento: dados.data_nascimento || null,
      telefone: dados.telefone,
      email: dados.email || null,
      senha_hash: senhaHash,
    })
    .select('id, cpf, nome, sexo, data_nascimento, telefone, email, filial_id, created_at')
    .single();

  if (error) throw new Error(`Erro ao criar filiado: ${error.message}`);

  // Notificar via WhatsApp (mock)
  await sendBoasVindas({
    telefone: dados.telefone,
    nome: filiado.nome,
    senhaTemporaria,
  }).catch(console.error);

  return { filiado, senhaTemporaria };
}

// ============================================================
// ATUALIZAÇÃO
// ============================================================

/**
 * Atualiza dados de um filiado.
 * @param {string} id
 * @param {string} filialId — garante que o filiado pertence à filial
 * @param {object} dados
 */
export async function atualizarFiliado(id, filialId, dados) {
  const supabase = createAdminClient();

  const camposPermitidos = ['nome', 'sexo', 'data_nascimento', 'telefone', 'email'];
  const update = Object.fromEntries(
    Object.entries(dados).filter(([k]) => camposPermitidos.includes(k))
  );

  const { data, error } = await supabase
    .from('filiados')
    .update(update)
    .eq('id', id)
    .eq('filial_id', filialId)
    .select('id, cpf, nome, sexo, data_nascimento, telefone, email, filial_id, updated_at')
    .single();

  if (error) throw new Error(`Erro ao atualizar filiado: ${error.message}`);
  return data;
}

/**
 * Atualiza a senha de um filiado (após reset de senha).
 * @param {string} id
 * @param {string} novaSenha
 */
export async function atualizarSenhaFiliado(id, novaSenha) {
  const supabase = createAdminClient();
  const senhaHash = await hashSenha(novaSenha);

  const { error } = await supabase
    .from('filiados')
    .update({ senha_hash: senhaHash })
    .eq('id', id);

  if (error) throw new Error(`Erro ao atualizar senha: ${error.message}`);
  return { sucesso: true };
}

// ============================================================
// DELEÇÃO
// ============================================================

/**
 * Remove um filiado (apenas pela filial dona).
 * @param {string} id
 * @param {string} filialId
 */
export async function deletarFiliado(id, filialId) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('filiados')
    .delete()
    .eq('id', id)
    .eq('filial_id', filialId);

  if (error) throw new Error(`Erro ao deletar filiado: ${error.message}`);
  return { sucesso: true };
}
