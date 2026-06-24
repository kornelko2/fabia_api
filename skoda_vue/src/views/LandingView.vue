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
  link: [{ rel: 'canonical', href: canonical.value }]
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
