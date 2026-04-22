import { createAdminClient } from '@/lib/supabase-server';
import { auditService } from './auditService';

// ============================================================
// LEITURA
// ============================================================

/**
 * Lista notícias.
 * @param {{ publicado?: boolean, destaque?: boolean, limit?: number }} filtros
 */
export async function listarNoticias({ publicado, destaque, limit } = {}) {
  const supabase = createAdminClient();

  let query = supabase
    .from('noticias')
    .select('id, titulo, resumo, imagem_url, publicado, destaque, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (publicado !== undefined) query = query.eq('publicado', publicado);
  if (destaque  !== undefined) query = query.eq('destaque',  destaque);
  if (limit)                   query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new Error(`Erro ao listar notícias: ${error.message}`);
  return data;
}

/**
 * Busca uma notícia pelo ID (inclui conteúdo completo).
 * @param {string} id
 */
export async function buscarNoticiaPorId(id) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('noticias')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Notícia não encontrada: ${error.message}`);
  return data;
}

// ============================================================
// CRIAÇÃO
// ============================================================

/**
 * Cria uma nova notícia (admin).
 * @param {{ titulo: string, resumo?: string, conteudo?: string, imagem_url?: string, publicado?: boolean, destaque?: boolean }} dados
 */
export async function criarNoticia(dados, executante = null) {
  const supabase = createAdminClient();

  if (!dados.titulo?.trim()) throw new Error('Título é obrigatório');

  const { data, error } = await supabase
    .from('noticias')
    .insert({
      titulo:     dados.titulo.trim(),
      resumo:     dados.resumo?.trim()     || null,
      conteudo:   dados.conteudo?.trim()   || null,
      imagem_url: dados.imagem_url?.trim() || null,
      publicado:  dados.publicado  ?? false,
      destaque:   dados.destaque   ?? false,
    })
    .select('id, titulo, resumo, imagem_url, publicado, destaque, created_at')
    .single();

  if (error) throw new Error(`Erro ao criar notícia: ${error.message}`);

  // Auditoria
  if (executante) {
    await auditService.log({
      user_id: executante.id,
      user_name: executante.nome || executante.name || 'Usuário',
      action: 'INSERT',
      tabela: 'noticias',
      registro_id: data.id,
      target: data.titulo,
      description: `Notícia "${data.titulo}" publicada`,
      dados_novos: data,
    });
  }

  return data;
}

// ============================================================
// ATUALIZAÇÃO
// ============================================================

/**
 * Atualiza dados de uma notícia (admin).
 * @param {string} id
 * @param {object} dados
 */
export async function atualizarNoticia(id, dados, executante = null) {
  const supabase = createAdminClient();

  // Buscar dados anteriores
  const { data: anterior } = await supabase
    .from('noticias')
    .select('*')
    .eq('id', id)
    .single();

  const permitidos = ['titulo', 'resumo', 'conteudo', 'imagem_url', 'publicado', 'destaque'];
  const update = Object.fromEntries(
    Object.entries(dados).filter(([k]) => permitidos.includes(k))
  );

  const { data: novo, error } = await supabase
    .from('noticias')
    .update(update)
    .eq('id', id)
    .select('id, titulo, resumo, imagem_url, publicado, destaque, updated_at')
    .single();

  if (error) throw new Error(`Erro ao atualizar notícia: ${error.message}`);

  // Auditoria
  if (executante && anterior) {
    await auditService.log({
      user_id: executante.id,
      user_name: executante.nome || executante.name || 'Usuário',
      action: 'UPDATE',
      tabela: 'noticias',
      registro_id: id,
      target: novo.titulo,
      description: `Notícia "${novo.titulo}" atualizada`,
      dados_anteriores: anterior,
      dados_novos: novo,
    });
  }

  return novo;
}

// ============================================================
// DELEÇÃO
// ============================================================

/**
 * Remove uma notícia (admin).
 * @param {string} id
 */
export async function deletarNoticia(id, executante = null) {
  const supabase = createAdminClient();

  const anterior = await buscarNoticiaPorId(id);

  const { error } = await supabase
    .from('noticias')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Erro ao deletar notícia: ${error.message}`);

  // Auditoria
  if (executante) {
    await auditService.log({
      user_id: executante.id,
      user_name: executante.nome || executante.name || 'Usuário',
      action: 'DELETE',
      tabela: 'noticias',
      registro_id: id,
      target: anterior.titulo,
      description: `Notícia "${anterior.titulo}" excluída`,
      dados_anteriores: anterior,
    });
  }

  return { sucesso: true };
}
