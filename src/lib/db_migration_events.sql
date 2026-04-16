-- ================================================================
-- FBK - Migração segura: Gestão de Eventos (Novos Campos)
-- Pode ser executada em banco existente sem apagar tabelas
-- ================================================================

-- 1. ADICIONAR COLUNAS DE DIVULGAÇÃO E LINKS
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'eventos'
  ) THEN
    ALTER TABLE public.eventos
      ADD COLUMN IF NOT EXISTS data_inicio_div date,
      ADD COLUMN IF NOT EXISTS data_fim_div date,
      ADD COLUMN IF NOT EXISTS link_resultados text,
      ADD COLUMN IF NOT EXISTS link_regulamento text,
      ADD COLUMN IF NOT EXISTS link_certificados text;
  END IF;
END $$;

-- 2. PREENCHER DADOS EXISTENTES SEM SOBRESCREVER O QUE JÁ ESTÁ PREENCHIDO
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'eventos'
  ) THEN
    UPDATE public.eventos
    SET
      data_inicio_div = COALESCE(data_inicio_div, CAST(created_at AS date)),
      data_fim_div = COALESCE(
        data_fim_div,
        CASE
          WHEN data_inicio IS NOT NULL THEN (data_inicio + 30)
          ELSE CAST(created_at AS date) + 30
        END
      )
    WHERE data_inicio_div IS NULL OR data_fim_div IS NULL;
  END IF;
END $$;

-- 3. CRIAR ÍNDICE PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_eventos_divulgacao
ON public.eventos (data_inicio_div, data_fim_div);

-- FIM DA MIGRAÇÃO
