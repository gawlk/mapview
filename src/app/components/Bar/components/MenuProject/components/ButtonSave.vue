<template>
  <Button full :leftIcon="SaveIcon" orange>{{ t('Save project') }}</Button>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import { SaveIcon } from '@heroicons/vue/solid'

  import { Button } from '/src/components'

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'Save project': 'Save project'
fr:
  'Save project': 'Sauvegarder le projet'
</i18n>
