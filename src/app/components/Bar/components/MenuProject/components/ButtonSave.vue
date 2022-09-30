<script setup lang="ts">
  import store from '/src/store'

  import IconSave from '~icons/heroicons-solid/save'

  import Button from '/src/components/Button.vue'

  const { t } = useI18n()
</script>

<template>
  <Button
    full
    :leftIcon="IconSave"
    orange
    @click="() => store.projects.selected?.toJSON()"
  >
    {{ t('Save project') }}
  </Button>
</template>

<i18n lang="yaml">
fr:
  'Save project': 'Sauvegarder le projet'
</i18n>
