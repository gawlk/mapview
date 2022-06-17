<script setup lang="ts">
  import DialogExport from './components/DialogExport.vue'
  import GroupAlbum from './components/GroupAlbum/Index.vue'
  import GroupReports from './components/GroupReports.vue'
  import Zones from './components/Zones.vue'

  import DialogInformations from '/src/components/DialogInformations.vue'
  import Submenu from '/src/components/Submenu.vue'

  import IconIssueDraft from '~icons/octicon/issue-draft-16'

  import store from '/src/store'

  const { t } = useI18n()

  const props = defineProps<{
    menu: MenuProps
  }>()
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
  <Submenu
    :buttonIcon="IconIssueDraft"
    :buttonText="`${t('Zones settings')}`"
    :menuProps="props.menu"
    :route="` / ${t('Zones')}`"
  >
    <Zones />
  </Submenu>
  <DialogExport />
</template>

<i18n lang="yaml">
fr:
  'Zones settings': 'Configuration des zones'
</i18n>
