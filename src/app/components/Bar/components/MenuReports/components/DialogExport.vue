<script setup lang="ts">
  import IconCloudDownload from '~icons/heroicons-solid/cloud-download'
  import IconDownload from '~icons/heroicons-solid/download'

  import Button from '/src/components/Button.vue'
  import Dialog from '/src/components/Dialog.vue'

  import store from '/src/store'
  import {
    getSimpleReportExports,
    mrvzExporter,
    downloadFile,
  } from '/src/scripts'

  const state = reactive({
    isOpen: false,
  })

  const { t } = useI18n()

  const downloadExport = async (exporter: AnyExporter) => {
    store.projects.selected &&
      downloadFile(await exporter.export(store.projects.selected as any))

    state.isOpen = false
  }
</script>

<template>
  <Dialog
    :isOpen="state.isOpen"
    :title="t('Export')"
    full
    :leftIcon="IconCloudDownload"
    orange
    @open="() => (state.isOpen = true)"
    @close="() => (state.isOpen = false)"
  >
    <template v-slot:button>
      {{ t('Export the report') }}
    </template>
    <template v-slot:dialog>
      <div class="space-y-2">
        <Button
          :leftIcon="IconDownload"
          @click="
            store.projects.selected &&
              mrvzExporter.export(store.projects.selected)
          "
          full
        >
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
  </Dialog>
</template>

<i18n lang="yaml">
fr:
  'Export the report': 'Exporter le rapport'
</i18n>
