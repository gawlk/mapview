<template>
  <GroupReports />
  <GroupAlbum />
  <DialogInformations />
  <DialogExport />
</template>

<script setup lang="ts">
  import { DialogInformations } from '/src/components'
  import DialogExport from './components/DialogExport.vue'
  import GroupAlbum from './components/GroupAlbum.vue'
  import GroupReports from './components/GroupReports.vue'
</script>
