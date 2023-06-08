import { createResizeObserver } from '@solid-primitives/resize-observer'

import store from '/src/store'

import { Button } from '/src/components'

import Footer from './components/footer'
import Logo from './components/logo'
import MenuWrapperDesktop, { baseID } from './components/menuWrapperDesktop'

import Initializer from '../initializer'

interface Props {
  setID: (id: string) => void
  readonly menus: Menu[]
}

export default (props: Props) => {
  return (
    <div class="hidden w-[520px] flex-none space-y-8 overflow-scroll px-2 py-8 lg:block">
      <Logo />

      <Show when={store.selectedProject} fallback={<Initializer />}>
        {(() => {
          let div = undefined as HTMLDivElement | undefined

          onMount(() => {
            if (!div) return

            createResizeObserver(div, ({ height }) => {
              height && props.setID(baseID)
            })
          })

          return (
            <div ref={div} class="space-y-8">
              <For each={props.menus}>
                {(menu) => (
                  <div>
                    <Show
                      when={
                        (store.selectedProject?.reports.list.length || 0) > 0 ||
                        !menu.needsReport
                      }
                      fallback={
                        <Button v-else disabled full leftIcon={menu.icon}>
                          {menu.name}
                        </Button>
                      }
                    >
                      <MenuWrapperDesktop
                        id={menu.id}
                        name={menu.name}
                        icon={menu.icon}
                      />
                    </Show>
                  </div>
                )}
              </For>
            </div>
          )
        })()}
      </Show>

      <Footer />
    </div>
  )
}
