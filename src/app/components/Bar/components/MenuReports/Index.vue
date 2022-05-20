<script setup lang="ts">
  import DialogExport from './components/DialogExport.vue'
  import GroupAlbum from './components/GroupAlbum/Index.vue'
  import GroupReports from './components/GroupReports.vue'
  import DisclosureZones from './components/DisclosureZones.vue'

  import DialogInformations from '/src/components/DialogInformations.vue'

  import store from '/src/store'

  const { t } = useI18n()
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
              title: t('Informations'),
              fields: [
                store.projects.selected.reports.selected.name,
                ...store.projects.selected.reports.selected.informations,
              ],
            },
            {
              title: t('Platform'),
              fields: store.projects.selected.reports.selected.platform,
            },
          ]
        : []
    "
  />
  <DisclosureZones />
  <DialogExport />
</template>
