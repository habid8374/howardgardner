# Pendientes del cliente — Howard Gardner Bilingual School

Datos que no se inventaron y que el colegio debe confirmar o entregar.
En el código están marcados con `TODO(CLIENTE)`.

## Datos de contacto y ubicación
- [ ] **Enlace del perfil de Google (Google Business Profile)** para el mapa y el botón “Cómo llegar”. Hoy Google ubica la dirección “Calle 12 #34 B-2” en otra cuadra (Cl. 12 #19B-34). `lib/site.ts`
- [ ] **Correo institucional** para la política de datos y el pie de página.
- [ ] Confirmar que **301 202 8756** es el número único para llamadas y WhatsApp.
- [ ] Confirmar el horario de atención (lunes a viernes, 7:00 a. m. – 5:00 p. m.).
- [ ] Canal de YouTube (si existe). Se quitó el enlace vacío del sitio anterior.

## Contenido académico
- [ ] Grados ofrecidos y edades de ingreso por nivel. `components/Levels.tsx`
- [x] Oxford Quality (Oxford University Press): confirmado por pieza oficial, ya está en el sitio.
- [ ] Logo oficial de Oxford Quality en alta calidad y permiso de uso (hoy se muestra la pieza de anuncio).
- [ ] Bilingüismo: intensidad horaria de inglés, certificaciones de los docentes, exámenes internacionales que se preparan, intercambios. Se retiraron del sitio hasta confirmarlos. `components/Bilingual.tsx`
- [ ] ¿Fue el colegio **#1 municipal en inglés** en Saber 11° 2025? El sitio anterior lo decía, pero las piezas oficiales solo dicen “destacado puntaje en inglés”.
- [ ] Pasos reales del proceso de admisión, documentos requeridos y fechas de inscripción y matrícula 2027. `components/Admissions.tsx`
- [ ] Preguntas frecuentes adicionales: costos, uniformes, transporte, jornada, alimentación. `components/Faq.tsx`

## Material visual
- [ ] (Opcional) Ícono simplificado del escudo para tamaños muy pequeños (16 px). Hoy el favicon usa el escudo completo.
- [ ] **Lámina 2 del carrusel del A+ (“¿Qué significa?”)** como archivo de imagen, para añadirla a la galería. Su texto ya está en las preguntas frecuentes.
- [ ] **Fotografías reales** del colegio: fachada, aulas, estudiantes en clase, eventos, laboratorio, deportes (horizontales y en alta resolución, mínimo 2000 px de ancho). Hoy solo hay una foto del patio (1080 px) y piezas de redes sociales.
- [ ] Autorización de uso de imagen de los estudiantes que aparecen en las piezas y en las fotos del **Family Day 2026** (hoy en el carrusel y la galería).
- [ ] Foto del rector en mejor resolución y con fondo limpio.

## Versión en inglés
- [ ] **Revisión del inglés por un docente del colegio.** Todos los textos están en `lib/dictionaries/en.ts`. Son traducción de Axentia, natural y no literal.
- [ ] Confirmar equivalencias de grados en inglés: Prejardín = Pre-K 3, Jardín = Pre-K 4, Transición = Kindergarten.
- [ ] (Opcional) Versiones en inglés de las piezas de redes; hoy se muestran en español con descripción traducida.

## Admisiones, PQRSF y panel (funcionando con servidor real)
Conectado el 18 nov 2026, todo en plan gratis:
- **Base de datos: Neon** (`howardgardner-db`, Marketplace de Vercel). Tablas: `admissions`, `pqrsf`, `staff`, `rate_limits`, `audit_log` (`lib/server/schema.sql`).
- **Adjuntos: Vercel Blob privado** (`howardgardner-files`). Solo se descargan desde el panel con sesión.
- **Correos: Resend** — código listo (`lib/server/mail.ts`). **Falta aceptar los términos de Resend en Vercel** (enlace en el chat) y definir `SCHOOL_NOTIFY_EMAIL`.
- Panel: `/admin` con usuario y contraseña verificados en el servidor. Usuario de demo: `demo` / `colegio2027` (se muestra en la pantalla de acceso solo con `DEMO_MODE=1`).
- Crear o cambiar usuarios: `node --env-file=.env.local scripts/db-setup.mjs <usuario> <contraseña> "<Nombre>" [admin|consulta]` (traer variables con `vercel env pull`).

Para pasar a producción hace falta:
- [ ] Quitar `DEMO_MODE`, borrar el usuario `demo` y crear un usuario por persona del colegio (rol administrador o consulta).
- [ ] Dominio propio verificado en Resend, para que los correos lleguen a cualquier acudiente (hoy, sin dominio, Resend solo entrega a la dirección dueña de la cuenta).
- [ ] Vercel Pro (uso comercial) y cuentas a nombre del colegio.
- [ ] Documentos requeridos por grado, edades de ingreso y responsable de responder PQRSF.
- [ ] Validar con el abogado los plazos y criterios de prioridad de PQRSF. Hoy: Alta 5, Media 10, Baja 15 días hábiles; quejas y reclamos entran en Alta, peticiones en Media, sugerencias y felicitaciones en Baja; si el acudiente marca "urgente", entra en Alta.
- [ ] Actualizar la Política de Tratamiento de Datos con las nuevas finalidades (admisiones y PQRSF) y la transferencia internacional de datos a los proveedores de la nube.

## Plataforma (decidida e implementada)
**Se descarta Supabase gratis:** pausa el proyecto tras una semana sin actividad. **Se usa Neon** desde Vercel: no pausa el proyecto (la base “duerme” tras 5 min sin uso y despierta sola), 1 GB gratis, Postgres estándar. Copia de seguridad semanal: pendiente para producción.

## Legal
- [ ] Validar la **Política de Tratamiento de Datos** con el área jurídica del colegio y añadir la fecha de vigencia. `app/politica-de-datos/page.tsx`

## Dominio
- [ ] **Dominio `.edu.co`** (ej. howardgardner.edu.co): Axentia hace el trámite en registrocolombia.co y paga el primer año ($30.000/año para colegios privados). El colegio entrega:
  - RUT del colegio (generado hace máximo 6 meses).
  - Carta de solicitud en papelería oficial, firmada por el rector, con uno o dos contactos directivos.
  - Resolución de licencia o reconocimiento oficial (preescolar, básica y media).
- [ ] Al tenerlo, cambiar `SITE_URL` en `lib/site.ts` y `public/llms.txt`.

## Seguridad
Ver `SECURITY.md` (matriz OWASP Top 10:2025 y ASVS 5.0, demo y producción).
