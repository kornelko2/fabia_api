# Škoda Fabia Converter — UI Redesign & Icon System Plan

> A staged, resumable plan. Work top-to-bottom; each task has a checkbox so work
> can stop and resume at any time without losing context. Update the **Status**
> and the **Progress log** at the bottom as you go.

**Status legend:** `[ ]` todo · `[~]` in progress · `[x]` done · `[-]` skipped/deferred

**Goal in one sentence:** turn the app into a clean, friendly, easy-to-understand
single-page tool — replace emoji with a proper Vue icon set, show less on first
glance (progressive disclosure), and make results genuinely shareable so people
post it in chats and link it from their projects.

**Owner:** kornelko · **Started:** 2026-06-23 · **Frontend:** Vue 3.5 + Vite 7 (`skoda_vue/`)

---

## How to resume after an interruption
1. Open this file, find the first unchecked `[ ]` task.
2. Re-read the phase's **Acceptance criteria** before coding.
3. After each task: tick the box, add a line to the **Progress log**, run
   `npm run build` to confirm nothing broke.
4. Don't deploy mid-phase; finish a phase, then deploy as one unit.

---

## Phase tracker
- [x] **Phase 0 — Decide & set up the icon system** (blocking; do first)
- [x] **Phase 1 — Replace emoji with icons** (depends on Phase 0)
- [ ] **Phase 2 — Simplify the UI (progressive disclosure)**
- [ ] **Phase 3 — Shareability & engagement**
- [ ] **Phase 4 — Polish, accessibility & QA**

---

## Phase 0 — Decide & set up the icon system

**Decision needed (pick one):**
- **`lucide-vue-next` — RECOMMENDED.** Clean, consistent line icons, tree-shakable
  (only imported icons ship), MIT, ~friendly modern look, tiny per-icon cost.
  `npm i lucide-vue-next`. Usage: `import { Car, Share2 } from 'lucide-vue-next'`.
- **`unplugin-icons` + Iconify** — most flexible "standard" route: auto-import any
  icon from 200k+ (Material, Tabler, Phosphor, Lucide…) via `~icons/...`. Slightly
  more Vite config; great if we want to mix sets later.
- **`@mdi/js` + a small `<SvgIcon>` wrapper** — Material Design Icons, the classic
  Vue choice; verbose without Vuetify.

**Recommendation:** start with **`lucide-vue-next`** (simplest, looks great, no
config). Revisit Iconify only if we need icons Lucide lacks (e.g. brand/flag icons).

### Tasks
- [x] Confirm the icon library (default: `lucide-vue-next`). **NOTE:**
      `lucide-vue-next` is now deprecated (v1.0.0 points to a stub); installed the
      maintained successor **`@lucide/vue`** (`1.21.0`) instead. Same named-import
      API, so all later phases are unaffected.
- [x] `npm i @lucide/vue` and commit the lockfile change. *(lockfile updated;
      commit when convenient — see Progress log.)*
- [x] Create a tiny convention doc / wrapper: standard size (`20`), stroke
      width (`2`), color via `currentColor` so icons inherit text color.
      *(See **Conventions** below.)*
- [x] Add `src/components/AppIcon.vue` thin wrapper for consistent size/stroke
      and a11y (decorative by default; pass `label` for meaningful icons).
- [-] Decide the **language-flag** question: **keeping emoji flags** (🇨🇿 …)
      for now — they read fine and a flag-icon set would be scope creep.
      Revisit only if a specific platform renders them poorly.

**Acceptance criteria:** library installed, one icon rendered somewhere as a
smoke test, build passes, conventions written down here.

---

## Phase 1 — Replace emoji with icons

Emoji currently live in component **templates** (next to `{{ $t(...) }}`), not in
the locale JSON — so this is template-only work and does not touch translations.

**Inventory (approx. occurrences):** ConversionForm 29 · Statistics 48 ·
Footer 13 · Header 13 · App.vue 9 (these 9 are language flags — see Phase 0).

### Mapping reference (emoji → Lucide icon)
| Emoji | Where | Lucide icon |
|---|---|---|
| 🚗 | brand / car refs | `Car` |
| 🎯 | input hint, popular types | `Target` |
| 🎉 | "Funny" style/badge | `Sparkles` or `PartyPopper` |
| 🔬 | "Scientific" style/badge | `Microscope` or `FlaskConical` |
| ⚡ | cached, power | `Zap` |
| 📊 | conversion, stats title | `ChartColumnBig` (Lucide renamed `BarChart3`) |
| 📚 | detailed explanation | `BookOpen` |
| ❌ | error | `CircleX` |
| 🔧 | examples heading | `Wrench` |
| 📏 | reference specs, length | `Ruler` |
| 📋 | copy | `Copy` / `ClipboardCopy` |
| 📤 | share | `Share2` |
| 🔗 | embed / link | `Link2` |
| 🔄 | refresh / reuse | `RefreshCw` |
| 📈 | total served | `TrendingUp` |
| 🕒 | recent | `Clock` |
| 🏆 | most requested | `Trophy` |
| 🌍 | language usage, 8 languages | `Globe` |
| 📅 | last updated | `Calendar` |
| → | conversion arrow | `ArrowRight` |
| 🧠 | AI explanations | `BrainCircuit` |
| 📱 | PWA / install | `Smartphone` |
| ⬆️ | scroll to top | `ArrowUp` |
| ❤️ | "built with love" | `Heart` |
| 🔴 | live indicator | `Radio` / small dot |
| ⛽ | consumption | `Fuel` |
| ⚖️ | weight | `Scale` |
| 💰 | price | `Coins` / `Euro` |
| ↔️ | width | `MoveHorizontal` |
| ↕️ | height | `MoveVertical` |
| 📐 | area | `Square` / `Ruler` |

### Tasks (by file)
- [x] **Header.vue** — menu Embed/Share, embed dialog title, copy, close (X).
- [x] **ConversionForm.vue** — title, hint, convert button (also fixed a corrupted
      glyph), result badges, conversion/explanation headers, action buttons, error,
      examples, specs, embed dialog copy/close.
- [x] **Footer.vue** — feature list, action buttons, live indicator, modal close
      buttons (added `aria-label`s). GitHub mark left as its existing SVG.
- [x] **Statistics.vue** — section headers, refresh/loading spinner, both arrows,
      overview stat icons, mini-buttons, details modal, embed dialog.
- [x] Replace `getTypeIcon()` emoji map → `TYPE_ICONS` map of Lucide components;
      render with `<AppIcon :icon="getTypeIcon(type)" />`.
- [x] Add `aria-label`/`title` to every icon-only button (close buttons, stats
      share/embed mini-buttons).
- [x] Remove now-unused emoji; `npm run build` passes.

**Notes / intentional exceptions (not "decorative template emoji"):**
- **Language flags** (🇨🇿 …) kept — Phase 0 decision. Still present in the
  Response Language `<select>` (native options can't render components).
- **Explanation Style `<option>` emoji** (🎉 / 🔬) removed → plain text, since the
  native dropdown can't render icons. The visible **result badges** use icons.
  (Adding icons *inside* a dropdown needs a custom select — deferred to Phase 2.)
- **Generated embed-HTML strings** (🚗/📊 inside `generateEmbed*()`) kept — that's
  third-party English-only output, polished in Phase 3, not app chrome.
- **`getLanguageFlag()` `🌍` fallback** kept — consistent with keeping emoji flags.

**Acceptance criteria:** met — no decorative emoji left in app templates (flags +
documented exceptions kept), icon-only controls have accessible labels, build
passes, bundle +~3 kB gzip (icons tree-shaken).

---

## Phase 2 — Simplify the UI (progressive disclosure)

**Principle:** first screen answers "what is this and how do I use it?" in one
glance. Everything else is available on scroll or behind a toggle.

**Target information hierarchy (top → bottom):**
1. **Hero** — product name + one-line value ("Measure anything in Škoda Fabias")
   + the single input and a primary **Convert** button. Maybe 1 example chip.
2. **Result** — appears in place, clean and screenshot-friendly.
3. *(scroll)* **Examples** — the category tiles, collapsed/condensed.
4. *(scroll)* **Statistics** — moved below the fold, optionally collapsed.
5. **Footer** — condensed; About/Privacy/Help stay as modals.

### Tasks
- [ ] Make the hero the only above-the-fold block: input + Convert + short
      subtitle. Move everything else down.
- [ ] Move **Statistics** below examples; wrap in a collapsible "Show live stats"
      section (collapsed by default on mobile).
- [ ] Demote the advanced controls: put **Response Language** + **Explanation
      Style** behind a small "Options" disclosure with sensible defaults
      (language = UI language, style = Funny). Keep them reachable, not upfront.
- [ ] Condense the footer feature list (icons + short labels, not a wall of text).
- [ ] Tighten copy: shorter labels, fewer sentences; let icons carry meaning.
- [ ] Add subtle section spacing/dividers so scrolling feels structured.
- [ ] Re-check all 8 languages — German/Czech strings are longer; ensure no
      overflow in the simplified layout.

**Acceptance criteria:** on a phone viewport, the first screen shows only
hero+input+CTA (+ maybe one example); a new user understands what to do without
scrolling; advanced options are one tap away, not in the way.

---

## Phase 3 — Shareability & engagement

**Principle:** make it effortless and rewarding to share a result or the app.

### Tasks
- [ ] **Real Open Graph image.** Create a 1200×630 PNG (branded: car silhouette +
      "Measure everything in Škoda Fabias") and point `og:image`/`twitter:image`
      at the absolute URL. (Current og:image is the SVG logo — many chat apps
      don't render SVG previews.)
- [ ] Use `twitter:card = summary_large_image` once the PNG exists.
- [ ] **Shareable result cards** — design the result block to look good as a
      screenshot (brand, the input → "X Fabias", small footer credit + URL).
- [ ] **Deep-linkable conversions** — encode the conversion in the URL (query
      params, e.g. `?v=1500&u=ps&t=power&lang=cs`); on load, read params and
      auto-fill/auto-convert. Then "Share" copies a link that reproduces the
      exact result. Big driver of organic sharing.
- [ ] Polish the existing **Embed** snippet output (it's English-only HTML by
      design) — make the default look clean and on-brand.
- [ ] Add a single, prominent **Share** affordance near the result (Web Share API
      with clipboard fallback — already implemented; just surface it better).
- [ ] (Optional) Light **social proof** — a small "N conversions" teaser pulled
      from `/stats` near the hero (one number, not the full stats panel).

**Acceptance criteria:** pasting the URL in a chat shows a proper title +
description + image card; "Share" on a result produces a link that reopens that
exact conversion; result looks good as a screenshot.

---

## Phase 4 — Polish, accessibility & QA

### Tasks
- [ ] Typography scale + spacing consistency pass (one rhythm across sections).
- [ ] Color usage: green as accent only; neutral text; sufficient contrast (WCAG AA).
- [ ] Focus states on all interactive elements; logical tab order.
- [ ] `aria-label`s verified on icon-only buttons; `aria-hidden` on decorative icons.
- [ ] Responsive sweep: 360px, 768px, 1280px.
- [ ] Cross-language sweep: all 8 locales render without overflow.
- [ ] Lighthouse pass (Performance/Accessibility/Best-Practices/SEO) — aim ≥ 90.
- [ ] Final `npm run build`, deploy, smoke-test on `fabia-conv.crayz.me`.
- [ ] Update `CHANGELOG.md` (new `[Unreleased]` → version bump) and tag.

**Acceptance criteria:** Lighthouse ≥ 90 across the board, no a11y violations on
interactive controls, clean responsive layout in every language.

---

## Conventions (set in Phase 0)
- **Icon library:** `@lucide/vue` (v1.21.0) — the maintained successor to the now
  deprecated `lucide-vue-next`. Tree-shaken: only imported icons ship.
- **Import:** `import { Share2 } from '@lucide/vue'` (named PascalCase imports).
- **Render:** prefer the wrapper `import AppIcon from './AppIcon.vue'` (relative —
  no `@` alias in this project) then `<AppIcon :icon="Share2" />`. Direct use
  (`<Share2 :size="20" />`) is fine for one-offs.
- **Default icon size / stroke:** `20` / `2` (the `AppIcon` defaults).
- **Color:** icons inherit `currentColor` — set `color` on the parent, don't
  hard-code icon color.
- **Accessibility:** decorative icons are hidden by default (`AppIcon` sets
  `aria-hidden`). For a meaningful/icon-only control, pass `label` →
  `<AppIcon :icon="Share2" :label="$t('header.shareApp')" />` (renders
  `role="img"` + `aria-label`).
- **Renamed icons to watch for:** `BarChart3` → `ChartColumnBig`. Most other
  names in the Phase 1 mapping table are unchanged in `@lucide/vue` (verified).

## Files in scope
- `src/components/Header.vue`
- `src/components/ConversionForm.vue`
- `src/components/Footer.vue`
- `src/components/Statistics.vue`
- `src/App.vue` (language flags)
- `src/style.css` (spacing/typography/buttons)
- `index.html` (og:image / twitter card for Phase 3)
- `public/` (new og-image PNG for Phase 3)

## Out of scope (for now)
- Switching CSS frameworks (no Tailwind/Vuetify migration).
- Re-translating locale JSON (emoji are in templates, not the catalogs).
- Backend/Worker changes (unless deep-link sharing needs a new endpoint — it
  shouldn't; query-param state is client-side).

---

## Progress log
> Append one line per session: date — what changed — next step.
- 2026-06-23 — Plan created. Next: Phase 0, confirm `lucide-vue-next` and install.
- 2026-06-24 — Phase 0 done. `lucide-vue-next` is deprecated → installed
  `@lucide/vue@1.21.0` (same API). Added `src/components/AppIcon.vue` wrapper
  (size 20 / stroke 2, decorative by default, `label` for a11y). Smoke-tested a
  `Car` icon through the wrapper — `npm run build` passes, icons tree-shake.
  Conventions filled in above; keeping emoji flags. Lockfile changed (not yet
  committed). Next: Phase 1 — replace template emoji with icons, starting
  Header.vue (note `BarChart3` → `ChartColumnBig`).
- 2026-06-24 — Phase 1 done. Replaced decorative emoji with Lucide icons across
  Header / ConversionForm / Footer / Statistics via `<AppIcon :icon="…">`.
  Refactored `getTypeIcon()` to return components (`TYPE_ICONS` map). Added
  `aria-label`s to icon-only close/share/embed buttons; fixed a corrupted glyph
  on the Convert button. Kept emoji flags, `<option>` emoji, and generated
  embed-HTML emoji (documented). `npm run build` passes (+~3 kB gzip). Next:
  Phase 2 — simplify the UI (progressive disclosure).
