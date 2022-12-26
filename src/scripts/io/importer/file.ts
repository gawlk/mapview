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
    ? (importedJSON as JSONMachineProject)
    : convertJSONFromPRJZToMPVZ(importedJSON)
}

export const importFile = async (file: File) => {
  await waitForMap()

  const extension = file.name.split('.').pop()

  const unzipped = await unzipFile(file)

  const jsonProject = getProjectJSONFromZip(unzipped, extension || '')

  console.log(jsonProject)
  if (jsonProject) {
    const project = await importProjectFromJSON(jsonProject)

    if (project) {
      setTimeout(async () => {
        importScreenshotsFromZIP(unzipped, jsonProject, project)

        importRawDataFromZIP(unzipped, project)

        await waitForMap()

        importOverlaysFromZIP(unzipped, jsonProject, project)
      }, 500)
    }

    return project
  } else {
    return null
  }
}
