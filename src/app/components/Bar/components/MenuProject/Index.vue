<script setup lang="ts">
  import store from '/src/store'

  import DialogInformations from '/src/components/DialogInformations.vue'

  import ButtonSave from './components/ButtonSave.vue'
  import DialogConfigurations from './components/DialogConfigurations.vue'
  import GroupProjects from './components/GroupProjects.vue'
</script>

<template>
  <GroupProjects />
  <DialogInformations
    preID="project-"
    :data="[
      {
        title: 'Informations',
        fields: store.projects.selected
          ? [
              store.projects.selected.name,
              ...store.projects.selected.informations,
            ]
          : [],
      },
    ]"
  />
  <DialogConfigurations />
  <ButtonSave />
</template>
