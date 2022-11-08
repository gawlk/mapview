<script setup lang="ts">
  import IconCloudDownload from '~icons/heroicons-solid/cloud-download'
  import IconDownload from '~icons/heroicons-solid/download'

  import Button from '/src/components/Button.vue'
  import Dialog from '/src/components/Dialog.vue'
  import Context from '/src/scripts/io/exporter'

  import store from '/src/store'

  import {
    F25ExportStrategy,
    FWDDynatestExportStrategy,
    FWDSwecoExportStrategy,
    PDXExportStrategy,
    ExcelExportStrategy
  } from '/src/scripts'

  const state = reactive({
    isOpen: false,
  })

  const { t } = useI18n()

  const formats = {
    fwdDynatest: new FWDDynatestExportStrategy(),
    f25: new F25ExportStrategy(),
    pdx: new PDXExportStrategy(),
    fwdSweco: new FWDSwecoExportStrategy(),
    excel: new ExcelExportStrategy(),
  }

  function exportFile(format: string) {
    const strategy = formats[format as 'fwdDynatest' | 'f25' | 'pdx' | 'fwdSweco' | 'excel']

    const context = new Context(strategy)

    if (store.projects.selected) context.doExport(store.projects.selected)

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
        <Button :leftIcon="IconDownload"
          @click="exportFile('excel')" full> Excel </Button>
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
          @click="exportFile('fwdDynatest')"
        >
          FWD (Dynatest)
        </Button>
        <Button
          v-if="store.projects.selected?.machine === 'Heavydyn'"
          :leftIcon="IconDownload"
          full
          @click="exportFile('fwdSweco')"
        >
          FWD (Sweco)
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<i18n lang="yaml">
fr:
  'Export the report': 'Exporter le rapport'
</i18n>
