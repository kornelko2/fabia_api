<script setup>
/**
 * Thin wrapper around @lucide/vue icons for consistent size, stroke and a11y.
 *
 * Usage:
 *   import { Share2 } from '@lucide/vue'
 *   import AppIcon from './AppIcon.vue'
 *
 *   <AppIcon :icon="Share2" />                      <- decorative (aria-hidden)
 *   <AppIcon :icon="Share2" :label="$t('share')" /> <- meaningful (aria-label, role=img)
 *
 * Conventions:
 *   - default size 20, stroke 2
 *   - color inherits via currentColor (set color on the parent)
 *   - icon-only buttons must pass a `label`; decorative icons omit it.
 */
defineProps({
  // A Lucide icon component, e.g. imported `Share2`.
  icon: { type: [Object, Function], required: true },
  size: { type: [Number, String], default: 20 },
  strokeWidth: { type: [Number, String], default: 2 },
  // Accessible label. When set, the icon is exposed as an image with this name.
  // When empty, the icon is treated as decorative and hidden from assistive tech.
  label: { type: String, default: '' },
})
</script>

<template>
  <component
    :is="icon"
    class="app-icon"
    :size="size"
    :stroke-width="strokeWidth"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  />
</template>

<style scoped>
.app-icon {
  flex-shrink: 0;
  vertical-align: middle;
}
</style>
