import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    // Enforce real summaries: min 50 chars to avoid placeholders
    description: z.string().min(50),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  tags: z.array(z.string()).nonempty(), // Enforce at least one tag
  category: z.enum(['Data Engineering', 'Bioinformatics', 'Security', 'Automation', 'Cloud']),
  }),
});

const stories = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    heroImage: z.string().optional(),
  }),
});

export const collections = { blog, stories };