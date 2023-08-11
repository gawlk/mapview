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
    customJSON?: { name: string; json: JSONAny }
    template?: File
  },
) => {
  const { overlays, screenshots, rawData, template } = parameters
  const zip: Fflate.Zippable = {}

  let json: JSONMapview | JSONAny | undefined
  let projectJson

  if (entity.kind === 'Project') {
    projectJson = entity.toJSON()

    json = {
      version: 1,
      jsonFileFormat: 'Database from Mapview',
      project: projectJson,
    } as JSONMapview
  } else if (parameters.customJSON) {
    json = parameters.customJSON.json
  }

  await Promise.all([
    overlays && entity.kind === 'Project' && addOverlaysToZip(zip, entity),

    screenshots && addScreenshotsToZip(zip, entity, projectJson),

    rawData && addRawDataToZip(zip, entity),

    template && addFileToZip(zip, template),
  ])

  if (json) {
    await addJSONToZip(
      zip,
      parameters.customJSON?.name || 'database.json',
      json,
    )
  }

  return zipSync(zip)
}
