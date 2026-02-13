import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const conversations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/conversations' }),
  schema: z.object({
    title: z.string(),
    denomination: z.string(),
    order: z.number(),
  }),
});

const teme = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/teme' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
  }),
});

export const collections = { conversations, teme };
