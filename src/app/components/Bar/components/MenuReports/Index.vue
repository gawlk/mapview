<script setup lang="ts">
  import store from '/src/store'

  import IconIssueDraft from '~icons/octicon/issue-draft-16'

  import DialogInformations from '/src/components/DialogInformations.vue'
  import Submenu from '/src/components/Submenu.vue'

  import Export from './components/Export/Index.vue'
  import GroupAlbum from './components/GroupAlbum/Index.vue'
  import GroupReports from './components/GroupReports.vue'
  import Zones from './components/Zones.vue'

  const { t } = useI18n()

  const props = defineProps<{
    readonly menu: MenuProps
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
                ...store.projects.selected.reports.selected.information,
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
  <Export />
</template>

<i18n lang="yaml">
fr:
  'Zones settings': 'Configuration des zones'
</i18n>
