<script setup lang="ts">
  import store from '/src/store'
  import { mpvzExporter, downloadFile } from '/src/scripts'

  import IconSave from '~icons/heroicons-solid/save'

  import Button from '/src/components/Button.vue'

  const { t } = useI18n()

  const save = async () =>
    store.projects.selected &&
    downloadFile(await mpvzExporter.export(store.projects.selected))
</script>

<template>
  <Button
    full
    :leftIcon="IconSave"
    :disabled="!store.projects.selected"
    orange
    @click="save"
  >
    {{ t('Save project') }}
  </Button>
</template>

<i18n lang="yaml">
fr:
  'Save project': 'Sauvegarder le projet'
</i18n>
