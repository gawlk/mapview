import store from '/src/store'

import ButtonFileOverlay from './components/buttonFileOverlay'
import ButtonLineVisibility from './components/buttonLineVisibility'
import ButtonMarkersMoveability from './components/buttonMarkersMoveability'
import ButtonMarkersVisibility from './components/buttonMarkersVisibility'
import ButtonOverlaysVisibility from './components/buttonOverlaysVisibility'
import DialogOverlays from './components/dialogOverlays'
import SelectMapStyles from './components/selectMapStyles'
import SelectMarkersContent from './components/selectMarkersContent'

export default () => {
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
      <div class="flex space-x-2">
        <SelectMarkersContent />
        <ButtonMarkersVisibility />
        <ButtonLineVisibility />
        <ButtonMarkersMoveability />
      </div>
    </>
  )
}
