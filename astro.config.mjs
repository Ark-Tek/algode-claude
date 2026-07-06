import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Cambia `site` por el dominio definitivo (p.ej. https://algodeformacion.es)
// cuando esté disponible.
//
// output: 'hybrid' — todas las páginas siguen siendo estáticas por defecto
// (igual que antes), EXCEPTO las que llevan `export const prerender = false`
// en su frontmatter (las páginas de /admin), que se ejecutan como funciones
// serverless en Vercel. Esto es lo que permite que el panel de mantenimiento
// lea y escriba en GitHub en tiempo real sin convertir todo el sitio en SSR.
export default defineConfig({
  site: 'https://algodeformacion.es',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
});
