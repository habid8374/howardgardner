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
- [ ] Autorización de uso de imagen de los estudiantes que aparecen en las piezas.
- [ ] Foto del rector en mejor resolución y con fondo limpio.

## Versión en inglés
- [ ] **Revisión del inglés por un docente del colegio.** Todos los textos están en `lib/dictionaries/en.ts`. Son traducción de Axentia, natural y no literal.
- [ ] Confirmar equivalencias de grados en inglés: Prejardín = Pre-K 3, Jardín = Pre-K 4, Transición = Kindergarten.
- [ ] (Opcional) Versiones en inglés de las piezas de redes; hoy se muestran en español con descripción traducida.

## Demo de admisiones, PQRSF y panel (hecha, solo para mostrar)
Funciona en Vercel sin base de datos: los envíos se guardan **solo en el navegador** de quien prueba (`lib/demo-store.ts`).
- Panel: botón "Acceso colegio" / "Staff login" en el pie de página (`/admin`) · clave de demostración `colegio2027` (no es seguridad real). El panel está en español e inglés.
- Para presentarla: enviar el formulario y abrir el panel en el mismo navegador.

Para pasar a producción hace falta:
- [ ] Dominio propio (para correos automáticos de confirmación).
- [ ] Nombres y correos del personal que usará el panel, y su rol (administrador / consulta).
- [ ] Documentos requeridos por grado, edades de ingreso y responsable de responder PQRSF.
- [ ] Validar con el abogado los plazos y criterios de prioridad de PQRSF. Hoy: Alta 5, Media 10, Baja 15 días hábiles; quejas y reclamos entran en Alta, peticiones en Media, sugerencias y felicitaciones en Baja; si el acudiente marca "urgente", entra en Alta.
- [ ] Actualizar la Política de Tratamiento de Datos con las nuevas finalidades (admisiones y PQRSF) y la transferencia internacional de datos a los proveedores de la nube.

## Plataforma para producción (decidido)
**Se descarta Supabase gratis:** pausa el proyecto tras una semana sin actividad y el formulario dejaría de funcionar en vacaciones o semanas sin PQRSF. Supabase Pro (25 USD/mes) no pausa, pero no es necesario.

**Se usa, todo administrado desde Vercel:**
- **Base de datos: Neon (Postgres)** desde el Marketplace de Vercel. No pausa el proyecto: la base “duerme” tras 5 min sin uso y despierta sola en la siguiente visita. Plan gratis: 1 GB por proyecto (sobra para el volumen de un colegio). Postgres estándar, se puede mudar sin reescribir.
- **Archivos: Vercel Blob privado** para adjuntos de PQRSF y documentos de admisión (enlaces temporales, nunca públicos).
- **Correos: Resend** (gratis hasta 3.000 correos/mes): confirmación al acudiente y aviso al colegio.
- **Acceso al panel:** usuario y contraseña por persona, roles y registro de actividad.
- **Copia de seguridad semanal** automática a un archivo privado.
- **Vercel Pro (20 USD/mes por usuario):** obligatorio para un sitio de cliente (Hobby es solo para uso personal no comercial). Incluir en el mantenimiento mensual.
- Las cuentas (Vercel, Neon, Resend, dominio) deben quedar **a nombre del colegio**, con Axentia como administrador.

Cambio en el código: solo `lib/demo-store.ts` pasa de guardar en el navegador a llamar al servidor; formularios, panel, alertas y PDF se mantienen.

## Legal
- [ ] Validar la **Política de Tratamiento de Datos** con el área jurídica del colegio y añadir la fecha de vigencia. `app/politica-de-datos/page.tsx`

## Dominio
- [ ] Dominio propio (ej. howardgardner.edu.co). Al tenerlo, cambiar `SITE_URL` en `lib/site.ts` y `public/llms.txt`.
