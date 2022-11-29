<script setup lang="ts">
  import { type Component } from 'vue'

  import Template from './Template.vue'

  const state = reactive({
    template1: null as File | null,
    template2: null as File | null,
    template3: null as File | null,
  })

  const emit = defineEmits<{
    (event: 'component', value: Component): void
  }>()
</script>

<template>
  <div class="space-y-2">
    <Template :n="1"></Template>
    <Template :n="2"></Template>
    <Template :n="3"></Template>
  </div>
</template>

<i18n lang="yaml">
fr:
  'Use the template from the imported project': 'Exporter le rapport'
</i18n>
