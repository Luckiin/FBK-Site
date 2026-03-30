-- ============================================================
-- FBK - Federação Baiana de Kickboxing
-- Schema Supabase (PostgreSQL)
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================================

-- Habilitar extensão para UUID
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- 1. USUÁRIOS (atletas, filiais, admins)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.users (
  id              uuid primary key default gen_random_uuid(),
  auth_id         uuid unique,                        -- referência ao auth.users do Supabase
  name            text not null,
  email           text not null unique,
  phone           text,
  role            text not null default 'atleta'      -- 'atleta' | 'filial' | 'admin'
                  check (role in ('atleta', 'filial', 'admin')),

  -- Documentos
  cpf             text,                               -- CPF (apenas dígitos)
  cnpj            text,                               -- CNPJ para filiais
  rm              text,                               -- Registro de Matrícula

  -- Endereço
  endereco        text,
  cidade          text,
  cep             text,
  estado          char(2) default 'BA',

  -- Dados extras do atleta
  data_nascimento date,
  sexo            text check (sexo in ('M', 'F', null)),
  categoria       text,                               -- categoria de peso/idade
  graduacao       text,                               -- faixa/graduação
  academia_id     uuid,                               -- referência à filial

  -- Dados extras da filial
  nome_academia   text,
  responsavel     text,

  ativo           boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_users_email    on public.users (email);
create index if not exists idx_users_role     on public.users (role);
create index if not exists idx_users_cpf      on public.users (cpf);
create index if not exists idx_users_academia on public.users (academia_id);

-- ─────────────────────────────────────────────────────────────
-- 2. EVENTOS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.eventos (
  id              uuid primary key default gen_random_uuid(),
  titulo          text not null,
  descricao       text,
  tipo            text not null default 'competicao'
                  check (tipo in ('competicao', 'curso', 'seminario', 'acao_social')),
  data_inicio     date,
  data_fim        date,
  local           text,
  cidade          text,
  estado          char(2) default 'BA',
  status          text not null default 'agendado'
                  check (status in ('agendado', 'em_andamento', 'concluido', 'cancelado')),
  imagem_url      text,
  destaque        boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_eventos_tipo   on public.eventos (tipo);
create index if not exists idx_eventos_status on public.eventos (status);
create index if not exists idx_eventos_data   on public.eventos (data_inicio);

-- ─────────────────────────────────────────────────────────────
-- 3. INSCRIÇÕES EM EVENTOS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.inscricoes (
  id              uuid primary key default gen_random_uuid(),
  evento_id       uuid not null references public.eventos (id) on delete cascade,
  user_id         uuid not null references public.users (id) on delete cascade,
  categoria       text,
  modalidade      text,
  peso            text,
  status          text not null default 'pendente'
                  check (status in ('pendente', 'confirmada', 'cancelada')),
  created_at      timestamptz not null default now(),

  unique(evento_id, user_id)
);

create index if not exists idx_inscricoes_evento on public.inscricoes (evento_id);
create index if not exists idx_inscricoes_user   on public.inscricoes (user_id);

-- ─────────────────────────────────────────────────────────────
-- 4. NOTÍCIAS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.noticias (
  id              uuid primary key default gen_random_uuid(),
  titulo          text not null,
  resumo          text,
  conteudo        text,
  imagem_url      text,
  publicado       boolean not null default false,
  data_publicacao timestamptz,
  autor           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_noticias_publicado on public.noticias (publicado);

-- ─────────────────────────────────────────────────────────────
-- 5. RANKING
-- ─────────────────────────────────────────────────────────────
create table if not exists public.ranking (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users (id) on delete cascade,
  modalidade      text not null,
  categoria       text not null,
  pontos          integer not null default 0,
  posicao         integer,
  temporada       text,                               -- ex: "2026"
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  unique(user_id, modalidade, categoria, temporada)
);

create index if not exists idx_ranking_modalidade on public.ranking (modalidade);
create index if not exists idx_ranking_temporada  on public.ranking (temporada);

-- ─────────────────────────────────────────────────────────────
-- 6. DOCUMENTOS (certificados, comunicados, etc.)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.documentos (
  id              uuid primary key default gen_random_uuid(),
  titulo          text not null,
  descricao       text,
  tipo            text not null default 'certificado'
                  check (tipo in ('certificado', 'comunicado', 'regulamento', 'estatuto', 'outro')),
  arquivo_url     text,
  publico         boolean not null default false,      -- visível sem login?
  user_id         uuid references public.users (id) on delete set null,  -- null = documento geral
  created_at      timestamptz not null default now()
);

create index if not exists idx_documentos_tipo    on public.documentos (tipo);
create index if not exists idx_documentos_publico on public.documentos (publico);

-- ─────────────────────────────────────────────────────────────
-- 7. PARCEIROS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.parceiros (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null,
  logo_url        text,
  site_url        text,
  ativo           boolean not null default true,
  ordem           integer default 0,
  created_at      timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- 8. CONTATO (mensagens do formulário)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.contatos (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null,
  email           text not null,
  assunto         text,
  mensagem        text not null,
  lida            boolean not null default false,
  created_at      timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- 9. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────

-- Ativar RLS em todas as tabelas
alter table public.users       enable row level security;
alter table public.eventos     enable row level security;
alter table public.inscricoes  enable row level security;
alter table public.noticias    enable row level security;
alter table public.ranking     enable row level security;
alter table public.documentos  enable row level security;
alter table public.parceiros   enable row level security;
alter table public.contatos    enable row level security;

-- Helper: retorna o role do usuário autenticado
create or replace function public.get_user_role()
returns text language sql security definer as $$
  select role from public.users where auth_id = auth.uid() limit 1;
$$;

-- Helper: retorna o id do usuário autenticado
create or replace function public.get_user_id()
returns uuid language sql security definer as $$
  select id from public.users where auth_id = auth.uid() limit 1;
$$;

-- ── users ────────────────────────────────────────────────────
create policy "users: admin full access"
  on public.users for all
  using (public.get_user_role() = 'admin');

create policy "users: user reads own"
  on public.users for select
  using (auth_id = auth.uid());

create policy "users: user updates own"
  on public.users for update
  using (auth_id = auth.uid());

-- Filial pode ver atletas da sua academia
create policy "users: filial reads own athletes"
  on public.users for select
  using (
    public.get_user_role() = 'filial'
    and academia_id = public.get_user_id()
  );

-- ── eventos ──────────────────────────────────────────────────
create policy "eventos: public read"
  on public.eventos for select
  using (true);

create policy "eventos: admin full access"
  on public.eventos for all
  using (public.get_user_role() = 'admin');

-- ── inscricoes ───────────────────────────────────────────────
create policy "inscricoes: admin full access"
  on public.inscricoes for all
  using (public.get_user_role() = 'admin');

create policy "inscricoes: user reads own"
  on public.inscricoes for select
  using (user_id = public.get_user_id());

create policy "inscricoes: user inserts own"
  on public.inscricoes for insert
  with check (user_id = public.get_user_id());

-- ── noticias ─────────────────────────────────────────────────
create policy "noticias: public read published"
  on public.noticias for select
  using (publicado = true);

create policy "noticias: admin full access"
  on public.noticias for all
  using (public.get_user_role() = 'admin');

-- ── ranking ──────────────────────────────────────────────────
create policy "ranking: public read"
  on public.ranking for select
  using (true);

create policy "ranking: admin full access"
  on public.ranking for all
  using (public.get_user_role() = 'admin');

-- ── documentos ───────────────────────────────────────────────
create policy "documentos: public read public docs"
  on public.documentos for select
  using (publico = true);

create policy "documentos: user reads own docs"
  on public.documentos for select
  using (user_id = public.get_user_id());

create policy "documentos: admin full access"
  on public.documentos for all
  using (public.get_user_role() = 'admin');

-- ── parceiros ────────────────────────────────────────────────
create policy "parceiros: public read"
  on public.parceiros for select
  using (ativo = true);

create policy "parceiros: admin full access"
  on public.parceiros for all
  using (public.get_user_role() = 'admin');

-- ── contatos ─────────────────────────────────────────────────
create policy "contatos: anyone can insert"
  on public.contatos for insert
  with check (true);

create policy "contatos: admin reads all"
  on public.contatos for all
  using (public.get_user_role() = 'admin');

-- ─────────────────────────────────────────────────────────────
-- 10. TRIGGERS: updated_at automático
-- ─────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

create trigger trg_eventos_updated_at
  before update on public.eventos
  for each row execute function public.set_updated_at();

create trigger trg_noticias_updated_at
  before update on public.noticias
  for each row execute function public.set_updated_at();

create trigger trg_ranking_updated_at
  before update on public.ranking
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 11. STORAGE BUCKETS (configurar no Dashboard > Storage)
-- ─────────────────────────────────────────────────────────────
-- Nome: fbk-docs     (private)  — certificados, documentos internos
-- Nome: fbk-public   (public)   — imagens do site, logos, banners
--
-- insert into storage.buckets (id, name, public) values ('fbk-docs', 'fbk-docs', false);
-- insert into storage.buckets (id, name, public) values ('fbk-public', 'fbk-public', true);

-- ─────────────────────────────────────────────────────────────
-- FIM DO SCHEMA
-- ─────────────────────────────────────────────────────────────
