import store from '/src/store'

import { Button } from '/src/components'

import Footer from './components/footer'
import Logo from './components/logo'
import MenuWrapperDesktop from './components/menuWrapperDesktop'

import Initializer from '../initializer'

interface Props {
  readonly menus: Menu[]
}

export default (props: Props) => {
  return (
    <div class="hidden w-[520px] flex-none space-y-8 overflow-scroll py-8 px-2 lg:block">
      <Logo />

      <Show when={store.projects.selected} fallback={<Initializer />}>
        <div class="space-y-8">
          <For each={props.menus}>
            {(menu) => (
              <div>
                <Show
                  when={
                    (store.projects.selected?.reports.list.length || 0) > 0 ||
                    !menu.needsReport
                  }
                  fallback={
                    <Button v-else disabled full leftIcon={menu.icon}>
                      {menu.name}
                    </Button>
                  }
                >
                  <MenuWrapperDesktop
                    name={menu.name}
                    icon={menu.icon}
                    menuProps={menu.props}
                  >
                    <Dynamic component={menu.component} menu={menu.props} />
                  </MenuWrapperDesktop>
                </Show>
              </div>
            )}
          </For>
        </div>
      </Show>

      <Footer />
    </div>
  )
}
