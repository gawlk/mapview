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
    (event: 'component', value: Component): void
  }>()

  const state = reactive({
    isOpen: false,
  })

  const downloadExport = async (exporter: AnyExporter) => {
    store.projects.selected &&
      downloadFile(await exporter.export(store.projects.selected as any))

    state.isOpen = false
  }
</script>

<template>
  <div class="space-y-2">
    <Button :leftIcon="IconDownload" @click="emit('component', Templates)" full>
      {{ mrvzExporter.name }}
    </Button>
    <Button
      v-for="exporter in store.projects.selected
        ? getSimpleReportExports(store.projects.selected)
        : []"
      :leftIcon="IconDownload"
      full
      @click="downloadExport(exporter)"
    >
      {{ exporter.name }}
    </Button>
  </div>
</template>
