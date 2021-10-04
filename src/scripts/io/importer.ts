import { unzipSync } from 'fflate'

import store from '/src/store'
import {
  createHeavydynProject,
  createMaxidynProject,
  createMinidynProject,
  createImage,
  Uint8ArrayToData64Image,
} from '/src/scripts'

const waitForMap = () =>
  new Promise<boolean>((resolve) => {
    const interval = setInterval(async () => {
      if (store.map?.isStyleLoaded()) {
        clearInterval(interval)
        resolve(true)
      }
    }, 100)
  })

export const importFile = async (file: File) => {
  await waitForMap()

  const extension = file.name.split('.').pop()

  switch (extension) {
    case 'json':
      await importJSON(JSON.parse(await file.text()))

      break

    case 'prjz':
      const zip = unzipSync(new Uint8Array(await file.arrayBuffer()))

      const jsonUint = zip['data.json']

      if (jsonUint) {
        const JSONProject: JSONProject = JSON.parse(
          new TextDecoder().decode(jsonUint)
        )

        await importJSON(JSONProject)

        JSONProject.images.forEach(async (image) => {
          const array = zip[`images/${image.name}`]

          if (array && store.project && store.map) {
            const data64 = Uint8ArrayToData64Image(
              array,
              image.name.split('.').pop() as string
            )

            store.project.images.push(
              await createImage(data64, store.map, {
                ...image,
                areImagesVisible:
                  store.project.mapviewSettings.areImagesVisible,
              })
            )
          }
        })
      }
  }
}

const importJSON = async (json: JSONProject) => {
  const map = store.map as mapboxgl.Map

  map.setCenter(json.mapviewSettings.coordinates)
  map.setZoom(json.mapviewSettings.zoom)

  switch (json.database.machine) {
    case 'heavydyn':
      store.project = await createHeavydynProject(json, map)
      break

    case 'maxidyn':
      store.project = await createMaxidynProject(json, map)
      break

    case 'minidyn':
      store.project = await createMinidynProject(json, map)
      break
  }

  console.log(store.project)
}
