<template>
  <GroupReports />
  <GroupAlbum />
  <DialogInformations />
  <DialogExport />
</template>

<script setup>
  import { DialogInformations } from '/src/components'
  import DialogExport from './components/DialogExport.vue'
  import GroupAlbum from './components/GroupAlbum.vue'
  import GroupReports from './components/GroupReports.vue'
</script>
