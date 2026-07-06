import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/* --------------------------------------------------------------------
   COURSES
   Cada curso vive en src/content/courses/<slug>.md
   El frontmatter alimenta: CourseCard, CourseHero, ScheduleTable,
   StickyEnrollBar, CourseSchema (JSON-LD) y el CourseFilter.
   -------------------------------------------------------------------- */
const courses = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/courses" }),
  schema: z.object({
    title: z.string(),
    shortDescription: z.string().max(160),
    modality: z.enum(['presencial', 'online', 'mixta']),
    level: z.enum(['Iniciación', 'Intermedio', 'Con experiencia', 'Todos']),
    durationHours: z.number().positive(),
    price: z.number().nullable(), // null = "Consultar precio" (evitar si es posible)
    fundaeEligible: z.boolean().default(false),
    hasCertificate: z.boolean().default(true),
    certificationBody: z.string().optional(), // p.ej. "SEPE", "RD 1215/1997"
    rating: z.number().min(0).max(5).optional(),
    reviewCount: z.number().int().nonnegative().optional(),
    instructorRef: z.string(), // slug de src/content/instructors/
    heroImage: z.string().optional(),
    nextSessions: z
      .array(
        z.object({
          date: z.coerce.date(),
          seatsTotal: z.number().int().positive(),
          seatsTaken: z.number().int().nonnegative(),
          location: z.string().optional(), // vacío si es online
        })
      )
      .default([]),
    curriculum: z
      .array(
        z.object({
          module: z.string(),
          hours: z.number().positive(),
          freePreview: z.boolean().default(false),
          topics: z.array(z.string()).default([]),
        })
      )
      .default([]),
    outcomes: z.array(z.string()).default([]), // "Qué aprenderás"
    audienceFit: z.array(z.string()).default([]), // "Este curso es para ti si..."
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .default([]),
    seoTitle: z.string().optional(),
    seoDescription: z.string().max(160).optional(),
    featured: z.boolean().default(false),
    publishedDate: z.coerce.date().default(() => new Date()),
  }),
});

/* --------------------------------------------------------------------
   INSTRUCTORS
   Bio reutilizable, referenciada desde courses por slug (instructorRef).
   -------------------------------------------------------------------- */
const instructors = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/instructors" }),
  schema: z.object({
    name: z.string(),
    role: z.string(), // p.ej. "Jefe de Almacén"
    company: z.string(), // empresa de referencia actual
    yearsExperience: z.number().positive(),
    photo: z.string().optional(),
    linkedinUrl: z.string().url().optional(),
    bioShort: z.string(),
  }),
});

/* --------------------------------------------------------------------
   TESTIMONIALS
   Reseñas verificadas — alimentan homepage y TestimonialGrid en fichas.
   -------------------------------------------------------------------- */
const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/testimonials" }),
  schema: z.object({
    studentName: z.string(),
    role: z.string(),
    company: z.string(),
    courseRef: z.string(), // slug de courses/
    rating: z.number().min(1).max(5),
    quote: z.string(),
    photo: z.string().optional(),
    verified: z.boolean().default(true),
    date: z.coerce.date(),
  }),
});

/* --------------------------------------------------------------------
   BLOG
   Organizado en 3 pilares de contenido: maquinaria, logistica, fundae.
   -------------------------------------------------------------------- */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    pillar: z.enum(['maquinaria', 'logistica', 'fundae']),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Equipo Algode'),
    heroImage: z.string().optional(),
    relatedCourseRef: z.string().optional(), // slug de courses/ a promocionar al final
    draft: z.boolean().default(false),
  }),
});

export const collections = { courses, instructors, testimonials, blog };