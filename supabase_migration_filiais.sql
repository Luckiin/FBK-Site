-- ============================================================
-- MIGRAÇÃO: Sistema de Filiais e Filiados
-- Execute este script no SQL Editor do Supabase
-- ============================================================

-- ============================================================
-- 1. TABELA: filiais
-- ============================================================
CREATE TABLE IF NOT EXISTS public.filiais (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nome        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  telefone    TEXT,
  status      TEXT NOT NULL DEFAULT 'pendente'
              CHECK (status IN ('pendente', 'aprovado', 'reprovado')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.filiais IS 'Filiais da federação com fluxo de aprovação';
COMMENT ON COLUMN public.filiais.auth_id IS 'Referência ao usuário Supabase Auth da filial';
COMMENT ON COLUMN public.filiais.status IS 'pendente=aguardando aprovação, aprovado=acesso liberado, reprovado=acesso negado';

-- ============================================================
-- 2. TABELA: filiados
-- ============================================================
CREATE TABLE IF NOT EXISTS public.filiados (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filial_id        UUID NOT NULL REFERENCES public.filiais(id) ON DELETE CASCADE,
  cpf              TEXT NOT NULL UNIQUE,
  nome             TEXT NOT NULL,
  sexo             TEXT CHECK (sexo IN ('M', 'F', 'Outro')),
  data_nascimento  DATE,
  telefone         TEXT NOT NULL UNIQUE,
  email            TEXT,
  senha_hash       TEXT NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.filiados IS 'Filiados vinculados a filiais, com autenticação própria (telefone+senha)';
COMMENT ON COLUMN public.filiados.senha_hash IS 'Senha em PBKDF2 via Web Crypto API — nunca texto puro';

-- ============================================================
-- 3. TABELA: password_resets
-- ============================================================
CREATE TABLE IF NOT EXISTS public.password_resets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL,
  token       TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.password_resets IS 'Tokens de recuperação de senha com expiração de 15 minutos';

-- ============================================================
-- 4. TRIGGERS: updated_at automático
-- ============================================================

-- Reutiliza a função set_updated_at() se já existir
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_filiais_updated_at ON public.filiais;
CREATE TRIGGER trg_filiais_updated_at
  BEFORE UPDATE ON public.filiais
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_filiados_updated_at ON public.filiados;
CREATE TRIGGER trg_filiados_updated_at
  BEFORE UPDATE ON public.filiados
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.filiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.filiados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;

-- Filiais: admin vê tudo
DROP POLICY IF EXISTS "Admin full access filiais" ON public.filiais;
CREATE POLICY "Admin full access filiais" ON public.filiais
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

-- Filiais: filial lê/edita o próprio registro
DROP POLICY IF EXISTS "Filial reads own" ON public.filiais;
CREATE POLICY "Filial reads own" ON public.filiais
  FOR SELECT USING (auth_id = auth.uid());

DROP POLICY IF EXISTS "Filial updates own" ON public.filiais;
CREATE POLICY "Filial updates own" ON public.filiais
  FOR UPDATE USING (auth_id = auth.uid());

-- Filiados: acesso via service role (auth customizada, sem Supabase Auth)
-- As políticas abaixo permitem acesso apenas via service_role key (API routes)
DROP POLICY IF EXISTS "Service role full access filiados" ON public.filiados;
CREATE POLICY "Service role full access filiados" ON public.filiados
  FOR ALL
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admin reads filiados" ON public.filiados;
CREATE POLICY "Admin reads filiados" ON public.filiados
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.auth_id = auth.uid() AND u.role = 'admin'
    )
  );

-- Filial lê os próprios filiados (via join)
DROP POLICY IF EXISTS "Filial reads own filiados" ON public.filiados;
CREATE POLICY "Filial reads own filiados" ON public.filiados
  FOR SELECT
  USING (
    filial_id IN (
      SELECT f.id FROM public.filiais f
      WHERE f.auth_id = auth.uid()
    )
  );

-- Password resets: apenas via service role
DROP POLICY IF EXISTS "Service role manages resets" ON public.password_resets;
CREATE POLICY "Service role manages resets" ON public.password_resets
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- 6. ÍNDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_filiais_status ON public.filiais(status);
CREATE INDEX IF NOT EXISTS idx_filiais_email ON public.filiais(email);
CREATE INDEX IF NOT EXISTS idx_filiados_filial_id ON public.filiados(filial_id);
CREATE INDEX IF NOT EXISTS idx_filiados_telefone ON public.filiados(telefone);
CREATE INDEX IF NOT EXISTS idx_filiados_cpf ON public.filiados(cpf);
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON public.password_resets(token);
CREATE INDEX IF NOT EXISTS idx_password_resets_email ON public.password_resets(email);

-- ============================================================
-- FIM DA MIGRAÇÃO
-- ============================================================
