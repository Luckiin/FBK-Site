
import { createAdminClient } from '@/lib/supabase-server';
import { hashSenha, gerarSenhaAleatoria } from '@/lib/cryptoUtils';
import { validarCPF } from './cpfService';
import { sendBoasVindasAtleta } from './emailService';
import { auditService } from './auditService';

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

export async function criarAtleta(filialId, dados, executante = null) {
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

  // Auditoria
  if (executante) {
    await auditService.log({
      user_id: executante.id,
      user_name: executante.nome || executante.name || 'Usuário',
      action: 'INSERT',
      tabela: 'atletas',
      registro_id: atletaEnriquecido.id,
      target: atletaEnriquecido.nome,
      description: `Atleta "${atletaEnriquecido.nome}" cadastrado`,
      dados_novos: atletaEnriquecido,
      filial_id: filialId
    });
  }

  await sendBoasVindasAtleta({
    to: atletaEnriquecido.email,
    nome: atletaEnriquecido.nome,
    telefone: atletaEnriquecido.telefone,
    senhaTemporaria,
  }).catch(console.error);

  return { atleta: atletaEnriquecido, senhaTemporaria };
}

export async function atualizarAtleta(id, filialId, dados, executante = null) {
  const supabase = createAdminClient();
  
  // Buscar dados anteriores para o log
  const { data: anterior } = await supabase
    .from('atletas')
    .select('*')
    .eq('id', id)
    .single();

  const camposPermitidos = ['nome', 'sexo', 'data_nascimento', 'telefone', 'email'];
  const update = Object.fromEntries(
    Object.entries(dados).filter(([k]) => camposPermitidos.includes(k))
  );

  let query = supabase
    .from('atletas')
    .update(update)
    .eq('id', id);

  if (filialId) {
    query = query.eq('filial_id', filialId);
  }

  const { data: novo, error } = await query
    .select('id, cpf, nome, sexo, data_nascimento, telefone, email, filial_id, updated_at')
    .single();

  if (error) throw new Error(`Erro ao atualizar atleta: ${error.message}`);

  // Auditoria
  if (executante && anterior) {
    await auditService.log({
      user_id: executante.id,
      user_name: executante.nome || executante.name || 'Usuário',
      action: 'UPDATE',
      tabela: 'atletas',
      registro_id: id,
      target: novo.nome,
      description: `Atleta "${novo.nome}" atualizado`,
      dados_anteriores: anterior,
      dados_novos: novo,
      filial_id: filialId
    });
  }

  return novo;
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

export async function deletarAtleta(id, filialId, executante = null) {
  const supabase = createAdminClient();

  // Buscar dados antes de deletar
  const { data: anterior } = await supabase
    .from('atletas')
    .select('id, nome')
    .eq('id', id)
    .single();

  let query = supabase
    .from('atletas')
    .delete()
    .eq('id', id);

  if (filialId) {
    query = query.eq('filial_id', filialId);
  }

  const { error } = await query;

  if (error) throw new Error(`Erro ao deletar atleta: ${error.message}`);

  // Auditoria
  if (executante && anterior) {
    await auditService.log({
      user_id: executante.id,
      user_name: executante.nome || executante.name || 'Usuário',
      action: 'DELETE',
      tabela: 'atletas',
      registro_id: id,
      target: anterior.nome,
      description: `Atleta "${anterior.nome}" removido do sistema`,
      dados_anteriores: anterior,
      filial_id: filialId
    });
  }

  return { sucesso: true };
}
