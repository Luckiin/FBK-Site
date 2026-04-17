/**
 * noticiasService.js
 * Lógica de negócio para notícias do site.
 */

import { createAdminClient } from '@/lib/supabase-server';

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
export async function criarNoticia(dados) {
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
export async function atualizarNoticia(id, dados) {
  const supabase = createAdminClient();

  const permitidos = ['titulo', 'resumo', 'conteudo', 'imagem_url', 'publicado', 'destaque'];
  const update = Object.fromEntries(
    Object.entries(dados).filter(([k]) => permitidos.includes(k))
  );

  const { data, error } = await supabase
    .from('noticias')
    .update(update)
    .eq('id', id)
    .select('id, titulo, resumo, imagem_url, publicado, destaque, updated_at')
    .single();

  if (error) throw new Error(`Erro ao atualizar notícia: ${error.message}`);
  return data;
}

// ============================================================
// DELEÇÃO
// ============================================================

/**
 * Remove uma notícia (admin).
 * @param {string} id
 */
export async function deletarNoticia(id) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('noticias')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Erro ao deletar notícia: ${error.message}`);
  return { sucesso: true };
}
