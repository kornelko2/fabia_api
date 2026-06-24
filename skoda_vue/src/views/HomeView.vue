<template>
  <main class="main-content">
    <ConversionForm ref="conversionForm" />
    <Statistics />
  </main>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import ConversionForm from '../components/ConversionForm.vue'
import Statistics from '../components/Statistics.vue'

const props = defineProps({
  // '' = default English home at '/' (respects the visitor's saved locale);
  // 'cs' = the Czech home at '/cs/'.
  locale: { type: String, default: '' }
})

const SITE = 'https://fabia-conv.crayz.me'

if (props.locale) {
  const { locale } = useI18n({ useScope: 'global' })
  locale.value = props.locale
}

const isCs = props.locale === 'cs'

useHead({
  ...(isCs
    ? {
        title: 'Převodník Škoda Fabia – Změřte cokoli ve Škoda Fabiích',
        meta: [
          { name: 'description', content: 'Velká čísla se špatně představují. Škoda Fabie ne. Zadejte libovolnou veličinu a zjistěte, kolik je to vozů Škoda Fabia — zdarma, s vysvětlením od AI.' },
          { property: 'og:title', content: 'Převodník Škoda Fabia – Změřte cokoli ve Škoda Fabiích' },
          { property: 'og:url', content: `${SITE}/cs/` },
          { property: 'og:locale', content: 'cs_CZ' }
        ]
      }
    : {}),
  link: [
    { rel: 'canonical', href: isCs ? `${SITE}/cs/` : `${SITE}/` },
    { rel: 'alternate', hreflang: 'en', href: `${SITE}/` },
    { rel: 'alternate', hreflang: 'cs', href: `${SITE}/cs/` },
    { rel: 'alternate', hreflang: 'x-default', href: `${SITE}/` }
  ]
})
</script>
