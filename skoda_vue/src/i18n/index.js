import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import cs from './locales/cs.json'
import sk from './locales/sk.json'
import hu from './locales/hu.json'
import pl from './locales/pl.json'
import de from './locales/de.json'
import es from './locales/es.json'
import fr from './locales/fr.json'

export const SUPPORTED_LOCALES = ['cs', 'sk', 'hu', 'pl', 'en', 'de', 'es', 'fr']

function getInitialLocale() {
  const saved = localStorage.getItem('preferred-language')
  if (saved && SUPPORTED_LOCALES.includes(saved)) return saved
  const browser = (navigator.language || 'en').slice(0, 2)
  return SUPPORTED_LOCALES.includes(browser) ? browser : 'en'
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: { en, cs, sk, hu, pl, de, es, fr }
})

export default i18n
