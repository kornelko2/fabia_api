import HomeView from '../views/HomeView.vue'
import LandingView from '../views/LandingView.vue'
import { pages } from '../content/pages.js'

// Static routes. vite-ssg pre-renders each of these to its own HTML file.
// Landing/SEO pages are generated from the data-driven catalog (pages.js):
// each becomes a static `/<slug>` route that gets its own prerendered HTML.
export const routes = [
  { path: '/', name: 'home', component: HomeView },
  ...pages.map(page => ({
    path: `/${page.slug}`,
    name: page.slug,
    component: LandingView,
    props: { page }
  }))
]
