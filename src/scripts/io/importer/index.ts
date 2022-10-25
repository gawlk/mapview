import { unzipSync } from 'fflate'

import store from '/src/store'
import { convertJSONFromPRJZToMPVZ } from './converter'
import { importImages } from './images'
import { importProject } from './project'
import { importRawData } from './rawData'
import { importScreenshots } from './screenshots'

const waitForMap = () =>
  new Promise<boolean>((resolve) => {
    const interval = setInterval(async () => {
      if (store.map?.isStyleLoaded()) {
        clearInterval(interval)
        resolve(true)
      }
    }, 100)
  })

export const acceptedExtensions =
  '.prjz, .mpvz, .dynz, .prjz.zip, .mpvz.zip, .dynz.zip'

export const importFile = async (file: File) => {
  await waitForMap()

  const extension = file.name.split('.').pop()

  const zip = unzipSync(new Uint8Array(await file.arrayBuffer()))

  const jsonUint = zip['database.json']

  if (jsonUint) {
    const importedJSON: any = JSON.parse(new TextDecoder().decode(jsonUint))

    const jsonProject =
      extension === 'mpvz'
        ? (importedJSON as JSONMachineProject)
        : convertJSONFromPRJZToMPVZ(importedJSON)

    console.log(jsonProject)

    const project = await importProject(jsonProject)

    if (project) {
      setTimeout(() => {
        importImages(zip, jsonProject, project)

        importScreenshots(zip, jsonProject, project)

        importRawData(zip, project)
      }, 500)
    }

    return project
  } else {
    return null
  }
}
