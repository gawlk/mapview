import { zipSync } from 'fflate'

import { addFileToZip, addJSONToZip } from '/src/scripts'

import { addOverlaysToZip } from './overlays'
import { addRawDataToZip } from './rawdata'
import { addScreenshotsToZip } from './screenshots'

export const createZipFromProject = async (
  project: MachineProject,
  parameters: {
    project?: boolean
    overlays?: boolean
    screenshots?: boolean
    rawData?: boolean
    customJSON?: { name: string; json: AnyJSON }
    onlyFromCurrentReport?: boolean
    additionalFile?: File
  }
) => {
  const {
    overlays,
    screenshots,
    rawData,
    onlyFromCurrentReport,
    additionalFile,
  } = parameters
  const zip: Fflate.Zippable = {}

  const json = project.toJSON()

  await Promise.all([
    overlays && addOverlaysToZip(zip, project),
    screenshots && addScreenshotsToZip(zip, project, json),
    rawData && addRawDataToZip(zip, project, onlyFromCurrentReport),

    additionalFile && addFileToZip(zip, additionalFile),
  ])

  parameters.customJSON
    ? await addJSONToZip(
        zip,
        parameters.customJSON.name,
        parameters.customJSON.json
      )
    : await addProjectToZip(zip, json)

  return zipSync(zip)
}

const addProjectToZip = async (
  zip: Fflate.Zippable,
  jsonProject: JSONMachineProject
) => {
  const json: JSONMapview = {
    version: 1,
    jsonFileFormat: 'Database from Mapview',
    project: jsonProject,
  }

  return addJSONToZip(zip, 'database.json', json)
}
