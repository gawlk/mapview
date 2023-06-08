import { useI18n } from '@solid-primitives/i18n'

import store from '/src/store'

import { Interactive } from '/src/components'

import ButtonFileOverlay from './components/buttonFileOverlay'
import ButtonLineVisibility from './components/buttonLineVisibility'
import ButtonMarkersMoveability from './components/buttonMarkersMoveability'
import ButtonMarkersVisibility from './components/buttonMarkersVisibility'
import ButtonOverlaysVisibility from './components/buttonOverlaysVisibility'
import DialogOverlays from './components/dialogOverlays'
import SelectMapStyles from './components/selectMapStyles'
import SelectMarkersContent from './components/selectMarkersContent'

export default () => {
  const [t] = useI18n()

  return (
    <>
      <SelectMapStyles />
      <div class="flex space-x-2">
        <Show when={store.selectedProject?.overlays.length}>
          <DialogOverlays />
          <ButtonOverlaysVisibility />
        </Show>
        <ButtonFileOverlay />
      </div>
      <Interactive
        full
        label={t('Points')}
        border={false}
        kind="static"
        leftIcon={IconTablerCircle}
      >
        <div class="-my-1 -mr-3 flex w-full space-x-1">
          <SelectMarkersContent />
          <ButtonMarkersVisibility />
          <ButtonLineVisibility />
          <ButtonMarkersMoveability />
        </div>
      </Interactive>
    </>
  )
}
