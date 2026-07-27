# Algode Formación — Sitio Web

Proyecto Astro que implementa el blueprint completo de rediseño UI/UX/CRO:
sistema de diseño, navegación por modalidad, fichas de curso con anatomía
de 10 secciones, quiz de recomendación, filtro de catálogo, calculadora
FUNDAE, blog por pilares de contenido y cumplimiento de accesibilidad.

## Panel de mantenimiento (`/admin`)

Zona protegida con contraseña para editar cursos e instructores y publicar
entradas de blog sin tocar código. Cada guardado crea un commit real en
GitHub, que dispara un redeploy automático en Vercel (1–2 minutos).

### Variables de entorno necesarias (configúralas en Vercel → Settings → Environment Variables)

| Variable | Qué es | Cómo obtenerla |
|---|---|---|
| `ADMIN_PASSWORD` | La contraseña para entrar en `/admin` | Elige una tú mismo, que no sea trivial |
| `ADMIN_SESSION_SECRET` | Secreto para firmar la cookie de sesión | Cualquier cadena larga aleatoria, p.ej. generada con `openssl rand -hex 32` |
| `GITHUB_TOKEN` | Token con permiso de escritura sobre el repo | GitHub → Settings → Developer settings → Fine-grained tokens → permiso "Contents: Read and write" limitado a este repositorio |
| `GITHUB_OWNER` | Tu usuario u organización de GitHub | p.ej. `Ark-Tek` |
| `GITHUB_REPO` | Nombre del repositorio | p.ej. `algode-claude` |
| `GITHUB_BRANCH` | Rama sobre la que se escribe | `main` (opcional, por defecto ya es `main`) |

**Importante:** ninguna de estas variables debe llevar el prefijo `PUBLIC_`
— así Astro garantiza que nunca llegan al navegador del visitante.

### Qué se puede hacer desde `/admin`

- **Cursos** (`/admin/cursos`): editar cualquier campo de un curso existente
  (precio, fechas, plazas, currículum, certificación, instructor...) o
  publicar un curso nuevo.
- **Instructores** (`/admin/instructores`): editar bio, foto y experiencia,
  o añadir uno nuevo.
- **Blog** (`/admin/blog/nuevo`): publicar una entrada nueva en cualquiera
  de los 3 pilares de contenido.

### Limitaciones conocidas (honestas, para que no sorprendan)

- Es una contraseña compartida, no cuentas individuales — vale para que tú
  (o alguien de confianza) mantenga el sitio, no para un equipo grande con
  permisos distintos por persona.
- Los campos más complejos del curso (currículum, FAQ, convocatorias) se
  editan como JSON en una caja de texto, no con un formulario visual
  campo-a-campo — es más rápido de construir y sigue siendo mucho más
  seguro que tocar el archivo `.md` a mano, pero hay que respetar el
  formato (cada formulario incluye un ejemplo justo debajo del campo).
- Después de guardar, el cambio tarda 1–2 minutos en verse en el sitio
  público (es el tiempo que tarda Vercel en redesplegar) — es normal,
  no significa que no se haya guardado.

### Probar el panel en local antes de desplegar

Crea un archivo `.env` en la raíz del proyecto (no se sube a git, ya está
en `.gitignore`) con las mismas variables de la tabla de arriba, y ejecuta
`npm run dev` — `/admin` funciona igual en local que en Vercel, escribiendo
de verdad en GitHub (ten cuidado: los cambios que hagas en local también
crean commits reales).

## Cómo arrancar el proyecto

```bash
npm install
npm run dev       # http://localhost:4321
```

```bash
npm run build     # genera /dist — sitio estático listo para producción
npm run preview   # sirve /dist localmente para verificar el build
```

## Cómo añadir un curso nuevo

1. Crea un archivo en `src/content/courses/<slug-del-curso>.md`.
2. Copia el frontmatter de `preparacion-pedidos.md` como plantilla — todos
   los campos están validados por el esquema en `src/content.config.ts`.
3. Si el curso necesita un instructor nuevo, añade primero su bio en
   `src/content/instructors/`.
4. El curso aparece automáticamente en `/cursos`, en los hubs de modalidad,
   en el mega-menú y en el filtro — no hace falta tocar ninguna página.

## Cómo añadir un artículo de blog

Crea un archivo en `src/content/blog/<pilar>/<slug>.md`, donde `<pilar>`
es uno de `maquinaria`, `logistica` o `fundae`. El frontmatter sigue el
esquema `blog` de `src/content.config.ts`.

## Antes de publicar en producción

- [ ] Sustituir las imágenes placeholder en `public/images/` por fotografía real.
- [ ] Sustituir `REPLACE_ME` en los `action` de los formularios
      (`src/components/forms/*.astro`) por los endpoints reales de Brevo/Formspree.
- [ ] Configurar `PUBLIC_GTM_ID` como variable de entorno para activar
      `GTMSnippet.astro`.
- [ ] Confirmar el dominio definitivo en `astro.config.mjs` (campo `site`).
- [ ] Revisar el teléfono y WhatsApp placeholder (`+34 900 000 000`) en
      todos los componentes — buscar y sustituir globalmente.
- [ ] Completar la auditoría de accesibilidad (axe DevTools + lectores de
      pantalla) antes de publicar `legal/accesibilidad.astro` como definitiva.
- [ ] Revisar el checklist completo de pre-lanzamiento del blueprint
      (sección L) antes de hacer público el sitio.

## Despliegue

El workflow en `.github/workflows/deploy.yml` construye el sitio y lo
despliega automáticamente a GitHub Pages en cada push a `main`. Solo hay
que activar GitHub Pages en la configuración del repositorio con la
opción "GitHub Actions" como fuente.

## Estructura del proyecto

Ver `algode-formacion-arquitectura-proyecto.md` (documento de
planificación) para el mapeo completo entre cada carpeta y la sección
correspondiente del blueprint de diseño.
