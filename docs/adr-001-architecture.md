# ADR-001: Architecture and tools (v1.1)

Status: proposed. Date: 18 Oct 2026. Based on: Requirements v1.0.

## Decisions

1. **Site: Astro, static pages.** Pages are built ahead of time and served from a CDN.
   Visitors never wait on a server. Built-in language routing: Hindi at `/`, Marathi `/mr/`, English `/en/`.
2. **CMS: Decap CMS (Git-backed).** Editors log in, write in three language folders, and the
   editorial workflow (draft, review, publish) maps to Git pull requests.
3. **Hosting: Cloudflare Pages.** Static hosting plus a tiny Worker for the CMS login helper
   and (next stage) a Pages Function for newsletter signup.
4. **YouTube videos: fetched at build time** from the channel feed, with a saved fallback list.
   A scheduled rebuild (about hourly) refreshes it. No runtime function needed.
5. **Newsletter: provider behind our own adapter.** Start with Brevo; switching later must
   touch one file only (see Stage 4).

6. **Language switch: in place, with one address per language.** Hindi `/`, Marathi `/mr/`, English `/en/`
   still exist as separate addresses (good for Google and for sharing a link in the right language).
   On the home page the language buttons do not open another page: every text carries a key (`data-i18n`),
   the browser swaps the texts, and the address bar is updated. Scroll position, a playing video and the
   bridge animation are untouched.
   Cost: the home page HTML also contains the article cards of the other languages (hidden by a style rule),
   and article pages still open the other address normally.

7. **Articles do not depend on the interface language.** Each article is written and published in one
   language (its folder: `hi/`, `mr/`, `en/`) and is listed for every visitor. The language buttons change
   only the interface text, and article pages show no language buttons (only Subscribe).

## What changed from design v1, and why

| Was | Now | Reason |
| --- | --- | --- |
| Sanity CMS | Decap CMS | Pages checked in Oct 2026 say Sanity's free plan has only 2 roles and public datasets, so the editor-approves-admin workflow would need a paid plan. Goal was near-zero cost. |
| YouTube sync as a runtime function | Build-time fetch plus scheduled rebuild | One fewer moving part; same "within an hour" result. |

## Trade-offs we accept

- No database: Git is the store. Content is plain Markdown, easy to move later.
- Editors need a GitHub account with access to the repository.
- After publishing, the site updates in minutes, not instantly.
- Free-plan limits of email services change often. Verify on the vendor's page before signing up.

## Revisit this decision when

- More than 3 editors, or editors who cannot use GitHub: move to a hosted CMS with roles.
- Newsletter list outgrows the provider's free daily sending limit: change provider (adapter makes this cheap).
- Build time becomes slow with many articles: use incremental builds.
- Comments, login or payments are needed: add an API layer and a database (phase 2 and 3).

## Not done yet (honest list)

- This project has not been built or run by the author yet (no internet where it was written).
  First `npm install` and `npm run build` may show small errors to fix.
- Newsletter signup is not built yet.
