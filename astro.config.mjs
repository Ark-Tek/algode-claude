import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Astro 7: output: 'static' ahora soporta nativo `export const prerender = false`
// en páginas individuales (el comportamiento anterior de 'hybrid' es ahora el
// comportamiento por defecto de 'static'). El adaptador de Vercel sigue siendo
// necesario para que esas páginas funcionen como funciones serverless en producción.
export default defineConfig({
  site: 'https://algodeformacion.es',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
});
