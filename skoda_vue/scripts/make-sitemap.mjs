// Generates public/sitemap.xml from the landing-page catalog so the sitemap
// never drifts from the routes. Wired into `npm run build`.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { pages } from '../src/content/pages.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/sitemap.xml')
const BASE = 'https://fabia-conv.crayz.me'
const today = new Date().toISOString().slice(0, 10)

const urls = [
  {
    loc: `${BASE}/`,
    priority: '1.0',
    image: {
      loc: `${BASE}/og-image.png`,
      title: 'Škoda Fabia Converter — measure everything in Škoda Fabias',
      caption: 'Branded preview card for the Škoda Fabia unit converter.'
    }
  },
  ...pages.map(p => ({ loc: `${BASE}/${p.slug}`, priority: '0.8' }))
]

const body = urls.map(u => {
  const image = u.image
    ? `\n    <image:image>\n      <image:loc>${u.image.loc}</image:loc>\n      <image:title>${u.image.title}</image:title>\n      <image:caption>${u.image.caption}</image:caption>\n    </image:image>`
    : ''
  return `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${u.priority}</priority>${image}\n  </url>`
}).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${body}
</urlset>
`

writeFileSync(OUT, xml, 'utf8')
console.log(`Wrote ${OUT} (${urls.length} URLs)`)
