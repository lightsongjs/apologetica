import { z } from 'zod';

// ----- Enums (closed sets) -----

export const ContentTypeEnum = z.enum([
  'erezie',           // Heresies
  'sinod',            // Councils
  'doctrina',         // Doctrines
  'personalitate',    // Historical figures (for teme about people)
  'tema-generala',    // General themes
]);

export const CategoryEnum = z.enum([
  'hristologie',      // Christology
  'pneumatologie',    // Pneumatology
  'triadologie',      // Trinity
  'soteriologie',     // Salvation
  'eclesiologie',     // Church
  'escatologie',      // End times
  'apologetica',      // Apologetics
  'alta',             // Other
]);

export type ContentType = z.infer<typeof ContentTypeEnum>;
export type Category = z.infer<typeof CategoryEnum>;

// ----- Metadata Schema -----

export const ContentMetadataSchema = z.object({
  // Existing (from current teme schema)
  title: z.string().min(1, 'Title is required'),
  summary: z.string().min(1, 'Summary is required'),

  // NEW: Taxonomy
  type: ContentTypeEnum,
  category: CategoryEnum,
  tags: z.array(z.string()).default([]),

  // NEW: Relations (slugs, validated at runtime)
  related: z.array(z.string()).optional(),           // General related content
  condemned_at: z.string().optional(),               // For heresies → synod slug
  defended_by: z.array(z.string()).optional(),       // Personality slugs
  opposed_to: z.array(z.string()).optional(),        // Opposing heresies/doctrines
  see_also: z.array(z.string()).optional(),          // Explicit cross-refs

  // NEW: Content status
  completeness: z.enum(['draft', 'complete', 'needs-review', 'stub']).default('draft'),
  last_updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
});

export type ContentMetadata = z.infer<typeof ContentMetadataSchema>;

// ----- Collection Schemas (for reference) -----

export const PersonalitatiFrontmatterSchema = z.object({
  name: z.string(),
  title: z.string(),
  image: z.string(),
  order: z.number().int(),
  tip: z.string().optional(),
});

export const LocuriFrontmatterSchema = z.object({
  name: z.string(),
  title: z.string(),
  image: z.string(),
  order: z.number().int(),
});

export const ConversationsFrontmatterSchema = z.object({
  title: z.string(),
  denomination: z.string(),
  order: z.number().int(),
});
