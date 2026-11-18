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
;

-- Sedes administrables desde el panel (nov 2026)
CREATE TABLE IF NOT EXISTS campuses (
  id            text PRIMARY KEY,                      -- identificador corto: principal, sede2, norte...
  name_es       text NOT NULL,
  name_en       text NOT NULL DEFAULT '',
  status        text NOT NULL DEFAULT 'soon' CHECK (status IN ('open','soon','hidden')),
  address       text NOT NULL DEFAULT '',
  city          text NOT NULL DEFAULT '',
  phone         text NOT NULL DEFAULT '',
  whatsapp      text NOT NULL DEFAULT '',
  email         text NOT NULL DEFAULT '',
  hours_es      text NOT NULL DEFAULT '',
  hours_en      text NOT NULL DEFAULT '',
  grades        text NOT NULL DEFAULT '',
  maps_url      text NOT NULL DEFAULT '',
  notify_email  text NOT NULL DEFAULT '',
  note_es       text NOT NULL DEFAULT '',
  note_en       text NOT NULL DEFAULT '',
  sort          integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Permisos por usuario (reemplazan el rol fijo)
ALTER TABLE staff ADD COLUMN IF NOT EXISTS perms jsonb NOT NULL DEFAULT '{}';
ALTER TABLE staff ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE staff ADD COLUMN IF NOT EXISTS last_login timestamptz
;

-- Superusuario (soporte de Axentia): solo otro superusuario puede editarlo o desactivarlo
ALTER TABLE staff ADD COLUMN IF NOT EXISTS superuser boolean NOT NULL DEFAULT false
;

-- Versión de sesión: al cambiar la clave, el usuario o desactivar la cuenta, se cierran todas sus sesiones abiertas
ALTER TABLE staff ADD COLUMN IF NOT EXISTS session_version integer NOT NULL DEFAULT 1
