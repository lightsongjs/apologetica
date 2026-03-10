import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { ContentMetadataSchema } from '../content-schema.js';

const conversations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/conversations' }),
  schema: z.object({
    title: z.string(),
    denomination: z.string(),
    order: z.number(),
    verify: z.boolean().default(false),
  }),
});

const teme = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/teme' }),
  schema: ContentMetadataSchema,
});

const personalitati = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/personalitati' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    image: z.string(),
    order: z.number(),
    tip: z.string().optional(),
    verify: z.boolean().default(false),
  }),
});

const locuri = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/locuri' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    image: z.string(),
    order: z.number(),
    verify: z.boolean().default(false),
  }),
});

const biblia = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/biblia' }),
  schema: z.object({
    testament: z.enum(['OT', 'NT']),
    book: z.string(),
    book_romanian: z.string(),
    chapter: z.number(),
    pericope: z.number(),
    pericope_title_en: z.string(),
    pericope_title_ro: z.string(),
    verses_start: z.number(),
    verses_end: z.number(),
    verses_total: z.number(),
    language: z.string(),
  }),
});

export const collections = { conversations, teme, personalitati, locuri, biblia };
