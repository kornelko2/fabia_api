import { ViteSSG } from 'vite-ssg'
import './style.css'
import App from './App.vue'
import { routes } from './router/routes'
import i18n from './i18n'

// vite-ssg entry: exports a `createApp` factory used for both client hydration
// and static generation. Plugins are registered in the setup callback so each
// SSG render gets a properly configured app.
export const createApp = ViteSSG(
  App,
  { routes },
  ({ app }) => {
    app.use(i18n)
  }
)
