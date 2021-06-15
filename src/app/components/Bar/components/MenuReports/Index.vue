<template>
  <GroupReports />
  <GroupAlbum />
  <DialogInformations />
  <DialogExport />
</template>

<script setup>
  import DialogExport from './components/DialogExport.vue'
  import { DialogInformations } from '/src/components'
  import GroupAlbum from './components/GroupAlbum.vue'
  import GroupReports from './components/GroupReports.vue'
</script>
