/**
 * GET    /api/noticias/[id]  — público (só se publicada) ou admin
 * PATCH  /api/noticias/[id]  — admin
 * DELETE /api/noticias/[id]  — admin
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { buscarNoticiaPorId, atualizarNoticia, deletarNoticia } from '@/lib/services/noticiasService';

async function getAdminProfile(supabase) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: perfil } = await supabase
    .from('users').select('*').eq('auth_id', user.id).single();
  return perfil?.role === 'admin' ? perfil : null;
}

export async function GET(request, { params }) {
  try {
    const noticia = await buscarNoticiaPorId(params.id);
    const supabase = await createServerClient();
    const admin = await getAdminProfile(supabase);

    if (!noticia.publicado && !admin) {
      return NextResponse.json({ erro: 'Não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ noticia });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 404 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const supabase = await createServerClient();
    const adminProfile = await getAdminProfile(supabase);
    if (!adminProfile) {
      return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });
    }

    const dados = await request.json();
    const noticia = await atualizarNoticia(params.id, dados, adminProfile);
    return NextResponse.json({ noticia });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const supabase = await createServerClient();
    const adminProfile = await getAdminProfile(supabase);
    if (!adminProfile) {
      return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });
    }

    await deletarNoticia(params.id, adminProfile);
    return NextResponse.json({ sucesso: true });
  } catch (err) {
    return NextResponse.json({ erro: err.message }, { status: 400 });
  }
}
