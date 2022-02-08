<script setup lang="ts">
  import store from '/src/store'

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
        fields: store.selectedProject
          ? [store.selectedProject.name, ...store.selectedProject.informations]
          : [],
      },
    ]"
  />
  <DialogConfigurations />
  <ButtonSave />
</template>
