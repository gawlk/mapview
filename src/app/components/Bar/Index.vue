<template>
  <BarDesktop :menus="menus" class="hidden lg:block" />
  <BarMobile :menus="menus" class="lg:hidden" />
</template>

<script setup>
  import { shallowReactive } from 'vue'
  import { useI18n } from 'vue-i18n'
  import {
    DocumentReportIcon,
    FolderOpenIcon,
    MapIcon,
  } from '@heroicons/vue/solid'

  import DotsIcon from '/src/assets/svg/custom/dots.svg'
  import BarDesktop from './components/BarDesktop/Index.vue'
  import BarMobile from './components/BarMobile/Index.vue'
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
  ].map((menu) => shallowReactive(menu))
</script>

<i18n lang="yaml">
en:
  'Project': 'Project'
  'Reports': 'Reports'
  'Map': 'Map'
  'Points': 'Points'
fr:
  'Project': 'Projet'
  'Reports': 'Rapports'
  'Map': 'Carte'
  'Points': 'Points'
</i18n>
