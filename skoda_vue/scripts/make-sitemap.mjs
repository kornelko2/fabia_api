// Generates public/sitemap.xml from the landing-page catalog (all locales) with
// hreflang alternates, so the sitemap never drifts from the routes.
// Wired into `npm run build`.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { pages, LOCALES, DEFAULT_LOCALE, pagePath } from '../src/content/pages.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/sitemap.xml')
const BASE = 'https://fabia-conv.crayz.me'
const today = new Date().toISOString().slice(0, 10)

const xmlEscape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Build entries: each has its loc + the set of hreflang alternates it belongs to.
const entries = []

// Home pages (one per locale) — alternates point at each locale home.
const homeAlternates = LOCALES.map(l => ({
  hreflang: l,
  href: BASE + (l === DEFAULT_LOCALE ? '/' : `/${l}/`)
}))
LOCALES.forEach(l => {
  entries.push({
    loc: BASE + (l === DEFAULT_LOCALE ? '/' : `/${l}/`),
    priority: l === DEFAULT_LOCALE ? '1.0' : '0.9',
    alternates: homeAlternates,
    image: l === DEFAULT_LOCALE
      ? {
          loc: `${BASE}/og-image.png`,
          title: 'Škoda Fabia Converter — measure everything in Škoda Fabias',
          caption: 'Branded preview card for the Škoda Fabia unit converter.'
        }
      : null
  })
})

// Landing pages — one entry per locale, each carrying the full alternate set.
pages.forEach(page => {
  const alternates = LOCALES.map(l => ({
    hreflang: l,
    href: BASE + pagePath(page.locales[l].slug, l)
  }))
  LOCALES.forEach(l => {
    entries.push({
      loc: BASE + pagePath(page.locales[l].slug, l),
      priority: '0.8',
      alternates
    })
  })
})

const body = entries.map(e => {
  const alts = e.alternates
    .map(a => `\n    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${xmlEscape(a.href)}"/>`)
    .join('')
  const xdefault = `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(e.alternates.find(a => a.hreflang === DEFAULT_LOCALE).href)}"/>`
  const image = e.image
    ? `\n    <image:image>\n      <image:loc>${e.image.loc}</image:loc>\n      <image:title>${xmlEscape(e.image.title)}</image:title>\n      <image:caption>${xmlEscape(e.image.caption)}</image:caption>\n    </image:image>`
    : ''
  return `  <url>\n    <loc>${xmlEscape(e.loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${e.priority}</priority>${alts}${xdefault}${image}\n  </url>`
}).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`

writeFileSync(OUT, xml, 'utf8')
console.log(`Wrote ${OUT} (${entries.length} URLs, ${LOCALES.length} locales)`)
