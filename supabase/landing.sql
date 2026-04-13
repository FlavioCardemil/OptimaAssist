-- Contenido editable de la landing page
create table if not exists contenido_landing (
  id uuid default gen_random_uuid() primary key,
  clave text unique not null,
  valor text not null,
  updated_at timestamptz default now()
);

-- Submissions del formulario de contacto
create table if not exists contactos (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  email text not null,
  especialidad text,
  mensaje text,
  created_at timestamptz default now()
);

-- RLS: solo super_admin puede leer/editar contenido_landing
alter table contenido_landing enable row level security;
create policy "super_admin_all" on contenido_landing
  for all using (
    exists (
      select 1 from usuarios where id = auth.uid() and rol = 'super_admin'
    )
  );

-- RLS: cualquiera puede insertar en contactos (formulario público), solo super_admin puede leer
alter table contactos enable row level security;
create policy "public_insert" on contactos
  for insert with check (true);
create policy "super_admin_select" on contactos
  for select using (
    exists (
      select 1 from usuarios where id = auth.uid() and rol = 'super_admin'
    )
  );
