import { useI18n } from '@solid-primitives/i18n'

import BarDesktop from './components/barDesktop'
import BarMobile from './components/barMobile'
// import BarMobile from './components/BarMobile/Index.vue'
import MenuData from './components/menuData'
import MenuMap from './components/menuMap'
// import MenuPoints from './components/MenuPoints/Index.vue'
import MenuProject from './components/menuProject'

// import MenuReports from './components/MenuReports/Index.vue'
import DotsIcon from '/src/assets/svg/custom/dots.svg'

export default () => {
  const [t] = useI18n()

  const menus: Menu[] = [
    {
      name: t('Project'),
      icon: IconTablerFolders,
      component: MenuProject,
      props: createMutable({
        route: '',
      }),
    },
    {
      name: t('Map'),
      icon: IconTablerMap,
      component: MenuMap,
      props: createMutable({
        route: '',
      }),
    },
    {
      name: t('Reports'),
      icon: IconTablerFiles,
      // component: MenuReports,
      component: () => {},
      needsReport: true,
      props: createMutable({
        route: '',
      }),
    },
    {
      name: t('Points'),
      icon: DotsIcon,
      // component: MenuPoints,
      component: () => {},
      needsReport: true,
      props: createMutable({
        route: '',
      }),
    },
    {
      name: t('Data'),
      icon: IconTablerTable,
      component: MenuData,
      needsReport: true,
      props: createMutable({
        route: '',
      }),
      style: 'max-height: 75vh; max-height: 75dvh',
      class: 'overflow-y-auto',
    },
  ].map((menu) => createMutable(menu))

  return (
    <>
      <BarDesktop menus={menus} />
      <BarMobile menus={menus} />
    </>
  )
}
