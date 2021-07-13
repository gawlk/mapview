<template>
  <BarDesktop :menus="menus" class="hidden lg:block" />
  <BarMobile :menus="menus" class="lg:hidden" />
</template>

<script setup lang="ts">
  import { shallowReactive } from 'vue'
  import { useI18n } from 'vue-i18n'
  import {
    DocumentReportIcon,
    FolderOpenIcon,
    MapIcon,
    TableIcon,
  } from '@heroicons/vue/solid'

  import DotsIcon from '/src/assets/svg/custom/dots.svg?component'
  import BarDesktop from './components/BarDesktop/Index.vue'
  import BarMobile from './components/BarMobile/Index.vue'
  import MenuData from './components/MenuData/Index.vue'
  import MenuMap from './components/MenuMap/Index.vue'
  import MenuPoints from './components/MenuPoints/Index.vue'
  import MenuProject from './components/MenuProject/Index.vue'
  import MenuReports from './components/MenuReports/Index.vue'

  const { t } = useI18n()

  const menus = [
    {
      name: t('Project'),
      icon: FolderOpenIcon,
      component: MenuProject,
    },
    {
      name: t('Map'),
      icon: MapIcon,
      component: MenuMap,
    },
    {
      name: t('Reports'),
      icon: DocumentReportIcon,
      component: MenuReports,
    },
    {
      name: t('Points'),
      icon: DotsIcon,
      component: MenuPoints,
    },
    {
      name: t('Data'),
      icon: TableIcon,
      component: MenuData,
    },
  ].map((menu) => shallowReactive(menu))
</script>

<i18n lang="yaml">
en:
  'Data': 'Data'
  'Map': 'Map'
  'Reports': 'Reports'
  'Points': 'Points'
  'Project': 'Project'
fr:
  'Data': 'Données'
  'Map': 'Carte'
  'Points': 'Points'
  'Project': 'Projet'
  'Reports': 'Rapports'
</i18n>
