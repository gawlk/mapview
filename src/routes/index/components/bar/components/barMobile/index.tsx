import { createResizeObserver } from '@solid-primitives/resize-observer'

import { store } from '/src/store'

import { Initializer } from '../initializer'
import { baseID, MenuWrapperMobile } from './components/menuWrapperMobile'

interface Props {
  readonly menus: Menu[]
  readonly setID: (id: string) => void
}

export const BarMobile = (props: Props) => {
  props.menus?.forEach((menu) => {
    menu.openedOnMobile.set(false)
  })

  const selectMenu = (menuToSelect: Menu) => {
    const selectedProject = store.selectedProject()
    if (selectedProject) {
      props.menus?.forEach((menu) => {
        menu.openedOnMobile.set((opened) =>
          menu === menuToSelect ? !opened : false,
        )
      })
    }
  }

  const [div, setDiv] = createSignal<HTMLDivElement | undefined>(undefined)

  onMount(() => {
    if (!div) return

    createResizeObserver(div, ({ height }) => {
      height && props.setID(baseID)
    })
  })

  return (
    <div class="flex-none p-2 lg:hidden">
      <Show when={!store.selectedProject()}>
        <div class="absolute inset-x-0 bottom-0 z-10 mb-[4.75rem] bg-transparent p-2">
          <Initializer class="rounded-lg bg-white p-2" />
        </div>
      </Show>

      <div ref={setDiv} class="relative flex items-center justify-around">
        <For each={props.menus}>
          {(menu) => (
            <MenuWrapperMobile
              id={menu.id}
              name={menu.name}
              icon={menu.icon}
              style={menu.style}
              class={menu.class}
              opened={menu.openedOnMobile()}
              disabled={!store.selectedProject}
              onClick={() => {
                selectMenu(menu)
              }}
            />
          )}
        </For>
      </div>
    </div>
  )
}
