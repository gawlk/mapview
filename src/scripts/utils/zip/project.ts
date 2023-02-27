import { zipSync } from 'fflate'

import { addFileToZip, addJSONToZip } from '/src/scripts'

import { addOverlaysToZip } from './overlays'
import { addRawDataToZip } from './rawdata'
import { addScreenshotsToZip } from './screenshots'

export const createZipFromEntity = async (
  entity: MachineProject | MachineReport,
  parameters: {
    overlays?: boolean
    screenshots?: boolean
    rawData?: boolean
    customJSON?: { name: string; json: AnyJSON }
    template?: File
  }
) => {
  const { overlays, screenshots, rawData, template } = parameters
  const zip: Fflate.Zippable = {}

  console.log(entity)

  let json

  if (entity.kind === 'Project') {
    json = entity.toJSON() // only for project
  }

  await Promise.all([
    overlays && entity.kind === 'Project' && addOverlaysToZip(zip, entity),
    screenshots && addScreenshotsToZip(zip, entity, json),
    rawData && addRawDataToZip(zip, entity),

    template && addFileToZip(zip, template),
  ])

  parameters.customJSON
    ? await addJSONToZip(
        zip,
        parameters.customJSON.name,
        parameters.customJSON.json
      )
    : json && (await addProjectToZip(zip, json))

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
