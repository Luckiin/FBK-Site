
import { createAdminClient } from '@/lib/supabase-server';
import { hashSenha, gerarSenhaAleatoria } from '@/lib/cryptoUtils';
import { validarCPF } from './cpfService';
import { sendBoasVindasAtleta } from './emailService';

/* ─────────────────────────────────────────────────── */
/* Atleta Service                                      */
/* ─────────────────────────────────────────────────── */

export async function listarAtletasPorFilial(filialId) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('atletas')
    .select('id, cpf, nome, sexo, data_nascimento, telefone, email, filial_id, created_at, updated_at, senha_temporaria, filiais(nome)')
    .eq('filial_id', filialId)
    .order('nome', { ascending: true });

  if (error) throw new Error(`Erro ao listar atletas: ${error.message}`);
  return data.map(f => ({ ...f, filial_nome: f.filiais?.nome ?? null, filiais: undefined }));
}

export async function buscarAtletaPorId(id) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('atletas')
    .select('id, cpf, nome, sexo, data_nascimento, telefone, email, filial_id, created_at, updated_at, senha_temporaria, filiais(nome)')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Atleta não encontrado: ${error.message}`);
  return { ...data, filial_nome: data.filiais?.nome ?? null, filiais: undefined };
}

export async function buscarAtletaPorTelefone(telefone) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('atletas')
    .select('*, filiais(nome)')
    .eq('telefone', telefone)
    .single();

  if (error) return null;
  return { ...data, filial_nome: data.filiais?.nome ?? null, filiais: undefined };
}

export async function buscarAtletaPorEmail(email) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('atletas')
    .select('id, email, nome, filiais(nome)')
    .eq('email', email)
    .single();

  if (error) return null;
  return { ...data, filial_nome: data.filiais?.nome ?? null, filiais: undefined };
}

export async function criarAtleta(filialId, dados) {
  const supabase = createAdminClient();

  if (!validarCPF(dados.cpf)) throw new Error('CPF inválido');
  if (!dados.nome?.trim())    throw new Error('Nome do atleta é obrigatório');
  if (!dados.email?.trim())   throw new Error('E-mail do atleta é obrigatório para o envio da senha');

  const { data: cpfExiste } = await supabase
    .from('atletas').select('id').eq('cpf', dados.cpf).single();
  if (cpfExiste) throw new Error('CPF já cadastrado');

  const { data: telExiste } = await supabase
    .from('atletas').select('id').eq('telefone', dados.telefone).single();
  if (telExiste) throw new Error('Telefone já cadastrado');

  const senhaTemporaria = gerarSenhaAleatoria(10);
  const senhaHash = await hashSenha(senhaTemporaria);

  const { data: atleta, error } = await supabase
    .from('atletas')
    .insert({
      filial_id: filialId,
      cpf: dados.cpf,
      nome: dados.nome.trim(),
      sexo: dados.sexo || null,
      data_nascimento: dados.data_nascimento || null,
      telefone: dados.telefone,
      email: dados.email || null,
      senha_hash: senhaHash,
      senha_temporaria: senhaTemporaria,
    })
    .select('id, cpf, nome, sexo, data_nascimento, telefone, email, filial_id, created_at, senha_temporaria, filiais(nome)')
    .single();

  if (error) throw new Error(`Erro ao criar atleta: ${error.message}`);

  const atletaEnriquecido = { ...atleta, filial_nome: atleta.filiais?.nome ?? null, filiais: undefined };

  await sendBoasVindasAtleta({
    to: atletaEnriquecido.email,
    nome: atletaEnriquecido.nome,
    telefone: atletaEnriquecido.telefone,
    senhaTemporaria,
  }).catch(console.error);

  return { atleta: atletaEnriquecido, senhaTemporaria };
}

export async function atualizarAtleta(id, filialId, dados) {
  const supabase = createAdminClient();
  const camposPermitidos = ['nome', 'sexo', 'data_nascimento', 'telefone', 'email'];
  const update = Object.fromEntries(
    Object.entries(dados).filter(([k]) => camposPermitidos.includes(k))
  );

  const { data, error } = await supabase
    .from('atletas')
    .update(update)
    .eq('id', id)
    .eq('filial_id', filialId)
    .select('id, cpf, nome, sexo, data_nascimento, telefone, email, filial_id, updated_at')
    .single();

  if (error) throw new Error(`Erro ao atualizar atleta: ${error.message}`);
  return data;
}

export async function atualizarSenhaAtleta(id, novaSenha) {
  const supabase = createAdminClient();
  const senhaHash = await hashSenha(novaSenha);

  const { error } = await supabase
    .from('atletas')
    .update({ senha_hash: senhaHash, senha_temporaria: null })
    .eq('id', id);

  if (error) throw new Error(`Erro ao atualizar senha: ${error.message}`);
  return { sucesso: true };
}

export async function deletarAtleta(id, filialId) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('atletas')
    .delete()
    .eq('id', id)
    .eq('filial_id', filialId);

  if (error) throw new Error(`Erro ao deletar atleta: ${error.message}`);
  return { sucesso: true };
}
