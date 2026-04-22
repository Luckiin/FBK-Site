import { createAdminClient } from '@/lib/supabase-server';
import { hashSenha, gerarSenhaAleatoria } from '@/lib/cryptoUtils';
import { validarCPF } from './cpfService';
import { sendBoasVindasAtleta } from './emailService';
import { auditService } from './auditService';

function normalizarModalidades(modalidades = []) {
  if (!Array.isArray(modalidades)) return [];

  return modalidades
    .map((item) => ({
      modalidade: item?.modalidade?.trim() || '',
      graduacao: item?.graduacao?.trim() || '',
      data_graduacao: item?.data_graduacao || null,
    }))
    .filter((item) => item.modalidade || item.graduacao || item.data_graduacao);
}

function validarModalidades(modalidades) {
  const lista = normalizarModalidades(modalidades);

  if (lista.length === 0) {
    throw new Error('Informe ao menos uma modalidade com graduacao e data');
  }

  for (const item of lista) {
    if (!item.modalidade || !item.graduacao || !item.data_graduacao) {
      throw new Error('Cada modalidade precisa ter modalidade, graduacao e data da graduacao');
    }
  }

  return lista;
}

function enriquecerAtleta(atleta) {
  return {
    ...atleta,
    modalidades: Array.isArray(atleta?.modalidades) ? atleta.modalidades : [],
    filial_nome: atleta?.filiais?.nome ?? null,
    filiais: undefined,
  };
}

const ATHLETE_SELECT = [
  'id',
  'cpf',
  'nome',
  'sexo',
  'data_nascimento',
  'telefone',
  'email',
  'uf',
  'cidade',
  'endereco',
  'nome_professor',
  'modalidades',
  'filial_id',
  'created_at',
  'updated_at',
  'senha_temporaria',
  'filiais(nome)',
].join(', ');

export async function listarAtletasPorFilial(filialId) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('atletas')
    .select(ATHLETE_SELECT)
    .eq('filial_id', filialId)
    .order('nome', { ascending: true });

  if (error) throw new Error(`Erro ao listar atletas: ${error.message}`);
  return (data || []).map(enriquecerAtleta);
}

export async function buscarAtletaPorId(id) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('atletas')
    .select(ATHLETE_SELECT)
    .eq('id', id)
    .single();

  if (error) throw new Error(`Atleta nao encontrado: ${error.message}`);
  return enriquecerAtleta(data);
}

export async function buscarAtletaPorTelefone(telefone) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('atletas')
    .select('*, filiais(nome)')
    .eq('telefone', telefone)
    .single();

  if (error) return null;
  return enriquecerAtleta(data);
}

export async function buscarAtletaPorEmail(email) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('atletas')
    .select('id, email, nome, filiais(nome)')
    .eq('email', email)
    .single();

  if (error) return null;
  return enriquecerAtleta(data);
}

export async function criarAtleta(filialId, dados, executante = null) {
  const supabase = createAdminClient();

  if (!validarCPF(dados.cpf)) throw new Error('CPF invalido');
  if (!dados.nome?.trim()) throw new Error('Nome do atleta e obrigatorio');
  if (!dados.email?.trim()) throw new Error('E-mail do atleta e obrigatorio para o envio da senha');

  const modalidades = validarModalidades(dados.modalidades);

  const { data: cpfExiste } = await supabase
    .from('atletas')
    .select('id')
    .eq('cpf', dados.cpf)
    .single();
  if (cpfExiste) throw new Error('CPF ja cadastrado');

  const { data: telExiste } = await supabase
    .from('atletas')
    .select('id')
    .eq('telefone', dados.telefone)
    .single();
  if (telExiste) throw new Error('Telefone ja cadastrado');

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
      email: dados.email.trim(),
      uf: dados.uf || null,
      cidade: dados.cidade?.trim() || null,
      endereco: dados.endereco?.trim() || null,
      nome_professor: dados.nome_professor?.trim() || null,
      modalidades,
      senha_hash: senhaHash,
      senha_temporaria: senhaTemporaria,
    })
    .select(ATHLETE_SELECT)
    .single();

  if (error) throw new Error(`Erro ao criar atleta: ${error.message}`);

  const atletaEnriquecido = enriquecerAtleta(atleta);

  if (executante) {
    await auditService.log({
      user_id: executante.id,
      user_name: executante.nome || executante.name || 'Usuario',
      action: 'INSERT',
      tabela: 'atletas',
      registro_id: atletaEnriquecido.id,
      target: atletaEnriquecido.nome,
      description: `Atleta "${atletaEnriquecido.nome}" cadastrado`,
      dados_novos: atletaEnriquecido,
      filial_id: filialId,
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

  const { data: anterior } = await supabase
    .from('atletas')
    .select('*')
    .eq('id', id)
    .single();

  const camposPermitidos = [
    'nome',
    'sexo',
    'data_nascimento',
    'telefone',
    'email',
    'uf',
    'cidade',
    'endereco',
    'nome_professor',
  ];

  const update = Object.fromEntries(
    Object.entries(dados).filter(([k]) => camposPermitidos.includes(k))
  );

  if ('modalidades' in dados) {
    update.modalidades = validarModalidades(dados.modalidades);
  }

  if ('nome' in update) update.nome = update.nome?.trim() || '';
  if (!update.nome) throw new Error('Nome do atleta e obrigatorio');

  if ('email' in update) {
    update.email = update.email?.trim() || '';
    if (!update.email) throw new Error('E-mail do atleta e obrigatorio');
  }

  if ('cidade' in update) update.cidade = update.cidade?.trim() || null;
  if ('endereco' in update) update.endereco = update.endereco?.trim() || null;
  if ('nome_professor' in update) update.nome_professor = update.nome_professor?.trim() || null;

  let query = supabase.from('atletas').update(update).eq('id', id);

  if (filialId) {
    query = query.eq('filial_id', filialId);
  }

  const { data: novo, error } = await query.select(ATHLETE_SELECT).single();

  if (error) throw new Error(`Erro ao atualizar atleta: ${error.message}`);

  const atletaAtualizado = enriquecerAtleta(novo);

  if (executante && anterior) {
    await auditService.log({
      user_id: executante.id,
      user_name: executante.nome || executante.name || 'Usuario',
      action: 'UPDATE',
      tabela: 'atletas',
      registro_id: id,
      target: atletaAtualizado.nome,
      description: `Atleta "${atletaAtualizado.nome}" atualizado`,
      dados_anteriores: anterior,
      dados_novos: atletaAtualizado,
      filial_id: filialId,
    });
  }

  return atletaAtualizado;
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

  const { data: anterior } = await supabase
    .from('atletas')
    .select('id, nome')
    .eq('id', id)
    .single();

  let query = supabase.from('atletas').delete().eq('id', id);

  if (filialId) {
    query = query.eq('filial_id', filialId);
  }

  const { error } = await query;

  if (error) throw new Error(`Erro ao deletar atleta: ${error.message}`);

  if (executante && anterior) {
    await auditService.log({
      user_id: executante.id,
      user_name: executante.nome || executante.name || 'Usuario',
      action: 'DELETE',
      tabela: 'atletas',
      registro_id: id,
      target: anterior.nome,
      description: `Atleta "${anterior.nome}" removido do sistema`,
      dados_anteriores: anterior,
      filial_id: filialId,
    });
  }

  return { sucesso: true };
}
