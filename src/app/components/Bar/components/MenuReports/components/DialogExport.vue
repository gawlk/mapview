<script setup lang="ts">
  import IconCloudDownload from '~icons/heroicons-solid/cloud-download'

  import Dialog from '/src/components/Dialog.vue'
  import Context from '/src/scripts/io/exporter'
  import store from '/src/store'

  import {
    F25ExportStrategy,
    FWDExportStrategy,
    PDXExportStrategy,
  } from '/src/scripts/io/exporter/heavydyn'

  const { t } = useI18n()

  interface IFormats {
    [key: string]: any
  }

  const formats = {
    fwd: new FWDExportStrategy(),
    f25: new F25ExportStrategy(),
    pdx: new PDXExportStrategy(),
  }

  function exportFile(format: string) {
    const strategy = (formats as IFormats)[format]
    const context = new Context(strategy)
    if (store.projects.selected) context.doExport(store.projects.selected)
  }
</script>

<template>
  <Dialog :title="t('Export')" full :leftIcon="IconCloudDownload" orange>
    <template v-slot:button>
      {{ t('Export the report') }}
    </template>
    <template v-slot:dialog>
      <button @click="exportFile('f25')">f25</button>
      <br />
      <button @click="exportFile('pdx')">pdx</button>
      <br />
      <button disabled @click="exportFile('fwd')">fwd</button>
    </template>
  </Dialog>
</template>

<i18n lang="yaml">
fr:
  'Export the report': 'Exporter le rapport'
</i18n>
