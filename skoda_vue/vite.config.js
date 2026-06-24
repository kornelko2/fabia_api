import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module'
      },
      includeAssets: ['skoda_green.svg'],
        manifest: {
          name: 'Škoda Fabia Converter',
          short_name: 'Fabia Units',
          description: 'Measure everything in Škoda Fabias - the ultimate unit converter',
        theme_color: '#00A651',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'skoda_green.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/skoda-fabia-api\.kornelko\.workers\.dev\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'fabia-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          }
        ]
      }
    })
  ],
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    // Render the SPA's dynamic bits only on the client; the prerendered HTML is
    // the SEO content + initial markup.
    crittersOptions: false
  }
})
