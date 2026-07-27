import type { CollectionEntry } from 'astro:content';
import { formatCurrency } from './format-currency';

/**
 * Genera el JSON-LD de tipo Course a partir del frontmatter de un curso.
 * Se usa en CourseSchema.astro, inyectado en el <head> de cada ficha.
 */
export function buildCourseSchema(course: CollectionEntry<'courses'>, url: string) {
  const { title, shortDescription, price, rating, reviewCount, durationHours } = course.data;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description: shortDescription,
    provider: {
      '@type': 'Organization',
      name: 'Algode Formación',
      sameAs: url,
    },
    timeRequired: `PT${durationHours}H`,
  };

  if (price !== null) {
    schema.offers = {
      '@type': 'Offer',
      price: price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    };
  }

  if (rating && reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: reviewCount,
    };
  }

  return schema;
}

/** Genera el JSON-LD de tipo FAQPage a partir del array `faq` del frontmatter. */
export function buildFaqSchema(faq: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/** Genera el JSON-LD de tipo BreadcrumbList. */
export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export { formatCurrency };
