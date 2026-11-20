import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    dek: z.string().optional(),
    category: z.string(),
    date: z.coerce.date(),
    author: z.string().default('নিজস্ব প্রতিবেদক'),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    views: z.number().default(0),
    breaking: z.boolean().default(false),
    updatedAt: z.coerce.date().optional(),
    upazila: z.string().optional(),
    unionSlug: z.string().optional(),
    village: z.string().optional(),
  }),
});

export const collections = { blog };
