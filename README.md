# TechSetu v2

Multilingual (Hindi, Marathi, English) content site. Astro static pages, Decap CMS, Cloudflare Pages.
Design decisions: see `docs/adr-001-architecture.md`.

## Run locally

Needs Node.js 22 (the `.nvmrc` file pins it, and Cloudflare reads it too).

```
npm install
npm run dev        # http://localhost:4321
npm run build      # builds to dist/
```

## Structure

```
src/
  i18n/ui.ts           all interface text in 3 languages
  i18n/utils.ts        language helpers (t(), localizedPath(), stripLang())
  lib/youtube.ts       newest videos at build time, with fallback
  content.config.ts    rules every article must follow
  content/articles/    hi/ mr/ en/  (same file name = same article)
  config.ts            links that may change (channel, social icons)
  layouts/BaseLayout   header, footer, SEO and language links
  components/          HomePage, ArticlePage, BridgeScene (hero animation),
                       MiniPlayer (floating video player), SocialIcons
  pages/               routes: / , /mr/ , /en/ , /articles/<name>/ , /<lang>/articles/<name>/
public/admin/          the CMS screen and its settings (config.yml)
docs/                  decisions
```

## Conventions

- No visible text inside pages: add it to `src/i18n/ui.ts` and print it with `<T k="key" />` (so it can switch language in place).
- Every function has a comment saying what it does, what it takes and what it returns.
- Fill the TODO values in `astro.config.mjs` and `public/admin/config.yml` before going live.
