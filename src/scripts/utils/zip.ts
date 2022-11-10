import { convertData64ImageToUint8Array } from '/src/scripts'
import { createZipFromProject as b } from './'
import { zipSync, type Zippable } from 'fflate'

export const createZipFromProject = async (
  project: MachineProject,
  parameters: {
    project?: boolean
    overlays?: boolean
    screenshots?: boolean
    rawData?: boolean
    customJSON?: { name: string; json: AnyJSON }
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
  const Rawdata: { [key: string]: Uint8Array } = {}

  await Promise.all([
    ...project.reports.list
      .map((report) => report.line.sortedPoints)
      .flat()
      .map((point) => {
        if (point.rawDataFile) {
          Rawdata[point.id] = new Uint8Array(point.rawDataFile)
        }
      }),
  ])

  zip.Rawdata = Rawdata
}
