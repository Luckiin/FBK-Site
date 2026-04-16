/**
 * GET /api/auth/me
 * Retorna o usuário logado (filial via Supabase Auth ou filiado via JWT cookie).
 * Usado pelo AuthContext no cliente para hidratar o estado de sessão.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase-server';
import { verifyToken } from '@/lib/cryptoUtils';
import { buscarFilialPorAuthId } from '@/lib/services/filialService';
import { buscarFiliadoPorId } from '@/lib/services/filiadoService';

export async function GET() {
  try {
    // 1. Verificar sessão Supabase (filial ou admin legado)
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Verificar se é filial
      const filial = await buscarFilialPorAuthId(user.id);
      if (filial) {
        return NextResponse.json({
          autenticado: true,
          tipo: 'filial',
          usuario: filial,
        });
      }

      // Verificar se é admin/usuário legado
      const { data: perfil } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', user.id)
        .single();

      if (perfil) {
        return NextResponse.json({
          autenticado: true,
          tipo: perfil.role,
          usuario: perfil,
        });
      }
    }

    // 2. Verificar cookie JWT (filiado)
    const cookieStore = cookies();
    const filiadoToken = cookieStore.get('filiado-session')?.value;

    if (filiadoToken) {
      const payload = await verifyToken(filiadoToken);
      if (payload?.sub) {
        const filiado = await buscarFiliadoPorId(payload.sub);
        if (filiado) {
          return NextResponse.json({
            autenticado: true,
            tipo: 'filiado',
            usuario: filiado,
          });
        }
      }
    }

    // Não autenticado
    return NextResponse.json({ autenticado: false, usuario: null });
  } catch (err) {
    console.error('[/api/auth/me]', err);
    return NextResponse.json({ autenticado: false, usuario: null });
  }
}
