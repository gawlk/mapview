<template>
  <div class="flex space-x-2">
    <Listbox
      :icon="DocumentReportIcon"
      :values="store.project?.reports.map((r) => r.name)"
      :preSelected="t('Report:')"
      :selected="store.project?.selectedReport?.name"
      @selectIndex="
        (index) =>
          store.project &&
          (store.project.selectedReport = store.project?.reports[index])
      "
      full
      isTop
    />
    <!-- <Button @click="inputFile.click()" :icon="PlusIcon" />
    <input
      @change="addReport($event.target.files[0])"
      accept="image/*"
      type="file"
      ref="inputFile"
      class="hidden"
    /> -->
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import store from '/src/store'

  import { DocumentReportIcon, PlusIcon } from '@heroicons/vue/solid'

  import { Button, Listbox } from '/src/components'

  const { t } = useI18n()

  const inputFile = ref()

  const addReport = (reportFile: File) => {
    if (reportFile) {
    }
  }
</script>

<i18n lang="yaml">
en:
  'Report:': 'Report:'
fr:
  'Report:': 'Rapport :'
</i18n>
