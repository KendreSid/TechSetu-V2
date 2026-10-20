// Astro configuration.
// Hindi is the default language and lives at "/"; Marathi at "/mr/", English at "/en/".
import { defineConfig } from 'astro/config';

export default defineConfig({
  // TODO: replace with the real address once the domain is bought.
  // Used for canonical and hreflang links (SEO).
  site: 'https://techsetu.example',
  i18n: {
    defaultLocale: 'hi',
    locales: ['hi', 'mr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
