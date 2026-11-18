# Seguridad — Howard Gardner Bilingual School

Referencias: **OWASP Top 10:2025** y **OWASP ASVS 5.0** (mayo de 2025). Meta para producción: **ASVS nivel 2**, el recomendado para sitios que manejan datos personales (aquí, datos de menores).

Estado a 18 de noviembre de 2026. La demo guarda los envíos **solo en el navegador** de quien la prueba (`lib/demo-store.ts`); no hay servidor ni base de datos todavía. Por eso varios controles quedan marcados como **producción**: se implementan al conectar la base de datos.

## Matriz OWASP Top 10:2025

| Riesgo | Demo (hecho) | Producción (obligatorio) |
|---|---|---|
| **A01 Control de acceso roto** | `/admin` fuera de buscadores (`robots.txt`, `X-Robots-Tag`) y sin caché (`no-store`). El acceso de la demo es solo de muestra. | Sesión en el servidor; roles (administrador / consulta) verificados en **cada** petición del servidor, nunca solo en la pantalla. Adjuntos privados con enlaces temporales. Los acudientes solo consultan su radicado con número + correo. |
| **A02 Configuración insegura** | CSP, HSTS (2 años, preload), X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP, CORP, X-Permitted-Cross-Domain-Policies; sin `X-Powered-By`. `next.config.ts`. | **A02-1:** pasar la CSP de `'unsafe-inline'` a nonces cuando haya renderizado en servidor. Variables secretas solo en el servidor. |
| **A03 Cadena de suministro** | `npm audit --omit=dev`: **0 vulnerabilidades**. Next 16.4.6 (corrige el salto del proxy) y jsPDF 4.2.1. Dependabot semanal (`.github/dependabot.yml`). Lockfile versionado. | Revisar y fusionar las actualizaciones de Dependabot cada semana. Las alertas que quedan son solo de herramientas de desarrollo (lint), sin parche publicado. |
| **A04 Fallas criptográficas** | Todo por HTTPS con HSTS. | Contraseñas con Argon2id o bcrypt; base de datos y copias cifradas; secretos fuera del código. |
| **A05 Inyección** | React escapa todo el texto; JSON-LD escapa `<`. **Inyección de fórmulas en Excel** neutralizada al exportar (`downloadCsv`). Entradas limpias de caracteres de control y con tamaño máximo (`LIMITS`). | Consultas parametrizadas (ORM); validación en el servidor con Zod de **todo** lo que llega. |
| **A06 Diseño inseguro** | Trampa invisible contra robots en los formularios. Adjuntos: solo PDF/JPG/PNG/WEBP de hasta 5 MB. Autorización de datos obligatoria. | Antispam (Cloudflare Turnstile) y límite de envíos por IP; revisión de tipo real del archivo en el servidor; datos mínimos necesarios. |
| **A07 Fallas de autenticación** | Panel de la demo: bloqueo de 60 s tras 5 intentos fallidos. | Cuenta por persona; bloqueo progresivo por usuario e IP; sesión que expira; verificación en dos pasos opcional; recuperación de contraseña segura. |
| **A08 Integridad de software y datos** | Sin scripts de terceros sin control; fuentes servidas desde el propio sitio. Despliegue solo desde GitHub. | Rama principal protegida; despliegues firmados desde el repositorio. |
| **A09 Registro y alertas** | **Historial de cambios** en cada solicitud (estado, prioridad, respuesta), visible en el panel. | Registro en el servidor con usuario, fecha e IP; alertas por intentos fallidos y errores; conservar los registros según la política de datos. |
| **A10 Condiciones excepcionales** | Páginas de error bilingües sin detalles internos (`app/[lang]/error.tsx`, `app/admin/error.tsx`); lectura del almacenamiento con manejo de errores. | Errores registrados en el servidor con su identificador; nunca "fallar abierto" (ante un error se niega el acceso). |

## Privacidad y cookies (Ley 1581 de 2012)
- Aviso de cookies con consentimiento: **nada de terceros se carga antes de elegir**. El mapa de Google y las estadísticas solo se activan con permiso (`lib/consent.ts`).
- Política de Cookies (`/es/politica-de-cookies`, `/en/cookie-policy`) y Política de Tratamiento de Datos publicadas; enlace "Preferencias de cookies" en el pie de cada página.

## Cómo verificar
```bash
npm audit --omit=dev          # dependencias de producción
npm run build && npm start    # en otra terminal:
npm run test:links            # enlaces y anclas en ambos idiomas
```

## Pendientes
- [ ] `/.well-known/security.txt` con el correo de contacto de seguridad (falta el correo institucional).
- [ ] Prueba de penetración externa antes de abrir el sistema con datos reales.
- [ ] Revisión del abogado del colegio: política de datos, cookies y plazos de PQRSF.
