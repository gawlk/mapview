import store from '/src/store'

import {
  convertJSONFromPRJZToMPVZ,
  importOverlaysFromZIP,
  importProjectFromJSON,
  importRawDataFromZIP,
  importScreenshotsFromZIP,
  unzipFile,
  waitForMap,
} from '/src/scripts'

export const getProjectJSONFromZip = (
  unzipped: Fflate.Unzipped,
  extension: string
) => {
  const jsonUint = unzipped['database.json']

  const importedJSON: any = JSON.parse(new TextDecoder().decode(jsonUint))

  return extension === 'mpvz'
    ? (importedJSON as JSONMapview).project
    : convertJSONFromPRJZToMPVZ(importedJSON)
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
      project = importProjectFromJSON(jsonProject)

      setTimeout(async () => {
        if (project) {
          importScreenshotsFromZIP(unzipped, jsonProject, project)

          importRawDataFromZIP(unzipped, project)

          await waitForMap()

          importOverlaysFromZIP(unzipped, jsonProject, project)
        }
      }, 100)
    }
  } catch (error) {
    console.log(error)
  } finally {
    return project
  }
}
