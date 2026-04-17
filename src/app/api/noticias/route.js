/**
 * GET  /api/noticias  — público: retorna notícias publicadas
 *                     — admin: retorna todas (publicadas + rascunho)
 * POST /api/noticias  — admin: cria nova notícia
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { listarNoticias, criarNoticia } from '@/lib/services/noticiasService';

async function isAdmin(supabase) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: perfil } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  return perfil?.role === 'admin';
}

export async function GET(request) {
  try {
    const supabase = await createServerClient();
    const admin = await isAdmin(supabase);

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;

    // Admins veem tudo; público vê só publicadas
    const filtros = admin ? { limit } : { publicado: true, limit };
    const noticias = await listarNoticias(filtros);

    return NextResponse.json({ noticias });
  } catch (err) {
    // Tabela ainda não existe ou outro erro de DB — retorna vazio sem quebrar o site
    console.error('[GET /api/noticias]', err.message);
    return NextResponse.json({ noticias: [] });
  }
}

export async function POST(request) {
  try {
    const supabase = await createServerClient();
    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });
    }

    const dados = await request.json();
    const noticia = await criarNoticia(dados);

    return NextResponse.json({ noticia }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 400 });
  }
}
