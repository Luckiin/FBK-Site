
create extension if not exists "pgcrypto";


drop table if exists public.contatos    cascade;
drop table if exists public.parceiros   cascade;
drop table if exists public.documentos  cascade;
drop table if exists public.ranking     cascade;
drop table if exists public.noticias    cascade;
drop table if exists public.exames      cascade;
drop table if exists public.inscricoes  cascade;
drop table if exists public.eventos     cascade;
drop table if exists public.users       cascade;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.get_user_role()   cascade;
drop function if exists public.get_user_id()     cascade;
drop function if exists public.set_updated_at()  cascade;



create table if not exists public.users (
  id              uuid primary key default gen_random_uuid(),
  auth_id         uuid unique references auth.users(id) on delete cascade,
  email           text not null unique,
  name            text not null default '',
  phone           text,
  role            text not null default 'atleta'
                  check (role in ('atleta', 'filial', 'admin')),

  registro        text,          -- número de registro (ex: 04767)
  anuidade        text not null default 'Ativo'
                  check (anuidade in ('Ativo', 'Inativo')),
  graduacao       text,          -- ex: Preta 1° DAN
  estilo          text,          -- ex: Kickboxing, Gojupu
  data_nascimento date,
  sexo            text check (sexo in ('M', 'F') or sexo is null),
  cpf             text,
  categoria       text,          -- categoria de peso/idade

  entidade        text,          -- nome da academia/entidade (ex: GRBK)
  academia_id     uuid,          -- FK para o registro da filial (preenchida depois)

  cnpj            text,
  nome_academia   text,
  responsavel     text,
  endereco        text,
  cidade          text,
  cep             text,
  estado          char(2) default 'BA',

  ativo           boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_users_auth_id   on public.users (auth_id);
create index if not exists idx_users_email     on public.users (email);
create index if not exists idx_users_role      on public.users (role);
create index if not exists idx_users_registro  on public.users (registro);
create index if not exists idx_users_academia  on public.users (academia_id);


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

create table if not exists public.auditoria (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  user_name text,
  target text,
  action text not null,
  description text,
  created_at timestamptz not null default now()
);

create index if not exists idx_auditoria_created_at on public.auditoria (created_at desc);
create index if not exists idx_auditoria_user_id on public.auditoria (user_id);

create index if not exists idx_eventos_tipo   on public.eventos (tipo);
create index if not exists idx_eventos_status on public.eventos (status);
create index if not exists idx_eventos_data   on public.eventos (data_inicio);


create table if not exists public.inscricoes (
  id              uuid primary key default gen_random_uuid(),
  evento_id       uuid not null references public.eventos(id) on delete cascade,
  user_id         uuid not null references public.users(id) on delete cascade,
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


create table if not exists public.exames (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  data_exame      date,
  graduacao_atual text,
  graduacao_nova  text,
  resultado       text check (resultado in ('aprovado', 'reprovado', 'pendente') or resultado is null),
  examinador      text,
  local           text,
  observacoes     text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_exames_user on public.exames (user_id);
create index if not exists idx_exames_data on public.exames (data_exame);


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


create table if not exists public.ranking (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  modalidade      text not null,
  categoria       text not null,
  pontos          integer not null default 0,
  posicao         integer,
  temporada       text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique(user_id, modalidade, categoria, temporada)
);

create index if not exists idx_ranking_modalidade on public.ranking (modalidade);
create index if not exists idx_ranking_temporada  on public.ranking (temporada);


create table if not exists public.documentos (
  id              uuid primary key default gen_random_uuid(),
  titulo          text not null,
  descricao       text,
  tipo            text not null default 'certificado'
                  check (tipo in ('certificado', 'comunicado', 'regulamento', 'estatuto', 'outro')),
  arquivo_url     text,
  publico         boolean not null default false,
  user_id         uuid references public.users(id) on delete set null,
  created_at      timestamptz not null default now()
);

create index if not exists idx_documentos_tipo    on public.documentos (tipo);
create index if not exists idx_documentos_publico on public.documentos (publico);


create table if not exists public.parceiros (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null,
  logo_url        text,
  site_url        text,
  ativo           boolean not null default true,
  ordem           integer default 0,
  created_at      timestamptz not null default now()
);


create table if not exists public.contatos (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null,
  email           text not null,
  assunto         text,
  mensagem        text not null,
  lida            boolean not null default false,
  created_at      timestamptz not null default now()
);



create or replace function public.get_user_role()
returns text language sql security definer stable as $$
  select role from public.users where auth_id = auth.uid() limit 1;
$$;

create or replace function public.get_user_id()
returns uuid language sql security definer stable as $$
  select id from public.users where auth_id = auth.uid() limit 1;
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

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
  on conflict (auth_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

drop trigger if exists trg_eventos_updated_at on public.eventos;
create trigger trg_eventos_updated_at
  before update on public.eventos
  for each row execute function public.set_updated_at();

drop trigger if exists trg_noticias_updated_at on public.noticias;
create trigger trg_noticias_updated_at
  before update on public.noticias
  for each row execute function public.set_updated_at();

drop trigger if exists trg_ranking_updated_at on public.ranking;
create trigger trg_ranking_updated_at
  before update on public.ranking
  for each row execute function public.set_updated_at();


alter table public.users       enable row level security;
alter table public.eventos     enable row level security;
alter table public.inscricoes  enable row level security;
alter table public.exames      enable row level security;
alter table public.noticias    enable row level security;
alter table public.ranking     enable row level security;
alter table public.documentos  enable row level security;
alter table public.parceiros   enable row level security;
alter table public.contatos    enable row level security;
alter table public.auditoria  enable row level security;

drop policy if exists "users: admin full access"         on public.users;
drop policy if exists "users: user reads own"            on public.users;
drop policy if exists "users: user updates own"          on public.users;
drop policy if exists "users: filial reads own athletes" on public.users;

drop policy if exists "eventos: public read"             on public.eventos;
drop policy if exists "eventos: admin full access"       on public.eventos;

drop policy if exists "inscricoes: admin full access"    on public.inscricoes;
drop policy if exists "inscricoes: user reads own"       on public.inscricoes;
drop policy if exists "inscricoes: user inserts own"     on public.inscricoes;

drop policy if exists "exames: admin full access"        on public.exames;
drop policy if exists "exames: user reads own"           on public.exames;

drop policy if exists "noticias: public read published"  on public.noticias;
drop policy if exists "noticias: admin full access"      on public.noticias;

drop policy if exists "ranking: public read"             on public.ranking;
drop policy if exists "ranking: admin full access"       on public.ranking;

drop policy if exists "documentos: public read"          on public.documentos;
drop policy if exists "documentos: user reads own"       on public.documentos;
drop policy if exists "documentos: admin full access"    on public.documentos;

drop policy if exists "parceiros: public read"           on public.parceiros;
drop policy if exists "parceiros: admin full access"     on public.parceiros;

drop policy if exists "contatos: anyone can insert"      on public.contatos;
drop policy if exists "contatos: admin reads all"        on public.contatos;

drop policy if exists "auditoria: anyone can insert"     on public.auditoria;
drop policy if exists "auditoria: all read"            on public.auditoria;


create policy "users: admin full access"
  on public.users for all
  using (public.get_user_role() = 'admin');

create policy "users: user reads own"
  on public.users for select
  using (auth_id = auth.uid());

create policy "users: user updates own"
  on public.users for update
  using (auth_id = auth.uid());

create policy "users: filial reads own athletes"
  on public.users for select
  using (
    public.get_user_role() = 'filial'
    and academia_id = public.get_user_id()
  );


create policy "eventos: public read"
  on public.eventos for select
  using (true);

create policy "eventos: admin full access"
  on public.eventos for all
  using (public.get_user_role() = 'admin');


create policy "inscricoes: admin full access"
  on public.inscricoes for all
  using (public.get_user_role() = 'admin');

create policy "inscricoes: user reads own"
  on public.inscricoes for select
  using (user_id = public.get_user_id());

create policy "inscricoes: user inserts own"
  on public.inscricoes for insert
  with check (user_id = public.get_user_id());


create policy "exames: admin full access"
  on public.exames for all
  using (public.get_user_role() = 'admin');

create policy "exames: user reads own"
  on public.exames for select
  using (user_id = public.get_user_id());


create policy "noticias: public read published"
  on public.noticias for select
  using (publicado = true);

create policy "noticias: admin full access"
  on public.noticias for all
  using (public.get_user_role() = 'admin');


create policy "ranking: public read"
  on public.ranking for select
  using (true);

create policy "ranking: admin full access"
  on public.ranking for all
  using (public.get_user_role() = 'admin');


create policy "documentos: public read"
  on public.documentos for select
  using (publico = true);

create policy "documentos: user reads own"
  on public.documentos for select
  using (user_id = public.get_user_id());

create policy "documentos: admin full access"
  on public.documentos for all
  using (public.get_user_role() = 'admin');


create policy "parceiros: public read"
  on public.parceiros for select
  using (ativo = true);

create policy "parceiros: admin full access"
  on public.parceiros for all
  using (public.get_user_role() = 'admin');


create policy "contatos: anyone can insert"
  on public.contatos for insert
  with check (true);

create policy "contatos: admin reads all"
  on public.contatos for all
  using (public.get_user_role() = 'admin');
create policy "auditoria: anyone can insert"
  on public.auditoria for insert
  with check (true);

create policy "auditoria: all read"
  on public.auditoria for select
  using (true);




