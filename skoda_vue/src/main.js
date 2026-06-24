import { ViteSSG } from 'vite-ssg'
import './style.css'
import App from './App.vue'
import { routes } from './router/routes'
import { createI18nInstance } from './i18n'

// vite-ssg entry: exports a `createApp` factory used for both client hydration
// and static generation. A fresh i18n instance per app keeps each prerendered
// route's locale isolated.
export const createApp = ViteSSG(
  App,
  { routes },
  ({ app }) => {
    app.use(createI18nInstance())
  }
)
