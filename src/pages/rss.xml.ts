import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog')).filter((p) => !p.data.draft);

  return rss({
    title: 'Blog de Algode Formación',
    description: 'Guías sobre maquinaria, empleo en logística y bonificación FUNDAE.',
    site: context.site ?? 'https://algodeformacion.es',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedDate,
      link: `/blog/${post.id}/`,
    })),
  });
}
