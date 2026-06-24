import HomeView from '../views/HomeView.vue'

// Static routes. vite-ssg pre-renders each of these to its own HTML file.
// Landing/SEO pages are added in Phase 1 (data-driven from src/content/pages.js).
export const routes = [
  { path: '/', name: 'home', component: HomeView }
]
