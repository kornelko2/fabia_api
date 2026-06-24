# Škoda Fabia Converter — SEO Tier 1 (vite-ssg landing pages)

> Staged, resumable plan. Goal: add **crawlable, pre-rendered SEO pages** without
> leaving the Vue + Vite + Cloudflare Pages stack. We add `vue-router` + `vite-ssg`
> so chosen routes are emitted as real static HTML (unique title/description/H1 +
> answer text), then hydrate into the same interactive app.

**Status legend:** `[ ]` todo · `[~]` in progress · `[x]` done · `[-]` skipped/deferred

**Owner:** kornelko · **Started:** 2026-06-24 · **Stack:** Vue 3.5 + Vite 7 + vite-ssg

---

## Decisions (locked)
- **Tool:** `vite-ssg` (true SSG + hydration; no headless browser, no framework swap).
- **Scope:** stay single-locale (English) for prerender. Per-language URLs +
  `hreflang` are **Tier 2** (out of scope here).
- **Landing pages are data-driven:** one `LandingView.vue` + a `pages.js` catalog
  (slug, title, description, H1, intro, prefilled example). Add a page = add a
  catalog entry. `vite-ssg` `includedRoutes` enumerates them.
- **PWA stays.** If the service worker doesn't precache the new HTML pages, that's
  acceptable for now (they load over the network); revisit if needed.

---

## Phase tracker
- [x] **Phase 0 — Foundation** (router + vite-ssg + SSR-safe i18n; build emits HTML)
- [x] **Phase 1 — Landing pages** (data-driven SEO pages reusing the converter)
- [ ] **Phase 2 — Structured data & discovery** (FAQ/WebSite JSON-LD, sitemap, links)
- [ ] **Phase 3 — Copy & QA** (tighten messaging, verify prerendered HTML, redeploy)

---

## Phase 0 — Foundation
**Goal:** the app runs through `vue-router` and `vite build` emits a static
`index.html` with real content (not an empty shell), with PWA + i18n intact.

### Tasks
- [x] Make `getInitialLocale()` SSR-safe (guards `window`/`localStorage`; default
      `en` on the server).
- [x] Convert `main.js` to `export const createApp = ViteSSG(App, { routes },
      ({ app }) => app.use(i18n))`.
- [x] Add `src/router/routes.js` with `/` → `HomeView`.
- [x] Extract home content into `views/HomeView.vue`; `App.vue` is now the layout
      (`Header` + `<router-view>` + `Footer` + PWA/install/language state).
      Decoupled `ConversionForm` from the `currentLanguage` prop (uses
      `$i18n.locale`); footer example chips now drive the converter via the
      `/?q=` deep-link (works from any page).
- [x] Wire `vite-ssg` in `vite.config.js` (`ssgOptions`). Build script →
      `vite-ssg build` (kept `build:spa` as a fallback).
- [x] `npm run build` emits a **23 KB** prerendered `dist/index.html`
      (`data-server-rendered="true"`, real form/stats markup); dev works; PWA
      still generates `sw.js`. Made SW registration a client-only dynamic import
      so the SSR build doesn't resolve the PWA virtual module on the server.

**Acceptance:** met — `/` prerenders with real content; app hydrates via router.
(Browser smoke-test of convert/deep-link/stats/lang/install recommended.)

---

## Phase 1 — Landing pages
### Tasks
- [x] Added `src/content/pages.js` — `REFERENCES` (Fabia specs) + **8 pages**:
      hectare / football-field / tennis-court / eiffel-tower / olympic-pool /
      kilometer / elephant / blue-whale. Each has a unique title, description,
      H1, intro and a value used to compute the answer statically.
- [x] `views/LandingView.vue` (`<script setup>`): unique `<h1>`, a
      **statically-computed answer** (`round(value / REFERENCES[type])`) baked
      into the HTML, SEO intro, the reused `ConversionForm` **prefilled** with the
      example (no auto API call), and internal links to the other pages + Home.
- [x] Per-page `useHead()` — title, meta description, canonical, og/twitter tags.
- [x] Routes generated from the catalog (`routes.js`); all 8 are static so
      vite-ssg prerenders each to its own HTML file.
- [x] **Heading hygiene:** demoted the Header brand from `<h1>` to a link, made
      the converter title `<h1>` on Home / `<h2>` on landing (via `headingLevel`
      prop) → exactly one `<h1>` per page.

**Acceptance:** met — `npm run build` emits 9 HTML files; each landing page's
static source carries its own title/description/canonical/H1 and the computed
"≈ N Škoda Fabias" answer; pages interlink; one `<h1>` each.

---

## Phase 2 — Structured data & discovery
### Tasks
- [ ] `FAQPage` JSON-LD on landing pages (2–4 Q&As each) + `WebSite` +
      `SearchAction` on home.
- [ ] Add all routes to `public/sitemap.xml` (or generate it).
- [ ] Footer/home internal links to the main category pages.

**Acceptance:** valid structured data (Rich Results test); sitemap lists every page.

---

## Phase 3 — Copy & QA
### Tasks
- [ ] Tighten hero/meta messaging (intuition-first: "big numbers, finally graspable").
- [ ] Verify prerendered HTML via `curl`/view-source (content present without JS).
- [ ] `npm run build`, redeploy, re-run Lighthouse (watch SEO + perf).
- [ ] Bump version + CHANGELOG; update sitemap `lastmod`.

**Acceptance:** view-source shows real content per page; Lighthouse SEO stays 100.

---

## Risks / watch-list
- **i18n in SSR:** `legacy:false` + `globalInjection` is SSR-friendly; just guard
  browser globals. Prerender renders in `en`.
- **PWA + vite-ssg ordering:** SW may not precache the new HTML; acceptable for now.
- **`window`/`localStorage` in components:** any browser-only access must be inside
  `onMounted`/guards, or SSG will throw. (ConversionForm/Statistics fetch in
  `mounted` — fine; watch for top-level `window` use.)

## Progress log
- 2026-06-24 — Plan created; installed `vue-router`, `vite-ssg`, `@unhead/vue`
  (pinned to v2 to match vite-ssg's `unhead@2`). Next: Phase 0 foundation.
- 2026-06-24 — Phase 0 done. Router + vite-ssg wired; `main.js` → `ViteSSG`;
  `App.vue` is the layout, `HomeView` holds the converter+stats. i18n + SW made
  SSR-safe. `npm run build` (now `vite-ssg build`) prerenders `/` to 23 KB of
  real HTML; PWA still works. Next: Phase 1 — data-driven landing pages.
- 2026-06-24 — Phase 1 done. `pages.js` catalog (8 long-tail pages) +
  `LandingView.vue` reusing the converter with a statically-computed answer and
  per-page `useHead`. Routes generated from the catalog; build emits 9 prerendered
  HTML files. Fixed heading hierarchy to one `<h1>` per page (Header brand → link,
  converter title `headingLevel` h1/h2). Next: Phase 2 — FAQ/WebSite JSON-LD,
  sitemap, internal links from home/footer.
