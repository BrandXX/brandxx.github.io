import { defineCollection, z } from 'astro:content';

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    industry: z.string(),
    date: z.string(),
    featured: z.boolean().default(false),
    stat: z.string(),
    tools: z.array(z.string())
  })
});

export const collections = {
  'case-studies': caseStudies
};
