<script setup lang="ts">
  import IconCloudDownload from '~icons/heroicons-solid/cloud-download'
  import IconDownload from '~icons/heroicons-solid/download'
  import Button from '/src/components/Button.vue'
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
      <div class="space-y-2">
        <Button disabled :leftIcon="IconDownload" full> Excel </Button>
        <Button
          v-if="store.projects.selected?.machine === 'Heavydyn'"
          :leftIcon="IconDownload"
          full
          @click="exportFile('f25')"
        >
          F25
        </Button>
        <Button
          v-if="store.projects.selected?.machine === 'Heavydyn'"
          :leftIcon="IconDownload"
          full
          @click="exportFile('pdx')"
        >
          PDX
        </Button>
        <Button
          v-if="store.projects.selected?.machine === 'Heavydyn'"
          :leftIcon="IconDownload"
          full
          @click="exportFile('fwd')"
        >
          FWD
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<i18n lang="yaml">
fr:
  'Export the report': 'Exporter le rapport'
</i18n>
