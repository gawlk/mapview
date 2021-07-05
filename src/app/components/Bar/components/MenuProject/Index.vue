<template>
  <div class="text-center space-x-2 p-1 text-sm font-medium">
    <span class="text-gray-500">
      {{ t('Name:') }}
    </span>
    <span class="font-semibold">Name</span>
  </div>
  <DialogInformations
    preID="project-"
    :informations="store.project.informations"
  />
  <DialogConfigurations />
  <ButtonChange />
  <ButtonSave />
</template>

<script setup>
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
  'Name:': 'Name:'
fr:
  'Name:': 'Nom :'
</i18n>
