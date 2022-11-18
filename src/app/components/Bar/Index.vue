<script setup lang="ts">
  import IconDocumentReport from '~icons/heroicons-solid/document-report'
  import IconFolderOpen from '~icons/heroicons-solid/folder-open'
  import IconMap from '~icons/heroicons-solid/map'
  import IconTable from '~icons/heroicons-solid/table'

  import BarDesktop from './components/BarDesktop/Index.vue'
  import BarMobile from './components/BarMobile/Index.vue'
  import MenuData from './components/MenuData/Index.vue'
  import MenuMap from './components/MenuMap/Index.vue'
  import MenuPoints from './components/MenuPoints/Index.vue'
  import MenuProject from './components/MenuProject/Index.vue'
  import MenuReports from './components/MenuReports/Index.vue'

  import DotsIcon from '/src/assets/svg/custom/dots.svg?component'

  const { t } = useI18n()

  const menus: Menu[] = [
    {
      name: t('Project'),
      icon: IconFolderOpen,
      component: MenuProject,
      props: shallowReactive({
        route: '',
      }),
    },
    {
      name: t('Map'),
      icon: IconMap,
      component: MenuMap,
      props: shallowReactive({
        route: '',
      }),
    },
    {
      name: t('Reports'),
      icon: IconDocumentReport,
      component: MenuReports,
      needsReport: true,
      props: shallowReactive({
        route: '',
      }),
    },
    {
      name: t('Points'),
      icon: DotsIcon,
      component: MenuPoints,
      needsReport: true,
      props: shallowReactive({
        route: '',
      }),
    },
    {
      name: t('Data'),
      icon: IconTable,
      component: MenuData,
      needsReport: true,
      props: shallowReactive({
        route: '',
      }),
      style: 'max-height: 75vh; max-height: 75dvh',
      class: 'overflow-y-auto',
    },
  ].map((menu) => shallowReactive(menu))
</script>

<template>
  <BarDesktop class="hidden lg:block" :menus="menus" />
  <BarMobile class="lg:hidden" :menus="menus" />
</template>
