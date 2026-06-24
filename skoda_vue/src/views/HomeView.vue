<template>
  <main class="main-content">
    <ConversionForm ref="conversionForm" />
    <Statistics />
  </main>
</template>

<script>
import ConversionForm from '../components/ConversionForm.vue'
import Statistics from '../components/Statistics.vue'

export default {
  name: 'HomeView',
  components: {
    ConversionForm,
    Statistics
  }
}
</script>
