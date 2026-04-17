

import { createAdminClient } from '@/lib/supabase-server';
import { verificarSenha } from '@/lib/cryptoUtils';
import { buscarFilialPorAuthId, buscarFilialPorEmail } from './filialService';
import { buscarFiliadoPorTelefone, buscarFiliadoPorEmail, atualizarSenhaFiliado } from './filiadoService';
import { sendRecuperacaoSenha } from './emailService';



export async function loginFilial(supabase, email, senha) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) {
    console.error('[loginFilial] Supabase error:', error.message, '| status:', error.status);
    throw new Error(error.message ?? 'Email ou senha incorretos');
  }

  const filial = await buscarFilialPorAuthId(data.user.id);
  if (filial) {
    if (filial.status === 'pendente') {
      throw new Error('Seu cadastro está sendo analisado. Aguarde a aprovação.');
    }
    if (filial.status === 'reprovado') {
      throw new Error('Seu cadastro foi reprovado. Entre em contato com a federação.');
    }

    return {
      tipo: 'filial',
      usuario: filial,
      session: data.session,
    };
  }

  const { data: perfil, error: perfilError } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', data.user.id)
    .single();

  if (perfilError || !perfil) {
    throw new Error('Usuário não encontrado. Verifique o cadastro.');
  }

  return {
    tipo: perfil.role,
    usuario: perfil,
    session: data.session,
  };
}



export async function loginFiliado(telefone, senha) {
  const filiado = await buscarFiliadoPorTelefone(telefone);
  if (!filiado) throw new Error('Telefone ou senha incorretos');

  const senhaValida = await verificarSenha(senha, filiado.senha_hash);
  if (!senhaValida) throw new Error('Telefone ou senha incorretos');

  const { senha_hash, ...filiadoSeguro } = filiado;

  return {
    tipo: 'filiado',
    usuario: filiadoSeguro,
  };
}



export async function solicitarRecuperacaoSenha(email) {
  const supabase = createAdminClient();

  const filiado = await buscarFiliadoPorEmail(email);
  const filial = await buscarFilialPorEmail(email);
  const dono = filiado || filial;

  if (!dono) {
    console.log(`[AUTH] Recuperação solicitada para email inexistente: ${email}`);
    return { sucesso: true };
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

  await supabase.from('password_resets').delete().eq('email', email);

  const { error } = await supabase.from('password_resets').insert({
    email,
    token,
    expires_at: expiresAt.toISOString(),
  });

  if (error) throw new Error('Erro ao gerar token de recuperação');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetUrl = `${appUrl}/auth/redefinir-senha?token=${token}`;

  await sendRecuperacaoSenha({ to: email, nome: dono.nome, resetUrl }).catch(console.error);

  return { sucesso: true };
}


export async function redefinirSenha(token, novaSenha) {
  const supabase = createAdminClient();

  const { data: reset, error } = await supabase
    .from('password_resets')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !reset) throw new Error('Token inválido ou já utilizado');

  if (new Date(reset.expires_at) < new Date()) {
    await supabase.from('password_resets').delete().eq('token', token);
    throw new Error('Token expirado. Solicite um novo link de recuperação.');
  }

  if (novaSenha.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres');
  }

  const filiado = await buscarFiliadoPorEmail(reset.email);
  if (filiado) {
    await atualizarSenhaFiliado(filiado.id, novaSenha);
  } else {
    const filial = await buscarFilialPorEmail(reset.email);
    if (filial?.auth_id) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        filial.auth_id,
        { password: novaSenha }
      );
      if (authError) throw new Error('Erro ao atualizar senha da filial');
    }
  }

  await supabase.from('password_resets').delete().eq('token', token);

  return { sucesso: true };
}


export async function validarTokenReset(token) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('password_resets')
    .select('email, expires_at')
    .eq('token', token)
    .single();

  if (error || !data) return { valido: false };
  if (new Date(data.expires_at) < new Date()) return { valido: false };

  return { valido: true, email: data.email };
}
