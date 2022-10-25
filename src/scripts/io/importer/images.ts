import { type Unzipped } from 'fflate'
import store from '/src/store'
import { createImage, convertUint8ArrayToData64Image } from '/src/scripts'

export const importImages = (
  zip: Unzipped,
  json: JSONMachineProject,
  project: MachineProject
) =>
  json.base.images.forEach(async (jsonImage) => {
    const array = zip[`images/${jsonImage.name}`]

    if (array) {
      const data64 = convertUint8ArrayToData64Image(
        array,
        jsonImage.name.split('.').pop() as string
      )

      const image = await createImage(data64, store.map, {
        ...jsonImage,
      })

      if (store.projects.selected === project && store.map?.isStyleLoaded()) {
        image.addToMap(store.projects.selected.settings.areImagesVisible)
      }

      project.images.push(image)
    }
  })
