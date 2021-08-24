<template>
  <GroupReports />
  <ListboxIcon />
  <GroupAlbum />
  <DialogInformations />
  <DialogExport />
</template>

<script setup lang="ts">
  import { DialogInformations } from '/src/components'
  import DialogExport from './components/DialogExport.vue'
  import GroupAlbum from './components/GroupAlbum.vue'
  import GroupReports from './components/GroupReports.vue'
  import ListboxIcon from './components/ListboxIcon.vue'
</script>
