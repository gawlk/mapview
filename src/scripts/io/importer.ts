import { Unzipped, unzipSync } from 'fflate'

import store from '/src/store'
import {
  createHeavydynProjectFromJSON,
  createMaxidynProjectFromJSON,
  createMinidynProjectFromJSON,
  createImage,
  Uint8ArrayToData64Image,
} from '/src/scripts'
import { convertJSONFromPRJZToMPVZ } from './converter'

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

  const zip = unzipSync(new Uint8Array(await file.arrayBuffer()))

  const jsonUint = zip['database.json']

  if (jsonUint) {
    const importedJSON: any = JSON.parse(new TextDecoder().decode(jsonUint))

    const jsonProject: JSONProject =
      extension === 'mpvz'
        ? (importedJSON as JSONProject)
        : convertJSONFromPRJZToMPVZ(importedJSON)

    const project = await generateProjectFromJSON(jsonProject)

    if (project) {
      await importImages(zip, jsonProject, project)

      importScreenshots(zip, jsonProject, project)
    }

    return project
  } else {
    return null
  }
}

const generateProjectFromJSON = async (
  json: JSONProject
): Promise<MachineProject | null> => {
  const map = store.map as mapboxgl.Map

  let project = null

  switch (json.machine) {
    case 'heavydyn':
      project = await createHeavydynProjectFromJSON(json, map)
      break

    case 'maxidyn':
      project = await createMaxidynProjectFromJSON(json, map)
      break

    case 'minidyn':
      project = await createMinidynProjectFromJSON(json, map)
      break
  }

  if (project) {
    store.projects.list.push(project)
  }

  console.log('project', project)

  return project
}

const importImages = async (
  zip: Unzipped,
  json: JSONProject,
  project: MachineProject
) =>
  Promise.all(
    json.images.map(async (jsonImage) => {
      const array = zip[`images/${jsonImage.name}`]

      if (array && store.map) {
        const data64 = Uint8ArrayToData64Image(
          array,
          jsonImage.name.split('.').pop() as string
        )

        const image = await createImage(data64, store.map, {
          ...jsonImage,
        })

        if (store.projects.selected === project && store.map.isStyleLoaded()) {
          image.addToMap(store.projects.selected.settings.areImagesVisible)
        }

        project.images.push(image)
      }
    })
  )

const importScreenshots = (
  zip: Unzipped,
  json: JSONProject,
  project: MachineProject
) => {
  const screenshots = Object.keys(zip)
    .filter((key) => key.startsWith('screenshots/'))
    .map((key) => key.substring(12))
    .filter((key) => key)

  json.reports.forEach((jsonReport, index) => {
    jsonReport.screenshots.forEach(async (screenshotIndex) => {
      const screenshotFileName = screenshots.find(
        (screenshot) => Number(screenshot.split('.')[0]) === screenshotIndex
      )

      if (screenshotFileName) {
        const array = zip[`screenshots/${screenshotFileName}`]

        const data64 = Uint8ArrayToData64Image(
          array,
          screenshotFileName.split('.').pop() as string
        )

        project.reports.list[index]?.screenshots.push(data64)
      }
    })
  })
}
