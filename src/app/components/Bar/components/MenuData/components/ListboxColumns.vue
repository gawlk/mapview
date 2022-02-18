<script setup lang="ts">
  import store from '/src/store'

  import IconViewBoards from '~icons/heroicons-solid/view-boards'

  const { t } = useI18n()
</script>

<template>
  <Listbox
    :icon="IconViewBoards"
    :values="
      store.projects.selected?.reports.selected?.dropsSettings.data.names.map(
        (name) => t(name)
      )
    "
    :preSelected="`${t('Columns')}${t(':')}`"
    full
  />
</template>
