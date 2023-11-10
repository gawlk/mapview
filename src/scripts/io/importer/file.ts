/* eslint-disable no-console */
import {
  convertJSONFromPRJZToMPVZ,
  createMachineProjectFromJSON,
  importOverlaysFromZIP,
  importRawDataFromZIP,
  importScreenshotsFromZIP,
  unzipFile,
  waitForMap,
} from '/src/scripts'
import { store } from '/src/store'

export const unzippedToJSON = (unzipped: Unzipped) => {
  const jsonUint = unzipped['database.json']

  return JSON.parse(new TextDecoder().decode(jsonUint))
}

export const getProjectJSONFromZip = (
  unzipped: Unzipped,
  extension: string,
) => {
  const importedJSON = unzippedToJSON(unzipped)

  if (extension === 'mpvz') {
    return (importedJSON as JSONMapview).project
  }

  return convertJSONFromPRJZToMPVZ(importedJSON)
}

export const importFile = async (file: File) => {
  let project = null as MachineProject | null

  try {
    await waitForMap()

    const extension = file.name.split('.').pop()

    const unzipped = await unzipFile(file)

    const jsonProject = getProjectJSONFromZip(unzipped, extension || '')

    console.log(jsonProject)

    if (jsonProject) {
      project = await createMachineProjectFromJSON(jsonProject, store.map())

      setTimeout(async () => {
        if (project) {
          importScreenshotsFromZIP(unzipped, jsonProject, project)

          importRawDataFromZIP(unzipped, project)

          await waitForMap()

          importOverlaysFromZIP(unzipped, jsonProject, project)

          setTimeout(() => {
            if (project) {
              project.state.set('Loaded')
            }
          }, 5000)
        }
      }, 100)

      return project
    }

    return null
  } catch (error) {
    console.log(error)
    return null
  }
}
