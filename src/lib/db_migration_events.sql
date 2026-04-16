-- ================================================================
-- FBK - Migração: Gestão de Eventos (Novos Campos)
-- Execute este script no SQL Editor do Supabase
-- ================================================================

-- 1. ADICIONAR COLUNAS DE DIVULGAÇÃO E LINKS
ALTER TABLE public.eventos 
ADD COLUMN IF NOT EXISTS data_inicio_div date,
ADD COLUMN IF NOT EXISTS data_fim_div date,
ADD COLUMN IF NOT EXISTS link_resultados text,
ADD COLUMN IF NOT EXISTS link_regulamento text,
ADD COLUMN IF NOT EXISTS link_certificados text;

-- 2. COPIAR DATAS EXISTENTES (PARA NÃO QUEBRAR O QUE JÁ TEM)
-- Se já houver eventos, assume que a divulgação começa na criação e termina 30 dias após o início do evento.
UPDATE public.eventos 
SET data_inicio_div = CAST(created_at AS date),
    data_fim_div = data_inicio + INTERVAL '30 days'
WHERE data_inicio_div IS NULL;

-- 3. CRIAR ÍNDICES PARA PERFORMANCE NO FILTRO DE DIVULGAÇÃO
CREATE INDEX IF NOT EXISTS idx_eventos_divulgacao 
ON public.eventos (data_inicio_div, data_fim_div);

-- FIM DA MIGRAÇÃO
