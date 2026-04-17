-- ============================================================
-- MIGRAÇÃO: noticias
-- Tabela de notícias gerenciadas pelo admin e exibidas no site.
-- ============================================================

CREATE TABLE IF NOT EXISTS noticias (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo       text NOT NULL,
  resumo       text,
  conteudo     text,
  imagem_url   text,
  publicado    boolean NOT NULL DEFAULT false,
  destaque     boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS noticias_publicado_idx ON noticias (publicado);
CREATE INDEX IF NOT EXISTS noticias_created_at_idx ON noticias (created_at DESC);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER noticias_updated_at
  BEFORE UPDATE ON noticias
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode ler notícias publicadas
CREATE POLICY "Noticias publicadas são públicas"
  ON noticias FOR SELECT
  USING (publicado = true);

-- Admins autenticados têm acesso total
CREATE POLICY "Admins têm acesso total a noticias"
  ON noticias FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid()
        AND role = 'admin'
    )
  );
