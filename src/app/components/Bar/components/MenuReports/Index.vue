<script setup lang="ts">
  import DialogExport from './components/DialogExport.vue'
  import GroupAlbum from './components/GroupAlbum/Index.vue'
  import GroupReports from './components/GroupReports.vue'
  import ListboxIcon from './components/ListboxIcon.vue'

  import store from '/src/store'
</script>

<template>
  <GroupReports />
  <ListboxIcon />
  <GroupAlbum />
  <DialogInformations
    preID="report-"
    :data="
      store.selectedProject?.selectedReport
        ? [
            {
              title: 'Informations',
              fields: [
                store.selectedProject.selectedReport.name,
                ...store.selectedProject.selectedReport.informations,
              ],
            },
            {
              title: 'Platform',
              fields: store.selectedProject.selectedReport.platform,
            },
          ]
        : []
    "
  />
  <DialogExport />
</template>
