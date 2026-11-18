# Seguridad — Howard Gardner Bilingual School

Referencias: **OWASP Top 10:2025** y **OWASP ASVS 5.0** (mayo de 2025). Meta para producción: **ASVS nivel 2**, el recomendado para sitios que manejan datos personales (aquí, datos de menores).

Estado a 18 de noviembre de 2026. La demo ya funciona con **servidor real**: base de datos Neon, adjuntos en Vercel Blob privado y API en `app/api/`. La columna **Producción** lista lo que falta antes de recibir datos reales.

## Matriz OWASP Top 10:2025

| Riesgo | Demo (hecho) | Producción (obligatorio) |
|---|---|---|
| **A01 Control de acceso roto** | Cada ruta del panel (`app/api/admin/*`) verifica la sesión en el servidor y el rol (solo *admin* cambia datos). Adjuntos en almacenamiento **privado**, solo descargables con sesión. La consulta del acudiente exige radicado **y** correo. `/admin` fuera de buscadores y sin caché. | Un usuario por persona; revisar roles cada semestre. |
| **A02 Configuración insegura** | CSP, HSTS (2 años, preload), X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP, CORP, X-Permitted-Cross-Domain-Policies; sin `X-Powered-By`. `next.config.ts`. | **A02-1:** pasar la CSP de `'unsafe-inline'` a nonces cuando haya renderizado en servidor. Variables secretas solo en el servidor. |
| **A03 Cadena de suministro** | `npm audit --omit=dev`: **0 vulnerabilidades**. Next 16.4.6 (corrige el salto del proxy) y jsPDF 4.2.1. Dependabot semanal (`.github/dependabot.yml`). Lockfile versionado. | Revisar y fusionar las actualizaciones de Dependabot cada semana. Las alertas que quedan son solo de herramientas de desarrollo (lint), sin parche publicado. |
| **A04 Fallas criptográficas** | HTTPS con HSTS. Contraseñas con **scrypt** y sal; sesión firmada con HMAC (`SESSION_SECRET`, solo en el servidor). Neon y Blob cifran en reposo. | Rotar `SESSION_SECRET` al pasar a producción. |
| **A05 Inyección** | Consultas SQL **parametrizadas** (`sql\`...\``). Validación con **Zod** en el servidor de todo lo que llega (`lib/server/validate.ts`). Correos con HTML escapado. Excel protegido contra fórmulas. | — |
| **A06 Diseño inseguro** | Trampa contra robots; **límite de envíos por IP** en la base de datos (8 preinscripciones y 6 PQRSF por hora; 20 consultas cada 10 min). Adjuntos revisados por su **contenido real** (firma del archivo), máx. 5 MB, con nombre aleatorio. Revisión de origen (CSRF). | Antispam (Cloudflare Turnstile) si llega spam. |
| **A07 Fallas de autenticación** | Usuario y contraseña verificados en el servidor; mismo tiempo de respuesta exista o no el usuario; bloqueo de 15 min tras 5 intentos por usuario (y 20 por IP); cookie HttpOnly, Secure, SameSite=Strict, vence en 8 h. | Verificación en dos pasos opcional; quitar el usuario `demo`. |
| **A08 Integridad de software y datos** | Sin scripts de terceros sin control; fuentes servidas desde el propio sitio. Despliegue solo desde GitHub. | Rama principal protegida; despliegues firmados desde el repositorio. |
| **A09 Registro y alertas** | Historial por solicitud con **quién** hizo cada cambio. Tabla `audit_log`: inicios de sesión (también fallidos), cambios, descargas de adjuntos, con IP. | Alertas por correo ante muchos intentos fallidos. |
| **A10 Condiciones excepcionales** | Errores registrados en el servidor con un código; al usuario solo le llega el código. Ante cualquier error de sesión se niega el acceso. | — |

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
