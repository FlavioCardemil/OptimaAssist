-- Migraciones para la línea de tiempo unificada
-- Ejecutar en el SQL Editor de Supabase

-- 1. Campo "nota" en sesiones
alter table public.sesiones
  add column if not exists nota text;

-- 2. Campo "nota" en automatizaciones
alter table public.automatizaciones
  add column if not exists nota text;

-- 3. Nuevo valor "nota" en el enum estado_sesion
--    (usado para notas clínicas standalone en el timeline)
alter type estado_sesion add value if not exists 'nota';
