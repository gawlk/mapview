import { useI18n } from '@solid-primitives/i18n'

import { store } from '/src/store'

import { Dialog } from '/src/components'

import { ButtonFitOverlay } from './components/buttonFitOverlay'
import { ButtonOverlayOpacity } from './components/buttonOverlayOpacity'
import { ButtonRemoveOverlay } from './components/buttonRemoveOverlay'

export const DialogOverlays = () => {
  const [t] = useI18n()

  return (
    <Dialog
      closeable
      attached
      button={{
        leftIcon: IconTablerLayoutList,
        text: t('Open image list'),
        full: true,
      }}
    >
      <div class="space-y-1">
        <For each={store.selectedProject?.overlays}>
          {(overlay) => (
            <div class="flex space-x-1">
              <ButtonFitOverlay overlay={overlay} />
              <ButtonOverlayOpacity overlay={overlay} />
              <ButtonRemoveOverlay overlay={overlay} />
            </div>
          )}
        </For>
      </div>
    </Dialog>
  )
}
