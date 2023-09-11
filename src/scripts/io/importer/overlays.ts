import {
  cleanString,
  convertUint8ArrayToData64Image,
  createOverlay,
} from '/src/scripts'
import { store } from '/src/store'

export const importOverlaysFromZIP = (
  zip: Unzipped,
  json: JSONMachineProject,
  project: MachineProject,
) =>
  json.base.overlays.forEach(async (jsonOverlay) => {
    const lookingFor = cleanString(`overlays/${jsonOverlay.name}`)

    const result = Object.entries(zip).find(
      ([key]) => lookingFor === cleanString(key),
    )

    if (result) {
      console.log('result', 1)
      const array = result[1]

      const data64 = convertUint8ArrayToData64Image(
        array,
        jsonOverlay.name.split('.').pop() as string,
      )

      console.log('result', 2)

      const overlay = await createOverlay(data64, store.map, jsonOverlay)

      console.log('result', 3)

      if (store.projects.selected === project) {
        overlay.addToMap(store.projects.selected.settings.areOverlaysVisible)
      }

      console.log('result', 4)

      project.overlays.push(overlay)
    }
  })
