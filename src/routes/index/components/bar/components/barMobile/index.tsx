import store from '/src/store'

import MenuWrapperMobile from './components/menuWrapperMobile'

import Initializer from '../initializer'

interface Props {
  readonly menus: Menu[]
}

export default (props: Props) => {
  props.menus?.map((menu) => {
    menu.openedOnMobile = false
  })

  const selectMenu = (menuToSelect: Menu) => {
    if (store.projects.selected) {
      props.menus?.forEach((menu) => {
        menu.openedOnMobile =
          menu === menuToSelect ? !menu.openedOnMobile : false
      })
    }
  }

  return (
    <div class="flex-none p-2 lg:hidden">
      <Show when={!store.projects.selected}>
        <div class="absolute inset-x-0 bottom-0 z-10 mb-[4.75rem] bg-transparent p-2">
          <Initializer class="rounded-lg bg-white p-2" />
        </div>
      </Show>
      <div class="relative flex items-center justify-around">
        <For each={props.menus}>
          {(menu) => (
            <MenuWrapperMobile
              name={menu.name}
              icon={menu.icon}
              style={menu.style}
              class={menu.class}
              opened={menu.openedOnMobile}
              disabled={!store.projects.selected}
              onClick={() => selectMenu(menu)}
            >
              <Dynamic component={menu.component} menu={menu.props} />
            </MenuWrapperMobile>
          )}
        </For>
      </div>
    </div>
  )
}
