<template>
  <main class="main-content landing">
    <div class="container">
      <article class="landing-intro card">
        <p class="crumb">
          <router-link :to="homeLink">← Škoda Fabia Converter</router-link>
        </p>
        <h1>{{ content.h1 }}</h1>
        <p class="answer">≈ <strong>{{ nfmt }}</strong> {{ t('landing.answerUnit') }}</p>
        <p class="intro">{{ content.intro }}</p>
        <p class="how">{{ t('landing.how', { ref: refLabel, example: content.example, n: nfmt }) }}</p>
      </article>

      <!-- The real converter, prefilled with this page's example -->
      <ConversionForm :initial-input="content.example" heading-level="h2" />

      <section class="faq card">
        <h2>{{ t('landing.faqTitle') }}</h2>
        <div v-for="(item, i) in faqs" :key="i" class="faq-item">
          <h3>{{ item.q }}</h3>
          <p>{{ item.a }}</p>
        </div>
      </section>

      <section class="more card">
        <h2>{{ t('landing.moreTitle') }}</h2>
        <ul class="more-links">
          <li v-for="p in others" :key="p.locales[locale].slug">
            <router-link :to="otherLink(p)">{{ p.locales[locale].h1 }}</router-link>
          </li>
        </ul>
        <p>
          <router-link :to="homeLink" class="open-converter">{{ t('landing.openConverter') }}</router-link>
        </p>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import ConversionForm from '../components/ConversionForm.vue'
import { pages, REFERENCES, LOCALES, DEFAULT_LOCALE, pagePath } from '../content/pages.js'

const props = defineProps({
  page: { type: Object, required: true },
  locale: { type: String, default: 'en' }
})

const SITE = 'https://fabia-conv.crayz.me'

const { t, locale: i18nLocale } = useI18n({ useScope: 'global' })
// Render this page in its own locale (affects the prerendered HTML and the
// hydrated UI/converter).
i18nLocale.value = props.locale

const content = computed(() => props.page.locales[props.locale])
const fabias = computed(() => Math.round(props.page.value / REFERENCES[props.page.type]))
const nfmt = computed(() => fabias.value.toLocaleString(props.locale === 'cs' ? 'cs-CZ' : 'en-US'))
const refLabel = computed(() => t('landing.ref.' + props.page.type))

const homeLink = computed(() => (props.locale === DEFAULT_LOCALE ? '/' : `/${props.locale}/`))
const others = computed(() => pages.filter(p => p !== props.page).slice(0, 6))
const otherLink = (p) => pagePath(p.locales[props.locale].slug, props.locale)

const canonical = computed(() => SITE + pagePath(content.value.slug, props.locale))

const faqs = computed(() => {
  const params = { n: nfmt.value, example: content.value.example, ref: refLabel.value }
  return [
    { q: content.value.h1, a: t('landing.faqA1', params) },
    { q: t('landing.faqQ2', params), a: t('landing.faqA2', params) },
    { q: t('landing.faqQ3'), a: t('landing.faqA3') }
  ]
})

const faqJsonLd = computed(() => JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.value.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }
  }))
}))

useHead(() => ({
  title: content.value.title,
  meta: [
    { name: 'description', content: content.value.description },
    { property: 'og:title', content: content.value.title },
    { property: 'og:description', content: content.value.description },
    { property: 'og:url', content: canonical.value },
    { property: 'og:type', content: 'article' },
    { property: 'og:locale', content: props.locale === 'cs' ? 'cs_CZ' : 'en_US' },
    { name: 'twitter:title', content: content.value.title },
    { name: 'twitter:description', content: content.value.description }
  ],
  link: [
    { rel: 'canonical', href: canonical.value },
    ...LOCALES.map(l => ({
      rel: 'alternate',
      hreflang: l,
      href: SITE + pagePath(props.page.locales[l].slug, l)
    })),
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: SITE + pagePath(props.page.locales[DEFAULT_LOCALE].slug, DEFAULT_LOCALE)
    }
  ],
  script: [{ type: 'application/ld+json', innerHTML: faqJsonLd.value }]
}))
</script>

<style scoped>
.landing {
  padding-top: 2rem;
}

.landing-intro {
  margin-bottom: 1.5rem;
}

.crumb {
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
}

.crumb a {
  color: var(--skoda-green);
  text-decoration: none;
  font-weight: 600;
}

.landing-intro h1 {
  color: #1a1a1a;
  font-size: 1.75rem;
  line-height: 1.2;
  margin-bottom: 0.5rem;
}

.answer {
  font-size: 1.5rem;
  color: var(--skoda-green);
  font-weight: 700;
  margin: 0.5rem 0 1rem;
}

.answer strong {
  font-size: 2rem;
}

.intro,
.how {
  color: #444;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.how {
  color: #666;
  font-size: 0.9375rem;
}

.faq {
  margin-top: 1.5rem;
}

.faq h2,
.more h2 {
  color: var(--skoda-green);
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}

.faq-item {
  margin-bottom: 1rem;
}

.faq-item:last-child {
  margin-bottom: 0;
}

.faq-item h3 {
  font-size: 1rem;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.faq-item p {
  color: #555;
  line-height: 1.6;
  margin: 0;
}

.more {
  margin-top: 1.5rem;
}

.more-links {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
  display: grid;
  gap: 0.5rem;
}

.more-links a {
  color: #333;
  text-decoration: none;
}

.more-links a:hover {
  color: var(--skoda-green);
  text-decoration: underline;
}

.open-converter {
  color: var(--skoda-green);
  font-weight: 600;
  text-decoration: none;
}
</style>
