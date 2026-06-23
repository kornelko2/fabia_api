# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-06-23

### Fixed
- AI explanation text now renders Markdown correctly. `formatResult()` ignored
  the model's `**bold**` syntax and bolded number+unit runs with an ASCII-only
  regex, which broke mid-word on accented characters (e.g. Czech `koní`). It now
  parses `**bold**`/`*italic*`, is Unicode-safe, and HTML-escapes the model
  output before injecting via `v-html`.
- Header menu **Embed Code** button now works. It previously toggled an
  undeclared `showEmbedDialog` flag with no dialog markup, so clicking it did
  nothing. Added a working embed dialog that generates an `<iframe>` snippet for
  the app with copy-to-clipboard and a confirmation toast.
- Header menu **Share App** button hardened: uses the Web Share API when
  available, gracefully falls back to clipboard (with a legacy `execCommand`
  path for non-secure contexts), distinguishes user-cancelled shares from
  errors, and replaces the blocking `alert()` with a toast.
- `/convert` now supports the `czk` price unit, matching `/explain` (previously
  Czech crowns returned `null` on `/convert` only).
- Reconciled the legacy FastAPI app (`main.py`) Škoda Fabia reference specs
  (mass, length, width, height) with the Cloudflare Worker, which is the source
  of truth — both backends now return identical conversions.

### Security
- Upgraded `hono` 4.9.11 → 4.12.27 in the Cloudflare Worker backend, clearing
  ~25 advisories (auth bypass, CORS bypass, prototype pollution, cookie/SSE
  injection, path traversal in `serveStatic`).
- Ran `npm audit fix` on the frontend, resolving 15 vulnerabilities (9 high).
  One low-severity, dev-server-only `esbuild` advisory remains (requires a major
  Vite v7 → v8 upgrade to fix; deferred as it does not ship to production).
- Excluded Wrangler/Miniflare local state (`.wrangler/`), PWA dev artifacts
  (`dev-dist/`), and the D1 data dumps containing real IP addresses / user
  records (`remote-data.sql`, `*-remote-backup.sql`) from version control via
  `.gitignore`, so production data is never committed.

### Changed
- Switched the default AI model to `gpt-5-mini` (low-cost, latest) and refreshed
  the allowlist (`gpt-5-mini, gpt-4o-mini, gpt-4-turbo, gpt-3.5-turbo`).
- Updated frontend dependencies within their semver ranges (`vue`, `zod`,
  `vite`, `vite-plugin-pwa`, `workbox-window`, `@vitejs/plugin-vue`).
- Updated Wrangler 4.83.0 → 4.104.0 (global install).

### Added
- SEO metadata in `index.html`: a real page title (replacing the default
  `skoda_vue`), plus description, keywords, robots, Open Graph and Twitter Card
  tags so search engines and social previews index the app properly.
- Search-engine infrastructure: `public/robots.txt` (with sitemap reference),
  `public/sitemap.xml`, a `<link rel="canonical">`, absolute Open Graph/Twitter
  image URLs, `WebApplication` JSON-LD structured data, and a static HTML hero
  (title + key message inside `#app`, replaced by the Vue app on mount) so
  crawlers index real content without executing JavaScript.
- `public/_redirects` rule so the Google verification file is served at its
  exact `.html` URL (Cloudflare Pages otherwise 308-redirects to the clean URL).
- Google Search Console verification file served at the site root
  (`public/google5bd7d881f2100c95.html`).
- Full UI internationalization with **vue-i18n**. The language switcher now
  translates the entire interface (Header, conversion form, statistics, footer,
  and the About/Privacy/Help modals), not just the AI response language. All 8
  languages are covered (cs, sk, hu, pl, en, de, es, fr) via per-locale JSON
  catalogs (222 keys each); the choice persists in `localStorage` and falls back
  to English. Non-English translations are machine-generated and would benefit
  from a native review pass.
- This `CHANGELOG.md`.

## [0.1.0] - 2025-10-12

Initial release.

### Added
- Python / FastAPI converter (`main.py`) turning mass, length, width, height,
  area, and power into "Škoda Fabia 1.2 HTP" units, with i18n via `gettext`
  and an `/embed` endpoint for embeddable HTML snippets.
- Cloudflare architecture under `skoda_vue/`:
  - **Frontend** — Vue 3 + Vite PWA (offline support, install prompt,
    multi-language UI).
  - **Backend** — Hono Worker with `/convert`, `/explain` (OpenAI-backed,
    cached), `/conversions`, `/models`, and `/stats` endpoints.
  - **D1 database** for conversion logging and AI-response caching
    (`schema.sql`, `schema_update.sql`).
- Localization assets for cs, de, en, es, fr.

[Unreleased]: https://github.com/kornelko2/fabia_api/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/kornelko2/fabia_api/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/kornelko2/fabia_api/releases/tag/v0.1.0
