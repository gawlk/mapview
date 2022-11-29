import { type Zippable, zipSync } from 'fflate'

import { convertData64ImageToUint8Array } from '/src/scripts'

import { createZipFromProject as b } from './'

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
  const zip: Zippable = {}

  const json = project.toJSON()

  await Promise.all([
    parameters.project && addProjectToZip(zip, json),
    parameters.overlays && addOverlaysToZip(zip, project),
    parameters.screenshots && addScreenshotsToZip(zip, project, json),
    parameters.rawData && addRawDataToZip(zip, project),
    parameters.customJSON &&
      addJSONToZip(zip, parameters.customJSON.name, parameters.customJSON.json),
    parameters.additionalFile && addFileToZip(zip, parameters.additionalFile),
  ])

  return zipSync(zip)
}

const jsonToUint8Array = async (json: AnyJSON) =>
  new Uint8Array(
    await new Blob([JSON.stringify(json, null, 2)], {
      type: 'json',
    }).arrayBuffer()
  )

const addProjectToZip = async (zip: Zippable, json: JSONMachineProject) =>
  addJSONToZip(zip, 'database.json', json)

const addJSONToZip = async (zip: Zippable, name: string, json: AnyJSON) => {
  zip[name] = await jsonToUint8Array(json)
}

const addFileToZip = async (zip: Zippable, file: File) => {
  zip[file.name] = new Uint8Array(await file.arrayBuffer())
}

const addOverlaysToZip = async (zip: Zippable, project: MachineProject) => {
  const overlays: { [key: string]: Uint8Array } = {}

  await Promise.all(
    project.overlays.map(async (overlay) => {
      if (overlay.sourceData.url) {
        overlays[overlay.toJSON().name] = await convertData64ImageToUint8Array(
          overlay.sourceData.url
        )
      }
    })
  )

  zip.overlays = overlays
}

const addScreenshotsToZip = async (
  zip: Zippable,
  project: MachineProject,
  json?: JSONMachineProject
) => {
  const screenshots: { [key: string]: Uint8Array } = {}

  await Promise.all(
    project.reports.list
      .map((report, reportIndex) =>
        report.screenshots.map((screenshot) => {
          return {
            reportIndex,
            screenshot,
          }
        })
      )
      .flat()
      .map(async (obj, index) => {
        screenshots[`${index}.png`] = await convertData64ImageToUint8Array(
          obj.screenshot
        )

        json?.base.reports.list[obj.reportIndex].base.screenshots.push(index)
      })
  )

  zip.screenshots = screenshots
}

const addRawDataToZip = async (zip: Zippable, project: MachineProject) => {
  const rawdata: { [key: string]: Uint8Array } = {}

  await Promise.all([
    ...project.reports.list
      .map((report) => report.line.sortedPoints)
      .flat()
      .map((point) => {
        if (point.rawDataFile) {
          rawdata[point.id] = new Uint8Array(point.rawDataFile)
        }
      }),
  ])

  zip.rawdata = rawdata
}
