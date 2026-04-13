-- Schema para la tabla Asistente y Storage
-- Ejecutar en el SQL Editor de Supabase

-- Tabla asistente (una por profesional)
create table if not exists public.asistente (
  id uuid primary key default gen_random_uuid(),
  profesional_id uuid not null unique references public.profesionales(id) on delete cascade,
  nombre text not null default '',
  frase_presentacion text not null default '',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.asistente enable row level security;

create policy "Profesional gestiona su asistente" on public.asistente
  for all using (
    profesional_id = (
      select id from public.profesionales where email = auth.jwt() ->> 'email'
    )
  );

-- Trigger para updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger asistente_updated_at
  before update on public.asistente
  for each row execute function public.set_updated_at();

-- Storage: bucket para avatares
insert into storage.buckets (id, name, public)
values ('avatares', 'avatares', true)
on conflict (id) do nothing;

-- Políticas de Storage
create policy "Subida autenticada de avatares" on storage.objects
  for insert with check (
    bucket_id = 'avatares'
    and auth.role() = 'authenticated'
  );

create policy "Lectura pública de avatares" on storage.objects
  for select using (bucket_id = 'avatares');

create policy "Actualización de avatares propios" on storage.objects
  for update using (
    bucket_id = 'avatares'
    and auth.role() = 'authenticated'
  );

create policy "Eliminación de avatares propios" on storage.objects
  for delete using (
    bucket_id = 'avatares'
    and auth.role() = 'authenticated'
  );
