<script setup lang="ts">
  import store from '/src/store'

  import DialogInformations from '/src/components/DialogInformations.vue'

  import ButtonSave from './components/ButtonSave.vue'
  import DialogConfigurations from './components/DialogConfigurations.vue'
  import GroupProjects from './components/GroupProjects.vue'

  const { t } = useI18n()
</script>

<template>
  <GroupProjects />
  <DialogInformations
    preID="project-"
    :data="[
      {
        title: t('Informations'),
        fields: store.projects.selected
          ? [
              store.projects.selected.name,
              ...store.projects.selected.informations,
            ]
          : [],
      },
      {
        title: t('Hardware'),
        fields: store.projects.selected ? store.projects.selected.hardware : [],
      },
    ]"
  />
  <DialogConfigurations />
  <ButtonSave />
</template>
