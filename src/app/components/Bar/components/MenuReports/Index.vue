<template>
  <GroupReports />
  <ListboxValue />
  <ListboxDrop />
  <DisclosureThreshold />
  <GroupAlbum />
  <DialogInformations />
  <DialogExport />
</template>

<script setup>
  import DialogExport from './components/DialogExport.vue'
  import { DialogInformations } from '/src/components'
  import DisclosureThreshold from './components/DisclosureThreshold.vue'
  import GroupAlbum from './components/GroupAlbum.vue'
  import GroupReports from './components/GroupReports.vue'
  import ListboxDrop from './components/ListboxDrop.vue'
  import ListboxValue from './components/ListboxValue.vue'
</script>
