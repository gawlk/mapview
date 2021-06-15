<template>
  <Dialog :buttonIcon="CogIcon">
    <template v-slot:button>
      {{ t('See configurations') }}
    </template>
    <template v-slot:dialog> modal </template>
  </Dialog>
</template>

<script setup>
  import { useI18n } from 'vue-i18n'

  import { CogIcon } from '@heroicons/vue/solid'

  import { Dialog } from '/src/components'

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'See configurations': 'See configurations'
fr:
  'See configurations': 'Voir les configurations'
</i18n>
