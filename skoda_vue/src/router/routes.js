import HomeView from '../views/HomeView.vue'
import LandingView from '../views/LandingView.vue'
import { pages, LOCALES, DEFAULT_LOCALE, pagePath } from '../content/pages.js'

// Static routes — vite-ssg pre-renders each to its own HTML file.
//   /            English home
//   /cs/         Czech home
//   /<slug>      English landing pages
//   /cs/<slug>   Czech landing pages
const landingRoutes = pages.flatMap(page =>
  LOCALES.map(locale => ({
    path: pagePath(page.locales[locale].slug, locale),
    name: `${locale}-${page.locales[locale].slug}`,
    component: LandingView,
    props: { page, locale }
  }))
)

export const routes = [
  { path: '/', name: 'home', component: HomeView },
  ...LOCALES.filter(l => l !== DEFAULT_LOCALE).map(locale => ({
    path: `/${locale}/`,
    name: `home-${locale}`,
    component: HomeView,
    props: { locale }
  })),
  ...landingRoutes
]
