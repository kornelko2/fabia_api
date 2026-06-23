<template>
  <div class="converter">
  <h1>Škoda Fabia 1.2 HTP Unit Converter</h1>
    <form @submit.prevent="handleSubmit">
      <div v-for="field in fields" :key="field.key" class="input-group">
        <label :for="field.key">{{ field.label }}</label>
        <input :id="field.key" v-model.number="inputs[field.key].value" type="number" :placeholder="field.label" />
        <select v-model="inputs[field.key].unit">
          <option v-for="unit in field.units" :key="unit" :value="unit">{{ unit }}</option>
        </select>
      </div>
      <div class="input-group">
        <label for="text">Context/Question</label>
        <input id="text" v-model="inputs.text" type="text" placeholder="e.g. How many Skoda Fabias fit on a football field?" />
      </div>
      <div class="input-group">
        <label>Result Format</label>
        <select v-model="inputs.format">
          <option value="rounded">Rounded</option>
          <option value="scientific">Scientific</option>
        </select>
      </div>
      <button type="submit">Convert & Explain</button>
    </form>
    <div v-if="response" class="response">
      <h2>Result</h2>
      <pre>{{ response }}</pre>
    </div>
    <div v-if="error" class="error">
      <pre>{{ error }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fields = [
  { key: 'length', label: 'Length', units: ['m', 'km', 'mi', 'ft', 'yd', 'cm', 'mm'] },
  { key: 'width', label: 'Width', units: ['m', 'km', 'mi', 'ft', 'yd', 'cm', 'mm'] },
  { key: 'height', label: 'Height', units: ['m', 'km', 'mi', 'ft', 'yd', 'cm', 'mm'] },
  { key: 'weight', label: 'Weight', units: ['kg', 'g', 'lb', 't'] },
  { key: 'price', label: 'Price', units: ['eur', 'usd', 'pln'] },
]

const inputs = ref({
  length: { value: null, unit: 'm' },
  width: { value: null, unit: 'm' },
  height: { value: null, unit: 'm' },
  weight: { value: null, unit: 'kg' },
  price: { value: null, unit: 'eur' },
  text: '',
  format: 'rounded',
})

const response = ref(null)
const error = ref(null)

async function handleSubmit() {
  error.value = null
  response.value = null
  // Prepare payload, only include filled fields
  const payload = {}
  for (const key of Object.keys(inputs.value)) {
    if (['text', 'format'].includes(key)) {
      payload[key] = inputs.value[key]
    } else if (inputs.value[key].value !== null && inputs.value[key].value !== undefined && inputs.value[key].value !== '') {
      payload[key] = { value: inputs.value[key].value, unit: inputs.value[key].unit }
    }
  }
  try {
    const res = await fetch('https://skoda-fabia-api.kornelko.workers.dev/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error(await res.text())
    response.value = await res.json()
  } catch (e) {
    error.value = e.message || e
  }
}
</script>

<style scoped>
.converter {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.input-group {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
label {
  min-width: 80px;
}
input, select {
  flex: 1;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
button {
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #0056b3;
}
.response, .error {
  margin-top: 2rem;
  background: #fff;
  border-radius: 4px;
  padding: 1rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
}
.error {
  color: #b30000;
  background: #ffeaea;
}
</style>
