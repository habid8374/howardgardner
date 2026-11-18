-- Esquema de Howard Gardner (Neon / Postgres). Idempotente: se puede correr varias veces.
CREATE SEQUENCE IF NOT EXISTS admissions_seq;
CREATE SEQUENCE IF NOT EXISTS pqrsf_seq;

CREATE TABLE IF NOT EXISTS admissions (
  id          text PRIMARY KEY,
  created_at  timestamptz NOT NULL DEFAULT now(),
  lang        text NOT NULL CHECK (lang IN ('es','en')),
  guardian    text NOT NULL,
  phone       text NOT NULL,
  grade       text NOT NULL,
  message     text NOT NULL DEFAULT '',
  status      text NOT NULL DEFAULT 'nueva',
  notes       jsonb NOT NULL DEFAULT '[]',
  history     jsonb NOT NULL DEFAULT '[]',
  sample      boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS pqrsf (
  id               text PRIMARY KEY,
  created_at       timestamptz NOT NULL DEFAULT now(),
  lang             text NOT NULL CHECK (lang IN ('es','en')),
  type             text NOT NULL,
  name             text NOT NULL,
  email            text NOT NULL,
  phone            text NOT NULL DEFAULT '',
  student          text NOT NULL DEFAULT '',
  grade            text NOT NULL DEFAULT '',
  subject          text NOT NULL,
  description      text NOT NULL,
  attachment       text NOT NULL DEFAULT '',   -- nombre original del archivo
  attachment_path  text NOT NULL DEFAULT '',   -- ruta privada en Vercel Blob
  urgent           boolean NOT NULL DEFAULT false,
  priority         text NOT NULL,
  status           text NOT NULL DEFAULT 'radicada',
  answer           text NOT NULL DEFAULT '',
  answered_at      timestamptz,
  notes            jsonb NOT NULL DEFAULT '[]',
  history          jsonb NOT NULL DEFAULT '[]',
  sample           boolean NOT NULL DEFAULT false
);

-- Personal del colegio con acceso al panel (contraseña con scrypt + sal)
CREATE TABLE IF NOT EXISTS staff (
  username    text PRIMARY KEY,
  name        text NOT NULL,
  pass_hash   text NOT NULL,
  role        text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin','consulta')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Límite de intentos (formularios públicos y acceso al panel)
CREATE TABLE IF NOT EXISTS rate_limits (
  key          text PRIMARY KEY,
  count        integer NOT NULL,
  window_start timestamptz NOT NULL,
  locked_until timestamptz
);

-- Registro de actividad del panel (OWASP A09)
CREATE TABLE IF NOT EXISTS audit_log (
  id       bigserial PRIMARY KEY,
  at       timestamptz NOT NULL DEFAULT now(),
  actor    text NOT NULL,
  action   text NOT NULL,
  target   text NOT NULL DEFAULT '',
  ip       text NOT NULL DEFAULT ''
);

-- Varias sedes (nov 2026): cada registro y cada usuario del panel pueden pertenecer a una sede
ALTER TABLE admissions ADD COLUMN IF NOT EXISTS campus text NOT NULL DEFAULT 'principal';
ALTER TABLE pqrsf ADD COLUMN IF NOT EXISTS campus text NOT NULL DEFAULT 'principal';
ALTER TABLE staff ADD COLUMN IF NOT EXISTS campus text;  -- NULL = todas las sedes
CREATE INDEX IF NOT EXISTS admissions_campus_idx ON admissions (campus, created_at DESC);
CREATE INDEX IF NOT EXISTS pqrsf_campus_idx ON pqrsf (campus, created_at DESC)
