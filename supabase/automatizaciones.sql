-- Schema para tabla Automatizaciones
-- Ejecutar en el SQL Editor de Supabase

create table if not exists public.automatizaciones (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references public.pacientes(id) on delete cascade,
  profesional_id uuid not null references public.profesionales(id) on delete cascade,
  tipo text not null check (tipo in ('volver_en', 'volver_fecha', 'tomar_examen', 'visitar_especialista')),
  configuracion jsonb not null default '{}',
  estado text not null default 'pendiente' check (estado in ('pendiente', 'mensaje1_enviado', 'mensaje2_enviado', 'completado', 'sin_recordatorio')),
  created_at timestamptz default now()
);

-- Índices
create index if not exists idx_automatizaciones_paciente on public.automatizaciones(paciente_id);
create index if not exists idx_automatizaciones_profesional on public.automatizaciones(profesional_id);

-- Row Level Security
alter table public.automatizaciones enable row level security;

create policy "Profesional gestiona sus automatizaciones" on public.automatizaciones
  for all using (
    profesional_id = (
      select id from public.profesionales where email = auth.jwt() ->> 'email'
    )
  );

-- Realtime: necesario para recibir payload completo en DELETE
alter table public.automatizaciones replica identity full;

-- Agregar la tabla a la publicación de Realtime de Supabase
alter publication supabase_realtime add table public.automatizaciones;
