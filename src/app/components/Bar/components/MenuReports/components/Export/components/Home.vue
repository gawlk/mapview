<script setup lang="ts">
  import { type Component } from 'vue'

  import store from '/src/store'

  import {
    downloadFile,
    getSimpleReportExports,
    mrvzExporter,
  } from '/src/scripts'

  import IconDownload from '~icons/heroicons-solid/download'

  import Button from '/src/components/Button.vue'

  import Templates from './mrvz/Templates.vue'

  const emit = defineEmits<{
    (event: 'component', value: Component, props?: any): void
    (event: 'replace', value: Component, props?: any): void
  }>()

  const state = reactive({
    isOpen: false,
  })

  const downloadExport = async (exporter: AnyExporter) => {
    store.projects.selected &&
      downloadFile(await exporter.export(store.projects.selected as any))

    state.isOpen = false
  }

  const exporters = computed(() =>
    store.projects.selected
      ? getSimpleReportExports(store.projects.selected)
      : []
  )

  if (exporters.value.length === 0) {
    emit('replace', Templates)
  }
</script>

<template>
  <div class="space-y-2">
    <Button :leftIcon="IconDownload" @click="emit('component', Templates)" full>
      {{ mrvzExporter.name }}
    </Button>
    <Button
      v-for="exporter in exporters"
      :leftIcon="IconDownload"
      full
      @click="downloadExport(exporter)"
    >
      {{ exporter.name }}
    </Button>
  </div>
</template>
