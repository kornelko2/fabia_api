<template>
  <main class="main-content landing">
    <div class="container">
      <article class="landing-intro card">
        <p class="crumb">
          <router-link to="/">← Škoda Fabia Converter</router-link>
        </p>
        <h1>{{ page.h1 }}</h1>
        <p class="answer">≈ <strong>{{ fabias.toLocaleString() }}</strong> Škoda Fabias</p>
        <p class="intro">{{ page.intro }}</p>
        <p class="how">
          Each Škoda Fabia 1.2 HTP measures {{ refLabel }} — so
          {{ page.example }} works out to roughly {{ fabias.toLocaleString() }} of them.
          Want a different figure? Tweak it below or type any measurement.
        </p>
      </article>

      <!-- The real converter, prefilled with this page's example -->
      <ConversionForm :initial-input="page.example" heading-level="h2" />

      <section class="faq card">
        <h2>Frequently asked</h2>
        <div v-for="(item, i) in faqs" :key="i" class="faq-item">
          <h3>{{ item.q }}</h3>
          <p>{{ item.a }}</p>
        </div>
      </section>

      <section class="more card">
        <h2>More Škoda Fabia comparisons</h2>
        <ul class="more-links">
          <li v-for="p in others" :key="p.slug">
            <router-link :to="'/' + p.slug">{{ p.h1 }}</router-link>
          </li>
        </ul>
        <p>
          <router-link to="/" class="open-converter">→ Open the full converter</router-link>
        </p>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import ConversionForm from '../components/ConversionForm.vue'
import { pages, REFERENCES } from '../content/pages.js'

const props = defineProps({
  page: { type: Object, required: true }
})

const fabias = computed(() => Math.round(props.page.value / REFERENCES[props.page.type]))
const others = computed(() => pages.filter(p => p.slug !== props.page.slug).slice(0, 6))

const REF_LABEL = {
  area: '6.587 m² of ground',
  length: '4.002 m bumper to bumper',
  weight: '1,035 kg',
  price: '€16,500',
  power: '64 HP'
}
const refLabel = computed(() => REF_LABEL[props.page.type] || '')

const canonical = computed(() => `https://fabia-conv.crayz.me/${props.page.slug}`)

// Visible FAQ — also emitted as FAQPage structured data below. Google requires
// the schema's Q&As to match content visible on the page, so these are the same.
const faqs = computed(() => {
  const n = fabias.value.toLocaleString()
  return [
    {
      q: props.page.h1,
      a: `${props.page.example} is about ${n} Škoda Fabias, because each Fabia 1.2 HTP measures ${refLabel.value}.`
    },
    {
      q: `How is "${props.page.example}" converted into Škoda Fabias?`,
      a: `We divide ${props.page.example} by a single Škoda Fabia 1.2 HTP (${refLabel.value}), which gives roughly ${n} Fabias.`
    },
    {
      q: 'What is the Škoda Fabia Converter?',
      a: 'A free, playful tool that expresses any measurement — length, area, weight, power or price — as how many Škoda Fabias it equals, with AI-written explanations in 8 languages.'
    }
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
  title: props.page.title,
  meta: [
    { name: 'description', content: props.page.description },
    { property: 'og:title', content: props.page.title },
    { property: 'og:description', content: props.page.description },
    { property: 'og:url', content: canonical.value },
    { property: 'og:type', content: 'article' },
    { name: 'twitter:title', content: props.page.title },
    { name: 'twitter:description', content: props.page.description }
  ],
  link: [{ rel: 'canonical', href: canonical.value }],
  script: [
    { type: 'application/ld+json', innerHTML: faqJsonLd.value }
  ]
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

.more h2 {
  color: var(--skoda-green);
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
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
