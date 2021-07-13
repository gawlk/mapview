<template>
  <Dialog :buttonIcon="CloudDownloadIcon" buttonBlue>
    <template v-slot:button>
      {{ t('Export') }}
    </template>
  </Dialog>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import { CloudDownloadIcon } from '@heroicons/vue/solid'

  import { Dialog } from '/src/components'

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'Export': 'Export'
fr:
  'Export': 'Exporter'
</i18n>
