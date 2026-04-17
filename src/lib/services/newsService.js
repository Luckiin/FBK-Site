import { createAdminClient } from '@/lib/supabase-server';

export async function listarNoticias({ somentePublicadas = false, limit = null } = {}) {
  const supabase = createAdminClient();
  let query = supabase
    .from('noticias')
    .select('*')
    .order('data_publicacao', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (somentePublicadas) query = query.eq('publicado', true);
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new Error(`Erro ao listar noticias: ${error.message}`);
  return data || [];
}

export async function buscarNoticiaPorId(id) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('noticias')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Noticia nao encontrada: ${error.message}`);
  return data;
}

export async function salvarNoticia(dados) {
  const supabase = createAdminClient();
  const payload = {
    titulo: dados.titulo?.trim() || '',
    resumo: dados.resumo?.trim() || null,
    conteudo: dados.conteudo?.trim() || null,
    imagem_url: dados.imagem_url?.trim() || null,
    publicado: !!dados.publicado,
    data_publicacao: dados.publicado
      ? (dados.data_publicacao || new Date().toISOString())
      : null,
    autor: dados.autor?.trim() || null,
  };

  if (!payload.titulo) throw new Error('Titulo obrigatorio');

  if (dados.id) {
    const { data, error } = await supabase
      .from('noticias')
      .update(payload)
      .eq('id', dados.id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar noticia: ${error.message}`);
    return data;
  }

  const { data, error } = await supabase
    .from('noticias')
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(`Erro ao criar noticia: ${error.message}`);
  return data;
}

export async function deletarNoticia(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from('noticias').delete().eq('id', id);
  if (error) throw new Error(`Erro ao deletar noticia: ${error.message}`);
  return { sucesso: true };
}
