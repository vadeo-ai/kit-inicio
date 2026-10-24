-- Tabla de ejemplo. Reglas DSQL: sin FOREIGN KEY, sin SERIAL/secuencias (id UUID desde la app),
-- sin JSONB (JSON en TEXT), índices con CREATE INDEX ASYNC, una sentencia DDL por transacción.
CREATE TABLE IF NOT EXISTS tareas (
  id uuid PRIMARY KEY,
  titulo text NOT NULL CHECK (length(titulo) BETWEEN 1 AND 200),
  detalle text NOT NULL DEFAULT '',
  estado text NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_curso', 'hecha')),
  creada_por text NOT NULL,
  creada_en timestamptz NOT NULL DEFAULT now(),
  actualizada_en timestamptz NOT NULL DEFAULT now()
);
--- siguiente
CREATE INDEX ASYNC IF NOT EXISTS tareas_estado_idx ON tareas (estado);
