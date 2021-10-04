<template>
  <Button
    full
    :leftIcon="SwitchHorizontalIcon"
    :rightIcon="PlusIcon"
    @click="file.click()"
  >
    {{ t('Change project') }}
  </Button>

  <input
    @change="change($event.target?.files)"
    accept=".json, .prjz"
    type="file"
    ref="file"
    class="hidden"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import store from '/src/store'
  import { importFile } from '/src/scripts'

  import { PlusIcon, SwitchHorizontalIcon } from '@heroicons/vue/solid'

  import { Button } from '/src/components'

  const { t } = useI18n()

  const file = ref()

  const change = (files: File[]) => {
    const file = files[0]

    if (file) {
      store.project?.clean()

      importFile(file)
    }
  }
</script>

<i18n lang="yaml">
en:
  'Change project': 'Change project'
fr:
  'Change project': 'Changer de projet'
</i18n>
