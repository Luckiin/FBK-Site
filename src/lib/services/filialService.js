

import { createAdminClient } from '@/lib/supabase-server';
import {
  sendFilialAprovada,
  sendFilialCadastroRecebido,
  sendFilialReprovada,
  sendNovaFilialAdmin,
} from './emailService';



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



export async function criarFilial({ nome, email, telefone, senha }) {
  const supabase = createAdminClient();

  const filialExistente = await buscarFilialPorEmail(email);
  if (filialExistente) {
    throw new Error('Este email já está cadastrado');
  }

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true, // Confirma automaticamente (sem email de verificação)
  });

  if (authError) throw new Error(`Erro ao criar conta: ${authError.message}`);

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
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw new Error(`Erro ao criar filial: ${filialError.message}`);
  }

  await sendFilialCadastroRecebido({ to: email, nome }).catch((err) =>
    console.error('[FILIAL] Falha ao enviar email de confirmação para', email, ':', err.message)
  );
  await sendNovaFilialAdmin({ nomeFilial: nome, emailFilial: email }).catch((err) =>
    console.error('[FILIAL] Falha ao enviar email de notificação para admin:', err.message)
  );

  return filial;
}



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

  if (novoStatus === 'aprovado') {
    await sendFilialAprovada({ to: data.email, nome: data.nome }).catch((err) =>
      console.error('[FILIAL] Falha ao enviar email de aprovação para', data.email, ':', err.message)
    );
  }
  if (novoStatus === 'reprovado') {
    await sendFilialReprovada({
      to: data.email,
      nome: data.nome,
      motivo: data.motivo_reprovacao,
    }).catch((err) =>
      console.error('[FILIAL] Falha ao enviar email de reprovação para', data.email, ':', err.message)
    );
  }

  return data;
}



export async function deletarFilial(id) {
  const supabase = createAdminClient();

  const filial = await buscarFilialPorId(id);

  const { error } = await supabase.from('filiais').delete().eq('id', id);
  if (error) throw new Error(`Erro ao deletar filial: ${error.message}`);

  if (filial.auth_id) {
    await supabase.auth.admin.deleteUser(filial.auth_id).catch(console.error);
  }

  return { sucesso: true };
}
