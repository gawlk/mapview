<template>
  <Dialog :buttonIcon="InformationCircleIcon">
    <template v-slot:button>
      {{ t('View informations') }}
    </template>
    <template v-slot:dialog> modal </template>
  </Dialog>
</template>

<script setup>
  import { useI18n } from 'vue-i18n'

  import { InformationCircleIcon } from '@heroicons/vue/solid'

  import { Dialog } from '/src/components'

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'View informations': 'View informations'
fr:
  'View informations': 'Voir les informations'
</i18n>
