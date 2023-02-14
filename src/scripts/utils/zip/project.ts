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
    additionalFile?: File
  }
) => {
  const zip: Fflate.Zippable = {}

  const json = project.toJSON()

  await Promise.all([
    parameters.overlays && addOverlaysToZip(zip, project),
    parameters.screenshots && addScreenshotsToZip(zip, project, json),
    parameters.rawData && addRawDataToZip(zip, project),

    parameters.additionalFile && addFileToZip(zip, parameters.additionalFile),
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
    jsonFileFormat: 'Project database from Mapview',
    project: jsonProject,
  }

  return addJSONToZip(zip, 'database.json', json)
}
