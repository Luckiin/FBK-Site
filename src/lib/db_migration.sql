-- ================================================================
-- FBK - Migração segura: Cadastro de Atleta
-- Pode ser executada em banco existente sem apagar tabelas
-- ================================================================

-- 1. ADICIONAR COLUNAS FALTANTES NA TABELA USERS
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'users'
  ) THEN
    ALTER TABLE public.users
      ADD COLUMN IF NOT EXISTS foto_url text,
      ADD COLUMN IF NOT EXISTS data_graduacao date,
      ADD COLUMN IF NOT EXISTS nome_professor text;
  END IF;
END $$;

-- 2. AJUSTAR CONSTRAINT DE SEXO
-- Compatível tanto com dados antigos ('M', 'F') quanto novos rótulos por extenso.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'users'
  ) THEN
    ALTER TABLE public.users
      DROP CONSTRAINT IF EXISTS users_sexo_check;

    ALTER TABLE public.users
      ADD CONSTRAINT users_sexo_check
      CHECK (
        sexo IN ('M', 'F', 'Masculino', 'Feminino', 'Outro')
        OR sexo IS NULL
      );
  END IF;
END $$;

-- 3. ATUALIZAR TRIGGER DE SINCRONIZAÇÃO DE USUÁRIOS
-- Vincula auth_id em perfis já existentes pelo mesmo e-mail, sem sobrescrever role/name.
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. GARANTIR POLICY DE INSERT PARA ADMIN
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'users'
  ) THEN
    DROP POLICY IF EXISTS "users: admin can insert" ON public.users;
    CREATE POLICY "users: admin can insert"
      ON public.users FOR INSERT
      WITH CHECK (public.get_user_role() = 'admin');
  END IF;
END $$;

-- FIM DA MIGRAÇÃO
