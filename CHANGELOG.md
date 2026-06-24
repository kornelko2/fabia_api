# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2026-06-24

SEO Tier 1 — pre-rendered landing pages (frontend `skoda_vue/`).

### Added
- **Static site generation** via `vite-ssg` + `vue-router`: routes now pre-render
  to real static HTML and hydrate into the same SPA. Build is `vite-ssg build`.
- **8 SEO landing pages** (`/hectare-in-skoda-fabias`, `/eiffel-tower-in-skoda-fabias`,
  `/blue-whale-in-skoda-fabias`, …), data-driven from `src/content/pages.js`. Each
  has a unique title/description/canonical, a single `<h1>`, a statically-computed
  "≈ N Škoda Fabias" answer in the HTML, the live converter prefilled, a visible
  FAQ, and internal links. Add a page = add a catalog entry.
- **Structured data:** `FAQPage` JSON-LD per landing page, sitewide `WebSite` +
  `SearchAction` (sitelinks search box).
- **Generated `sitemap.xml`** from the catalog (`scripts/make-sitemap.mjs`, wired
  into `build`) — 9 URLs incl. the OG image.
- Footer **"Popular comparisons"** internal links (all 8 locales).

### Changed
- `main.js` exports a `ViteSSG` app; `App.vue` is now the layout
  (`Header` + `<router-view>` + `Footer`); home content lives in `HomeView`.
- `ConversionForm` decoupled from the `currentLanguage` prop (uses `$i18n.locale`);
  gains `initialInput` (landing-page prefill) and `headingLevel` (one `<h1>` per
  page) props. Footer example chips drive the converter via the `/?q=` deep link.
- Tightened hero + Open Graph/Twitter copy to lead with the value ("big numbers,
  finally graspable").
- Header brand is now a home link (was an `<h1>`) so each page has a single `<h1>`.

### Notes
- Landing pages are English-only for now; per-language URLs + `hreflang` are a
  later tier. `getInitialLocale()` and the service-worker registration were made
  SSR-safe for static generation.

## [0.3.0] - 2026-06-24

UI redesign & icon system (frontend `skoda_vue/`).

### Added
- Icon system based on `@lucide/vue` with a thin `AppIcon.vue` wrapper
  (consistent size/stroke, `currentColor`, decorative by default, `label` prop
  for accessible icon-only controls).
- **Deep-linkable conversions:** the URL now encodes the conversion as
  `?q=<input>&lang=<value>&style=<funny|scientific>`. Opening such a link
  auto-fills and auto-converts; every conversion updates the address bar
  (`history.replaceState`) so any result is shareable.
- **Real Open Graph image:** a branded 1200×630 PNG (`public/og-image.png`)
  generated from an inline SVG via `scripts/make-og-image.mjs` (`npm run
  og-image`, `sharp` devDependency). `og:image`/`twitter:image` point at it and
  the Twitter card is now `summary_large_image`.
- Brand + URL credit line inside the result card so screenshots are
  self-explanatory.
- New locale keys (`form.options`, `stats.show`, `stats.hide`) across all 8
  languages.

### Changed
- Replaced decorative emoji throughout Header, ConversionForm, Footer and
  Statistics with Lucide icons; `getTypeIcon()` now returns icon components.
  (Language flags and native `<select>` options keep emoji by design.)
- **Progressive disclosure:** advanced controls (Response Language, Explanation
  Style) moved into a collapsed "Options" disclosure; the Statistics section is
  now collapsible (collapsed by default on mobile, lazy-loads `/stats`); footer
  feature list condensed into a two-column grid.
- **Share** is now the primary (green) result action, ahead of Copy/Embed.

### Accessibility
- Added visible keyboard `:focus-visible` outlines for buttons, links and
  summaries; `aria-label`s on all icon-only controls (close, share, embed) and
  `aria-hidden` on decorative icons.
- Raised low-contrast secondary text to meet WCAG AA.

## [0.2.0] - 2026-06-23

### Fixed
- Stopped the footer from polling `/stats` every 30 seconds. The interval was
  never cleared, so Vite HMR stacked duplicate timers in dev (a flood of
  requests) and it generated needless background traffic in production. Stats
  now load once on mount; the Statistics section's Refresh button covers manual
  updates.
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
- GitHub repository link (with the GitHub mark) in the footer's "Support This
  Project" section, next to the Buy Me a Coffee banner.
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
