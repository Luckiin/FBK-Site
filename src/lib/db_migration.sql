-- ================================================================
-- FBK - Migração: Cadastro de Atleta
-- Execute este script no SQL Editor do Supabase
-- ================================================================

-- 1. ADICIONAR COLUNAS FALTANTES NA TABELA USERS
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS foto_url text,
ADD COLUMN IF NOT EXISTS data_graduacao date,
ADD COLUMN IF NOT EXISTS nome_professor text;

-- 2. AJUSTAR CONSTRAINT DE SEXO (OPCIONAL - CASO QUEIRA SUPORTAR MAIS OPÇÕES)
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_sexo_check;

ALTER TABLE public.users 
ADD CONSTRAINT users_sexo_check 
CHECK (sexo IN ('Masculino', 'Feminino', 'Outro') OR sexo IS NULL);

-- 3. ATUALIZAR TRIGGER DE SINCRONIZAÇÃO DE USUÁRIOS
-- Isso garante que se o admin criar o perfil antes do usuário se registrar no Auth,
-- o Auth.id seja vinculado corretamente ao perfil pré-existente via e-mail.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'atleta')
  )
  ON CONFLICT (email) DO UPDATE 
  SET auth_id = EXCLUDED.auth_id,
      updated_at = NOW();
  RETURN new;
END;
$$;

-- 4. DAR PERMISSÕES PARA ADMIN E FILIAL INSERIR NA USERS
-- (Caso não existam políticas de INSERT para o admin, as policies de ALL já cobrem)
-- Mas para garantir que o Admin Client (ou admin logado) consiga criar atletas manualmente:
DROP POLICY IF EXISTS "users: admin can insert" ON public.users;
CREATE POLICY "users: admin can insert"
  ON public.users FOR INSERT
  WITH CHECK (public.get_user_role() = 'admin');

-- FIM DA MIGRAÇÃO
