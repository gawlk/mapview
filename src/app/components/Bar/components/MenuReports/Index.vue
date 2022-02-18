<script setup lang="ts">
  import DialogExport from './components/DialogExport.vue'
  import GroupAlbum from './components/GroupAlbum/Index.vue'
  import GroupReports from './components/GroupReports.vue'

  import store from '/src/store'
</script>

<template>
  <GroupReports />
  <GroupAlbum />
  <DialogInformations
    preID="report-"
    :data="
      store.projects.selected?.reports.selected
        ? [
            {
              title: 'Informations',
              fields: [
                store.projects.selected.reports.selected.name,
                ...store.projects.selected.reports.selected.informations,
              ],
            },
            {
              title: 'Platform',
              fields: store.projects.selected.reports.selected.platform,
            },
          ]
        : []
    "
  />
  <DialogExport />
</template>
