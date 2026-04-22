import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase-server';
import { verifyToken } from '@/lib/cryptoUtils';
import { buscarFilialPorAuthId } from '@/lib/services/filialService';
import { auditService } from '@/lib/services/auditService';

export async function GET(request) {
  try {
    const supabase = await createServerClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    let currentUser = null;
    let userRole = null;

    if (authUser) {
      const filial = await buscarFilialPorAuthId(authUser.id);
      if (filial) {
        currentUser = filial;
        userRole = 'filial';
      } else {
        const { data: perfil } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', authUser.id)
          .single();
        if (perfil) {
          currentUser = perfil;
          userRole = perfil.role;
        }
      }
    }

    // Role-based logic
    if (!userRole) return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const tabela = searchParams.get('tabela');
    const action = searchParams.get('action');

    const filter = {};
    if (tabela) filter.tabela = tabela;
    if (action) filter.action = action;

    if (userRole === 'filial') {
      // Filial vê tudo o que tem o seu filial_id (dela mesma e de seus atletas)
      filter.filial_id = currentUser.id;
    } 
    // Admin não tem filtro de filial_id, vê tudo.

    const logs = await auditService.getAll(filter);
    return NextResponse.json(logs);

  } catch (err) {
    console.error('[/api/auditoria]', err);
    return NextResponse.json({ erro: err.message }, { status: 500 });
  }
}
