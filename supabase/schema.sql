-- Schema para Óptima Assist
-- Ejecutar en el SQL Editor de Supabase

-- Tabla de profesionales
create table if not exists public.profesionales (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  especialidad text not null,
  email text not null unique,
  created_at timestamptz default now()
);

-- Tabla de pacientes
create table if not exists public.pacientes (
  id uuid primary key default gen_random_uuid(),
  rut text not null unique,
  nombre text not null,
  apellido text not null,
  telefono text,
  email text,
  profesional_id uuid not null references public.profesionales(id) on delete cascade,
  created_at timestamptz default now()
);

-- Tipo de estado
drop type if exists estado_sesion cascade;
create type estado_sesion as enum (
  'contactando',
  'agendado',
  'atendido',
  'esperando',
  'completo',
  'abandono',
  'recuperado'
);

-- Tabla de sesiones
create table if not exists public.sesiones (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references public.pacientes(id) on delete cascade,
  profesional_id uuid not null references public.profesionales(id) on delete cascade,
  fecha timestamptz not null default now(),
  estado estado_sesion not null default 'contactando',
  created_at timestamptz default now()
);

-- Índices para performance
create index if not exists idx_pacientes_profesional on public.pacientes(profesional_id);
create index if not exists idx_sesiones_paciente on public.sesiones(paciente_id);
create index if not exists idx_sesiones_profesional on public.sesiones(profesional_id);
create index if not exists idx_sesiones_fecha on public.sesiones(fecha desc);

-- Row Level Security (RLS)
alter table public.profesionales enable row level security;
alter table public.pacientes enable row level security;
alter table public.sesiones enable row level security;

-- Políticas: el profesional autenticado solo ve sus propios datos
-- Vincular auth.users con profesionales via email
create policy "Profesional ve su perfil" on public.profesionales
  for select using (email = auth.jwt() ->> 'email');

create policy "Profesional ve sus pacientes" on public.pacientes
  for all using (
    profesional_id = (
      select id from public.profesionales where email = auth.jwt() ->> 'email'
    )
  );

create policy "Profesional ve sus sesiones" on public.sesiones
  for all using (
    profesional_id = (
      select id from public.profesionales where email = auth.jwt() ->> 'email'
    )
  );

-- Función auxiliar para obtener pacientes con su estado actual
create or replace function public.pacientes_con_estado(prof_id uuid)
returns table (
  id uuid,
  rut text,
  nombre text,
  apellido text,
  telefono text,
  email text,
  profesional_id uuid,
  estado_actual estado_sesion,
  fecha_ultima_sesion timestamptz,
  sesion_id uuid
)
language sql
security definer
as $$
  select
    p.id,
    p.rut,
    p.nombre,
    p.apellido,
    p.telefono,
    p.email,
    p.profesional_id,
    coalesce(s.estado, 'contactando'::estado_sesion) as estado_actual,
    s.fecha as fecha_ultima_sesion,
    s.id as sesion_id
  from public.pacientes p
  left join lateral (
    select estado, fecha, id
    from public.sesiones
    where paciente_id = p.id
      and estado != 'nota'
    order by fecha desc
    limit 1
  ) s on true
  where p.profesional_id = prof_id
  order by p.apellido, p.nombre;
$$;
