<script setup lang="ts">
  import store from '/src/store'
  import { save } from '/src/scripts'

  import IconSave from '~icons/heroicons-solid/save'

  import Button from '/src/components/Button.vue'

  const { t } = useI18n()
</script>

<template>
  <Button
    full
    :leftIcon="IconSave"
    :disabled="!store.projects.selected"
    orange
    @click="() => store.projects.selected && save(store.projects.selected)"
  >
    {{ t('Save project') }}
  </Button>
</template>

<i18n lang="yaml">
fr:
  'Save project': 'Sauvegarder le projet'
</i18n>
