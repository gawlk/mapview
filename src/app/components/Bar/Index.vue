<script setup lang="ts">
  import BarDesktop from './components/BarDesktop/Index.vue'
  import BarMobile from './components/BarMobile/Index.vue'
  import MenuData from './components/MenuData/Index.vue'
  import MenuMap from './components/MenuMap/Index.vue'
  import MenuPoints from './components/MenuPoints/Index.vue'
  import MenuProject from './components/MenuProject/Index.vue'
  import MenuReports from './components/MenuReports/Index.vue'

  import IconDocumentReport from '~icons/heroicons-solid/document-report'
  import IconFolderOpen from '~icons/heroicons-solid/folder-open'
  import IconMap from '~icons/heroicons-solid/map'
  import IconTable from '~icons/heroicons-solid/table'
  import DotsIcon from '/src/assets/svg/custom/dots.svg?component'

  const { t } = useI18n()

  const menus: MenuProp[] = [
    {
      name: t('Project'),
      icon: IconFolderOpen,
      component: MenuProject,
    },
    {
      name: t('Map'),
      icon: IconMap,
      component: MenuMap,
    },
    {
      name: t('Reports'),
      icon: IconDocumentReport,
      component: MenuReports,
      needsReport: true,
    },
    // {
    //   name: t('Points'),
    //   icon: DotsIcon,
    //   component: MenuPoints,
    //   needsReport: true,
    // },
    // {
    //   name: t('Data'),
    //   icon: IconTable,
    //   component: MenuData,
    //   needsReport: true,
    // },
  ].map((menu) => shallowReactive(menu))
</script>

<template>
  <BarDesktop :menus="menus" class="hidden lg:block" />
  <BarMobile :menus="menus" class="lg:hidden" />
</template>
