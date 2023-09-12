import { createResizeObserver } from '@solid-primitives/resize-observer'

import { Button } from '/src/components'
import { run } from '/src/scripts'
import { store } from '/src/store'

import { Initializer } from '../initializer'
import { Footer } from './components/footer'
import { Logo } from './components/logo'
import { baseID, MenuWrapperDesktop } from './components/menuWrapperDesktop'

interface Props {
  setID: (id: string) => void
  readonly menus: Menu[]
}

export const BarDesktop = (props: Props) => {
  return (
    <div class="hidden w-[520px] flex-none space-y-8 overflow-scroll px-2 py-8 lg:block">
      <Logo />

      <Show when={store.selectedProject} fallback={<Initializer />}>
        {run(() => {
          const [div, setDiv] = createSignal<HTMLDivElement | undefined>(
            undefined,
          )

          onMount(() => {
            if (!div) return

            createResizeObserver(div, ({ height }) => {
              height && props.setID(baseID)
            })
          })

          return (
            <div ref={setDiv} class="space-y-8">
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
                        class={menu.class}
                      />
                    </Show>
                  </div>
                )}
              </For>
            </div>
          )
        })}
      </Show>

      <Footer />
    </div>
  )
}
