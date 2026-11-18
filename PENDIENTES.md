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
- [ ] Bilingüismo: intensidad horaria de inglés, certificaciones de los docentes, exámenes internacionales que se preparan, intercambios. Se retiraron del sitio hasta confirmarlos. `components/Bilingual.tsx`
- [ ] ¿Fue el colegio **#1 municipal en inglés** en Saber 11° 2025? El sitio anterior lo decía, pero las piezas oficiales solo dicen “destacado puntaje en inglés”.
- [ ] Pasos reales del proceso de admisión, documentos requeridos y fechas de inscripción 2026. `components/Admissions.tsx`
- [ ] Preguntas frecuentes adicionales: costos, uniformes, transporte, jornada, alimentación. `components/Faq.tsx`

## Material visual
- [ ] **Fotografías reales** del colegio: fachada, aulas, estudiantes en clase, eventos, laboratorio, deportes (horizontales y en alta resolución, mínimo 2000 px de ancho). Hoy solo hay una foto del patio (1080 px) y piezas de redes sociales.
- [ ] Autorización de uso de imagen de los estudiantes que aparecen en las piezas.
- [ ] Foto del rector en mejor resolución y con fondo limpio.

## Legal
- [ ] Validar la **Política de Tratamiento de Datos** con el área jurídica del colegio y añadir la fecha de vigencia. `app/politica-de-datos/page.tsx`

## Dominio
- [ ] Dominio propio (ej. howardgardner.edu.co). Al tenerlo, cambiar `SITE_URL` en `lib/site.ts` y `public/llms.txt`.
