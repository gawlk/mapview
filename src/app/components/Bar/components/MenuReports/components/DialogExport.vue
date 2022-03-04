<script setup lang="ts">
  import IconCloudDownload from '~icons/heroicons-solid/cloud-download'

  const { t } = useI18n()
</script>

<template>
  <Dialog :title="t('Export')" :buttonIcon="IconCloudDownload" buttonBlue>
    <template v-slot:button>
      {{ t('Export the report') }}
    </template>
  </Dialog>
</template>

<i18n lang="yaml">
fr:
  'Export the report': 'Exporter le rapport'
</i18n>
