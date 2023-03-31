import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import BarDesktop from './components/barDesktop'
import BarMobile from './components/barMobile'
import MenuData from './components/menuData'
import MenuMap from './components/menuMap'
import MenuPoints from './components/menuPoints'
import MenuProject from './components/menuProject'
import MenuReports from './components/menuReports'

import DotsIcon from '/src/assets/svg/custom/dots.svg'

export default () => {
  const [t] = useI18n()

  const menus: Menu[] = [
    {
      id: 'project',
      name: t('Project'),
      icon: IconTablerFolders,
      component: MenuProject,
      props: createMutable({
        route: '',
      }),
    },
    {
      id: 'map',
      name: t('Map'),
      icon: IconTablerMap,
      component: MenuMap,
      props: createMutable({
        route: '',
      }),
    },
    {
      id: 'reports',
      name: t('Reports'),
      icon: IconTablerFiles,
      component: MenuReports,
      needsReport: true,
      props: createMutable({
        route: '',
      }),
    },
    {
      id: 'points',
      name: t('Points'),
      icon: DotsIcon,
      component: MenuPoints,
      needsReport: true,
      props: createMutable({
        route: '',
      }),
    },
    {
      id: 'data',
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

  const [id, setID] = createSignal<string | undefined>(undefined)

  return (
    <>
      <BarDesktop menus={menus} setID={(id) => setID(id)} />
      <BarMobile menus={menus} setID={(id) => setID(id)} />
      <Show when={store.selectedProject}>
        <For each={menus}>
          {(menu) => {
            const element = createMemo(
              () =>
                (document.getElementById(
                  `${id() || ''}${menu.id}`
                ) as HTMLElement | null) || undefined
            )

            return (
              <Portal mount={element()}>
                <div class="space-y-1.5">
                  <Dynamic component={menu.component} menu={menu.props} />
                </div>
              </Portal>
            )
          }}
        </For>
      </Show>
    </>
  )
}
