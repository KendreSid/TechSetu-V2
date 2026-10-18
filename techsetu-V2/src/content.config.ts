/**
 * Defines what an "article" must contain. If an editor leaves out a required
 * field, the build stops with a clear message instead of publishing a broken page.
 *
 * Files live in src/content/articles/<language>/<name>.md, e.g. hi/chatgpt-explained.md.
 * The same <name> in each language folder means "the same article, translated".
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    /** English-only URL name; kept for editors, the file name decides the address. */
    urlName: z.string().optional(),
    /** original = written by a person, machine_draft = machine translation, reviewed = checked by a person */
    translationStatus: z.enum(['original', 'machine_draft', 'reviewed']).default('original'),
    /** true = visible only in the CMS, not on the site */
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
