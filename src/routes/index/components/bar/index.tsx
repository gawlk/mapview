import { useI18n } from '@solid-primitives/i18n'

import { store } from '/src/store'

import { BarDesktop } from './components/barDesktop'
import { BarMobile } from './components/barMobile'
import { MenuColors } from './components/menuColors'
import { MenuData } from './components/menuData'
import { MenuMap } from './components/menuMap'
import { MenuProject } from './components/menuProject'
import { MenuReports } from './components/menuReports'

export const Bar = () => {
  const [t] = useI18n()

  const menus: Menu[] = [
    {
      id: 'project',
      name: t('Project'),
      icon: IconTablerFolders,
      component: MenuProject,
    },
    {
      id: 'map',
      name: t('Map'),
      icon: IconTablerMap,
      component: MenuMap,
    },
    {
      id: 'reports',
      name: t('Reports'),
      icon: IconTablerFiles,
      component: MenuReports,
    },
    {
      id: 'colors',
      name: t('Colors'),
      icon: IconTablerRainbow,
      component: MenuColors,
      needsReport: true,
    },
    {
      id: 'data',
      name: t('Data'),
      icon: IconTablerTable,
      component: MenuData,
      needsReport: true,
      style: 'max-height: 75vh; max-height: 75dvh',
      class: 'overflow-y-auto',
    },
  ].map((menu) => createMutable(menu))

  const [id, setID] = createSignal<string | undefined>(undefined)

  return (
    <>
      <BarDesktop menus={menus} setID={(_id) => setID(_id)} />
      <BarMobile menus={menus} setID={(_id) => setID(_id)} />
      <Show when={store.selectedProject}>
        <For each={menus}>
          {(menu) => {
            const element = createMemo(
              () =>
                document.getElementById(`${id() || 'none'}${menu.id}`) ||
                undefined,
            )

            return (
              <Portal mount={element()}>
                <div class="space-y-1.5">
                  <Dynamic component={menu.component} />
                </div>
              </Portal>
            )
          }}
        </For>
      </Show>
    </>
  )
}
