/* eslint-disable no-console */
import {
  convertJSONFromPRJZToMPVZ,
  importOverlaysFromZIP,
  importProjectFromJSON,
  importRawDataFromZIP,
  importScreenshotsFromZIP,
  unzipFile,
  waitForMap,
} from '/src/scripts'

export const unzippedToJSON = (unzipped: Unzipped) => {
  const jsonUint = unzipped['database.json']

  return JSON.parse(new TextDecoder().decode(jsonUint))
}

export const getProjectJSONFromZip = (
  unzipped: Unzipped,
  extension: string,
) => {
  const importedJSON = unzippedToJSON(unzipped)

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

    // console.log(jsonProject)

    if (jsonProject) {
      project = importProjectFromJSON(jsonProject)

      setTimeout(async () => {
        if (project) {
          console.log('import file timeout')

          importScreenshotsFromZIP(unzipped, jsonProject, project)

          importRawDataFromZIP(unzipped, project)

          console.log('importRawDataFromZIP')

          await waitForMap()

          console.log('importOverlaysFromZIP')

          importOverlaysFromZIP(unzipped, jsonProject, project)

          setTimeout(() => {
            if (project) {
              project.state = 'Loaded'
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
