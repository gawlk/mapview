<template>
  <div class="p-1 space-x-1 text-sm font-medium text-center">
    <span class="text-gray-500">
      {{ t('Name:') }}
    </span>
    <span class="font-semibold">{{ store.project?.name }}</span>
    <span class="font-bold text-gray-300">·</span>
    <span class="text-gray-500">
      {{ t('Machine:') }}
    </span>
    <span class="font-semibold">{{ store.project?.database.machine }}</span>
  </div>
  <DialogInformations
    preID="project-"
    :entity="(store.project as MachineProject)"
  />
  <DialogConfigurations />
  <ButtonChange />
  <ButtonSave />
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import store from '/src/store'

  import { DialogInformations } from '/src/components'
  import ButtonChange from './components/ButtonChange.vue'
  import ButtonSave from './components/ButtonSave.vue'
  import DialogConfigurations from './components/DialogConfigurations.vue'

  const { t } = useI18n()
</script>

<i18n lang="yaml">
en:
  'Machine:': 'Machine:'
  'Name:': 'Name:'
fr:
  'Machine:': 'Machine:'
  'Name:': 'Nom :'
</i18n>
