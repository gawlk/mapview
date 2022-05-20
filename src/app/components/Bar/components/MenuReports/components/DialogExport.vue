<script setup lang="ts">
  import IconCloudDownload from '~icons/heroicons-solid/cloud-download'

  import Dialog from '/src/components/Dialog.vue'

  const { t } = useI18n()
</script>

<template>
  <Dialog :title="t('Export')" full :leftIcon="IconCloudDownload" orange>
    <template v-slot:button>
      {{ t('Export the report') }}
    </template>
  </Dialog>
</template>

<i18n lang="yaml">
fr:
  'Export the report': 'Exporter le rapport'
</i18n>
