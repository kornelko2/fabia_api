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
- [x] **Phase 2 — Structured data & discovery** (FAQ/WebSite JSON-LD, sitemap, links)
- [~] **Phase 3 — Copy & QA** (code done; deploy + Lighthouse/Search Console pending)
- [x] **Phase 4 — Czech localization (Tier 2)** (cs landing pages + /cs/ home + hreflang)

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
- [x] `FAQPage` JSON-LD on every landing page (3 Q&As each) with a matching
      **visible** FAQ section (Google requires the schema to mirror page content).
- [x] `WebSite` + `SearchAction` JSON-LD (sitewide via `index.html`) →
      `?q={search_term_string}` for a potential sitelinks search box.
- [x] **Generated** `sitemap.xml` from the catalog via `scripts/make-sitemap.mjs`,
      wired into `npm run build` (`npm run sitemap && vite-ssg build`). 9 URLs,
      with the OG image on home.
- [x] Footer **"Popular comparisons"** internal links (6 landing pages) — appear
      on every page, so the pages are discoverable + get link equity. Added the
      `footer.popularComparisons` key to all 8 locales.

**Acceptance:** met — each landing page carries WebApplication + WebSite + FAQPage
JSON-LD; sitemap lists all 9 URLs; footer links to the pages sitewide.
(Validate with Google's Rich Results test after deploy.)

---

## Phase 3 — Copy & QA
### Tasks
- [x] Tightened hero subtitle (English `form.description`) and the meta /
      og:description / twitter:description to lead with the value
      ("big numbers, finally graspable").
- [x] View-source QA: built HTML for home + landing pages contains the title,
      hero copy, H1, FAQ and footer links **without JS**.
- [x] `npm run build` passes; `sitemap.xml` `lastmod` auto-set to build date.
- [x] Bumped `skoda_vue` 0.3.0 → 0.4.0 and wrote the `[0.4.0]` CHANGELOG entry.
- [ ] **Redeploy** to `fabia-conv.crayz.me` (owner's manual step).
- [ ] **Post-deploy:** re-run Lighthouse (watch SEO/perf), resubmit `sitemap.xml`
      in Google Search Console, validate a landing page in the Rich Results test.

**Acceptance:** met (code) — view-source shows real content per page. Lighthouse +
Search Console validation happen against the deployed build.

---

## Phase 4 — Czech localization (Tier 2, added on request)
**Goal:** Czech is the primary market — give the SEO pages a Czech mutation with
proper per-language URLs and `hreflang`.

### Done
- [x] `pages.js` restructured to per-locale content (`locales.en` / `locales.cs`),
      with hand-written Czech titles/descriptions/H1s/intros and Czech slugs
      (e.g. `/cs/hektar-ve-skoda-fabiich`). `LOCALES`, `DEFAULT_LOCALE`, `pagePath()`.
- [x] Landing UI strings + reference labels moved to a `landing.*` i18n block
      (en + cs); answers formatted with `toLocaleString('cs-CZ')`.
- [x] `LandingView` is locale-aware: forces its locale at render, localized
      content/FAQ, `canonical` + full `hreflang` (en/cs/x-default) + `og:locale`.
- [x] **Per-app i18n** (`createI18nInstance()` in the ViteSSG setup) so each
      prerendered route renders in its own locale with no leakage. Verified: EN
      pages stay English, CS pages render fully in Czech (incl. the converter UI).
- [x] Routes: `/`, `/cs/` (Czech home), `/<slug>` (en), `/cs/<slug>` (cs).
      `HomeView` takes a `locale` prop and emits home `hreflang` + Czech meta.
- [x] Footer "Popular comparisons" links resolve to the current locale's slug
      (falls back to en for the other 6 UI languages, which have no pages).
- [x] Sitemap regenerated for both locales **with `xhtml:link` hreflang
      alternates** — 18 URLs, 3 alternates each.

**Acceptance:** met — `npm run build` emits 18 prerendered HTML files (9 en + 9 cs);
each CS page is Czech with correct canonical + hreflang; sitemap covers every URL
with alternates.

**Follow-ups (not done):** the header language switch still sets locale in place
(doesn't navigate to the locale's URL); only en+cs have pages (the other 6 UI
languages remain client-side on `/`). Per-page "view in Čeština / English" links
could be added if wanted.

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
- 2026-06-24 — Phase 2 done. FAQPage JSON-LD + visible FAQ on landing pages;
  WebSite/SearchAction sitewide; generated sitemap.xml (9 URLs, wired into build);
  footer "Popular comparisons" links (8 locales). Verified all JSON-LD + sitemap
  in the built output. Next: Phase 3 — messaging/copy polish, view-source check,
  redeploy + Lighthouse.
- 2026-06-24 — Phase 3 (code) done. Tightened hero + og/twitter copy; view-source
  QA confirms prerendered content without JS; bumped to 0.4.0 + CHANGELOG. SEO
  Tier 1 is code-complete. **Remaining (owner):** deploy, then re-run Lighthouse,
  resubmit sitemap in Search Console, validate Rich Results.
- 2026-06-24 — Phase 4 (Czech, Tier 2) done. Per-locale `pages.js` + Czech copy +
  Czech slugs; `/cs/` home + `/cs/<slug>` landing pages; locale-aware
  `LandingView`/`HomeView` with hreflang; per-app i18n for SSG isolation; sitemap
  with hreflang alternates (18 URLs). Build emits 9 en + 9 cs prerendered files,
  verified Czech rendering + cross-locale hreflang. Still pending: deploy +
  Search Console (submit sitemap, confirm hreflang/Rich Results on the live site).
