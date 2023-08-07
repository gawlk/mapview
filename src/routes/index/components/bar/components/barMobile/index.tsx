import { createResizeObserver } from '@solid-primitives/resize-observer'

import { store } from '/src/store'

import { MenuWrapperMobile, baseID } from './components/menuWrapperMobile'

import { Initializer } from '../initializer'

interface Props {
  readonly menus: Menu[]
  setID: (id: string) => void
}

export const BarMobile = (props: Props) => {
  props.menus?.map((menu) => {
    menu.openedOnMobile = false
  })

  const selectMenu = (menuToSelect: Menu) => {
    if (store.selectedProject) {
      props.menus?.forEach((menu) => {
        menu.openedOnMobile =
          menu === menuToSelect ? !menu.openedOnMobile : false
      })
    }
  }

  let div = undefined as HTMLDivElement | undefined

  onMount(() => {
    if (!div) return

    createResizeObserver(div, ({ height }) => {
      height && props.setID(baseID)
    })
  })

  return (
    <div class="flex-none p-2 lg:hidden">
      <Show when={!store.selectedProject}>
        <div class="absolute inset-x-0 bottom-0 z-10 mb-[4.75rem] bg-transparent p-2">
          <Initializer class="rounded-lg bg-white p-2" />
        </div>
      </Show>

      <div ref={div} class="relative flex items-center justify-around">
        <For each={props.menus}>
          {(menu) => (
            <MenuWrapperMobile
              id={menu.id}
              name={menu.name}
              icon={menu.icon}
              style={menu.style}
              class={menu.class}
              opened={menu.openedOnMobile}
              disabled={!store.selectedProject}
              onClick={() => selectMenu(menu)}
            />
          )}
        </For>
      </div>
    </div>
  )
}
