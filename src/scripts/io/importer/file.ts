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

    console.time('import: file')

    const extension = file.name.split('.').pop()

    const unzipped = await unzipFile(file)

    console.time('import: zip to json')
    const jsonProject = getProjectJSONFromZip(unzipped, extension || '')
    console.timeEnd('import: zip to json')

    console.log(jsonProject)

    if (jsonProject) {
      console.timeLog('import: file')

      console.time('import: project')
      project = importProjectFromJSON(jsonProject)
      console.timeEnd('import: project')

      setTimeout(async () => {
        if (project) {
          console.timeLog('import: file')

          console.time('import: screenshots')
          importScreenshotsFromZIP(unzipped, jsonProject, project)
          console.timeEnd('import: screenshots')

          console.time('import: rawdata')
          importRawDataFromZIP(unzipped, project)
          console.timeEnd('import: rawdata')

          await waitForMap()

          console.time('import: overlays')
          importOverlaysFromZIP(unzipped, jsonProject, project)
          console.timeEnd('import: overlays')

          console.timeEnd('import: file')
        }
      }, 100)
    }
  } catch (error) {
    console.log(error)
  } finally {
    return project
  }
}
