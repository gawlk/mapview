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
  } from '/src/scripts'

  const state = reactive({
    isOpen: false,
  })

  const { t } = useI18n()

  const formats = {
    fwd: new FWDExportStrategy(),
    f25: new F25ExportStrategy(),
    pdx: new PDXExportStrategy(),
  }

  function exportFile(format: string) {
    const strategy = formats[format as 'fwd' | 'f25' | 'pdx']

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
