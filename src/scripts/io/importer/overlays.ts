import { type Unzipped } from 'fflate'
import store from '/src/store'
import { createOverlay, convertUint8ArrayToData64Image } from '/src/scripts'

export const importOverlays = (
  zip: Unzipped,
  json: JSONMachineProject,
  project: MachineProject
) =>
  json.base.overlays.forEach(async (jsonOverlay) => {
    const array = zip[`images/${jsonOverlay.name}`]

    if (array) {
      const data64 = convertUint8ArrayToData64Image(
        array,
        jsonOverlay.name.split('.').pop() as string
      )

      const overlay = await createOverlay(data64, store.map, jsonOverlay)

      if (store.projects.selected === project) {
        overlay.addToMap(store.projects.selected.settings.areOverlaysVisible)
      }

      project.overlays.push(overlay)
    }
  })
