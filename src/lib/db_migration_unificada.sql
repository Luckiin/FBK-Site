-- ================================================================
-- FBK - MIGRACAO UNIFICADA SEGURA
-- Reune:
-- 1. Sistema de filiais e filiados
-- 2. Ajustes na tabela public.users
-- 3. Novos campos de eventos
--
-- USO:
-- - Execute este script no SQL Editor do Supabase
-- - Seguro para banco existente
-- - Nao remove tabelas nem apaga dados existentes
-- - Nao execute o supabase_schema.sql em banco ja populado
-- ================================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- 1. TABELA: filiais
-- ============================================================

create table if not exists public.filiais (
  id          uuid primary key default gen_random_uuid(),
  auth_id     uuid references auth.users(id) on delete set null,
  nome        text not null,
  email       text not null unique,
  telefone    text,
  status      text not null default 'pendente'
              check (status in ('pendente', 'aprovado', 'reprovado')),
  motivo_reprovacao text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'filiais'
  ) then
    alter table public.filiais
      add column if not exists auth_id uuid references auth.users(id) on delete set null,
      add column if not exists nome text,
      add column if not exists email text,
      add column if not exists telefone text,
      add column if not exists status text,
      add column if not exists motivo_reprovacao text,
      add column if not exists created_at timestamptz not null default now(),
      add column if not exists updated_at timestamptz not null default now();

    alter table public.filiais
      alter column nome set not null,
      alter column email set not null,
      alter column status set default 'pendente';

    alter table public.filiais
      drop constraint if exists filiais_status_check;

    alter table public.filiais
      add constraint filiais_status_check
      check (status in ('pendente', 'aprovado', 'reprovado'));
  end if;
end $$;

create unique index if not exists idx_filiais_email_unique on public.filiais(email);
create index if not exists idx_filiais_status on public.filiais(status);
create index if not exists idx_filiais_email on public.filiais(email);

comment on table public.filiais is 'Filiais da federacao com fluxo de aprovacao';
comment on column public.filiais.auth_id is 'Referencia ao usuario Supabase Auth da filial';
comment on column public.filiais.status is 'pendente=aguardando aprovacao, aprovado=acesso liberado, reprovado=acesso negado';

-- ============================================================
-- 2. TABELA: filiados
-- ============================================================

create table if not exists public.filiados (
  id               uuid primary key default gen_random_uuid(),
  filial_id        uuid not null references public.filiais(id) on delete cascade,
  cpf              text not null unique,
  nome             text not null,
  sexo             text check (sexo in ('M', 'F', 'Outro')),
  data_nascimento  date,
  telefone         text not null unique,
  email            text,
  senha_hash       text not null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'filiados'
  ) then
    alter table public.filiados
      add column if not exists filial_id uuid references public.filiais(id) on delete cascade,
      add column if not exists cpf text,
      add column if not exists nome text,
      add column if not exists sexo text,
      add column if not exists data_nascimento date,
      add column if not exists telefone text,
      add column if not exists email text,
      add column if not exists senha_hash text,
      add column if not exists created_at timestamptz not null default now(),
      add column if not exists updated_at timestamptz not null default now();

    alter table public.filiados
      drop constraint if exists filiados_sexo_check;

    alter table public.filiados
      add constraint filiados_sexo_check
      check (sexo in ('M', 'F', 'Outro') or sexo is null);
  end if;
end $$;

create unique index if not exists idx_filiados_cpf_unique on public.filiados(cpf);
create unique index if not exists idx_filiados_telefone_unique on public.filiados(telefone);
create index if not exists idx_filiados_filial_id on public.filiados(filial_id);
create index if not exists idx_filiados_telefone on public.filiados(telefone);
create index if not exists idx_filiados_cpf on public.filiados(cpf);

comment on table public.filiados is 'Filiados vinculados a filiais, com autenticacao propria (telefone+senha)';
comment on column public.filiados.senha_hash is 'Senha em PBKDF2 via Web Crypto API - nunca texto puro';

-- ============================================================
-- 3. TABELA: password_resets
-- ============================================================

create table if not exists public.password_resets (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  token       text not null unique,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'password_resets'
  ) then
    alter table public.password_resets
      add column if not exists email text,
      add column if not exists token text,
      add column if not exists expires_at timestamptz,
      add column if not exists created_at timestamptz not null default now();
  end if;
end $$;

create unique index if not exists idx_password_resets_token_unique on public.password_resets(token);
create index if not exists idx_password_resets_token on public.password_resets(token);
create index if not exists idx_password_resets_email on public.password_resets(email);

comment on table public.password_resets is 'Tokens de recuperacao de senha com expiracao de 15 minutos';

-- ============================================================
-- 4. AJUSTES NA TABELA: users
-- ============================================================

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'users'
  ) then
    alter table public.users
      add column if not exists foto_url text,
      add column if not exists data_graduacao date,
      add column if not exists nome_professor text;

    alter table public.users
      drop constraint if exists users_sexo_check;

    alter table public.users
      add constraint users_sexo_check
      check (
        sexo in ('M', 'F', 'Masculino', 'Feminino', 'Outro')
        or sexo is null
      );
  end if;
end $$;

-- ============================================================
-- 5. AJUSTES NA TABELA: eventos
-- ============================================================

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'eventos'
  ) then
    alter table public.eventos
      add column if not exists data_inicio_div date,
      add column if not exists data_fim_div date,
      add column if not exists link_resultados text,
      add column if not exists link_regulamento text,
      add column if not exists link_certificados text;

    update public.eventos
    set
      data_inicio_div = coalesce(data_inicio_div, cast(created_at as date)),
      data_fim_div = coalesce(
        data_fim_div,
        case
          when data_inicio is not null then (data_inicio + 30)
          else cast(created_at as date) + 30
        end
      )
    where data_inicio_div is null or data_fim_div is null;
  end if;
end $$;

create index if not exists idx_eventos_divulgacao
on public.eventos (data_inicio_div, data_fim_div);

-- ============================================================
-- 6. FUNCOES E TRIGGERS
-- ============================================================

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (auth_id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'atleta')
  )
  on conflict (email) do update
  set auth_id = excluded.auth_id,
      updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists trg_filiais_updated_at on public.filiais;
create trigger trg_filiais_updated_at
  before update on public.filiais
  for each row execute function public.set_updated_at();

drop trigger if exists trg_filiados_updated_at on public.filiados;
create trigger trg_filiados_updated_at
  before update on public.filiados
  for each row execute function public.set_updated_at();

-- ============================================================
-- 7. RLS E POLICIES
-- ============================================================

alter table public.filiais enable row level security;
alter table public.filiados enable row level security;
alter table public.password_resets enable row level security;

drop policy if exists "Admin full access filiais" on public.filiais;
create policy "Admin full access filiais" on public.filiais
  for all
  using (
    exists (
      select 1 from public.users u
      where u.auth_id = auth.uid() and u.role = 'admin'
    )
  );

drop policy if exists "Filial reads own" on public.filiais;
create policy "Filial reads own" on public.filiais
  for select using (auth_id = auth.uid());

drop policy if exists "Filial updates own" on public.filiais;
create policy "Filial updates own" on public.filiais
  for update using (auth_id = auth.uid());

drop policy if exists "Service role full access filiados" on public.filiados;
create policy "Service role full access filiados" on public.filiados
  for all
  using (auth.role() = 'service_role');

drop policy if exists "Admin reads filiados" on public.filiados;
create policy "Admin reads filiados" on public.filiados
  for select
  using (
    exists (
      select 1 from public.users u
      where u.auth_id = auth.uid() and u.role = 'admin'
    )
  );

drop policy if exists "Filial reads own filiados" on public.filiados;
create policy "Filial reads own filiados" on public.filiados
  for select
  using (
    filial_id in (
      select f.id from public.filiais f
      where f.auth_id = auth.uid()
    )
  );

drop policy if exists "Service role manages resets" on public.password_resets;
create policy "Service role manages resets" on public.password_resets
  for all
  using (auth.role() = 'service_role');

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'users'
  ) then
    drop policy if exists "users: admin can insert" on public.users;
    create policy "users: admin can insert"
      on public.users for insert
      with check (public.get_user_role() = 'admin');
  end if;
end $$;

-- ============================================================
-- FIM
-- ============================================================
