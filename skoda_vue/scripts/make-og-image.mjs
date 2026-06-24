// Generates the 1200x630 Open Graph image (public/og-image.png) from an inline
// SVG. Run with: npm run og-image
// Requires the dev dependency `sharp`.
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/og-image.png')

const GREEN = '#00A651'
const GREEN_DARK = '#008a44'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="1" stop-color="#e8f5e8"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="14" fill="${GREEN}"/>
  <rect y="616" width="1200" height="14" fill="${GREEN}"/>

  <!-- Brand row -->
  <g transform="translate(80,86)" fill="${GREEN}" font-family="Arial, Helvetica, sans-serif">
    <circle cx="22" cy="22" r="24" fill="${GREEN}"/>
    <text x="22" y="31" text-anchor="middle" fill="#ffffff" font-size="26" font-weight="bold">F</text>
    <text x="62" y="31" font-size="28" font-weight="bold" letter-spacing="2">ŠKODA FABIA CONVERTER</text>
  </g>

  <!-- Headline -->
  <g font-family="Arial, Helvetica, sans-serif">
    <text x="80" y="290" font-size="74" font-weight="bold" fill="#0a0a0a">Measure everything</text>
    <text x="80" y="372" font-size="74" font-weight="bold" fill="${GREEN}">in Škoda Fabias</text>
    <text x="80" y="440" font-size="32" fill="#555555">Free unit converter · AI explanations · 8 languages</text>
  </g>

  <!-- Car silhouette -->
  <g transform="translate(720,338)">
    <path d="M14,150
      C14,140 22,134 36,132
      L78,128
      C96,86 134,62 196,60
      L300,60
      C360,62 392,92 414,128
      L452,134
      C470,137 478,144 478,156
      L478,176
      C478,184 472,190 462,190
      L432,190
      A30,30 0 0 0 372,190
      L168,190
      A30,30 0 0 0 108,190
      L30,190
      C20,190 14,184 14,176
      Z"
      fill="${GREEN}" stroke="${GREEN_DARK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M120,124 C140,92 168,78 210,76 L292,76 C340,78 366,98 386,124 Z" fill="#d8f3e2" opacity="0.95"/>
    <line x1="252" y1="76" x2="252" y2="124" stroke="${GREEN}" stroke-width="3"/>
    <circle cx="138" cy="190" r="34" fill="#1a1a1a"/>
    <circle cx="138" cy="190" r="15" fill="#cfcfcf"/>
    <circle cx="402" cy="190" r="34" fill="#1a1a1a"/>
    <circle cx="402" cy="190" r="15" fill="#cfcfcf"/>
  </g>

  <!-- URL -->
  <text x="80" y="556" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="bold" fill="${GREEN_DARK}">fabia-conv.crayz.me</text>
</svg>`

await sharp(Buffer.from(svg)).png().toFile(OUT)
console.log('Wrote', OUT)
