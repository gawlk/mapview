<template>
  <Button full :leftIcon="SwitchHorizontalIcon" :rightIcon="PlusIcon">
    {{ t('Change project') }}
  </Button>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import { PlusIcon, SwitchHorizontalIcon } from '@heroicons/vue/solid'

  import { Button } from '/src/components'

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'Change project': 'Change project'
fr:
  'Change project': 'Changer de projet'
</i18n>
