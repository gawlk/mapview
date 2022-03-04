<script setup lang="ts">
  import IconSave from '~icons/heroicons-solid/save'

  const { t } = useI18n()
</script>

<template>
  <Button full :leftIcon="IconSave" orange>
    {{ t('Save project') }}
  </Button>
</template>

<i18n lang="yaml">
fr:
  'Save project': 'Sauvegarder le projet'
</i18n>
