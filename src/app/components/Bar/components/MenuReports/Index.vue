<template>
  <GroupReports />
  <ListboxIcon />
  <GroupAlbum />
  <DialogInformations
    preID="report-"
    :entity="(store.project?.selectedReport as MachineReport)"
  />
  <DialogExport />
</template>

<script setup lang="ts">
  import { DialogInformations } from '/src/components'
  import DialogExport from './components/DialogExport.vue'
  import GroupAlbum from './components/GroupAlbum/Index.vue'
  import GroupReports from './components/GroupReports.vue'
  import ListboxIcon from './components/ListboxIcon.vue'

  import store from '/src/store'
</script>
